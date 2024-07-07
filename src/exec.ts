import { exec } from 'child_process';

function executeCommand(command: string, args: string[]): Promise<string> {
	return new Promise((resolve, reject) => {
		const childProcess = exec(`${command} ${args.join(' ')}`, (error, stdout, stderr) => {
			if (error) {
				reject(error);
			} else {
				resolve(stdout);
			}
		});

		childProcess.on('error', (error) => {
			reject(error);
		});
	});
}
