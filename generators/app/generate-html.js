const chalk = require("chalk");
const prompts = require("./prompts");

module.exports = {
    id: "project-html",
    aliases: ["html", "web", "vanilla"],
    name: "HTML, CSS & JS",

    /**
     * @param {import('yeoman-generator')} generator
     * @param {Object} projectConfig
     */
    prompting: async (generator, projectConfig) => {
        await prompts.askForProjectDisplayName(generator, projectConfig);
        await prompts.askForProjectId(generator, projectConfig);
        await prompts.askForProjectDescription(generator, projectConfig);
        await prompts.askForCheckJavaScript(generator, projectConfig);
        await prompts.askForGit(generator, projectConfig);
        await prompts.askForPackageManager(generator, projectConfig);
    },

    /**
     * @param {import('yeoman-generator')} generator
     * @param {Object} projectConfig
     */
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
            generator.templatePath("assets"),
            generator.destinationPath("assets"),
        );

        generator.fs.copy(
            generator.templatePath("commitlintrc.json"),
            generator.destinationPath(".commitlintrc.json"),
        );

        generator.fs.copy(
            generator.templatePath("eslintrc.json"),
            generator.destinationPath(".eslintrc.json"),
        );

        generator.fs.copy(
            generator.templatePath("eslintignore"),
            generator.destinationPath(".eslintignore"),
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

        if (projectConfig.git) {
            generator.fs.copy(
                generator.templatePath("gitignore"),
                generator.destinationPath(".gitignore"),
            );

            generator.fs.copy(
                generator.templatePath("gitattributes"),
                generator.destinationPath(".gitattributes"),
            );
        }

        generator.fs.copy(
            generator.templatePath("LICENSE"),
            generator.destinationPath("LICENSE"),
        );

        generator.fs.copyTpl(
            generator.templatePath("jsconfig.json.ejs"),
            generator.destinationPath("jsconfig.json"),
            projectConfig,
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

        generator.fs.copyTpl(
            generator.templatePath("public/index.html.ejs"),
            generator.destinationPath("public/index.html"),
            projectConfig,
        );

        projectConfig.installDependencies = true;
    },

    /**
     * @param {import('yeoman-generator')} generator
     * @param {Object} projectConfig
     */
    endMessage: (generator, projectConfig) => {
        // generator.log();
        // generator.log(
        //     `  ${chalk.cyan(`${projectConfig.pkgRunCommand} start`)}`,
        // );
        // generator.log('  Will start "nodemon" on the main entry point');
        // generator.log();

        generator.log();
        generator.log(`  ${chalk.cyan(`${projectConfig.pkgRunCommand} lint`)}`);
        generator.log("  Will lint your code and report any violations");
        generator.log();

        generator.log();
        generator.log(
            `  ${chalk.cyan(`${projectConfig.pkgRunCommand} lint:fix`)}`,
        );
        generator.log(
            "  Will lint your code and automatically fix any violations it can",
        );
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
