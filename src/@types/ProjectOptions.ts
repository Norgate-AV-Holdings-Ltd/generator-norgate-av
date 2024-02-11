import { NodeEnvironment } from "../environments/index.js";

export type ProjectOptions = {
    name: string;
    skipPrompts: boolean;
    node?: NodeEnvironment;
};
