import { Question } from "yeoman-generator";
import { Answers } from "../@types";
import AppGenerator from "..";

abstract class BaseQuestion {
    protected readonly generator: AppGenerator;

    protected constructor(generator: AppGenerator) {
        this.generator = generator;
    }

    public abstract getQuestion(): Question<Answers>;
}

export default BaseQuestion;
