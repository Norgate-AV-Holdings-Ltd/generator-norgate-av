import { ConfigHelper } from "../helpers/index.js";

export class PythonEnvironment {
    private engine: string;

    public constructor() {
        const config = ConfigHelper.getInstance().getConfig();
        this.engine = config.environments.python.engine.fallback;
    }

    public async initialize(): Promise<void> {}

    public getEngine(): string {
        return this.engine;
    }
}
