import { Question } from "yeoman-generator";
import config from "config";
// import { resolveRefs } from "json-refs";
import BaseQuestion from "./BaseQuestion";
import { Answers, NodePackageManager } from "../@types";
import AppGenerator from "..";

class PackageManager extends BaseQuestion {
    // private config: any;
    private default = config.get<NodePackageManager>("pkgmanager.node.default");
    private choices = config.get<NodePackageManager[]>(
        "pkgmanager.node.choices",
    );

    constructor(generator: AppGenerator) {
        super(generator);
        // this.initialize();
    }

    // private async initialize() {
    //     const { resolved }: any = await resolveRefs(config.util.toObject());
    //     this.config = resolved;
    //     // this.default = this.getDefault();
    // }

    // private getDefault() {
    //     return this.config.templates[
    //         this.generator.generator?.getSignature().id
    //     ].pkgmanager.default;
    // }

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

export default PackageManager;
