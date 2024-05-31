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

import * as remote from '@electron/remote';
import * as electronLog from 'electron-log/renderer';

/**
 * @summary Open an external resource in a new BrowserWindow
 * using the remote module.
 */
export async function open(url: string) {
	if (url) {
		electronLog.info(`Opening remote internal window to ` + `'` + url + `'`);
		const remoteWin = new remote.BrowserWindow({
			width: 1024,
			height: 768,
			useContentSize: true,
			webPreferences: {
				sandbox: true,
			},
		});
		remoteWin.loadURL(url);
		remoteWin.on('close', () => {
			electronLog.info('Closed a remote internal window');
		});
	}
}
