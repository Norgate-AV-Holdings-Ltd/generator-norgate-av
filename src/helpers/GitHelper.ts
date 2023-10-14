import Generator from "yeoman-generator";
import which from "which";

class GitHelper {
    private static async isGitInstalled(): Promise<string | undefined> {
        return await which("git").catch(() => undefined);
    }

    private static getGitUserName(generator: Generator): string {
        return generator.user.git.name();
    }

    private static getGitUserEmail(generator: Generator): string {
        return generator.user.git.email();
    }

    public static async init(generator: Generator): Promise<void | Error> {
        if (!(await GitHelper.isGitInstalled())) {
            throw new Error("Git executable not found on PATH");
        }

        if (!GitHelper.getGitUserName(generator)) {
            throw new Error("Git username has not been setup");
        }

        if (!GitHelper.getGitUserEmail(generator)) {
            throw new Error("Git user email has not been setup");
        }

        await generator.spawnCommand("git", ["init", "--quiet"]);
    }

    public static async add(generator: Generator): Promise<void | Error> {
        if (!(await GitHelper.isGitInstalled())) {
            throw new Error("Git executable not found on PATH");
        }

        if (!GitHelper.getGitUserName(generator)) {
            throw new Error("Git username has not been setup");
        }

        if (!GitHelper.getGitUserEmail(generator)) {
            throw new Error("Git user email has not been setup");
        }

        await generator.spawnCommand("git", ["add", "-A"]);
    }

    public static async commit(generator: Generator): Promise<void | Error> {
        if (!(await GitHelper.isGitInstalled())) {
            throw new Error("Git executable not found on PATH");
        }

        if (!GitHelper.getGitUserName(generator)) {
            throw new Error("Git username has not been setup");
        }

        if (!GitHelper.getGitUserEmail(generator)) {
            throw new Error("Git user email has not been setup");
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

export default GitHelper;
