import { Question } from "yeoman-generator";
import { Answers } from "../@types";
import BaseQuestion from "./BaseQuestion";
import AppGenerator from "..";

class ProjectIdQuestion extends BaseQuestion {
    private readonly pattern: RegExp = /^[a-z0-9][a-z0-9-]*$/i;

    constructor(generator: AppGenerator) {
        super(generator);
    }

    public getQuestion(): Question<Answers> {
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

export default ProjectIdQuestion;
