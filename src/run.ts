import { resolveConfig, resolveProgram } from "./config"
import { isAbsolute, resolve } from 'path'
import { consola } from "consola";
import { isObject } from "./utils";
import { executeCommand } from "./exec";

export async function run(argv: string[], configPath: string, isOrder: boolean = false, log: boolean = false) {
	const root = process.cwd()
	const config = await resolveConfig(isAbsolute(configPath) ? configPath : resolve(root, configPath))

	if (argv.length === 0 && !config) {
		consola.warn('No command to run')
		return
	}

	if (!isObject(config)) {
		consola.warn('Invalid configuration file')
		return
	}

	const program = resolveProgram(config)

	const commands  = program.filter(({ key }) => argv.includes(key))

	if (commands.length === 0) {
		consola.warn('No command to run')
		return
	}

	if (isOrder) {
		for (const command of commands) {
			await executeCommand(command, root)
		}
	} else {
		await Promise.all(commands.map((p) => executeCommand(p, root)))
	}

}

