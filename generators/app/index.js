const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

const path = require("path");
const which = require("which");
const env = require("./env");

const simpl = require("./generate-simpl");
const ts = require("./generate-ts");
const js = require("./generate-js");
const cli = require("./generate-node-cli");
const html = require("./generate-html");
const python = require("./generate-python");
const c = require("./generate-c");

const generators = [simpl, ts, js, cli, html, python, c];

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.appname = "Norgate AV Project Generator";

        this.description =
            "Generates project boilerplates of various types ready for development.";

        this.argument("destination", {
            type: String,
            required: false,
            description:
                "\n    The folder to create the project in, absolute or relative to the current working directory.\n    Use '.' for the current folder. If not provided, defaults to a folder with the project display name.\n  ",
        });

        this.option("yes", {
            type: Boolean,
            alias: "y",
            description:
                "Quick mode, skip all optional prompts and use defaults",
        });

        this.option("open", {
            type: Boolean,
            alias: "o",
            description: "Open the generated project in Visual Studio Code",
        });

        this.option("projectType", {
            type: String,
            alias: "t",
            description: `${generators
                .slice(0, 6)
                .map((projectType) => projectType.aliases[0])
                .join(", ")}...`,
        });

        this.option("projectDisplayName", {
            type: String,
            alias: "n",
            description: "Display name of the project",
        });

        this.option("projectId", {
            type: String,
            description: "Id of the project",
        });

        this.option("projectDescription", {
            type: String,
            description: "Description of the project",
            default: "",
        });

        this.option("pkg", {
            type: String,
            alias: "p",
            description:
                'Package manager to use. Possible values, "yarn" or "npm"',
            // default: "yarn",
        });

        this.option("git", {
            type: Boolean,
            alias: "g",
            description: "Initialize a git repo",
            // default: true,
        });

        this.projectConfig = Object.create(null);
        this.projectConfig.installDependencies = false;

        this.options.skipPrompts = this.options.yes;

        this.projectGenerator = undefined;

        this.abort = false;
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

        this.projectConfig.dep = (name) => {
            const version = dependencies[name];

            if (typeof version === "undefined") {
                throw new Error(`Module ${name} is not listed in env.js`);
            }

            return `${JSON.stringify(name)}: ${JSON.stringify(version)}`;
        };

        const node = await env.getNodeVersion();
        this.projectConfig.node = node;
    }

    async prompting() {
        const { projectType } = this.options;

        if (projectType) {
            // const projectTypeId = `project-${projectType}`;

            const projectGenerator = generators.find(
                (generator) => generator.aliases.indexOf(projectType) !== -1,
            );

            if (projectGenerator) {
                this.projectConfig.type = projectGenerator.id;
            } else {
                this.log(
                    `Invalid project type: ${projectType}\nPossible types are: ${generators
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

        this.projectGenerator = generators.find(
            (generator) => generator.id === this.projectConfig.type,
        );

        try {
            await this.projectGenerator.prompting(this, this.projectConfig);
        } catch (error) {
            this.abort = true;
        }
    }

    writing() {
        if (this.abort) {
            return;
        }

        if (!this.options.destination && !this.projectGenerator.update) {
            this.destinationRoot(this.destinationPath(this.projectConfig.name));
        }

        this.env.cwd = this.destinationPath();

        this.log();
        this.log(`Bootstrapping ${chalk.cyan(this.projectConfig.name)}...`);
        this.log();
        this.log(
            `Creating a new ${chalk.cyan(
                this.projectGenerator.name,
            )} project in ${chalk.green(this.destinationPath())}.`,
        );
        this.log();

        this.sourceRoot(
            path.join(__dirname, `./templates/${this.projectConfig.type}`),
        );

        this.projectGenerator.writing(this, this.projectConfig);
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

        if (this.projectGenerator.endMessage) {
            this.projectGenerator.endMessage(this, this.projectConfig);
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
};
