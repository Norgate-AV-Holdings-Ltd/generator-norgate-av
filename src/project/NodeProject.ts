import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { PackageJson } from "type-fest";
import { findUp } from "find-up";

class NodeProject {
    // private static instance: NodeProject;
    private packageJson: PackageJson | null = null;
    public node: string = "";
    public installDependencies: boolean = false;

    public constructor() {}

    public async initialize() {
        this.packageJson = await this.getPackageJson();
    }

    private async getPackageJson(): Promise<PackageJson> {
        const file = await findUp("dependencies/package.json", {
            cwd: path.dirname(fileURLToPath(import.meta.url)),
        });

        if (!file) {
            throw new Error("Could not find package.json file.");
        }

        return JSON.parse(await fs.readFile(file, "utf-8")) as PackageJson;
    }

    public getDependency(name: string): string {
        const { dependencies } = this.packageJson;
        const version = dependencies[name];

        if (typeof version === "undefined") {
            throw new Error(`Module ${name} is not listed`);
        }

        return `${JSON.stringify(name)}: ${JSON.stringify(version)}`;
    }

    public getDevDependency(name: string): string {
        const { devDependencies } = this.packageJson;
        const version = devDependencies[name];

        if (typeof version === "undefined") {
            throw new Error(`Module ${name} is not listed`);
        }

        return `${JSON.stringify(name)}: ${JSON.stringify(version)}`;
    }

    public getNodeEngine() {
        return this.packageJson.engines.node;
    }
}

export default NodeProject;
