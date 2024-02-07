import chalk from "chalk";
import which from "which";
import type Generator from "yeoman-generator";

export class CodeHelper {
    public static async getPath(): Promise<string | Error> {
        const code = await which("code").catch(() => undefined);

        if (!code) {
            throw new Error(`${chalk.cyan("`code`")} command not found.`);
        }

        return code;
    }

    public static async open(
        generator: Generator,
        path: string,
    ): Promise<void> {
        const code = await which("code").catch(() => undefined);

        if (!code) {
            generator.log(`${chalk.cyan("`code`")} command not found.`);
            return;
        }

        generator.log(`Opening ${chalk.green(path)} in Visual Studio Code...`);
        await generator.spawn(code, [path]);
    }
}
