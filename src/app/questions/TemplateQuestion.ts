import { Question } from "yeoman-generator";
import { AppGenerator } from "../app";

export abstract class TemplateQuestion {
    protected readonly generator: AppGenerator;

    constructor(generator: AppGenerator) {
        this.generator = generator;
    }

    public abstract getQuestion(): Question<any>;
}
