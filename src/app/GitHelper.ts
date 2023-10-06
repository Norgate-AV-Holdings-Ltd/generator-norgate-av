import Generator from "yeoman-generator";
import which from "which";

export class GitHelper {
    private static async isGitInstalled(): Promise<string | undefined> {
        return await which("git").catch(() => undefined);
    }

    public static async init(generator: Generator): Promise<void | Error> {
        if (!(await GitHelper.isGitInstalled())) {
            throw new Error("Git executable not found on PATH");
        }

        await generator.spawnCommand("git", ["init", "--quiet"]);
    }

    public static async add(generator: Generator): Promise<void | Error> {
        if (!(await GitHelper.isGitInstalled())) {
            throw new Error("Git executable not found on PATH");
        }

        await generator.spawnCommand("git", ["add", "-A"]);
    }

    public static async commit(generator: Generator): Promise<void | Error> {
        if (!(await GitHelper.isGitInstalled())) {
            throw new Error("Git executable not found on PATH");
        }

        await generator.spawnCommand("git", [
            "commit",
            "-m",
            "chore: initial commit",
            "--no-verify",
            "--quiet",
        ]);
    }
}
