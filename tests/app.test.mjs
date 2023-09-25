import path from "path";
import assert from "yeoman-assert";
import helpers from "yeoman-test";
import { describe, beforeAll, expect, it } from "vitest";

describe("generator-norgate-av:app", () => {
    beforeAll(() => {
        return helpers
            .run(path.join(__dirname, "../generators/app"))
            .withPrompts({
                name: "test",
                description: "test",
                yes: true,
            });
    });

    it("should always pass", () => {
        expect(1).toEqual(1);
    });
});
