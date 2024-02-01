import path from "path";
import fs from "fs/promises";
import { PackageJson } from "type-fest";

class NodeProject {
    private static instance: NodeProject;
    private packageJson!: PackageJson;
    public node: string = "";
    public installDependencies: boolean = false;

    constructor(packageJson: PackageJson) {
        this.packageJson = packageJson;
    }

    public static async getInstance() {
        if (!this.instance) {
            this.instance = new NodeProject(await this.getPackageJson());
        }

        return this.instance;
    }

    private static async getPackageJson(): Promise<PackageJson> {
        const file = await fs.readFile(
            path.join(__dirname, "dependencies/package.json"),
            "utf-8",
        );

        return JSON.parse(file);
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
