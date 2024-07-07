import { defineCommand, runMain } from "citty";
import { run } from "./run";
import pkg from "../package.json";
import { CONFIG_NAME } from "./config";

const main = defineCommand({
	meta: {
		name: "barc",
		version: pkg.version,
		description: "A tool to help command-line programs pass parameters",
	},
	args: {
		order: {
			type: "boolean",
			description: "Is it necessary to execute in an orderly manner?",
			alias: 'o',
			default: false
		},
		config: {
			type: "string",
			description: "Specify the configuration file",
			alias: 'c',
			valueHint: "path",
			default: CONFIG_NAME
		},
		log: {
			type: "boolean",
			description: "Output log information",
			alias: 'l',
			default: false
		}
	},
	run({args}) {
		run(args._, args.config, args.order, args.log)
	},
});

runMain(main);