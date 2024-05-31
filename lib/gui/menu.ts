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

import * as i18next from 'i18next';

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
			label: i18next.t('menu.edit'),
		},
		{
			role: 'viewMenu',
			label: i18next.t('menu.view'),
		},
		{
			role: 'windowMenu',
			label: i18next.t('menu.window'),
		},
		{
			label: i18next.t('menu.devmenu'),
			submenu: [
				{
					label: i18next.t('menu.electrondevtools'),
					accelerator: isMac ? 'Cmd+Shift+F12' : 'F12',
					click() {
						toggleDevTools();
					},
				},
				{ type: 'separator' },
				{
					label: i18next.t('menu.gpu'),
					accelerator: 'CmdorCtrl+Alt+G',
					click() {
						electronLog.info('Opening chrome://gpu');
						openInternal('chrome://gpu');
					},
				},
				{
					label: i18next.t('menu.procinternals'),
					accelerator: 'CmdorCtrl+Alt+P',
					click() {
						electronLog.info('Opening chrome://process-internals');
						openInternal('chrome://process-internals');
					},
				},
				{ type: 'separator' },
				{
					label: i18next.t('menu.testwindow'),
					accelerator: 'CmdorCtrl+N',
					click() {
						electronLog.info('Opening Test Window');
						openInternal('https://www.google.com/');
					},
				},
				{
					label: 'Open File',
					accelerator: 'Ctrl+Shift+O',
					click() {
						electron.dialog
							.showOpenDialog({ properties: ['openFile'] })
							.then((result) => {
								electronLog.info('Opened file: ' + result.filePaths);
								const openURI = result.filePaths;
								const openWindow = new electron.BrowserWindow({
									webPreferences: {
										nodeIntegration: false,
										nodeIntegrationInWorker: false,
										contextIsolation: false,
										sandbox: true,
										experimentalFeatures: true,
										webviewTag: true,
										devTools: true,
									},
								});
								openWindow.loadFile(openURI[0]);
								openWindow.setTitle(openURI[0]);
							});
					},
				},
				{ type: 'separator' },
				{
					label: i18next.t('menu.config'),
					click() {
						electronLog.info('Editing Config File');
						electron.app.emit('edit-config-file');
					},
				},
				{
					label: i18next.t('menu.restart'),
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
			label: i18next.t('menu.help'),
			submenu: [
				{
					label: i18next.t('menu.pro'),
					click() {
						openInternal(
							'https://www.balena.io/etcher-pro?utm_source=etcher_menu&ref=etcher_menu',
						);
					},
				},
				{
					label: i18next.t('menu.website'),
					click() {
						openInternal('https://etcher.balena.io?ref=etcher_menu');
					},
				},
				{
					label: i18next.t('menu.issue'),
					click() {
						openExternal('https://github.com/Alex313031/etcher-ng-win7/issues');
					},
				},
				{ type: 'separator' },
				{
					label: i18next.t('menu.about'),
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
					label: i18next.t('menu.about'),
				},
				{
					type: 'separator' as const,
				},
				{
					role: 'hide' as const,
					label: i18next.t('menu.hide'),
				},
				{
					role: 'hideOthers' as const,
					label: i18next.t('menu.hideOthers'),
				},
				{
					role: 'unhide' as const,
					label: i18next.t('menu.unhide'),
				},
				{
					type: 'separator' as const,
				},
				{
					label: i18next.t('menu.goback'),
					accelerator: 'Alt+Left',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.webContents.goBack();
						}
						electronLog.info('Navigated back');
					},
				},
				{
					label: i18next.t('menu.goforward'),
					accelerator: 'Alt+Right',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.webContents.goForward();
						}
						electronLog.info('Navigated forward');
					},
				},
				{
					label: i18next.t('menu.quit'),
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
					label: i18next.t('menu.goback'),
					accelerator: 'Alt+Left',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.webContents.goBack();
						}
						electronLog.info('Navigated back');
					},
				},
				{
					label: i18next.t('menu.goforward'),
					accelerator: 'Alt+Right',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.webContents.goForward();
						}
						electronLog.info('Navigated forward');
					},
				},
				{
					label: i18next.t('menu.quit'),
					accelerator: 'CmdOrCtrl+Q',
					role: 'quit' as const,
				},
			],
		});
	}

	const menu = electron.Menu.buildFromTemplate(menuTemplate);

	electron.Menu.setApplicationMenu(menu);
}
