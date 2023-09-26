import Generator, {
    GeneratorOptions as BaseGeneratorOptions,
} from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import path from "path";
import which from "which";

import * as env from "./env";

import simpl from "./generate-simpl";
import ts from "./generate-ts";
import js from "./generate-js";
import cli from "./generate-node-cli";
import html from "./generate-html";
import python from "./generate-python";
import c from "./generate-c";

const generators = [simpl, ts, js, cli, html, python, c];

interface GeneratorOptions extends BaseGeneratorOptions {}

interface Option {
    name: string;
    config: Generator.OptionConfig;
}

const options: Option[] = [
    {
        name: "description",
        config: {
            type: String,
            alias: "d",
            description: "Description of the project",
            default: "",
        },
    },
    {
        name: "yes",
        config: {
            type: Boolean,
            alias: "y",
            description:
                "Quick mode, skip all optional prompts and use defaults",
        },
    },
    {
        name: "open",
        config: {
            type: Boolean,
            alias: "o",
            description: "Open the generated project in Visual Studio Code",
        },
    },
    {
        name: "type",
        config: {
            type: String,
            alias: "t",
            description: `${generators
                .slice(0, 6)
                .map((type) => type.aliases[0])
                .join(", ")}...`,
        },
    },
    {
        name: "id",
        config: {
            type: String,
            description: "Id of the project",
        },
    },
    {
        name: "pkg",
        config: {
            type: String,
            alias: "p",
            description:
                'Package manager to use. Possible values, "yarn" or "npm"',
        },
    },
    {
        name: "git",
        config: {
            type: Boolean,
            alias: "g",
            description: "Initialize a git repo",
        },
    },
];

export default class extends Generator<GeneratorOptions> {
    public projectConfig: any;
    public template: any;
    public abort: boolean = false;

    constructor(args: string | string[], opts: GeneratorOptions) {
        super(args, opts);

        this.desc(
            "Generates project boilerplates of various types ready for development.",
        );

        this.initializeArguments();

        for (const { name, config } of options) {
            this.option(name, config);
        }

        // this.option("description", {
        //     type: String,
        //     description: "Description of the project",
        //     default: "",
        // });

        // this.option("yes", {
        //     type: Boolean,
        //     alias: "y",
        //     description:
        //         "Quick mode, skip all optional prompts and use defaults",
        // });

        // this.option("open", {
        //     type: Boolean,
        //     alias: "o",
        //     description: "Open the generated project in Visual Studio Code",
        // });

        // this.option("type", {
        //     type: String,
        //     alias: "t",
        //     description: `${generators
        //         .slice(0, 6)
        //         .map((type) => type.aliases[0])
        //         .join(", ")}...`,
        // });

        // this.option("projectDisplayName", {
        //     type: String,
        //     alias: "n",
        //     description: "Display name of the project",
        // });

        // this.option("id", {
        //     type: String,
        //     description: "Id of the project",
        // });

        // this.option("pkg", {
        //     type: String,
        //     alias: "p",
        //     description:
        //         'Package manager to use. Possible values, "yarn" or "npm"',
        // });

        // this.option("git", {
        //     type: Boolean,
        //     alias: "g",
        //     description: "Initialize a git repo",
        // });

        this.projectConfig = Object.create(null);
        this.projectConfig.installDependencies = false;

        this.options.skipPrompts = this.options.yes;

        this.template = undefined;
    }

    public initializeArguments(): void {
        this.argument("destination", {
            type: String,
            required: false,
            description:
                "\n    The folder to create the project in, absolute or relative to the current working directory.\n    Use '.' for the current folder. If not provided, defaults to a folder with the project display name.\n  ",
        });
    }

    async initializing() {
        this.log(
            yosay(
                `Welcome to the\n${chalk.magenta(
                    "Norgate AV",
                )}\nproject generator!`,
            ),
        );

        const { destination } = this.options;

        if (destination) {
            const folderPath = path.resolve(
                this.destinationPath(),
                destination,
            );

            this.destinationRoot(folderPath);
        }

        const dependencies = await env.getDependencies();
        this.projectConfig.dependencies = dependencies;

        const devDependencies = await env.getDevDependencies();
        this.projectConfig.devDependencies = devDependencies;

        this.projectConfig.devDep = (name: string) => {
            const version = devDependencies[name];

            if (typeof version === "undefined") {
                throw new Error(`Module ${name} is not listed in env.js`);
            }

            return `${JSON.stringify(name)}: ${JSON.stringify(version)}`;
        };

        this.projectConfig.dep = (name: string) => {
            const version = dependencies[name];

            if (typeof version === "undefined") {
                throw new Error(`Module ${name} is not listed in env.js`);
            }

            return `${JSON.stringify(name)}: ${JSON.stringify(version)}`;
        };

        const node = await env.getNodeEngine();
        this.projectConfig.node = node;
    }

