import fs from "fs";
import path from "path";
import which from "which";

interface CommonPackageJson {
    engines: {
        node: string;
    };
    devDependencies: Record<string, string>;
    dependencies: Record<string, string>;
}

async function getCommonPackageJson(): Promise<CommonPackageJson> {
    const file = await fs.promises.readFile(path.join(__dirname, "dependencies/package.json"));

    return JSON.parse(file.toString());
}

export async function getDependencies(): Promise<Record<string, string>> {
    return (await getCommonPackageJson()).dependencies;
}

export async function getDevDependencies(): Promise<Record<string, string>> {
    return (await getCommonPackageJson()).devDependencies;
}

export async function getNodeEngine(): Promise<string> {
    return (await getCommonPackageJson()).engines.node;
}

export async function getGitPath(): Promise<string | undefined> {
    return await which("git").catch(() => undefined);
}

export async function getCodePath(): Promise<string | undefined> {
    return await which("code").catch(() => undefined);
}
