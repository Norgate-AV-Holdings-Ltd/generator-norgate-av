import { Question } from "yeoman-generator";
import AppGenerator from "..";

export abstract class ProjectQuestion {
    protected readonly generator: AppGenerator;

    protected constructor(generator: AppGenerator) {
        this.generator = generator;
    }

    public abstract getQuestion(): Question<any>;
}
