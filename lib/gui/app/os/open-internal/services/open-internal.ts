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

import * as electron from 'electron';
import * as electronLog from 'electron-log';

/**
 * @summary Open an external resource in a new BrowserWindow
 */
export async function open(url: string) {
	if (url) {
		electronLog.info(`Opening internal window to ` + `'` + url + `'`);
		const newWin = new electron.BrowserWindow({
			width: 1024,
			height: 768,
			useContentSize: true,
			webPreferences: {
				sandbox: true,
			},
		});
		newWin.loadURL(url);
		newWin.on('close', () => {
			electronLog.info('Closed an internal window');
		});
	}
}
