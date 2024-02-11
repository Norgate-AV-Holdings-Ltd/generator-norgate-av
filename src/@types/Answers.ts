import { NodePackageManager } from "./index.js";

export type Answers = {
    type: string;
    name: string;
    id: string;
    description: string;
    author: string;
    git: boolean;
    pkg: NodePackageManager;
    openWith: "code" | "skip";
};

export type Answers2 = {
    // The project type
    type: string;

    // The display name of the project
    // Defaults to the folder name
    name: string;

    // The name of the project
    // Defaults to lowercased name
    // with spaces replaced by dashes
    id: string;
    description: string;

    // The author of the project
    // Defaults to the git user name
    author: string;
    git: boolean;
    pkg: NodePackageManager;
    openWith: "code" | "skip";
};
