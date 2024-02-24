import { ArgumentSpec, CliOptionSpec } from "yeoman-generator";
import { GeneratorFactory } from "../generators/index.js";
import { ResolvedConfig } from "../@types/index.js";

export class CliHelper {
    private static config: ResolvedConfig;

    public static initialize(config: ResolvedConfig): void {
        this.config = config;
    }

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
                name: "id",
                type: String,
                alias: "i",
                description: "Id of the project",
            },
            {
                name: "description",
                type: String,
                alias: "d",
                description: "Description of the project",
            },
            {
                name: "author",
                type: String,
                alias: "a",
                description: "Author of the project",
            },
            {
                name: "git",
                type: Boolean,
                alias: "g",
                description: "Initialize a git repo",
            },
            {
                name: "pkg",
                type: String,
                alias: "p",
                description: `Package manager to use. Possible values: ${this.config.pkgmanager.node!.choices.join(", ")}`,
            },
            {
                name: "open",
                type: Boolean,
                alias: "o",
                description: "Open the generated project in Visual Studio Code",
            },
            {
                name: "yes",
                type: Boolean,
                alias: "y",
                description:
                    "Quick mode, skip all optional prompts and use defaults",
            },
        ];
    }
}
