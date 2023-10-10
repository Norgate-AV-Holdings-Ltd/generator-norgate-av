import { GeneratorOptions } from "yeoman-generator";

export type AppOptions = GeneratorOptions & {
    type: string;
    description?: string;
    id?: string;
    pkg: string;
    git: boolean;
    open?: boolean;
    yes?: boolean;
};
