import { CliArgument, CliOption } from "../@types/index.js";
import { GeneratorFactory } from "../generators/index.js";

export class CliHelper {
    public static getArguments(): CliArgument[] {
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

    public static getOptions(): CliOption[] {
        return [
            {
                name: "type",
                config: {
                    type: String,
                    alias: "t",
                    description: `${GeneratorFactory.getAvailable()
                        .slice(0, 6)
                        .map((generator) => generator.aliases[0])
                        .join(", ")}...`,
                },
            },
            {
                name: "description",
                config: {
                    type: String,
                    alias: "d",
                    description: "Description of the project",
                    default: "",
                },
            },
            {
                name: "yes",
                config: {
                    type: Boolean,
                    alias: "y",
                    description:
                        "Quick mode, skip all optional prompts and use defaults",
                },
            },
            {
                name: "open",
                config: {
                    type: Boolean,
                    alias: "o",
                    description:
                        "Open the generated project in Visual Studio Code",
                },
            },
            {
                name: "id",
                config: {
                    type: String,
                    description: "Id of the project",
                },
            },
            {
                name: "pkg",
                config: {
                    type: String,
                    alias: "p",
                    description:
                        'Package manager to use. Possible values: ["pnpm", "yarn", "npm"]',
                },
            },
            {
                name: "git",
                config: {
                    type: Boolean,
                    alias: "g",
                    description: "Initialize a git repo",
                },
            },
        ];
    }
}
