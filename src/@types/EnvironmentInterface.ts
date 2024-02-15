export interface EnvironmentInterface {
    initialize(): Promise<void>;
    getStore(): { [key: string]: unknown };
    getDependency(): string;
    getDevDependency(): string;
    getEngine(): string;
}
