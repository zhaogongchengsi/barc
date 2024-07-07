import { resolveConfig, resolveProgram } from "./config"
import { isAbsolute, resolve } from 'path'
import { consola } from "consola";
import { isObject } from "./utils";

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

	if (argv.length === 0) {
		argv = [program[0].exec]
	}

	const tasks = program.filter(({ exec }) => argv.includes(exec))

	console.log(argv, program)
}

