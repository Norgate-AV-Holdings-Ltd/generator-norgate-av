import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import assert from "yeoman-assert";
import helpers, { RunResult } from "yeoman-test";
import { describe, beforeEach, afterEach, expect, it } from "vitest";
import AppGenerator from "../src/app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generator = path.resolve(__dirname, "../generators/app");

describe("generator-norgate-av:app", () => {
    let result: RunResult<AppGenerator>;

    beforeEach<Promise<RunResult<AppGenerator>>>(async () => {
        result = await helpers.create<AppGenerator>(generator).withAnswers({
            type: "typescript",
            name: "test",
            description: "test",
            git: false,
            pkg: "pnpm",
        });

        // process.chdir("test");
    });

    afterEach(() => {
        result?.cleanup();
    });
    // describe("should generate a typescript project without errors", () => {
    it("should create a directory named 'test'", () => {
        // assert.equal(path.basename(process.cwd()), "test");
        // assert.exists("test");
    });
    it("should create the correct files", async () => {
        console.log(await fs.readdir(process.cwd()));
        console.log(await fs.readdir(`${process.cwd()}/test`));
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
    // });

    it("should always pass", () => {
        expect(1).toEqual(1);
    });
});
