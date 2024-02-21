#!/usr/bin/env node

import figlet from "figlet";
import StringBuilder from "string-builder";
import chalk from "chalk";
import { Command } from "commander";
import { getPackageJson } from "./utils/index.js";
import { hello } from "./commands/index.js";

const packageJson = await getPackageJson();

if (!packageJson) {
    console.log(chalk.bold.red("Could not find package.json"));
    process.exit(1);
}

const args = process.argv;
const program = new Command();

program
    .name(packageJson.name)
    .description(packageJson.description)
    .version(packageJson.version, "-v, --version");

program.addCommand(hello());

program.addHelpText("beforeAll", () => {
    const builder = new StringBuilder();

    builder
        .appendLine(figlet.textSync(packageJson.name))
        .appendLine()
        .appendLine(`${packageJson.version}`)
        .appendLine("===================================================")
        .appendLine();

    return builder.toString();
});

if (!args[2]) {
    program.outputHelp();
    process.exit(0);
}

program.parse(args);
