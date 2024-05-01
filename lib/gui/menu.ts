/*
 * Copyright 2024 balena.io and Alex313031
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

import * as Os from 'os';
import * as electron from 'electron';
import * as electronLog from 'electron-log';
import { open as openInternal } from './app/os/open-internal/services/open-internal';
import { open as openExternal } from './app/os/open-external/services/open-external';

/**
 * @summary Builds a native application menu for a given window
 */
export function buildWindowMenu(window: electron.BrowserWindow) {
	// Get version info
	const appName = electron.app.getName();
	const appVer = electron.app.getVersion();
	const electronVer = process.versions.electron;
	const chromeVer = process.versions.chrome;
	const nodeVer = process.versions.node;
	const v8Ver = process.versions.v8;
	// Globally export what OS we are on
	const isLinux = process.platform === 'linux';
	const isWin = process.platform === 'win32';
	const isMac = process.platform === 'darwin';
	let currentOS;
	if (isLinux) {
		currentOS = 'Linux';
	} else if (isWin) {
		currentOS = 'Windows';
	} else if (isMac) {
		currentOS = 'MacOS';
	} else {
		currentOS = 'BSD';
	}
	const archType = Os.arch();
	/**
	 * @summary Toggle the main window's devtools
	 */
	function toggleDevTools() {
		if (!window) {
			return;
		}
		// NOTE: We can't use `webContents.toggleDevTools()` here,
		// as we need to force detached mode
		if (window.webContents.isDevToolsOpened()) {
			electronLog.info('Closing Electron DevTools');
			window.webContents.closeDevTools();
		} else {
			electronLog.info('Opening Electron DevTools on mainWindow');
			window.webContents.openDevTools({
				mode: 'detach',
			});
		}
	}

	const menuTemplate: electron.MenuItemConstructorOptions[] = [
		{
			role: 'editMenu',
		},
		{
			role: 'viewMenu',
			label: 'View',
		},
		{
			role: 'windowMenu',
		},
		{
			label: 'Developer',
			submenu: [
				{
					label: 'Open Electron DevTools',
					accelerator: isMac ? 'Cmd+Shift+F12' : 'F12',
					click() {
						toggleDevTools();
					},
				},
				{ type: 'separator' },
				{
					label: 'Open chrome://gpu',
					accelerator: 'CmdorCtrl+Alt+G',
					click() {
						electronLog.info('Opening chrome://gpu');
						const gpuWindow = new electron.BrowserWindow({
							width: 900,
							height: 700,
							useContentSize: true,
							title: 'GPU Internals',
						});
						gpuWindow.loadURL('chrome://gpu');
					},
				},
				{
					label: 'Open chrome://process-internals',
					accelerator: 'CmdorCtrl+Alt+P',
					click() {
						electronLog.info('Opening chrome://process-internals');
						openInternal('chrome://process-internals');
					},
				},
				{
					label: 'Open Test Window',
					accelerator: 'CmdorCtrl+N',
					click() {
						electronLog.info('Opening Test Window');
						openInternal('https://www.google.com/');
					},
				},
				{ type: 'separator' },
				{
					label: 'Edit Config File',
					click() {
						electronLog.info('Editing Config File');
						electron.app.emit('edit-config-file');
					},
				},
				{
					label: 'Restart App',
					accelerator: 'CmdorCtrl+Alt+R',
					click() {
						electron.app.relaunch();
						electron.app.quit();
					},
				},
			],
		},
		{
			role: 'help',
			submenu: [
				{
					label: 'Etcher Pro',
					click() {
						openInternal(
							'https://www.balena.io/etcher-pro?utm_source=etcher_menu&ref=etcher_menu',
						);
					},
				},
				{
					label: 'Etcher Website',
					click() {
						openInternal('https://etcher.balena.io?ref=etcher_menu');
					},
				},
				{
					label: 'Report an Issue',
					click() {
						openExternal('https://github.com/Alex313031/etcher-ng/issues');
					},
				},
				{ type: 'separator' },
				{
					label: 'About Etcher-ng',
					accelerator: 'CmdorCtrl+Alt+A',
					click() {
						const info = [
							appName + ' v' + appVer,
							'',
							'Electron : ' + electronVer,
							'Chromium : ' + chromeVer,
							'Node : ' + nodeVer,
							'V8 : ' + v8Ver,
							'OS : ' + currentOS + ' ' + archType,
						];
						electron.dialog.showMessageBox({
							type: 'info',
							title: 'About ' + appName,
							message: info.join('\n'),
							buttons: ['Ok'],
						});
						electronLog.info('Opened About window');
					},
				},
			],
		},
	];

	if (isMac) {
		menuTemplate.unshift({
			label: appName,
			submenu: [
				{
					role: 'about' as const,
					label: 'About Etcher-ng',
				},
				{
					type: 'separator' as const,
				},
				{
					role: 'hide' as const,
				},
				{
					role: 'hideOthers' as const,
				},
				{
					role: 'unhide' as const,
				},
				{
					type: 'separator' as const,
				},
				{
					label: 'Go Back',
					accelerator: 'Alt+Left',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.webContents.goBack();
						}
						electronLog.info('Navigated back');
					},
				},
				{
					label: 'Go Forward',
					accelerator: 'Alt+Right',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.webContents.goForward();
						}
						electronLog.info('Navigated forward');
					},
				},
				{
					label: 'Quit Etcher-ng',
					accelerator: 'CmdOrCtrl+Q',
					role: 'quit' as const,
				},
			],
		});
	} else {
		menuTemplate.unshift({
			label: appName,
			submenu: [
				{
					label: 'Go Back',
					accelerator: 'Alt+Left',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.webContents.goBack();
						}
						electronLog.info('Navigated back');
					},
				},
				{
					label: 'Go Forward',
					accelerator: 'Alt+Right',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.webContents.goForward();
						}
						electronLog.info('Navigated forward');
					},
				},
				{
					label: 'Quit Etcher-ng',
					accelerator: 'CmdOrCtrl+Q',
					role: 'quit' as const,
				},
			],
		});
	}

	const menu = electron.Menu.buildFromTemplate(menuTemplate);

	electron.Menu.setApplicationMenu(menu);
}
