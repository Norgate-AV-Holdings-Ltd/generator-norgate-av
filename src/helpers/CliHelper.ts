import { ArgumentSpec, CliOptionSpec } from "yeoman-generator";
import { GeneratorFactory } from "../generators/index.js";

export class CliHelper {
    public static getArguments(): Array<{
        name: string;
        config: Partial<ArgumentSpec>;
    }> {
        return [
            {
                name: "destination",
                config: {
                    type: String,
                    required: false,
                    description:
                        "\n    The folder to create the project in, absolute or relative to the current working directory.\n    Use '.' for the current folder. If not provided, defaults to a folder with the project display name.\n  ",
                },
            },
        ];
    }

    public static getOptions(): Array<CliOptionSpec> {
        return [
            {
                name: "type",
                type: String,
                alias: "t",
                description: `${GeneratorFactory.getAvailable()
                    .slice(0, 6)
                    .map((signature) => signature.aliases[0])
                    .join(", ")}...`,
            },
            {
                name: "description",
                type: String,
                alias: "d",
                description: "Description of the project",
                default: "",
            },
            {
                name: "yes",
                type: Boolean,
                alias: "y",
                description:
                    "Quick mode, skip all optional prompts and use defaults",
            },
            {
                name: "open",
                type: Boolean,
                alias: "o",
                description: "Open the generated project in Visual Studio Code",
            },
            {
                name: "id",
                type: String,
                description: "Id of the project",
            },
            {
                name: "pkg",
                type: String,
                alias: "p",
                description:
                    'Package manager to use. Possible values: ["pnpm", "yarn", "npm"]',
            },
            {
                name: "git",
                type: Boolean,
                alias: "g",
                description: "Initialize a git repo",
            },
        ];
    }
}
