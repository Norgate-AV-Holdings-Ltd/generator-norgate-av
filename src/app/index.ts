import Generator, { GeneratorOptions as BaseGeneratorOptions } from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import path from "path";
import which from "which";
import TemplateFactory from "./template.factory";
import Template, { TemplateId } from "./template.interface";
import options from "./cli/cli.options";
import args from "./cli/cli.arguments";
import Project from "./project.options";
import { GitHelper } from "./GitHelper";

interface GeneratorOptions extends BaseGeneratorOptions {}

export default class extends Generator<GeneratorOptions> {
    private project: Project = new Project();
    private template: Template | undefined = undefined;
    private readonly templateChoices: TemplateId[] = TemplateFactory.getAvailableTemplates();
    private abort: boolean = false;

    constructor(args: string | string[], opts: GeneratorOptions) {
        super(args, opts);

        this._initializeCliArguments();
        this._initializeCliOptions();

        this.desc("Generates project boilerplates of various types ready for development.");
        this.options.skipPrompts = this.options.yes;
    }

    private _initializeCliArguments(): void {
        for (const { name, config } of args) {
            this.argument(name, config);
        }
    }

    private _initializeCliOptions(): void {
        for (const { name, config } of options) {
            this.option(name, config);
        }
    }

    public async initializing() {
        const { destination } = this.options;

        this.log(yosay(`Welcome to the\n${chalk.bold.magenta("Norgate AV")}\nproject generator!`));

        if (!destination) {
            return;
        }

        const folderPath = path.resolve(this.destinationPath(), destination);
        this.destinationRoot(folderPath);
    }

    public async prompting() {
        const { type } = this.options;

        if (!type) {
            const answer = await this.prompt({
                type: "list",
                name: "type",
                message: "What type of project do you want to create?",
                pageSize: this.templateChoices.length,
                choices: this.templateChoices.map((template) => {
                    return {
                        name: template.name,
                        value: template.id,
                    };
                }),
            });

            this.project.type = answer.type;
        } else {
            const template = this.templateChoices.find(
                (template) => template.aliases.indexOf(type) !== -1,
            );

            if (template) {
                this.project.type = template.id;
            } else {
                this.log(
                    `Invalid project type: ${type}\nPossible types are: ${this.templateChoices
                        .map((template) => template.aliases.join(", "))
                        .join(", ")}`,
                );

                this.abort = true;
                return;
            }
        }

        try {
            this.template = TemplateFactory.createTemplate(this.project.type, {
                generator: this,
                options: this.options,
            });

            await this.template.prompting();
        } catch (error) {
            this.abort = true;
        }
    }

    public async writing() {
        if (this.abort) {
            return;
        }

        if (!this.options.destination) {
            this.destinationRoot(this.destinationPath(this.project.name));
        }

        this.env.cwd = this.destinationPath();

        this.log();
        this.log(`Bootstrapping ${chalk.cyan(this.project.name)}...`);
        this.log();
        this.log(
            `Creating a new ${chalk.cyan(this.template?.getName())} project in ${chalk.green(
                this.env.cwd,
            )}.`,
        );
        this.log();

        this.sourceRoot(path.join(__dirname, `./templates/${this.project.type}`));
        this.template?.writing();
    }

    public async install() {
        if (this.abort) {
            this.env.options.skipInstall = true;
            return;
        }

        if (this.project.installDependencies) {
            this.env.options.nodePackageManager = this.project.pkg;
        } else {
            this.env.options.skipInstall = true;
        }

        if (this.project.git) {
            try {
                await GitHelper.init(this);
                this.log();
                this.log("Initialized a git repository.");
            } catch (error) {
                this.log();
                this.log(`${chalk.red.bold("Oops!")} 🤦‍♂️`);
                this.log("You opted to use Git but Git is not installed on your system.");
                this.log();
                this.log("Skipping git setup.");
                this.log();
                this.project.git = false;
            }
        }

        this.log();
        this.log("Installing packages. This might take a couple of minutes.");
    }

    public async end() {
        if (this.abort) {
            return;
        }

        if (this.project.git) {
            await GitHelper.add(this);
            await GitHelper.commit(this);

            this.log();
            this.log("Created git commit.");
        }

        this.log();
        this.log(
            `${chalk.green("Success!")} Created ${chalk.cyan(this.project.name)} at ${chalk.green(
                this.destinationPath(),
            )}`,
        );
        this.log("Inside that directory, you can run several commands:");

        this.template?.end();

        this.log(
            `Open ${chalk.cyan("README.md")} inside the new project for further instructions.`,
        );

        if (!this.options.open && !this.options.skipPrompts) {
            const location = this.options.destination || this.project.name;

            this.log();
            this.log("To start editing with Visual Studio Code, use the following commands:");

            this.log();
            this.log(`  ${chalk.cyan("code")} ${location}`);
            this.log();
        }

        this.log();
        this.log(chalk.magenta("Happy Hacking! 😀"));
        this.log();

        if (!this.options.open) {
            // const choices = [];
            // if (codeLocation) {
            //     choices.push({
            //         name: "Open with `code`",
            //         value: codeLocation,
            //     });
            // }
            // choices.push({ name: "Skip", value: "skip" });
            // const answer = await this.prompt({
            //     type: "list",
            //     name: "openWith",
            //     message: "Do you want to open the new folder with Visual Studio Code?",
            //     choices,
            // });
            // if (answer && answer.openWith && answer.openWith !== "skip") {
            //     this.spawnCommand(answer.openWith, [this.destinationPath()]);
            // }
            return;
        }

        this._openWithCode();
    }

    private async _openWithCode() {
        const code = await which("code").catch(() => undefined);

        if (!code) {
            this.log(`${chalk.cyan("`code`")} command not found.`);
            return;
        }

        this.log(`Opening ${chalk.green(this.destinationPath())} in Visual Studio Code...`);
        await this.spawnCommand(code, [this.destinationPath()]);
    }
}
