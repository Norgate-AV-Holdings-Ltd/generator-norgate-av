import { BaseOptions } from "yeoman-generator";

export type AppOptions = BaseOptions & {
    type: string;
    description?: string;
    id?: string;
    pkg: string;
    git: boolean;
    open?: boolean;
    yes?: boolean;
    skipPrompts: boolean;
    destination: string;
    name: string;
};
