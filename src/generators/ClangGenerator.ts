import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import config from "config";
import { ResolvedRefsResults, resolveRefs } from "json-refs";
import {
    Answers,
    Config,
    GeneratorInterface,
    GeneratorSignature,
} from "../@types/index.js";
import AppGenerator from "../app.js";
import {
    ProjectName,
    ProjectId,
    ProjectDescription,
    Git,
    PackageManager,
} from "../questions/index.js";
import { NodeHelper } from "../helpers/index.js";

export class ClangGenerator implements GeneratorInterface {
    private readonly generator: AppGenerator;
    private readonly name = ClangGenerator.getSignature().name;

    private readonly questions = [
        ProjectName,
        ProjectId,
        ProjectDescription,
        Git,
        PackageManager,
    ];

    public constructor(generator: AppGenerator) {
        this.generator = generator;
        this.generator.options.node = {
            engine: NodeHelper.getNodeEngine(),
            getDependency: (name: string) => NodeHelper.getDependency(name),
            getDevDependency: (name: string) =>
                NodeHelper.getDevDependency(name),
            installDependencies: true,
            getNodeEngine: () => NodeHelper.getNodeEngine(),
        };
    }

    public static getSignature(): GeneratorSignature {
        return config.get<GeneratorSignature>(
            "generators.template-c.signature",
        );
    }

    public getSourceRoot(): string {
        return path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            config.get<string>("files.directory"),
            ClangGenerator.getSignature().id,
        );
    }

    public async prompting(): Promise<void> {
        // const { options } = this.generator;

        const questions = this.questions.map((question) =>
            new question(this.generator).getQuestion(),
        );

        const answers = await this.generator.prompt(
            questions.map((q) => {
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
        this.generator.options.description =
            this.generator.options.description || answers.description;
        this.generator.options.git = this.generator.options.git || answers.git;
        this.generator.options.pkg = this.generator.options.pkg || answers.pkg;
        this.generator.options.displayName =
            this.generator.options.displayName || answers.displayName;
    }

    private async getFilePaths() {
        try {
            const result: ResolvedRefsResults = await resolveRefs(
                config.util.toObject() as Config,
            );

            const resolved = result.resolved as Config;

            const id = ClangGenerator.getSignature().id;

            return resolved.generators[id]?.paths;
        } catch (error) {
            this.generator.log(error);
        }
    }

    public async writing(): Promise<void> {
        const paths = await this.getFilePaths();

        if (!paths) {
            this.generator.abort = true;
            return;
        }

        this.generator.log(paths);

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
        // this.project.installDependencies = true;
    }

    public async install(): Promise<void> {}

    public async end(): Promise<void> {
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
