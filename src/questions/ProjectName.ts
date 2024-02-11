import path from "node:path";
import { PromptQuestion } from "@yeoman/types";
import AppGenerator from "../app.js";
import { Answers } from "../@types/index.js";
import { BaseQuestion } from "./index.js";

export class ProjectName extends BaseQuestion {
    constructor(generator: AppGenerator) {
        super(generator);
        this.generator.options.name = this.getDefault();
    }

    private getDefault(): string {
        return this.generator.options.destination
            ? path.basename(this.generator.destinationPath())
            : "";
    }

    public getQuestion(): PromptQuestion<Answers> {
        return {
            type: "input",
            name: "name",
            message: "What's the name of your project?",
            default: this.generator.options.name,
            when:
                !this.generator.options.name &&
                !this.generator.options.skipPrompts,
        };
    }
}
