import consola from "consola"
import { safeDestr } from "destr"
import { existsSync } from "fs"
import { readFile } from 'fs/promises'

export const CONFIG_NAME = 'barc.config.json'

export interface Config {
	[key: string]: any
}

export async function resolveConfig(path?: string): Promise<Config | undefined>{
	if (!path || !existsSync(path) || !path.endsWith('.json')) {
		return undefined
	}

	const content = await readFile(path, 'utf-8').catch(() => {
		consola.error('Failed to read configuration file')
	})

	if (!content) return

	try {
		return safeDestr(content)
	} catch (e:any) {
		consola.error(`Failed to parse configuration file: ${e.message}`)
	}
}
