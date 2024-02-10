import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "yeoman-assert";
import helpers, { RunResult } from "yeoman-test";
import { describe, beforeAll, afterAll, expect, it } from "vitest";
import AppGenerator from "../src/app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generator = path.resolve(__dirname, "../dist/generators/app");

describe("generator-norgate-av:app", () => {
    describe.each([
        {
            type: "python",
            name: "test",
            description: "test-description",
            git: false,
            openWith: "skip",
        },
        {
            type: "py",
            name: "test",
            description: "test-description",
            git: true,
            openWith: "skip",
        },
    ])(
        'python using type "$type" and git "$git"',
        ({ type, name, description, git, openWith }) => {
            let result: RunResult<AppGenerator>;

            beforeAll(async () => {
                result = await helpers
                    .create<AppGenerator>(generator)
                    .withAnswers({
                        type,
                        name,
                        description,
                        git,
                        openWith,
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
                    "CONTRIBUTING.md",
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

            it("should create a git repository if git is true", () => {
                git ? assert.file(".git") : assert.noFile(".git");
            });

            it("should always pass", () => {
                expect(1).toEqual(1);
            });
        },
    );
});
