export type NodeProject = {
    engine: string;
    installDependencies: boolean;
    getDependency(name: string): string;
    getDevDependency(name: string): string;
    getNodeEngine(): string;
};
