const translation = {
	translation: {
		continue: 'Continue',
		ok: 'OK',
		cancel: 'Cancel',
		skip: 'Skip',
		sure: "Yes, I'm sure",
		warning: 'WARNING! ',
		attention: 'Attention',
		failed: 'Failed',
		completed: 'Completed',
		yesContinue: 'Yes, continue',
		reallyExit: 'Are you sure you want to close Etcher-ng?',
		yesExit: 'Yes, quit',
		progress: {
			starting: 'Starting...',
			decompressing: 'Decompressing...',
			flashing: 'Flashing...',
			finishing: 'Finishing...',
			verifying: 'Validating...',
			failing: 'Failed',
		},
		message: {
			sizeNotRecommended: 'Not recommended',
			tooSmall: 'Too small',
			locked: 'Locked',
			system: 'System drive',
			containsImage: 'Source drive',
			largeDrive: 'Large drive',
			sourceLarger: 'The selected source is {{byte}} larger than this drive.',
			flashSucceed_one: 'Successful target',
			flashSucceed_other: 'Successful targets',
			flashFail_one: 'Failed target',
			flashFail_other: 'Failed targets',
			toDrive: 'to {{description}} ({{name}})',
			toTarget_one: 'to {{num}} target',
			toTarget_other: 'to {{num}} targets',
			andFailTarget_one: 'and failed to be flashed to {{num}} target',
			andFailTarget_other: 'and failed to be flashed to {{num}} targets',
			succeedTo: '{{name}} was successfully flashed {{target}}',
			exitWhileFlashing:
				'You are currently flashing a drive. Closing Etcher-ng may leave your drive in an unusable state.',
			looksLikeWindowsImage:
				'It looks like you are trying to burn a Windows image.\n\nUnlike other images, Windows images require special processing to be made bootable. We suggest you use a tool specially designed for this purpose, such as <a href="https://rufus.akeo.ie">Rufus</a> (Windows), <a href="https://github.com/slacka/WoeUSB">WoeUSB</a> (Linux), or Boot Camp Assistant (macOS).',
			image: 'image',
			drive: 'drive',
			missingPartitionTable:
				'It looks like this is not a bootable {{type}}.\n\nThe {{type}} does not appear to contain a partition table, and might not be recognized or bootable by your device.',
			largeDriveSize:
				"This is a large drive! Make sure it doesn't contain files that you want to keep.",
			systemDrive:
				'Selecting your system drive is dangerous and will erase your drive!',
			sourceDrive: 'Contains the image you chose to flash',
			noSpace:
				'Not enough space on the drive. Please insert larger one and try again.',
			genericFlashError:
				'Something went wrong. If it is a compressed image, please check that the archive is not corrupted.\n{{error}}',
			validation:
				'The write has been completed successfully but Etcher-ng detected potential corruption issues when reading the image back from the drive. \n\nPlease consider writing the image to a different drive.',
			openError:
				'Something went wrong while opening {{source}}.\n\nError: {{error}}',
			flashError: 'Something went wrong while writing {{image}} {{targets}}.',
			unplug:
				"Looks like Etcher-ng lost access to the drive. Did it get unplugged accidentally?\n\nSometimes this error is caused by faulty readers that don't provide stable access to the drive.",
			cannotWrite:
				'Looks like Etcher-ng is not able to write to this location of the drive. This error is usually caused by a faulty drive, reader, or port. \n\nPlease try again with another drive, reader, or port.',
			childWriterDied:
				'The writer process ended unexpectedly. Please try again, and contact the Etcher-ng team if the problem persists.',
			badProtocol: 'Only http:// and https:// URLs are supported.',
		},
		target: {
			selectTarget: 'Select target',
			plugTarget: 'Plug in a target drive',
			targets: 'Targets',
			change: 'Change',
		},
		source: {
			useSourceURL: 'Use Image URL',
			auth: 'Authentication',
			username: 'Enter username',
			password: 'Enter password',
			unsupportedProtocol: 'Unsupported protocol',
			windowsImage: 'Possible Windows image detected',
			partitionTable: 'Missing partition table',
			errorOpen: 'Error opening source',
			fromFile: 'Flash from file',
			fromURL: 'Flash from URL',
			clone: 'Clone drive',
			image: 'Image',
			name: 'Name: ',
			path: 'Path: ',
			selectSource: 'Select source',
			plugSource: 'Plug a source drive',
			osImages: 'OS Images',
			allFiles: 'All',
			enterValidURL: 'Enter a valid URL',
		},
		drives: {
			name: 'Name',
			size: 'Size',
			location: 'Location',
			find: '{{length}} found',
			select: 'Select {{select}}',
			showHidden: 'Show {{num}} hidden',
			systemDriveDanger:
				'Selecting your system drive is dangerous and will erase your drive!',
			openInBrowser: '`Etcher-ng will open {{link}} in your browser`',
			changeTarget: 'Change target',
			largeDriveWarning: 'You are about to erase an unusually large drive',
			largeDriveWarningMsg:
				'Are you sure the selected drive is not a storage drive?',
			systemDriveWarning: "You are about to erase your computer's drives",
			systemDriveWarningMsg:
				'Are you sure you want to flash your system drive?',
		},
		flash: {
			another: 'Flash another',
			target: 'Target',
			location: 'Location',
			error: 'Error',
			flash: 'Flash',
			flashNow: 'Flash!',
			skip: 'Validation has been skipped',
			moreInfo: 'more info',
			speedTip:
				'The speed is calculated by dividing the image size by the flashing time.\nDisk images with ext partitions flash faster as we are able to skip unused parts.',
			speed: 'Effective speed: {{speed}} MB/s',
			speedShort: '{{speed}} MB/s',
			eta: 'ETA: {{eta}}',
			failedTarget: 'Failed targets',
			failedRetry: 'Retry failed targets',
			flashFailed: 'Flash Failed.',
			flashCompleted: 'Flash Completed!',
		},
		settings: {
			errorReporting:
				'Anonymously report errors and usage statistics to balena.io',
			verify: 'Auto Verify after flashing',
			verifyDesc: 'Verify that the drive was written correctly',
			autoUpdate: 'Auto-updates enabled',
			settings: 'Settings',
			systemInformation: 'System Information',
			trimExtPartitions:
				'Trim unallocated space on raw images (in ext-type partitions)',
			decompressFirst:
				'Decompress compressed images (i.e. .tar.xz) before flashing',
		},
		menu: {
			edit: 'Edit',
			view: 'View',
			devTool: 'Toggle Developer Tools',
			window: 'Window',
			help: 'Help',
			pro: 'Etcher Pro',
			website: 'Etcher Website',
			issue: 'Report an Issue',
			devmenu: 'Developer',
			electrondevtools: 'Open Electron DevTools',
			testwindow: 'Open Test Window',
			config: 'Edit Config File',
			restart: 'Restart App',
			gpu: 'Open chrome://gpu',
			procinternals: 'Open chrome://process-internals',
			goback: 'Go Back',
			goforward: 'Go Forward',
			about: 'About Etcher-ng',
			hide: 'Hide Etcher-ng',
			hideOthers: 'Hide Others',
			unhide: 'Unhide All',
			quit: 'Quit Etcher-ng',
		},
	},
};

export default translation;