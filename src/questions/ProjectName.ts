import path from "node:path";
import { PromptQuestion } from "@yeoman/types";
import { BaseQuestion } from "./BaseQuestion.js";
import { Answers } from "../@types/index.js";
import AppGenerator from "../app.js";

export class ProjectName extends BaseQuestion {
    public constructor(generator: AppGenerator) {
        super(generator);

        if (this.generator.options.skipPrompts) {
            this.generator.options.name = this.getDefault();
        }
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
            default: this.getDefault(),
            when:
                !this.generator.options.name &&
                !this.generator.options.skipPrompts,
        };
    }
}
