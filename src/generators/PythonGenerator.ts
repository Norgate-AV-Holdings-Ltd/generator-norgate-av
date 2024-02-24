import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { PromptQuestion } from "@yeoman/types";
import {
    Answers,
    GeneratorInterface,
    GeneratorSignature,
    PathMap,
} from "../@types/index.js";
import AppGenerator from "../app.js";
import {
    Author,
    Git,
    ProjectDescription,
    ProjectId,
    ProjectName,
} from "../questions/index.js";
import { PythonEnvironment } from "../environments/index.js";
import { ConfigHelper } from "../helpers/index.js";

export class PythonGenerator implements GeneratorInterface {
    private readonly generator: AppGenerator;
    private readonly name = PythonGenerator.getSignature().name;
    private readonly questions: Array<PromptQuestion<Answers>> = [];

    public constructor(generator: AppGenerator) {
        this.generator = generator;
        this.generator.options.python = new PythonEnvironment();
        // this.generator.options.environment = new PythonEnvironment()
    }

    public async initialize(): Promise<void> {
        this.setupPrompts();
        return Promise.resolve();
    }

    private setupPrompts(): void {
        this.questions.push(
            new ProjectName(this.generator).getQuestion(),
            new ProjectId(this.generator).getQuestion(),
            new ProjectDescription(this.generator).getQuestion(),
            new Author(this.generator).getQuestion(),
            new Git(this.generator).getQuestion(),
        );
    }

    public static getSignature(): GeneratorSignature {
        const config = ConfigHelper.getInstance().getConfig();
        return config.generators.python.signature;
    }

    public getSourceRoot(): string {
        const config = ConfigHelper.getInstance().getConfig();
        return path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            config.files.directory,
            PythonGenerator.getSignature().id,
        );
    }

    public async prompting(): Promise<void> {
        const answers = await this.generator.prompt<Answers>(
            this.questions.map((q) => {
                return {
                    ...q,
                    name: q.name as string,
                };
            }),
        );

        this.updateOptions(answers);
    }

    private updateOptions(answers: Answers): void {
        this.generator.options.type =
            this.generator.options.type || answers.type;

        this.generator.options.name =
            this.generator.options.name || answers.name;

        this.generator.options.id = this.generator.options.id || answers.id;

        this.generator.options.author = this.generator.options.skipPrompts
            ? this.generator.options.author
            : answers.author;

        this.generator.options.description = this.generator.options.skipPrompts
            ? this.generator.options.description
            : answers.description;

        // If git was passed in as false, the prompt wont be asked so we want to keep it as false
        // If git was passed in as true, the prompt wont be asked so we want to keep it as true
        // If git was not passed in, it be undefined and we want to set it to the answer
        if (this.generator.options.git === undefined) {
            this.generator.options.git = answers.git;
        }
    }

    private getFilePaths(): Array<PathMap> {
        const config = ConfigHelper.getInstance().getConfig();

        const { id } = PythonGenerator.getSignature();

        return config.generators[id].paths;
    }

    public async writing(): Promise<void> {
        const paths = this.getFilePaths();

        if (!paths) {
            this.generator.abort = true;
            return Promise.resolve();
        }

        this.generator.env.cwd = this.generator.destinationPath();

        this.generator.log();
        this.generator.log(
            `Bootstrapping ${chalk.cyan(this.generator.options.name)}...`,
        );
        this.generator.log();
        this.generator.log(
            `Creating a new ${chalk.cyan(
                this.name,
            )} project in ${chalk.green(this.generator.env.cwd)}.`,
        );
        this.generator.log();

        this.generator.sourceRoot(this.getSourceRoot());

        for (const path of paths) {
            this.generator.fs.copyTpl(
                this.generator.templatePath(path.from),
                this.generator.destinationPath(path.to),
                this.generator.options,
            );
        }
    }

    public async install(): Promise<void> {
        if (this.generator.abort) {
            this.generator.options.skipInstall = true;
        }

        await this.setupVenv();

        if (this.generator.options.skipInstall) {
            return Promise.resolve();
        }

        await this.runPipInstall();
    }

    private async runPipInstall(): Promise<void> {
        this.generator.log();
        this.generator.log(
            "Running pip to install the project dependencies for you...",
        );

        const pip = path.join(this.generator.env.cwd, ".venv", "bin", "pip");

        const requirements = path.join(
            this.generator.env.cwd,
            "requirements.txt",
        );

        await this.generator.spawn(pip, [
            "install",
            "-r",
            requirements,
            "--quiet",
        ]);
    }

    private async setupVenv(): Promise<void> {
        this.generator.log();
        this.generator.log("Creating a virtual environment...");
        await this.generator.spawn("python3", [
            "-m",
            "venv",
            `${path.join(this.generator.env.cwd, ".venv")}`,
        ]);
    }

    public async end(): Promise<void> {
        const { name } = this.generator.options;

        this.generator.log("We suggest that you begin by typing:");
        this.generator.log();
        this.generator.log(`  ${chalk.cyan("cd")} ${name}`);
        this.generator.log();

        return Promise.resolve();
    }
}
