import { PromptQuestion } from "@yeoman/types";
import { BaseQuestion } from "./index.js";
import { Answers } from "../@types/index.js";
import AppGenerator from "../app.js";

export class Git extends BaseQuestion {
    constructor(generator: AppGenerator) {
        super(generator);
        // this.generator.options.git = this.getDefault();
    }

    private getDefault(): boolean {
        return true;
    }

    public getQuestion(): PromptQuestion<Answers> {
        return {
            type: "confirm",
            name: "git",
            message: "Initialize a git repository?",
            default: this.getDefault(),
            when: !this.generator.options.skipPrompts,
        };
    }
}
