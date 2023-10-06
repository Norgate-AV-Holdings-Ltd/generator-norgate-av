export class QuestionFactory {
    // Compare this snippet from src/app/question.factory.ts:
    // import { Question } from "./question.interface";
    //
    // export class QuestionFactory {
    //     public static create(name: string, generator: any, projectConfig: any): Question {
    //         switch (name) {
    //             case "projectName":
    //                 return new ProjectNameQuestion(generator, projectConfig);
    //             case "projectDescription":
    //                 return new ProjectDescriptionQuestion(generator, projectConfig);
    //             case "git":
    //                 return new GitQuestion(generator, projectConfig);
    //             default:
    //                 throw new Error(`Unknown question: ${name}`);
    //         }
    //     }
    // }
    public static create(name: string, generator: any, projectConfig: any): Question {
        switch (name) {
            case "projectName":
                return new ProjectNameQuestion(generator, projectConfig);
            case "projectDescription":
                return new ProjectDescriptionQuestion(generator, projectConfig);
            case "git":
                return new GitQuestion(generator, projectConfig);
            default:
                throw new Error(`Unknown question: ${name}`);
        }
    }
}
