import path from "node:path";
import { fileURLToPath } from "node:url";
// import assert from "yeoman-assert";
import helpers, { RunResult } from "yeoman-test";
import { describe, beforeAll, afterAll, expect, it } from "vitest";

describe("generator-norgate-av:app", () => {
    // let result: RunResult;

    // beforeAll(async () => {
    //     result = await helpers
    //         .create(
    //             path.join(
    //                 path.dirname(fileURLToPath(import.meta.url)),
    //                 "../generators/app",
    //             ),
    //         )
    //         .withOptions({})
    //         .withAnswers({});
    // });

    // afterAll(() => {
    //     result.cleanup();
    // });

    it("should always pass", () => {
        expect(1).toEqual(1);
    });
});
