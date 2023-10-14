import { Question } from "yeoman-generator";
import BaseQuestion from "./BaseQuestion";
import { Answers } from "../@types";
import AppGenerator from "..";

class GitQuestion extends BaseQuestion {
    constructor(generator: AppGenerator) {
        super(generator);
    }

    public getQuestion(): Question<Answers> {
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

export default GitQuestion;
