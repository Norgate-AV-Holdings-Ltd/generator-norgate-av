import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import path from "path";
import { AppOptions } from "./app.options";
import { TemplateFactory, Template, TemplateId } from "./templates";
import { CodeHelper, GitHelper } from "./helpers";
import cliOptions from "./cli/cli.options";
import cliArguments from "./cli/cli.arguments";
import { ProjectTypeQuestion } from "./questions";

export class AppGenerator extends Generator<AppOptions> {
    private template: Template | undefined = undefined;
    private readonly templateChoices = TemplateFactory.getAvailableTemplates();
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

    public async initializing(): Promise<void> {
        this.log(
            yosay(
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

    private async _promptForProjectType(
        choices: TemplateId[],
    ): Promise<string> {
        const answer = await this.prompt(
            new ProjectTypeQuestion(this, choices).getQuestion(),
        );

        return answer.type;
    }

    public async prompting(): Promise<void> {
        this.log("Prompting");
        this.options.type =
            this.options.type ||
            (await this._promptForProjectType(this.templateChoices));

        try {
            this.template = TemplateFactory.createTemplate(this);
            this.log(this.template.getName());
            await this.template.prompting();
        } catch (error) {
            this.log(error);
            this.abort = true;
        }

        this.log("Prompting Complete");
    }

    public async writing(): Promise<void> {
        this.log("Writing");
        if (this.abort) {
            return;
        }

        if (!this.options.destination) {
            this.destinationRoot(this.destinationPath(this.options.name));
        }

        this.template?.writing();
        this.log("Writing Complete");
    }

    public async install(): Promise<void> {
        if (this.abort) {
            this.env.options.skipInstall = true;
            return;
        }

        if (this.options.installDependencies) {
            this.env.options.nodePackageManager = this.options.pkg;
        } else {
            this.env.options.skipInstall = true;
        }

        if (this.options.git) {
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
                this.options.git = false;
            }
        }

        this.log();
        this.log("Installing packages. This might take a couple of minutes.");
    }

    public async end(): Promise<void> {
        if (this.abort) {
            return;
        }

        if (this.options.git) {
            await GitHelper.add(this);
            await GitHelper.commit(this);

            this.log();
            this.log("Created git commit.");
        }

        this.log();
        this.log(
            `${chalk.green("Success!")} Created ${chalk.cyan(
                this.options.name,
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
            const location = this.options.destination || this.options.name;

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
            CodeHelper.open(this, this.destinationPath());
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
}

export default AppGenerator;
