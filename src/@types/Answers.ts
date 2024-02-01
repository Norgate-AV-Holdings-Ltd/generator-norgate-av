import { NodePackageManager } from "./index.js";

export type Answers = {
    type: string;
    displayName: string;
    name: string;
    description: string;
    git: boolean;
    pkg: NodePackageManager;
};
