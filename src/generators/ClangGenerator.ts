import chalk from "chalk";
import config from "config";
import path from "path";
import { resolveRefs } from "json-refs";
import { GeneratorInterface, GeneratorSignature } from "../@types";
import AppGenerator from "..";
import {
    ProjectName,
    ProjectId,
    ProjectDescription,
    Git,
    PackageManager,
} from "../questions";

export class ClangGenerator implements GeneratorInterface {
    public static readonly signature = config.get<GeneratorSignature>(
        "generators.c.signature",
    );

    private readonly generator: AppGenerator;

    private readonly questions = [
        ProjectName,
        ProjectId,
        ProjectDescription,
        Git,
        PackageManager,
    ];

    constructor(generator: AppGenerator) {
        this.generator = generator;
    }

    // private async getPackageManager() {
    //     const { resolved }: any = await resolveRefs(config.util.toObject());
    //     this.generator.log(resolved.templates.c.pkgmanager);
    // }

    public getSignature(): GeneratorSignature {
        return ClangGenerator.signature;
    }

    public getSourceRoot(): string {
        return path.join(
            __dirname,
            config.get<string>("files.directory"),
            this.getSignature().id,
        );
    }

    public async prompting(): Promise<void> {
        // await this.getPackageManager();
        const questions = this.questions.map((question) =>
            new question(this.generator).getQuestion(),
        );

        const answers = await this.generator.prompt(questions);

        for (const [key, value] of Object.entries(answers)) {
            this.generator.options[key] = this.generator.options[key] || value;
        }
    }

    public async writing(): Promise<void> {
        // Resolve json references in config
        const { resolved }: any = await resolveRefs(config.util.toObject());
        // Get the resolved values
        const paths = resolved.generators.c.paths;
        this.generator.log(paths);

        this.generator.env.cwd = this.generator.destinationPath();

        this.generator.log();
        this.generator.log(
            `Bootstrapping ${chalk.cyan(this.generator.options.name)}...`,
        );
        this.generator.log();
        this.generator.log(
            `Creating a new ${chalk.cyan(
                this.getSignature().name,
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

export default ClangGenerator;
