// import toml from "toml";
// import { EnvironmentInterface } from "../@types/index.js";
import { ConfigHelper } from "../helpers/index.js";

export class PythonEnvironment {
    // implements EnvironmentInterface {
    // private store: Map<string, string> = new Map();
    private engine: string;

    public constructor() {
        const config = ConfigHelper.getInstance().getConfig();
        this.engine = config.environments.python.engine.fallback;
    }

    public async initialize(): Promise<void> {
        // this.store = toml.parse("../dependencies/pyproject.toml");
        return Promise.resolve();
    }

    public getDependency(name: string): string {
        return name;
    }

    // public getDevDependency(name: string): string {
    //     return this.getStore().devDependency[name] as string;
    // }

    public getEngine(): string {
        return this.engine;
    }

    // public getStore(): { [key: string]: unknown } {
    //     return Object.fromEntries(this.store);
    // }
}
