import { CliOption } from "./cli.interface";
import TemplateFactory from "../template.factory";

const options: CliOption[] = [
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
            description: "Quick mode, skip all optional prompts and use defaults",
        },
    },
    {
        name: "open",
        config: {
            type: Boolean,
            alias: "o",
            description: "Open the generated project in Visual Studio Code",
        },
    },
    {
        name: "type",
        config: {
            type: String,
            alias: "t",
            description: `${TemplateFactory.getAvailableTemplates()
                .slice(0, 6)
                .map((template) => template.aliases[0])
                .join(", ")}...`,
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
            description: 'Package manager to use. Possible values: ["pnpm", "yarn", "npm"]',
            default: "pnpm",
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

export default options;
