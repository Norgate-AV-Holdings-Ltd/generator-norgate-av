import { PromptQuestion } from "@yeoman/types";
import { BaseQuestion } from "./index.js";
import { Answers, NodePackageManager } from "../@types/index.js";
import { ConfigHelper } from "../helpers/index.js";
import AppGenerator from "../app.js";

export class PackageManager extends BaseQuestion {
    private default: NodePackageManager;
    private choices: Array<NodePackageManager>;

    constructor(generator: AppGenerator) {
        super(generator);

        const config = ConfigHelper.getInstance().getConfig();
        this.default = config.pkgmanager.node!.default;
        this.choices = config.pkgmanager.node!.choices;

        this.generator.options.pkg =
            this.generator.options.pkg || this.getDefault();
    }

    private getDefault(): NodePackageManager {
        return this.default;
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
            default: this.generator.options.pkg,
            when: !this.generator.options.skipPrompts,
        };
    }
}
