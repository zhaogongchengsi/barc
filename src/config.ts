import consola from "consola"
import { safeDestr } from "destr"
import { existsSync } from "fs"
import { readFile } from 'fs/promises'
import { isEmptyObject, isObject } from "./utils"

export const CONFIG_NAME = 'barc.config.json'

export interface Program {
	exec: string,
	argv: string[],
	prefix?: string,
	env?: {
		[key: string]: string
	},
	config: {
		[key: string]: any
	}
}

export interface Config {
	[key: string]: {
		argv?: string[],
		prefix?: string,
		env?: {
			[key: string]: string
		},
		[key: string]: any
	}
}

export async function resolveConfig(path?: string): Promise<Config | undefined> {
	if (!path || !existsSync(path) || !path.endsWith('.json')) {
		return undefined
	}

	const content = await readFile(path, 'utf-8').catch(() => {
		consola.error('Failed to read configuration file')
	})

	if (!content) return

	try {
		return safeDestr(content)
	} catch (e: any) {
		consola.error(`Failed to parse configuration file: ${e.message}`)
	}
}

export function resolveProgram(config?: Config): Program[] {
	if (!config || !isObject(config) || isEmptyObject(config)) return []

	return Object.entries(config)
		.map(([exec, value]) => {
			if (!isObject(value)) return undefined

			const prefix = value.prefix || '--'
			const argv = value.argv || []
			const env = value.env || {}

			delete value.prefix
			delete value.argv
			delete value.env

			return {
				exec,
				argv,
				prefix,
				env,
				config: value
			}
		}).filter(Boolean) as Program[]
}