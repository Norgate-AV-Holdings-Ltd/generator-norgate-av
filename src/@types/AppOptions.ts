import { BaseOptions } from "yeoman-generator";
import { NodeEnvironment } from "../environments/index.js";
import { NodePackageManager } from "./index.js";

export type AppOptions = BaseOptions & {
    type: string;
    destination: string;
    name: string;
    id?: string;
    description?: string;
    author: string;
    git: boolean;
    pkg: NodePackageManager;
    open?: boolean;
    yes?: boolean;
    skipPrompts: boolean;
    node?: NodeEnvironment;
};
