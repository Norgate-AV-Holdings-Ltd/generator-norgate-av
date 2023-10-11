import { Question } from "yeoman-generator";
import { AppGenerator } from "../app";
import { TemplateQuestion } from "./TemplateQuestion";

export class GitQuestion extends TemplateQuestion {
    constructor(generator: AppGenerator) {
        super(generator);
    }

    public getQuestion(): Question<{ git: boolean }> {
        return {
            type: "confirm",
            name: "git",
            message: "Initialize a git repository?",
            default: true,
            when:
                !this.generator.options.git &&
                !this.generator.options.skipPrompts,
        };
    }
}
