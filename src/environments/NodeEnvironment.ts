import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { PackageJson } from "type-fest";
import { findUp } from "find-up";
import axios from "axios";
import { NodeVersion } from "../@types/index.js";
import { ConfigHelper } from "../helpers/index.js";

export class NodeEnvironment {
    private _packageJson: PackageJson = {} as PackageJson;

    private engine: string;

    constructor() {
        const config = ConfigHelper.getInstance().getConfig();
        this.engine = config.environments.node.engine.fallback;
    }

    public async initialize(): Promise<void> {
        this.packageJson = await this.getPackageJson();
        this.engine = await this.getLatestLtsNodeVersion();
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

        if (!dependencies) {
            throw new Error("No dependencies found in package.json");
        }

        const version = dependencies[name];

        if (!version) {
            throw new Error(`Module ${name} is not listed`);
        }

        return `${JSON.stringify(name)}: ${JSON.stringify(version)}`;
    }

    public getDevDependency(name: string): string {
        const { devDependencies } = this.packageJson;

        if (!devDependencies) {
            throw new Error("No devDependencies found in package.json");
        }

        const version = devDependencies[name];

        if (!version) {
            throw new Error(`Module ${name} is not listed`);
        }

        return `${JSON.stringify(name)}: ${JSON.stringify(version)}`;
    }

    private async getLatestLtsNodeVersion(): Promise<string> {
        const response = await axios.get<Array<NodeVersion>>(
            "https://nodejs.org/dist/index.json",
        );

        const lts = response.data.filter((version) => version.lts);

        return lts[0]?.version.slice(1) || this.engine;
    }

    public getNodeEngine(): string {
        return this.engine;
    }

    public get packageJson(): PackageJson {
        return this._packageJson;
    }

    private set packageJson(value: PackageJson) {
        this._packageJson = value;
    }
}
