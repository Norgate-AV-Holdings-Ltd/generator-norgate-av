import { PromptQuestion } from "@yeoman/types";
import { Answers } from "../@types/index.js";
import AppGenerator from "../app.js";

export abstract class BaseQuestion {
    protected readonly generator: AppGenerator;

    protected constructor(generator: AppGenerator) {
        this.generator = generator;
    }

    public abstract getQuestion(): PromptQuestion<Answers>;
}
