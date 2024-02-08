import { PromptQuestion } from "@yeoman/types";
import config from "config";
import { BaseQuestion } from "./index.js";
import { Answers, NodePackageManager } from "../@types/index.js";
import AppGenerator from "../app.js";

export class PackageManager extends BaseQuestion {
    private default = config.get<NodePackageManager>(
        "config.pkgmanager.node.default",
    );
    private choices = config.get<Array<NodePackageManager>>(
        "config.pkgmanager.node.choices",
    );

    constructor(generator: AppGenerator) {
        super(generator);
    }

    public getQuestion(): PromptQuestion<Answers> {
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
