import { Command, Option } from "commander";

export function hello() {
    const command = new Command("hello");

    command
        .description("say hello to the world")
        .addOption(new Option("-n, --name <name>", "your name"))
        .action((options) => {
            if (options.name) {
                console.log(`Hello, ${options.name}!`);
                process.exit();
            }

            console.log("Hello, World!");
        });

    return command;
}
