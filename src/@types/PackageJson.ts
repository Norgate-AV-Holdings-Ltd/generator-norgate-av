export type PackageJson = {
    engines: {
        node: string;
    };
    devDependencies: Record<string, string>;
    dependencies: Record<string, string>;
};
