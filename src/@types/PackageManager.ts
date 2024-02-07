import { NodePackageManager } from "./index.js";

export type PackageManager = {
    default: NodePackageManager;
    choices: Array<NodePackageManager>;
};
