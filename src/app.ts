import path from "node:path";
import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import {
    Answers,
    AppOptions,
    GeneratorInterface,
    GeneratorSignature,
    UnresolvedConfig,
} from "./@types/index.js";
import { GeneratorFactory } from "./generators/GeneratorFactory.js";
import {
    CliHelper,
    CodeHelper,
    ConfigHelper,
    GitHelper,
} from "./helpers/index.js";
import { ProjectType } from "./questions/index.js";
import config from "../config/default.json";

await ConfigHelper.initialize(config as UnresolvedConfig);

class AppGenerator extends Generator<AppOptions> {
    private generator: GeneratorInterface | undefined = undefined;
    private readonly choices = GeneratorFactory.getAvailable();
    public abort: boolean = false;

    constructor(args: string | Array<string>, options: AppOptions) {
        super(args, options);

        this._initializeCliArguments();
        this._initializeCliOptions();

        this.description =
            "Generates project boilerplates of various types ready for development.";
        this.options.skipPrompts = this.options.yes || false;

        if (this.options.skipPrompts) {
            this.options.git = true;
        }
    }

    private _initializeCliArguments(): void {
        for (const arg of CliHelper.getArguments()) {
            this.argument(arg.name, arg.config);
        }
    }

    private _initializeCliOptions(): void {
        this.option(CliHelper.getOptions());
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

        return Promise.resolve();
    }

    private async _getProjectType(
        choices: Array<GeneratorSignature>,
    ): Promise<string> {
        const question = new ProjectType(this, choices).getQuestion();

        const answer = await this.prompt<Answers>({
            ...question,
            name: question.name as string,
        });

        return answer.type;
    }

    private _logError(error: unknown): void {
        if (!(error instanceof Error)) {
            return;
        }

        this.log(chalk.red(error.message));
    }

    public async prompting(): Promise<void> {
        this.options.type =
            this.options.type || (await this._getProjectType(this.choices));

        try {
            this.generator = GeneratorFactory.create(this);
            await this.generator.initialize();
            await this.generator.prompting();
        } catch (error) {
            this._logError(error);
            this.abort = true;
        }
    }

    public async writing(): Promise<void> {
        if (this.abort) {
            return;
        }

        if (!this.options.destination) {
            this.destinationRoot(this.destinationPath(this.options.name));
        }

        await this.generator?.writing();

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
    }

    public async install(): Promise<void> {
        if (this.abort) {
            this.options.skipInstall = true;
            return;
        }

        if (this.options.skipInstall) {
            return;
        }

        this.log();
        this.log("Installing packages. This might take a couple of minutes.");

        await this.generator?.install();
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

        await this.generator?.end();

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

        const code = await CodeHelper.getPath();

        if (code && this.options.open) {
            await CodeHelper.open(this, this.destinationPath());
            return;
        }

        const choices = [];

        if (code) {
            choices.push({
                name: "Open with `code`",
                value: code,
            });
        }

        choices.push({ name: "Skip", value: "skip" });

        const answer = await this.prompt<{ openWith: string }>({
            type: "list",
            name: "openWith",
            message:
                "Do you want to open the new folder with Visual Studio Code?",
            choices,
        });

        if (answer.openWith === "skip") {
            return;
        }

        await this.spawn(answer.openWith, [this.destinationPath()]);
    }
}

export default AppGenerator;
