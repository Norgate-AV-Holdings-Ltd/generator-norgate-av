import { ResolvedRefsResults, resolveRefs } from "json-refs";
import { ResolvedConfig, UnresolvedConfig } from "../@types/index.js";

export class ConfigHelper {
    private static instance: ConfigHelper | null = null;
    private config!: ResolvedConfig;

    public static getInstance(): ConfigHelper {
        if (this.instance === null) {
            this.instance = new ConfigHelper();
        }

        return this.instance;
    }

    public getConfig(): ResolvedConfig {
        return this.config;
    }

    public static async initialize(config: UnresolvedConfig): Promise<void> {
        try {
            const result: ResolvedRefsResults = await resolveRefs(config);
            const instance = ConfigHelper.getInstance();
            instance.config = result.resolved as ResolvedConfig;
        } catch (error) {
            console.error(error);
        }
    }
}
