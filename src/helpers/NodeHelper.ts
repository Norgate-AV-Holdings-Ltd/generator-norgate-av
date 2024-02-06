import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { PackageJson } from "type-fest";
import { findUpSync } from "find-up";

export class NodeHelper {
    private static readonly packageJson = this.getPackageJson();

    private static getPackageJson(): PackageJson {
        const file = findUpSync("dependencies/package.json", {
            cwd: path.dirname(fileURLToPath(import.meta.url)),
        });

        if (!file) {
            throw new Error("Could not find package.json file.");
        }

        return JSON.parse(fs.readFileSync(file, "utf-8")) as PackageJson;
    }

    public static getDependency(name: string): string {
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

    public static getDevDependency(name: string): string {
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

    public static getNodeEngine(): string {
        return this.packageJson.engines?.node || "18";
    }
}
