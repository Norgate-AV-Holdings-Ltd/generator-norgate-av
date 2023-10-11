import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import path from "path";
import which from "which";
import { AppOptions } from "./app.options";
import { TemplateFactory, Template, TemplateId } from "./templates";
import { GitHelper } from "./helpers";
import cliOptions from "./cli/cli.options";
import cliArguments from "./cli/cli.arguments";

export class AppGenerator extends Generator<AppOptions> {
    private readonly yosay: Function = yosay;
    private template: Template | undefined = undefined;
    private readonly templateChoices: TemplateId[] =
        TemplateFactory.getAvailableTemplates();
    private abort: boolean = false;

    constructor(args: string | string[], opts: AppOptions) {
        super(args, opts);

        this._initializeCliArguments();
        this._initializeCliOptions();

        this.description =
            "Generates project boilerplates of various types ready for development.";
        this.options.skipPrompts = this.options.yes;
    }

    private _initializeCliArguments(): void {
        for (const { name, config } of cliArguments) {
            this.argument(name, config);
        }
    }

    private _initializeCliOptions(): void {
        for (const { name, config } of cliOptions) {
            this.option(name, config);
        }
    }

    public async initializing() {
        this.log(
            this.yosay(
                `Welcome to the\n${chalk.bold.magenta(
                    "Norgate AV",
                )}\nproject generator!`,
            ),
        );

        this.destinationRoot(
            path.resolve(
                this.destinationPath(),
                this.options.destination || "",
            ),
        );
    }

    private async _promptForProjectType(choices: TemplateId[]) {
        const answer = await this.prompt({
            type: "list",
            name: "type",
            message: "What type of project do you want to create?",
            pageSize: choices.length,
            choices: choices.map((type) => {
                return {
                    name: type.name,
                    value: type.id,
                };
            }),
            when: !this.options.type,
        });

        return answer.type;
    }

    public async prompting() {
        this.options.type =
            this.options.type ||
            (await this._promptForProjectType(this.templateChoices));

        try {
            this.template = TemplateFactory.createTemplate(this);
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
            `Creating a new ${chalk.cyan(
                this.template?.getName(),
            )} project in ${chalk.green(this.env.cwd)}.`,
        );
        this.log();

        this.sourceRoot(
            path.join(__dirname, `./templates/${this.project.type}`),
        );
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
                this.log(
                    "You opted to use Git but Git is not installed on your system.",
                );
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
            `${chalk.green("Success!")} Created ${chalk.cyan(
                this.project.name,
            )} at ${chalk.green(this.destinationPath())}`,
        );
        this.log("Inside that directory, you can run several commands:");

        this.template?.end();

        this.log(
            `Open ${chalk.cyan(
                "README.md",
            )} inside the new project for further instructions.`,
        );

        if (!this.options.open && !this.options.skipPrompts) {
            const location = this.options.destination || this.project.name;

            this.log();
            this.log(
                "To start editing with Visual Studio Code, use the following commands:",
            );

            this.log();
            this.log(`  ${chalk.cyan("code")} ${location}`);
            this.log();
        }

        this.log();
        this.log(chalk.magenta("Happy Hacking! 😀"));
        this.log();

        if (this.options.open) {
            this._openWithCode();
        }

        // const choices = [];
        // if (code) {
        //     choices.push({
        //         name: "Open with `code`",
        //         value: code,
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
        // return;
    }

    private async _openWithCode() {
        const code = await which("code").catch(() => undefined);

        if (!code) {
            this.log(`${chalk.cyan("`code`")} command not found.`);
            return;
        }

        this.log(
            `Opening ${chalk.green(
                this.destinationPath(),
            )} in Visual Studio Code...`,
        );
        await this.spawnCommand(code, [this.destinationPath()]);
    }
}

class CodeHelper {
    public static async getPath(): Promise<string | Error> {
        const code = await which("code").catch(() => undefined);

        if (!code) {
            throw new Error(`${chalk.cyan("`code`")} command not found.`);
        }

        return code;
    }

    public static async open(generator: any, path: string): Promise<void> {
        const code = await which("code").catch(() => undefined);

        if (!code) {
            this.log(`${chalk.cyan("`code`")} command not found.`);
            return;
        }

        this.log(`Opening ${chalk.green(path)} in Visual Studio Code...`);
        await this.spawnCommand(code, [path]);
    }
}
export type App = typeof AppGenerator;
export default AppGenerator;
