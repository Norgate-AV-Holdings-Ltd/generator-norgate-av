import * as env from "./env";

class Project implements Project {
    public name: string = "";
    public description: string = "";
    public type: string = "";
    public git: boolean = false;
    public pkg: string = "";
    private dependencies: Record<string, string> = {};
    private devDependencies: Record<string, string> = {};
    public node: string = "";
    public installDependencies: boolean = false;

    constructor() {
        this.initialize();
    }

    private async initialize() {
        this.dependencies = await env.getDependencies();
        this.devDependencies = await env.getDevDependencies();
        this.node = await env.getNodeEngine();
    }

    public getDependency(name: string): string {
        const version = this.dependencies[name];

        if (typeof version === "undefined") {
            throw new Error(`Module ${name} is not listed`);
        }

        return `${JSON.stringify(name)}: ${JSON.stringify(version)}`;
    }

    public getDevDependency(name: string): string {
        const version = this.devDependencies[name];

        if (typeof version === "undefined") {
            throw new Error(`Module ${name} is not listed`);
        }

        return `${JSON.stringify(name)}: ${JSON.stringify(version)}`;
    }
}
export default Project;
