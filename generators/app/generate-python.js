const chalk = require("chalk");
const prompts = require("./prompts");

module.exports = {
    id: "project-python",
    aliases: ["python", "py"],
    name: "Python",

    prompting: async (generator, projectConfig) => {
        await prompts.askForProjectDisplayName(generator, projectConfig);
        await prompts.askForProjectId(generator, projectConfig);
        await prompts.askForProjectDescription(generator, projectConfig);
        await prompts.askForGit(generator, projectConfig);
    },

    writing: (generator, projectConfig) => {
        generator.fs.copy(
            generator.templatePath("github"),
            generator.destinationPath(".github"),
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
            generator.templatePath("changelogrc.json"),
            generator.destinationPath(".changelogrc.json"),
        );

        generator.fs.copyTpl(
            generator.templatePath("CHANGELOG.md"),
            generator.destinationPath("CHANGELOG.md"),
            projectConfig,
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
            generator.templatePath("README.md"),
            generator.destinationPath("README.md"),
            projectConfig,
        );

        projectConfig.installDependencies = false;
    },

    endMessage: (generator, projectConfig) => {
        generator.log("We suggest that you begin by typing:");
        generator.log();
        generator.log(`  ${chalk.cyan("cd")} ${projectConfig.name}`);
        generator.log();
    },
};
