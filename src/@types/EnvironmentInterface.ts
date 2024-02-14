export interface EnvironmentInterface {
    initialize(): Promise<void>;
    getEngine(): string;
}
