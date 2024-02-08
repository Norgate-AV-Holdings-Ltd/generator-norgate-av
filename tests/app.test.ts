import path from "node:path";
import { fileURLToPath } from "node:url";
// import assert from "yeoman-assert";
import helpers, { RunResult } from "yeoman-test";
import { describe, before, after, expect, it } from "esmocha";
// import AppGenerator from "../src/app.js";

describe("generator-norgate-av:app", () => {
    let result: RunResult;

    before(async () => {
        result = await helpers
            .create(
                path.join(
                    path.dirname(fileURLToPath(import.meta.url)),
                    "../generators/app/index.js",
                ),
            )
            .withOptions({})
            .withAnswers({});
    });

    after(() => {
        result?.cleanup();
    });

    it("should always pass", () => {
        expect(1).toEqual(1);
    });
});
