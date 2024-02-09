import { BaseOptions } from "yeoman-generator";
import { NodeEnvironment } from "../environments/NodeEnvironment.js";
import { NodePackageManager } from "./index.js";

export type AppOptions = BaseOptions & {
    type: string;
    description?: string;
    id?: string;
    pkg: NodePackageManager;
    git: boolean;
    open?: boolean;
    yes?: boolean;
    skipPrompts: boolean;
    destination: string;
    name: string;
    displayName: string;
    node?: NodeEnvironment;
    nodePackageManager?: NodePackageManager;
};
