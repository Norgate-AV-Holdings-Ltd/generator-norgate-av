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
// import NodeProject from "../project/NodeProject.js";

export class ClangGenerator implements GeneratorInterface {
    private readonly generator: AppGenerator;

    private readonly questions = [
        ProjectName,
        ProjectId,
        ProjectDescription,
        Git,
        PackageManager,
    ];

    public constructor(generator: AppGenerator) {
        this.generator = generator;
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
                ClangGenerator.getSignature().name,
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
        // this.generator.fs.copy(
        //     this.generator.templatePath("github"),
        //     this.generator.destinationPath(".github"),
        // );

        // this.generator.fs.copy(
        //     this.generator.templatePath("husky"),
        //     this.generator.destinationPath(".husky"),
        // );

        // this.generator.fs.copy(
        //     this.generator.templatePath("vscode"),
        //     this.generator.destinationPath(".vscode"),
        // );

        // this.generator.fs.copy(
        //     this.generator.templatePath("src"),
        //     this.generator.destinationPath("src"),
        // );

        // this.generator.fs.copy(
        //     this.generator.templatePath("Makefile"),
        //     this.generator.destinationPath("Makefile"),
        // );

        // this.generator.fs.copy(
        //     this.generator.templatePath("commitlintrc.json"),
        //     this.generator.destinationPath(".commitlintrc.json"),
        // );

        // this.generator.fs.copy(
        //     this.generator.templatePath("lintstagedrc.json"),
        //     this.generator.destinationPath(".lintstagedrc.json"),
        // );

        // this.generator.fs.copy(
        //     this.generator.templatePath("prettierrc.json"),
        //     this.generator.destinationPath(".prettierrc.json"),
        // );

        // this.generator.fs.copy(
        //     this.generator.templatePath("prettierignore"),
        //     this.generator.destinationPath(".prettierignore"),
        // );

        // this.generator.fs.copy(
        //     this.generator.templatePath("changelogrc.json"),
        //     this.generator.destinationPath(".changelogrc.json"),
        // );

        // this.generator.fs.copyTpl(
        //     this.generator.templatePath("CHANGELOG.md"),
        //     this.generator.destinationPath("CHANGELOG.md"),
        //     this.project,
        // );

        // this.generator.fs.copy(
        //     this.generator.templatePath("czrc"),
        //     this.generator.destinationPath(".czrc"),
        // );

        // this.generator.fs.copy(
        //     this.generator.templatePath("editorconfig"),
        //     this.generator.destinationPath(".editorconfig"),
        // );

        // this.generator.fs.copyTpl(
        //     this.generator.templatePath("nvmrc"),
        //     this.generator.destinationPath(".nvmrc"),
        //     this.project,
        // );

        // if (this.project.git) {
        //     this.generator.fs.copy(
        //         this.generator.templatePath("gitignore"),
        //         this.generator.destinationPath(".gitignore"),
        //     );

        //     this.generator.fs.copy(
        //         this.generator.templatePath("gitattributes"),
        //         this.generator.destinationPath(".gitattributes"),
        //     );

        //     this.generator.fs.copy(
        //         this.generator.templatePath("GitVersion.yml"),
        //         this.generator.destinationPath("GitVersion.yml"),
        //     );
        // }

        // this.generator.fs.copy(
        //     this.generator.templatePath("LICENSE"),
        //     this.generator.destinationPath("LICENSE"),
        // );

        // this.generator.fs.copyTpl(
        //     this.generator.templatePath("package.json.ejs"),
        //     this.generator.destinationPath("package.json"),
        //     this.project,
        // );

        // this.generator.fs.copyTpl(
        //     this.generator.templatePath("README.md"),
        //     this.generator.destinationPath("README.md"),
        //     this.project,
        // );

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
    }
}
