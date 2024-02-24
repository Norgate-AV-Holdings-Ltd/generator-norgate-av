import Generator from "yeoman-generator";
import which from "which";

export class GitHelper {
    public static async isGitInstalled(): Promise<string | undefined> {
        return await which("git").catch(() => undefined);
    }

    public static async getGitUserName(generator: Generator): Promise<string> {
        return (await generator.git.name()) || "";
    }

    public static async getGitUserEmail(generator: Generator): Promise<string> {
        return (await generator.git.email()) || "";
    }

    public static async init(generator: Generator): Promise<void | Error> {
        if (!(await GitHelper.isGitInstalled())) {
            throw new Error("Git executable not found on PATH");
        }

        if (!(await GitHelper.getGitUserName(generator))) {
            throw new Error("Git username has not been setup");
        }

        if (!(await GitHelper.getGitUserEmail(generator))) {
            throw new Error("Git user email has not been setup");
        }

        await generator.spawn("git", ["init", "--quiet"]);
    }

    public static async add(generator: Generator): Promise<void | Error> {
        if (!(await GitHelper.isGitInstalled())) {
            throw new Error("Git executable not found on PATH");
        }

        if (!(await GitHelper.getGitUserName(generator))) {
            throw new Error("Git username has not been setup");
        }

        if (!(await GitHelper.getGitUserEmail(generator))) {
            throw new Error("Git user email has not been setup");
        }

        await generator.spawn("git", ["add", "-A"]);
    }

    public static async commit(generator: Generator): Promise<void | Error> {
        if (!(await GitHelper.isGitInstalled())) {
            throw new Error("Git executable not found on PATH");
        }

        if (!(await GitHelper.getGitUserName(generator))) {
            throw new Error("Git username has not been setup");
        }

        if (!(await GitHelper.getGitUserEmail(generator))) {
            throw new Error("Git user email has not been setup");
        }

        await generator.spawn("git", [
            "commit",
            "-m",
            "chore: initial commit",
            "--no-verify",
            "--quiet",
        ]);
    }
}
