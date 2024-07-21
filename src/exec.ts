import { spawn } from 'child_process';
import { Program } from './config';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

export async function executeCommand(program: Program, cwd: string): Promise<void> {
	const prefix = program.prefix || '--'

	const keys = Object.entries(program.config).map(([key, value]) => {
		const _key = `${prefix}${key}`

		if (typeof value === 'boolean') {
			return _key
		}

		if (typeof value === 'number') {
			return `${_key}=${value}`
		}

		if (typeof value === 'object') {
			const opt = Object.entries(value).map(([k, v]) => {
				return `${k}=${v}`
			}).join(' ')
			return `${_key}:${opt}`
		}

		if (Array.isArray(value)) {
			return `${_key}:${value.join(',')}`
		}

		return `${_key}=${value}`
	})

	const args = [...program.argv, ...keys]

	return new Promise((resolve, reject) => {
		const exec = findCommandInNodeModules(program.exec, cwd)

		if (exec === null) {
			reject(new Error(`Command not found: ${program.exec}`))
			return;
		}

		const childProcess = spawn(
			exec,
			args,
			{
				cwd,
				env: program.env,
				stdio: 'inherit',
				argv0: program.exec,
				// 独立进程
				// detached: true,
			},
		)

		// 监听错误事件
		childProcess.on('error', (err) => {
			reject(err)
		})

		// 监听退出事件
		childProcess.on('exit', (code) => {
			if (code === 0) {
				resolve()
			} else {
				reject(new Error(`Command failed with exit code ${code}`))
			}
		})
	})
}

function findCommandInNodeModules(command: string, startPath: string): string | null {
	let currentDir = startPath;
	while (currentDir !== '/') {
		const binPath = join(currentDir, 'node_modules', '.bin', command);
		if (existsSync(binPath)) {
			return binPath;
		}
		currentDir = dirname(currentDir);
	}
	return null;
}