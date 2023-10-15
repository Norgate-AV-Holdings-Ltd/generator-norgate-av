import { Question } from "yeoman-generator";
import { Answers } from "../@types";
import BaseQuestion from "./BaseQuestion";
import AppGenerator from "..";

class ProjectDescription extends BaseQuestion {
    constructor(generator: AppGenerator) {
        super(generator);
    }

    public getQuestion(): Question<Answers> {
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

export default ProjectDescription;
