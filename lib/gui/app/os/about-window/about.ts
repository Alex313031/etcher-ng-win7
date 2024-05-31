/*
 * Copyright 2024 Alex313031
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
import * as electronLog from 'electron-log';
import * as remote from '@electron/remote/main';
import * as path from 'path';

/**
 * @summary Open a small window showing app version info
 */
export async function open() {
	const aboutWin = new electron.BrowserWindow({
		width: 500,
		height: 400,
		useContentSize: true,
		autoHideMenuBar: true,
		skipTaskbar: true,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: false,
			sandbox: false,
			experimentalFeatures: true,
			preload: path.join(__dirname, 'preload.js'),
		},
	});
	remote.enable(aboutWin.webContents);
	aboutWin.loadURL(
		`file://${path.join(
			'/',
			...__dirname.split(path.sep).map(encodeURIComponent),
			'about.html',
		)}`,
	);
	electronLog.info(`Opened About window`);
	aboutWin.on('close', () => {
		electronLog.info('Closed About window');
	});
}
