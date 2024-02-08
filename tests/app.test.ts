import path from "node:path";
import util from "node:util";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import assert from "yeoman-assert";
import helpers, { RunResult } from "yeoman-test";
import { describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generator = path.resolve(__dirname, "../generators/app");

describe("generator-norgate-av:app", () => {
    describe("should generate a typescript project without errors", () => {
        // let result: RunResult;

        // beforeEach(() => {
        //     const result = helpers.run(generator).withPrompts({
        //         type: "typescript",
        //         name: "generator-temp",
        //         id: "generator-temp",
        //         description: "A Generator for testing purposes",
        //         git: false,
        //         pkg: "pnpm",
        //     });

        //     console.log(result);
        // });

        // afterEach(() => {
        //     result?.cleanup();
        // });

        // console.log(result);

        // it("should create a directory named 'generator-temp'", () => {
        //     assert.equal(path.basename(process.cwd()), "generator-temp");
        // });

        it("should create the correct files", async () => {
            await helpers.run(generator);

            assert.file([
                ".github/workflows/ci.yml",
                ".github/dependabot.yml",
                ".husky/commit-msg",
                ".husky/pre-commit",
                ".vscode/extensions.json",
                ".vscode/settings.json",
                "src/app.ts",
                "tests/app.test.ts",
                ".all-contributorsrc",
                ".changelogrc.json",
                ".commitlintrc.json",
                ".czrc",
                ".editorconfig",
                ".eslintignore",
                ".eslintrc.json",
                ".gitattributes",
                ".gitignore",
                ".lintstagedrc.json",
                ".npmignore",
                ".npmrc",
                ".nvmrc",
                ".prettierignore",
                ".prettierrc.json",
                ".releaserc.json",
                "CHANGELOG.md",
                "CONTRIBUTING.md",
                "GitVersion.yml",
                "LICENSE",
                "package.json",
                "README.md",
                "tsconfig.json",
                "tsup.config.json",
                "tsup.schema.json",
                "vitest.config.ts",
            ]);
        });
    });

    it("should always pass", () => {
        expect(1).toEqual(1);
    });
});