    async prompting() {
        const { type } = this.options;

        if (type) {
            const template = generators.find(
                (generator) => generator.aliases.indexOf(type) !== -1,
            );

            if (template) {
                this.projectConfig.type = template.id;
            } else {
                this.log(
                    `Invalid project type: ${type}\nPossible types are: ${generators
                        .map((generator) => generator.aliases.join(", "))
                        .join(", ")}`,
                );

                this.abort = true;
            }
        } else {
            const choices = [];

            for (const generator of generators) {
                const { name, id } = generator;

                if (name) {
                    choices.push({ name, value: id });
                }
            }

            this.projectConfig.type = (
                await this.prompt({
                    type: "list",
                    name: "type",
                    message: "What type of project do you want to create?",
                    pageSize: choices.length,
                    choices,
                })
            ).type;
        }

        this.template = generators.find(
            (generator) => generator.id === this.projectConfig.type,
        );

        try {
            await this.template.prompting(this, this.projectConfig);
        } catch (error) {
            this.abort = true;
        }
    }

    writing() {
        if (this.abort) {
            return;
        }

        if (!this.options.destination && !this.template.update) {
            this.destinationRoot(this.destinationPath(this.projectConfig.name));
        }

        this.env.cwd = this.destinationPath();

        this.log();
        this.log(`Bootstrapping ${chalk.cyan(this.projectConfig.name)}...`);
        this.log();
        this.log(
            `Creating a new ${chalk.cyan(
                this.template.name,
            )} project in ${chalk.green(this.destinationPath())}.`,
        );
        this.log();

        this.sourceRoot(
            path.join(__dirname, `./templates/${this.projectConfig.type}`),
        );

        this.template.writing(this, this.projectConfig);
    }

    // async _gitInit() {
    //     const { git } = this.projectConfig;

    //     if (!git) {
    //         return Promise.resolve();
    //     }

    //     const gitPath = await which("git");

    //     if (gitPath) {
    //         await this.spawnCommand("git", ["init", "--quiet"]);
    //         this.log();
    //         this.log("Initialized a git repository.");
    //     } else {
    //         this.log();
    //         this.log(`${chalk.red.bold("Oops!")} 🤦‍♂️`);
    //         this.log(
    //             "You opted to use Git but Git is not installed on your system.",
    //         );
    //     }
    // }

    async install() {
        if (this.abort) {
            this.env.options.skipInstall = true;
            return;
        }

        if (this.projectConfig.installDependencies) {
            this.env.options.nodePackageManager = this.projectConfig.pkg;
        } else {
            this.env.options.skipInstall = true;
        }

        if (this.projectConfig.git) {
            await this.spawnCommand("git", ["init", "--quiet"]);
            this.log();
            this.log("Initialized a git repository.");
        }

        this.log();
        this.log("Installing packages. This might take a couple of minutes.");
    }

    async end() {
        if (this.abort) {
            return;
        }

        if (this.projectConfig.git) {
            await this.spawnCommand("git", ["add", "-A"]);
            await this.spawnCommand("git", [
                "commit",
                "-m",
                "chore: initial commit",
                "--no-verify",
                "--quiet",
            ]);

            this.log();
            this.log("Created git commit.");
        }

        this.log();
        this.log(
            `${chalk.green("Success!")} Created ${chalk.cyan(
                this.projectConfig.name,
            )} at ${chalk.green(this.destinationPath())}`,
        );
        this.log("Inside that directory, you can run several commands:");

        if (this.template.endMessage) {
            this.template.endMessage(this, this.projectConfig);
        }

        this.log(
            `Open ${chalk.cyan(
                "README.md",
            )} inside the new project for further instructions.`,
        );

        const [codeLocation] = await Promise.all([
            which("code").catch(() => undefined),
        ]);

        if (!this.options.open && !this.options.skipPrompts) {
            const cdLocation =
                this.options.destination || this.projectConfig.name;

            this.log();
            this.log(
                "To start editing with Visual Studio Code, use the following commands:",
            );

            this.log();
            this.log(`  ${chalk.cyan("code")} ${cdLocation}`);
            this.log();
        }

        this.log();
        this.log(chalk.magenta("Happy Hacking! 😀"));
        this.log();

        if (this.options.open) {
            if (codeLocation) {
                this.log(
                    `Opening ${chalk.green(
                        this.destinationPath(),
                    )} in Visual Studio Code...`,
                );

                this.spawnCommand(codeLocation, [this.destinationPath()]);
            } else {
                this.log(`${chalk.cyan("`code`")} command not found.`);
            }
        } else if (codeLocation) {
            const choices = [];

            if (codeLocation) {
                choices.push({
                    name: "Open with `code`",
                    value: codeLocation,
                });
            }

            choices.push({ name: "Skip", value: "skip" });

            const answer = await this.prompt({
                type: "list",
                name: "openWith",
                message:
                    "Do you want to open the new folder with Visual Studio Code?",
                choices,
            });

            if (answer && answer.openWith && answer.openWith !== "skip") {
                this.spawnCommand(answer.openWith, [this.destinationPath()]);
            }
        }
    }
}
