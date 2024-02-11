import { NodePackageManager } from "./index.js";

export type Answers = {
    // The project type
    type: string;

    // The name of the project
    // This will be used as the directory name
    // Will be taken from the 'destination' argument
    // Defaults to the name of the CWD
    name: string;

    // The id of the project
    // This will be used as the package name
    // Defaults to the name in kebab-case
    id: string;

    // The description of the project
    description: string;

    // The author of the project
    author: string;

    // Whether to initialize a git repository
    git: boolean;

    // The package manager to use
    pkg: NodePackageManager;

    // Whether to open the project with VS Code
    openWith: "code" | "skip";
};
