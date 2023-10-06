import { CliArgument } from "./cli.interface";

const args: CliArgument[] = [
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

export default args;
