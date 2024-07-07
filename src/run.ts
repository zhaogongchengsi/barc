import { resolveConfig } from "./config"
import { isAbsolute, resolve } from 'path'
import { consola } from "consola";

export async function run(argv: string[], configPath: string, isOrder: boolean = false) {
	const root = process.cwd()
	const config = await resolveConfig(isAbsolute(configPath) ? configPath : resolve(root, configPath))

	if (argv.length === 0 && !config) {
		consola.warn('No command to run')
		return
	}


	console.log(argv, config, isOrder)
}

