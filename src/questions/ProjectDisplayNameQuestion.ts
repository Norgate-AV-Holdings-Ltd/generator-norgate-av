import { Question } from "yeoman-generator";
import path from "path";
import AppGenerator from "..";
import { ProjectQuestion } from "./ProjectQuestion";

export class ProjectDisplayNameQuestion extends ProjectQuestion {
    constructor(generator: AppGenerator) {
        super(generator);
    }

    public getQuestion(): Question<{ displayName: string }> {
        const nameFromFolder = this.generator.options.destination
            ? path.basename(this.generator.destinationPath())
            : "";

        return {
            type: "input",
            name: "displayName",
            message: "What's the name of your project?",
            default: nameFromFolder,
            when:
                !this.generator.options.displayName &&
                !this.generator.options.skipPrompts,
        };
    }
}
