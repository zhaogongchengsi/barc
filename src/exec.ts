import { spawn } from 'child_process';
import { Program } from './config';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { isObject } from './utils';

export async function executeCommand(program: Program, cwd: string): Promise<void> {
	const args = transformParameter(program)

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


function transformParameter(program: Program): string[] {
	const { config, argv } = program;

	const parseSuffix = (key: string, defaultStr: string = ':') => {
		if ([':', '='].some((s) => key.endsWith(s))) {
			return key.slice(-1)
		}
		return defaultStr
	}

	const parsePrefix = (key: string, defStr: string = '--') => {
		if (['-', '--'].some((p) => key.startsWith(p))) {
			return key[0]
		}
		return defStr
	}

	const args = Object.entries(config).map(([key, value]) => {
		let prefix = parsePrefix(key, key.length === 1 ? '-' : '--');

		const _key = `${prefix}${key}`

		if (typeof value === 'boolean') {
			return _key
		}

		if (typeof value === 'number') {
			return `${_key}${parseSuffix(key, '=')}${value}`
		}

		if (Array.isArray(value)) {
			return `${_key}${parseSuffix(key, ':')}${value.join(', ')}`
		}

		if (isObject(value)) {
			const commonKey = `${_key}${parseSuffix(key, ':')}`
			return Object.entries(value)
				.map(([k, v]) => {
					return `${commonKey}${k}${parseSuffix(k, '=')}${v}`
				})
		}

		return `${_key}${parseSuffix(key, '=')}${value}`
	})

	return [...argv, ...args].flat()
}
