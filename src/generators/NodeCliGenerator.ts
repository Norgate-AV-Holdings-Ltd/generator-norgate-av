import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
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

export class NodeCliGenerator implements GeneratorInterface {
    private readonly generator: AppGenerator;
    private readonly name = NodeCliGenerator.getSignature().name;

    private readonly questions = [
        ProjectName,
        ProjectId,
        ProjectDescription,
        Git,
        PackageManager,
    ];

    public constructor(generator: AppGenerator) {
        this.generator = generator;
        this.generator.options.node = new NodeEnvironment();

        if (this.generator.options.skipPrompts) {
            const config = ConfigHelper.getInstance().getConfig();
            const { pkgmanager } = config.environments.node;

            this.generator.options.pkg = pkgmanager.default;

            // @ts-expect-error This is necessary as the env 'options' property doesn't seem to be correctly typed on the Environment.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            this.generator.env.options.nodePackageManager = pkgmanager.default;
        }
    }

    public async initialize(): Promise<void> {
        await this.generator.options.node?.initialize();
    }

    public static getSignature(): GeneratorSignature {
        const config = ConfigHelper.getInstance().getConfig();
        return config.generators.nodecli!.signature;
    }

    public getSourceRoot(): string {
        const config = ConfigHelper.getInstance().getConfig();
        return path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            config.files.directory,
            NodeCliGenerator.getSignature().id,
        );
    }

    public async prompting(): Promise<void> {
        const questions = this.questions.map((Question) =>
            new Question(this.generator).getQuestion(),
        );

        const answers = await this.generator.prompt<Answers>(
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
        this.generator.options.id = this.generator.options.id || answers.id;
        this.generator.options.description =
            this.generator.options.description || answers.description;
        this.generator.options.git = this.generator.options.git || answers.git;
        this.generator.options.pkg = this.generator.options.pkg || answers.pkg;

        // @ts-expect-error This is necessary as the env 'options' property doesn't seem to be correctly typed on the Environment.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.generator.env.options.nodePackageManager =
            this.generator.options.pkg || answers.pkg;

        // this.generator.options.displayName =
        //     this.generator.options.displayName || answers.displayName;
    }

    private getFilePaths(): Array<PathMap> {
        const config = ConfigHelper.getInstance().getConfig();

        const { id } = NodeCliGenerator.getSignature();

        return config.generators[id]!.paths;
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

        if (this.generator.options.skipInstall) {
            return Promise.resolve();
        }
    }

    public async end(): Promise<void> {
        const { name, pkg } = this.generator.options;

        this.generator.log();
        this.generator.log(`  ${chalk.cyan(`${pkg} dev`)}`);
        this.generator.log('  Will start "nodemon" on the main entry point');
        this.generator.log();

        this.generator.log();
        this.generator.log(`  ${chalk.cyan(`${pkg} pretty:fix`)}`);
        this.generator.log(
            "  Will format your code according to Prettier's rules",
        );
        this.generator.log();

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
