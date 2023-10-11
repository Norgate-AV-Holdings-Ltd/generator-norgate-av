import { ArgumentConfig, OptionConfig } from "yeoman-generator";

export interface CliArgument {
    name: string;
    config: ArgumentConfig;
}

export interface CliOption {
    name: string;
    config: OptionConfig;
}
