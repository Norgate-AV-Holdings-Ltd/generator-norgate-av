import { PromptQuestion } from "@yeoman/types";
import { Answers } from "../@types/index.js";
import { BaseQuestion } from "./index.js";
import AppGenerator from "../app.js";

export class ProjectId extends BaseQuestion {
    private readonly pattern: RegExp = /^[a-z0-9][a-z0-9-]*$/i;

    constructor(generator: AppGenerator) {
        super(generator);
    }

    public getQuestion(): PromptQuestion<Answers> {
        return {
            type: "input",
            name: "name",
            message: "What's the identifier of your project?",
            default: (answers: Answers) => {
                return answers.displayName
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "-");
            },
            when:
                !this.generator.options.id &&
                !this.generator.options.skipPrompts,
            validate: (input: string) => {
                if (!input) {
                    return "Please enter a unique identifier for your project";
                }

                if (!this.pattern.test(input)) {
                    return "Your identifier can only contain lowercase alphanumeric characters and dashes";
                }

                return true;
            },
        };
    }
}
