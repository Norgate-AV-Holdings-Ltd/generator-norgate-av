import Generator from "yeoman-generator";
import path from "path";
import * as validator from "./validator";
import Project from "./project.options";

export async function askForProjectDisplayName(generator: any, projectConfig: any): Promise<void> {
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
        .then((answer: any) => {
            projectConfig.displayName = answer.displayName;
        });
}

export async function askForProjectId(generator: any, projectConfig: any): Promise<void> {
    const projectName = generator.options.projectId;

    if (projectName) {
        projectConfig.name = projectName;
        return Promise.resolve();
    }

    let def = projectConfig.name;

    if (!def && projectConfig.displayName) {
        def = projectConfig.displayName.toLowerCase().replace(/[^a-z0-9]/g, "-");
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
        .then((answer: any) => {
            projectConfig.name = answer.name;
        });
}

export class Question implements TemplateQuestion {
    private readonly generator: Generator;
    private readonly project: Project;

    constructor(generator: any, project: any) {
        this.generator = generator;
        this.project = project;
    }

    public async prompt(): Promise<void> {
        const projectName = this.generator.options.projectId;

        if (projectName) {
            this.project.name = projectName;
            return Promise.resolve();
        }

        let def = this.project.name;

        if (!def && this.project.displayName) {
            def = this.project.displayName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        }

        if (def && this.generator.options.skipPrompts) {
            this.project.name = def;
            return Promise.resolve();
        }

        return this.generator
            .prompt({
                type: "input",
                name: "name",
                message: "What's the identifier of your project?",
                default: def || "",
                validate: validator.validateProjectId,
            })
            .then((answer: any) => {
                this.project.name = answer.name;
            });
    }
}

export async function askForProjectDescription(generator: any, projectConfig: any): Promise<void> {
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
        .then((answer: any) => {
            projectConfig.description = answer.description;
        });
}

export async function askForGit(generator: any, projectConfig: any): Promise<void> {
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
        .then((answer: any) => {
            projectConfig.git = answer.git;
        });
}

interface PkgRunCommand {
    [key: string]: string;
}

export async function askForPackageManager(
    generator: any,
    projectConfig: any,
): Promise<void | Error> {
    const defaultPkg = "pnpm";

    const pkgRunCommand: PkgRunCommand = {
        yarn: "yarn",
        npm: "npm",
        pnpm: "pnpm",
    };

    const { pkg } = generator.options;

    if (pkg === "npm" || pkg === "yarn" || pkg === "pnpm") {
        projectConfig.pkg = pkg;
        if (projectConfig.pkg in pkgRunCommand) {
            projectConfig.pkgRunCommand = pkgRunCommand[projectConfig.pkg];
        } else {
            throw new Error(`Invalid package manager: ${projectConfig.pkg}`);
        }
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
        .then((answer: { pkg: string }) => {
            projectConfig.pkg = answer.pkg;
            projectConfig.pkgRunCommand = pkgRunCommand[projectConfig.pkg];
        });
}
