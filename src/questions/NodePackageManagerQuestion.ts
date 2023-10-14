import { Question } from "yeoman-generator";
import config from "config";
import BaseQuestion from "./BaseQuestion";
import { Answers, NodePackageManager } from "../@types";
import AppGenerator from "..";

class NodePackageManagerQuestion extends BaseQuestion {
    private readonly default = config.get<NodePackageManager>(
        "package-manager.node.default",
    );
    private readonly choices = config.get<NodePackageManager[]>(
        "package-manager.node.choices",
    );

    constructor(generator: AppGenerator) {
        super(generator);
    }

    public getQuestion(): Question<Answers> {
        return {
            type: "list",
            name: "pkg",
            message: "Which package manager to use?",
            choices: this.choices.map((choice) => {
                return {
                    name: choice,
                    value: choice,
                };
            }),
            default: this.default,
            when:
                !this.generator.options.pkg &&
                !this.generator.options.skipPrompts,
        };
    }
}

export default NodePackageManagerQuestion;
