import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "yeoman-assert";
import helpers, { RunResult } from "yeoman-test";
import { describe, beforeAll, afterAll, expect, it } from "vitest";
import AppGenerator from "../src/app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generator = path.resolve(__dirname, "../dist/generators/app");

describe("generator-norgate-av:app", () => {
    describe("python:skip-install", () => {
        let result: RunResult<AppGenerator>;

        const name = "test";
        const description = "test-description";

        beforeAll(async () => {
            result = await helpers.create<AppGenerator>(generator).withAnswers({
                type: "python",
                name,
                description,
                git: false,
                openWith: "skip",
            });

            process.chdir(name);
        });

        afterAll(() => {
            result?.cleanup();
        });

        it(`should create a directory named '${name}' and CD into it`, () => {
            assert.equal(path.basename(process.cwd()), name);
        });

        it("should create the correct files", () => {
            assert.file([
                ".github/workflows/main.yml",
                ".github/dependabot.yml",
                ".vscode/extensions.json",
                ".vscode/settings.json",
                "src/main.py",
                ".editorconfig",
                ".gitattributes",
                ".gitignore",
                "CHANGELOG.md",
                "GitVersion.yml",
                "LICENSE",
                "README.md",
            ]);
        });

        it("should create the correct README.md", () => {
            assert.fileContent("README.md", `# ${name}`);
            assert.fileContent(
                "README.md",
                `This is the README for your project "${name}". After writing up a brief description, we recommend including the following sections.`,
            );
        });

        it("should create the correct LICENSE", () => {
            assert.fileContent("LICENSE", "The MIT License (MIT)");
            assert.fileContent(
                "LICENSE",
                `Copyright (c) ${new Date().getFullYear()}`,
            );
        });

        it("should create the correct CHANGELOG.md", () => {
            assert.fileContent(
                "CHANGELOG.md",
                `All notable changes to the "${name}" project will be documented in this file.`,
            );
        });

        it("should always pass", () => {
            expect(1).toEqual(1);
        });
    });
});
