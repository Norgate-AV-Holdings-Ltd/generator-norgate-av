import { PromptQuestion } from "@yeoman/types";
import { Answers } from "../@types/index.js";
import { BaseQuestion } from "./index.js";
import AppGenerator from "../app.js";

export class ProjectDescription extends BaseQuestion {
    constructor(generator: AppGenerator) {
        super(generator);
    }

    public getQuestion(): PromptQuestion<Answers> {
        return {
            type: "input",
            name: "description",
            message: "What's the description of your project?",
            default: "",
            when:
                !this.generator.options.description &&
                !this.generator.options.skipPrompts,
        };
    }
}
