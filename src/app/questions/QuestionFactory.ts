import { Question } from "yeoman-generator";
import AppGenerator from "../app";

export class QuestionFactory {
    public static getQuestions(
        generator: AppGenerator,
    ): Array<Question> | Error {
        throw new Error("Not implemented");
    }
}
