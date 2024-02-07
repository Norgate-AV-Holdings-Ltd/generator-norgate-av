export type NodeProject = {
    getDependency(name: string): string;
    getDevDependency(name: string): string;
    getNodeEngine(): string;
};
