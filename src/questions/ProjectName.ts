import path from "node:path";
import { PromptQuestion } from "@yeoman/types";
import AppGenerator from "../app.js";
import { Answers } from "../@types/index.js";
import { BaseQuestion } from "./index.js";

export class ProjectName extends BaseQuestion {
    constructor(generator: AppGenerator) {
        super(generator);
    }

    public getQuestion(): PromptQuestion<Answers> {
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
