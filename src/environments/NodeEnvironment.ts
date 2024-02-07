import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { PackageJson } from "type-fest";
import { findUpSync } from "find-up";
import axios from "axios";
import config from "config";
import { NodeVersion } from "../@types/index.js";

export class NodeEnvironment {
    private readonly packageJson = this.getPackageJson();
    private latestLts: string = config.get<string>(
        "environments.node.engine.fallback",
    );

    public async initialize(): Promise<void> {
        this.latestLts = await this.getLatestLtsNodeVersion();
    }

    private getPackageJson(): PackageJson {
        const file = findUpSync("dependencies/package.json", {
            cwd: path.dirname(fileURLToPath(import.meta.url)),
        });

        if (!file) {
            throw new Error("Could not find package.json file.");
        }

        return JSON.parse(fs.readFileSync(file, "utf-8")) as PackageJson;
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

        return lts[0]?.version.slice(1) || "18";
    }

    public getNodeEngine(): string {
        return this.latestLts;
    }
}
