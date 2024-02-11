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

        if (!this.generator.options.pkg && this.generator.options.skipPrompts) {
            this.generator.options.pkg = this.getDefault();

            // @ts-expect-error This is necessary as the env 'options' property doesn't seem to be correctly typed on the Environment.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            this.generator.env.options.nodePackageManager =
                this.generator.options.pkg;
        }
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
            default: this.getDefault(),
            when:
                !this.generator.options.pkg &&
                !this.generator.options.skipPrompts,
        };
    }
}
