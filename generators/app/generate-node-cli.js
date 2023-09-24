const chalk = require("chalk");
const prompts = require("./prompts");

module.exports = {
    id: "project-node-cli",
    aliases: ["cli", "node-cli"],
    name: "Node (CLI)",

    prompting: async (generator, projectConfig) => {
        await prompts.askForProjectDisplayName(generator, projectConfig);
        await prompts.askForProjectId(generator, projectConfig);
        await prompts.askForProjectDescription(generator, projectConfig);
        await prompts.askForGit(generator, projectConfig);
        await prompts.askForPackageManager(generator, projectConfig);
    },

    writing: (generator, projectConfig) => {
        generator.fs.copy(
            generator.templatePath("github"),
            generator.destinationPath(".github"),
        );

        generator.fs.copy(
            generator.templatePath("husky"),
            generator.destinationPath(".husky"),
        );

        generator.fs.copy(
            generator.templatePath("vscode"),
            generator.destinationPath(".vscode"),
        );

        generator.fs.copy(
            generator.templatePath("src"),
            generator.destinationPath("src"),
        );

        generator.fs.copy(
            generator.templatePath("commitlintrc.json"),
            generator.destinationPath(".commitlintrc.json"),
        );

        generator.fs.copy(
            generator.templatePath("lintstagedrc.json"),
            generator.destinationPath(".lintstagedrc.json"),
        );

        generator.fs.copy(
            generator.templatePath("prettierrc.json"),
            generator.destinationPath(".prettierrc.json"),
        );

        generator.fs.copy(
            generator.templatePath("prettierignore"),
            generator.destinationPath(".prettierignore"),
        );

        generator.fs.copy(
            generator.templatePath("changelogrc.json"),
            generator.destinationPath(".changelogrc.json"),
        );

        generator.fs.copyTpl(
            generator.templatePath("CHANGELOG.md"),
            generator.destinationPath("CHANGELOG.md"),
            projectConfig,
        );

        generator.fs.copy(
            generator.templatePath("czrc"),
            generator.destinationPath(".czrc"),
        );

        generator.fs.copy(
            generator.templatePath("editorconfig"),
            generator.destinationPath(".editorconfig"),
        );

        generator.fs.copyTpl(
            generator.templatePath("nvmrc"),
            generator.destinationPath(".nvmrc"),
            projectConfig,
        );

        generator.fs.copy(
            generator.templatePath("npmrc"),
            generator.destinationPath(".npmrc"),
        );

        generator.fs.copy(
            generator.templatePath("env"),
            generator.destinationPath(".env"),
        );

        if (projectConfig.git) {
            generator.fs.copy(
                generator.templatePath("gitignore"),
                generator.destinationPath(".gitignore"),
            );

            generator.fs.copy(
                generator.templatePath("gitattributes"),
                generator.destinationPath(".gitattributes"),
            );

            generator.fs.copy(
                generator.templatePath("GitVersion.yml"),
                generator.destinationPath("GitVersion.yml"),
            );
        }

        generator.fs.copy(
            generator.templatePath("LICENSE"),
            generator.destinationPath("LICENSE"),
        );

        generator.fs.copyTpl(
            generator.templatePath("package.json.ejs"),
            generator.destinationPath("package.json"),
            projectConfig,
        );

        generator.fs.copyTpl(
            generator.templatePath("README.md"),
            generator.destinationPath("README.md"),
            projectConfig,
        );

        projectConfig.installDependencies = true;
    },

    endMessage: (generator, projectConfig) => {
        generator.log();
        generator.log(`  ${chalk.cyan(`${projectConfig.pkgRunCommand} dev`)}`);
        generator.log('  Will start "nodemon" on the main entry point');
        generator.log();

        generator.log();
        generator.log(
            `  ${chalk.cyan(`${projectConfig.pkgRunCommand} pretty:fix`)}`,
        );
        generator.log("  Will format your code according to Prettier's rules");
        generator.log();

        generator.log();
        generator.log(
            `  ${chalk.cyan(`${projectConfig.pkgRunCommand} commit`)}`,
        );
        generator.log(
            "  Will invoke the Commitizen CLI to guide you through creating a properly formatted commit message",
        );
        generator.log();

        generator.log("We suggest that you begin by typing:");
        generator.log();
        generator.log(`  ${chalk.cyan("cd")} ${projectConfig.name}`);
        generator.log();
    },
};
