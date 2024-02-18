export interface EnvironmentInterface {
    initialize(): Promise<void>;
    getStore(): { [key: string]: unknown };
    getDependency(name: string): string;
    getDevDependency(name: string): string;
    getEngine(): string;
}
