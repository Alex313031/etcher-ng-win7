/*
 * Copyright 2016 balena.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as electron from 'electron';
import { autoUpdater } from 'electron-updater';
import * as electronLog from 'electron-log';
import * as Store from 'electron-store';
import * as contextMenu from 'electron-context-menu';
import { promises as fs } from 'fs';
import { platform } from 'os';
import * as path from 'path';
import * as semver from 'semver';

import { packageType, version } from '../../package.json';
import * as EXIT_CODES from '../shared/exit-codes';
import { delay, getConfig } from '../shared/utils';
import * as settings from './app/models/settings';
import { logException } from './app/modules/analytics';
import { buildWindowMenu } from './menu';
import CONFIG_PATH from './app/models/settings';

const customProtocol = 'etcher';
const scheme = `${customProtocol}://`;
const updatablePackageTypes = ['appimage', 'nsis', 'dmg'];
const packageUpdatable = false;
const packageUpdated = false;
let mainWindow;

// Restrict main.log size to 100Kb
electronLog.transports.file.maxSize = 1024 * 100;

const store = new Store();

// Globally export what OS we are on
const isLinux = process.platform === 'linux';
const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';

async function checkForUpdates(interval: number) {
	electronLog.info('Auto-Updates disabled for this build');
}

async function isFile(filePath: string): Promise<boolean> {
	try {
		const stat = await fs.stat(filePath);
		return stat.isFile();
	} catch {
		// noop
	}
	return false;
}

async function getCommandLineURL(argv: string[]): Promise<string | undefined> {
	argv = argv.slice(electron.app.isPackaged ? 1 : 2);
	if (argv.length) {
		const value = argv[argv.length - 1];
		// Take into account electron arguments
		if (value.startsWith('--')) {
			return;
		}
		// https://stackoverflow.com/questions/10242115/os-x-strange-psn-command-line-parameter-when-launched-from-finder
		if (platform() === 'darwin' && value.startsWith('-psn_')) {
			return;
		}
		if (
			!value.startsWith('http://') &&
			!value.startsWith('https://') &&
			!value.startsWith(scheme) &&
			!(await isFile(value))
		) {
			return;
		}
		return value;
	}
}

const sourceSelectorReady = new Promise((resolve) => {
	electron.ipcMain.on('source-selector-ready', resolve);
});

async function selectImageURL(url?: string) {
	// 'data:,' is the default chromedriver url that is passed as last argument when running spectron tests
	if (url !== undefined && url !== 'data:,') {
		url = url.replace(/\/$/, ''); // on windows the url ends with an extra slash
		url = url.startsWith(scheme) ? url.slice(scheme.length) : url;
		await sourceSelectorReady;
		electron.BrowserWindow.getAllWindows().forEach((window) => {
			window.webContents.send('select-image', url);
		});
	}
}

// This will catch clicks on links such as <a href="etcher://...">Open in Etcher-ng</a>
// We need to listen to the event before everything else otherwise the event won't be fired
electron.app.on('open-url', async (event, data) => {
	event.preventDefault();
	await selectImageURL(data);
});

interface AutoUpdaterConfig {
	autoDownload?: boolean;
	autoInstallOnAppQuit?: boolean;
	allowPrerelease?: boolean;
	fullChangelog?: boolean;
	allowDowngrade?: boolean;
}

async function createMainWindow() {
	const fullscreen = Boolean(await settings.get('fullscreen'));
	const defaultWidth = settings.DEFAULT_WIDTH;
	const defaultHeight = settings.DEFAULT_HEIGHT;
	const iconPath = isWin
		? path.join(__dirname, 'media', 'icon.ico')
		: path.join(__dirname, 'media', 'icon64.png');
	let width = defaultWidth;
	let height = defaultHeight;
	if (fullscreen) {
		({ width, height } = electron.screen.getPrimaryDisplay().bounds);
	}
	mainWindow = new electron.BrowserWindow({
		width,
		height,
		minWidth: 632,
		minHeight: 400,
		frame: !fullscreen,
		useContentSize: true,
		show: false,
		resizable: true,
		maximizable: true,
		fullscreen,
		fullscreenable: fullscreen,
		kiosk: fullscreen,
		autoHideMenuBar: false,
		titleBarStyle: 'hiddenInset',
		icon: iconPath,
		darkTheme: true,
		webPreferences: {
			backgroundThrottling: false,
			nodeIntegration: true,
			contextIsolation: false,
			devTools: true,
			experimentalFeatures: true,
			webviewTag: true,
			zoomFactor: width / defaultWidth,
			enableRemoteModule: true,
		},
	});

	electron.app.setAsDefaultProtocolClient(customProtocol);

	buildWindowMenu(mainWindow);

	electron.nativeTheme.themeSource = 'dark';

	// mainWindow.setFullScreen(true);

	// Prevent flash of white when starting the application
	mainWindow.once('ready-to-show', () => {
		console.timeEnd('ready-to-show');
		// Electron sometimes caches the zoomFactor
		// making it obnoxious to switch back-and-forth
		mainWindow.webContents.setZoomFactor(width / defaultWidth);
		mainWindow.show();
	});

	// Prevent external resources from being loaded (like images)
	// when dropping them on the WebView.
	// See https://github.com/electron/electron/issues/5919
	mainWindow.webContents.on('will-navigate', (event) => {
		event.preventDefault();
	});

	mainWindow.loadURL(
		`file://${path.join(
			'/',
			...__dirname.split(path.sep).map(encodeURIComponent),
			'index.html',
		)}`,
	);

	mainWindow.on('close', () => {
		if (mainWindow) {
			store.set('windowDetails', {
				position: mainWindow.getPosition(),
			});
			electronLog.info('Saved windowDetails.');
		} else {
			electronLog.error(
				'Error: mainWindow was not defined while trying to save windowDetails.',
			);
		}
	});

	const windowDetails = store.get('windowDetails');

	if (windowDetails) {
		mainWindow.setPosition(
			windowDetails.position[0],
			windowDetails.position[1],
		);
	} else {
		electronLog.info('No windowDetails.');
	}

	return mainWindow;
}

electron.app.allowRendererProcessReuse = false;

electron.app.on('edit-config-file', () => {
	if (isLinux) {
		electronLog.info(
			'Note that JSON must be a recognized file type for the OS to open the config.json file.',
		);
		electronLog.warn(
			'On Linux, a default text editor for handling JSON files must also be present and configured correctly.',
		);
		store.openInEditor();
		return;
	} else {
		electronLog.info(
			'Note that JSON must be a recognized file type \n for the OS to open the config.json file.',
		);
		store.openInEditor();
	}
});

electron.app.on('window-all-closed', () => {
	if (!isMac) {
		electronLog.warn('mainWindow.close()');
		electron.app.quit();
	} else {
		electronLog.info('Not keeping dock alive even though this is MacOS');
		electronLog.warn('mainWindow.close()');
		electron.app.quit();
	}
});

// Sending a `SIGINT` (e.g: Ctrl-C) to an Electron app that registers
// a `beforeunload` window event handler results in a disconnected white
// browser window in GNU/Linux and macOS.
// The `before-quit` Electron event is triggered in `SIGINT`, so we can
// make use of it to ensure the browser window is completely destroyed.
// See https://github.com/electron/electron/issues/5273
electron.app.on('before-quit', () => {
	if (mainWindow) {
		store.set('windowDetails', {
			position: mainWindow.getPosition(),
		});
		electronLog.info('Saved windowDetails.');
	} else {
		electronLog.error(
			'Error: mainWindow was not defined while trying to save windowDetails.',
		);
	}
	electron.app.releaseSingleInstanceLock();
	process.exit(EXIT_CODES.SUCCESS);
});

electron.app.on('relaunch', () => {
	electronLog.warn('Restarting App...');
	if (mainWindow) {
		store.set('windowDetails', {
			position: mainWindow.getPosition(),
		});
		electronLog.info('Saved windowDetails.');
	} else {
		electronLog.error(
			'Error: mainWindow was not defined while trying to save windowDetails.',
		);
	}
});

contextMenu({
	// Chromium context menu defaults
	showSelectAll: true,
	showCopyImage: true,
	showCopyImageAddress: true,
	showSaveImageAs: true,
	showCopyVideoAddress: true,
	showSaveVideoAs: true,
	showCopyLink: true,
	showSaveLinkAs: true,
	showInspectElement: true,
	showLookUpSelection: true,
	showSearchWithGoogle: false,
	prepend: (defaultActions, parameters) => [
		{
			label: 'Open Link in New Window',
			// Only show it when right-clicking a link
			visible: parameters.linkURL.trim().length > 0,
			click: () => {
				const toURL = parameters.linkURL;
				const linkWin = new electron.BrowserWindow({
					title: 'New Window',
					width: 1024,
					height: 700,
					useContentSize: true,
					darkTheme: true,
					webPreferences: {
						nodeIntegration: false,
						nodeIntegrationInWorker: false,
						experimentalFeatures: true,
						devTools: true,
					},
				});
				linkWin.loadURL(toURL);
				electronLog.info('Opened Link in New Window');
			},
		},
		{
			label: 'Search with Google',
			// Only show it when right-clicking text
			visible: parameters.selectionText.trim().length > 0,
			click: () => {
				const queryURL = `${encodeURIComponent(parameters.selectionText)}`;
				const searchURL = `https://google.com/search?q=${encodeURIComponent(
					parameters.selectionText,
				)}`;
				const searchWin = new electron.BrowserWindow({
					width: 1024,
					height: 700,
					useContentSize: true,
					darkTheme: true,
					webPreferences: {
						nodeIntegration: false,
						nodeIntegrationInWorker: false,
						experimentalFeatures: true,
						devTools: true,
					},
				});
				searchWin.loadURL(searchURL);
				electronLog.info('Searched for "' + queryURL + '" on Google');
			},
		},
		{
			label: 'Open Image in New Window',
			// Only show it when right-clicking an image
			visible: parameters.mediaType === 'image',
			click: () => {
				const imgURL = parameters.srcURL;
				const imgTitle = imgURL.substring(imgURL.lastIndexOf('/') + 1);
				const imgWin = new electron.BrowserWindow({
					title: imgTitle,
					useContentSize: true,
					darkTheme: true,
					webPreferences: {
						nodeIntegration: false,
						nodeIntegrationInWorker: false,
						experimentalFeatures: true,
						devTools: true,
					},
				});
				imgWin.loadURL(imgURL);
				electronLog.info('Opened Image in New Window');
			},
		},
		{
			label: 'Open Video in New Window',
			// Only show it when right-clicking a video
			visible: parameters.mediaType === 'video',
			click: () => {
				const vidURL = parameters.srcURL;
				const vidTitle = vidURL.substring(vidURL.lastIndexOf('/') + 1);
				const vidWin = new electron.BrowserWindow({
					title: vidTitle,
					useContentSize: true,
					darkTheme: true,
					webPreferences: {
						nodeIntegration: false,
						nodeIntegrationInWorker: false,
						experimentalFeatures: true,
						devTools: true,
					},
				});
				vidWin.loadURL(vidURL);
				electronLog.info('Popped out Video');
			},
		},
	],
});

async function main(): Promise<void> {
	if (!electron.app.requestSingleInstanceLock()) {
		electron.app.quit();
	} else {
		await electron.app.whenReady();
		electron.app.commandLine.appendSwitch('ignore-gpu-blocklist');
		const window = await createMainWindow();
		electron.app.on('second-instance', async (_event, argv) => {
			if (window.isMinimized()) {
				window.restore();
			}
			window.focus();
			await selectImageURL(await getCommandLineURL(argv));
		});
		await selectImageURL(await getCommandLineURL(process.argv));
	}
}

main();

console.time('ready-to-show');
