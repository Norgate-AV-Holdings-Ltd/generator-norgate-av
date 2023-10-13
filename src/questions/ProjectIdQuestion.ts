import { Question } from "yeoman-generator";
import AppGenerator from "..";
import { ProjectQuestion } from "./ProjectQuestion";

export class ProjectIdQuestion extends ProjectQuestion {
    private readonly pattern: RegExp = /^[a-z0-9][a-z0-9-]*$/i;

    constructor(generator: AppGenerator) {
        super(generator);
    }

    public getQuestion(): Question<{ name: string }> {
        return {
            type: "input",
            name: "name",
            message: "What's the identifier of your project?",
            default: this.generator.options.displayName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-"),
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
