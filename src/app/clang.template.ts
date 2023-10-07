import Generator, { GeneratorOptions } from "yeoman-generator";
import chalk from "chalk";
import Template from "./template.interface";
import Project from "./project.options";
import config from "config";

interface Prompt {}

interface PathMap {
    from: string;
    to: string;
}

class ClangTemplate implements Template {
    public static readonly id: string = "template-c";
    public static readonly aliases: string[] = ["c", "clang"];
    public static readonly name: string = "C";

    private readonly generator: Generator;
    private readonly project: Project;
    private readonly paths: PathMap[] = config.get<PathMap[]>("templates.clang.paths");

    private readonly questions: any[] = [];

    constructor(generator: Generator, project: Project) {
        this.generator = generator;
        this.project = project;
    }

    public getName(): string {
        return ClangTemplate.name;
    }

    public async prompting(): Promise<void> {
        // await prompts.askForProjectDisplayName(generator, projectConfig);
        // await prompts.askForProjectId(generator, projectConfig);
        // await prompts.askForProjectDescription(generator, projectConfig);
        // await prompts.askForGit(generator, projectConfig);
        // await prompts.askForPackageManager(generator, projectConfig);
        // for (const question of this.questions) {
        //     await question.prompt(this.generator, this.project);
        // }
        // await this.askForProjectDisplayName();
        await this.promptForProjectId();
    }

    private async promptForProjectId(): Promise<void> {
        if (this.project.id) {
            return;
        }

        const { id } = await this.generator.prompt({
            type: "input",
            name: "id",
            message: "Project ID",
            default: this.project.id,
        });

        this.project.id = id;
    }

    // private async askForProjectDisplayName(): Promise<void> {
    //     const { displayName } = await this.generator.prompt({
    //         type: "input",
    //         name: "displayName",
    //         message: "Project display name",
    //         default: this.project.displayName,
    //     });

    //     this.project.displayName = displayName;
    // }

    public async writing(): Promise<void> {
        for (const path of this.paths) {
            this.generator.fs.copyTpl(
                this.generator.templatePath(path.from),
                this.generator.destinationPath(path.to),
                this.project,
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

    public async install(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async end(): Promise<void> {
        this.generator.log();
        this.generator.log(`  ${chalk.cyan(`${this.project.pkg} commit`)}`);
        this.generator.log(
            "  Will invoke the Commitizen CLI to guide you through creating a properly formatted commit message",
        );
        this.generator.log();

        this.generator.log("We suggest that you begin by typing:");
        this.generator.log();
        this.generator.log(`  ${chalk.cyan("cd")} ${this.project.name}`);
        this.generator.log();
    }
}

export default ClangTemplate;
