import path from "node:path";
import fs from "node:fs/promises";
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
    ProjectName,
    ProjectId,
    ProjectDescription,
    Git,
    PackageManager,
} from "../questions/index.js";
import { ConfigHelper } from "../helpers/index.js";
import { NodeEnvironment } from "../environments/index.js";

export class CrestronSimplGenerator implements GeneratorInterface {
    private readonly generator: AppGenerator;
    private readonly name = CrestronSimplGenerator.getSignature().name;
    private readonly questions: Array<PromptQuestion<Answers>> = [];

    public constructor(generator: AppGenerator) {
        this.generator = generator;
        this.generator.options.node = new NodeEnvironment();
    }

    public async initialize(): Promise<void> {
        this.setupPrompts();
        await this.generator.options.node?.initialize();
    }

    private setupPrompts(): void {
        this.questions.push(
            new ProjectName(this.generator).getQuestion(),
            new ProjectId(this.generator).getQuestion(),
            new ProjectDescription(this.generator).getQuestion(),
            new Git(this.generator).getQuestion(),
            new PackageManager(this.generator).getQuestion(),
        );
    }

    public static getSignature(): GeneratorSignature {
        const config = ConfigHelper.getInstance().getConfig();
        return config.generators.simpl.signature;
    }

    public getSourceRoot(): string {
        const config = ConfigHelper.getInstance().getConfig();
        return path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            config.files.directory,
            CrestronSimplGenerator.getSignature().id,
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
        this.generator.options.pkg = this.generator.options.pkg || answers.pkg;

        // @ts-expect-error This is necessary as the env 'options' property doesn't seem to be correctly typed on the Environment.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.generator.env.options.nodePackageManager =
            this.generator.options.pkg || answers.pkg;

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

        const { id } = CrestronSimplGenerator.getSignature();

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

    private async findAndRename(
        search: string,
        replace: string,
    ): Promise<void> {
        const entities = await fs.readdir(this.generator.destinationPath(), {
            recursive: true,
        });

        if (!entities) {
            return;
        }

        await Promise.all(
            entities.map(async (entity) => {
                if (!entity.endsWith(search)) {
                    return;
                }

                await fs.rename(
                    path.join(this.generator.destinationPath(), entity),
                    path.join(
                        this.generator.destinationPath(),
                        entity.replace(search, replace),
                    ),
                );
            }),
        );
    }

    public async install(): Promise<void> {
        if (this.generator.abort) {
            this.generator.options.skipInstall = true;
            return Promise.resolve();
        }

        if (this.generator.options.skipInstall) {
            return Promise.resolve();
        }
    }

    public async end(): Promise<void> {
        // Search for any gitkeep files copied to the destination
        // and rename them to .gitkeep
        await this.findAndRename("gitkeep", ".gitkeep");

        const { name, pkg } = this.generator.options;

        this.generator.log();
        this.generator.log(`  ${chalk.cyan(`${pkg} commit`)}`);
        this.generator.log(
            "  Will invoke the Commitizen CLI to guide you through creating a properly formatted commit message",
        );
        this.generator.log();

        this.generator.log("We suggest that you begin by typing:");
        this.generator.log();
        this.generator.log(`  ${chalk.cyan("cd")} ${name}`);
        this.generator.log();

        return Promise.resolve();
    }
}
