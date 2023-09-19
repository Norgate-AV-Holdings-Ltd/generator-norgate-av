const path = require("path");
const validator = require("./validator");

/**
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */
exports.askForProjectDisplayName = (generator, projectConfig) => {
    const { projectDisplayName } = generator.options;

    if (projectDisplayName) {
        projectConfig.displayName = projectDisplayName;
        return Promise.resolve();
    }

    const nameFromFolder = generator.options.destination
        ? path.basename(generator.destinationPath())
        : "";

    if (generator.options.skipPrompts && nameFromFolder) {
        projectConfig.displayName = nameFromFolder;
        return Promise.resolve();
    }

    return generator
        .prompt({
            type: "input",
            name: "displayName",
            message: "What's the name of your project?",
            default: nameFromFolder,
        })
        .then((displayNameAnswer) => {
            projectConfig.displayName = displayNameAnswer.displayName;
        });
};

/**
 * Ask for project id ("name" in package.json)
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */
exports.askForProjectId = (generator, projectConfig) => {
    const projectName = generator.options.projectId;

    if (projectName) {
        projectConfig.name = projectName;
        return Promise.resolve();
    }

    let def = projectConfig.name;

    if (!def && projectConfig.displayName) {
        def = projectConfig.displayName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-");
    }

    if (def && generator.options.skipPrompts) {
        projectConfig.name = def;
        return Promise.resolve();
    }

    return generator
        .prompt({
            type: "input",
            name: "name",
            message: "What's the identifier of your project?",
            default: def || "",
            validate: validator.validateProjectId,
        })
        .then((nameAnswer) => {
            projectConfig.name = nameAnswer.name;
        });
};

/**
 * Ask for project description
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */
exports.askForProjectDescription = (generator, projectConfig) => {
    const { projectDescription } = generator.options;

    if (projectDescription) {
        projectConfig.description = projectDescription;
        return Promise.resolve();
    }

    if (generator.options.skipPrompts) {
        projectConfig.description = "";
        return Promise.resolve();
    }

    return generator
        .prompt({
            type: "input",
            name: "description",
            message: "What's the description of your project?",
            default: "",
        })
        .then((descriptionAnswer) => {
            projectConfig.description = descriptionAnswer.description;
        });
};

/**
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */
exports.askForGit = (generator, projectConfig) => {
    const { git } = generator.options;

    if (typeof git === "boolean") {
        projectConfig.git = Boolean(git);
        return Promise.resolve();
    }

    if (generator.options.skipPrompts) {
        projectConfig.git = true;
        return Promise.resolve();
    }

    return generator
        .prompt({
            type: "confirm",
            name: "git",
            message: "Initialize a git repository?",
            default: true,
        })
        .then((gitAnswer) => {
            projectConfig.git = gitAnswer.git;
        });
};

/**
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */
exports.askForPackageManager = (generator, projectConfig) => {
    const defaultPkg = "pnpm";

    const pkgRunCommand = {
        yarn: "yarn",
        npm: "npm",
        pnpm: "pnpm",
    };

    const { pkg } = generator.options;

    if (pkg === "npm" || pkg === "yarn" || pkg === "pnpm") {
        projectConfig.pkg = pkg;
        projectConfig.pkgRunCommand = pkgRunCommand[projectConfig.pkg];
        return Promise.resolve();
    }

    projectConfig.pkg = defaultPkg;
    projectConfig.pkgRunCommand = pkgRunCommand[projectConfig.pkg];

    if (generator.options.skipPrompts) {
        return Promise.resolve();
    }

    return generator
        .prompt({
            type: "list",
            name: "pkg",
            message: "Which package manager to use?",
            choices: [
                {
                    name: "pnpm",
                    value: "pnpm",
                },
                {
                    name: "yarn",
                    value: "yarn",
                },
                {
                    name: "npm",
                    value: "npm",
                },
            ],
            default: defaultPkg,
        })
        .then((pkgManagerAnswer) => {
            projectConfig.pkg = pkgManagerAnswer.pkg;
            projectConfig.pkgRunCommand = pkgRunCommand[projectConfig.pkg];
        });
};

/**
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */
exports.askForCheckJavaScript = (generator, projectConfig) => {
    projectConfig.checkJavaScript = false;

    if (generator.options.skipPrompts) {
        return Promise.resolve();
    }

    return generator
        .prompt({
            type: "confirm",
            name: "checkJavaScript",
            message: "Enable JavaScript type checking in 'jsconfig.json'?",
            default: false,
        })
        .then((strictJavaScriptAnswer) => {
            projectConfig.checkJavaScript =
                strictJavaScriptAnswer.checkJavaScript;
        });
};
