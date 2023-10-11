interface Project {
    name: string;
    description: string;
    type: string;
    git: boolean;
    pkg: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    node: string;
    dep: (name: string) => string;
    devDep: (name: string) => string;
    installDependencies: boolean;
}

export default Project;
