import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "yeoman-assert";
import helpers, { RunResult } from "yeoman-test";
import { describe, beforeAll, afterAll, expect, it } from "vitest";
import AppGenerator from "../src/app.js";
import {
    assertChangeLog,
    assertContributing,
    assertLicense,
    assertOptionValues,
    assertReadMe,
} from "./helpers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generator = path.resolve(__dirname, "../dist/generators/app");

const files = [
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
];

describe("generator-norgate-av:python", () => {
    describe.each([
        {
            type: "python",
            name: "test",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: false,
            openWith: "skip",
        },
        {
            type: "py",
            name: "test",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: true,
            openWith: "skip",
        },
    ])(
        "prompts: app --type $type --name $name --id $id --description $description --author $author --git $git --openWith $openWith",
        ({ type, name, id, description, author, git, openWith }) => {
            let result: RunResult<AppGenerator>;

            beforeAll(async () => {
                result = await helpers
                    .create<AppGenerator>(generator)
                    .withAnswers({
                        type,
                        name,
                        id,
                        description,
                        author,
                        git,
                        openWith,
                    });

                process.chdir(name);
            });

            afterAll(() => {
                result?.cleanup();
            });

            it("should assign the correct values", () => {
                assertOptionValues(result, {
                    type,
                    name,
                    id,
                    description,
                    author,
                    git,
                });
            });

            it(`should create a directory named '${name}' and CD into it`, () => {
                assert.equal(path.basename(process.cwd()), name);
            });

            it("should create the correct files", () => {
                assert.file(files);
            });

            it("should create the correct README.md", () => {
                assertReadMe("README.md", { id });
            });

            it("should create the correct LICENSE", () => {
                assertLicense("LICENSE", { author });
            });

            it("should create the correct CHANGELOG.md", () => {
                assertChangeLog("CHANGELOG.md", { id });
            });

            it("should create the correct CONTRIBUTING.md", () => {
                assertContributing("CONTRIBUTING.md", { id });
            });

            it.skipIf(process.env.CI)(
                "should create a git repository if git is true",
                () => {
                    git ? assert.file(".git") : assert.noFile(".git");
                },
            );

            it("should always pass", () => {
                expect(1).toEqual(1);
            });
        },
    );

    describe.each([
        {
            destination: "test",
            type: "python",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: false,
            yes: true,
        },
        {
            destination: "test",
            type: "py",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: true,
            yes: true,
        },
    ])(
        "cli: app $destination --type $type --id $id --description $description --author $author --git $git --pkg $pkg --yes $yes",
        ({ destination, type, id, description, author, git, yes }) => {
            let result: RunResult<AppGenerator>;

            beforeAll(async () => {
                result = await helpers
                    .create<AppGenerator>(generator)
                    .withArguments([destination])
                    .withOptions({
                        type,
                        id,
                        description,
                        author,
                        git,
                        yes,
                    });

                process.chdir(destination);
            });

            afterAll(() => {
                result?.cleanup();
            });

            it("should assign the correct values", () => {
                assertOptionValues(result, {
                    type,
                    id,
                    name: destination,
                    description,
                    author,
                    git,
                });
            });

            it(`should create a directory named '${destination}' and CD into it`, () => {
                assert.equal(path.basename(process.cwd()), destination);
            });

            it("should create the correct files", () => {
                assert.file(files);
            });

            it("should create the correct README.md", () => {
                assertReadMe("README.md", { id });
            });

            it("should create the correct LICENSE", () => {
                assertLicense("LICENSE", { author });
            });

            it("should create the correct CONTRIBUTING.md", () => {
                assertContributing("CONTRIBUTING.md", { id });
            });

            it("should create the correct CHANGELOG.md", () => {
                assertChangeLog("CHANGELOG.md", { id });
            });

            it.skipIf(process.env.CI)(
                "should create a git repository if git is true",
                () => {
                    git ? assert.file(".git") : assert.noFile(".git");
                },
            );

            it("should always pass", () => {
                expect(1).toEqual(1);
            });
        },
    );

    describe.each([
        {
            destination: "Test Project",
            type: "python",
            yes: true,
        },
        {
            destination: "Test Project",
            type: "py",
            yes: true,
        },
    ])(
        "cli: using all defaults, skipping prompts",
        ({ destination, type, yes }) => {
            let result: RunResult<AppGenerator>;

            beforeAll(async () => {
                result = await helpers
                    .create<AppGenerator>(generator)
                    .withArguments([destination])
                    .withOptions({
                        type,
                        yes,
                    });

                process.chdir(destination);
            });

            afterAll(() => {
                result?.cleanup();
            });

            it("should assign the correct default values", async () => {
                assertOptionValues(result, {
                    type,
                    id: "test-project",
                    name: destination,
                    description: "",
                    author: process.env.CI
                        ? ""
                        : (await result.generator.git.name()) || "",
                    git: !process.env.CI,
                });
            });

            it(`should create a directory named '${destination}' and CD into it`, () => {
                assert.equal(path.basename(process.cwd()), destination);
            });

            it("should create the correct files", () => {
                assert.file(files);
            });

            it("should create the correct README.md", () => {
                assertReadMe("README.md", { id: result.generator.options.id });
            });

            it("should create the correct LICENSE", () => {
                assertLicense("LICENSE", {
                    author: result.generator.options.author,
                });
            });

            it("should create the correct CONTRIBUTING.md", () => {
                assertContributing("CONTRIBUTING.md", {
                    id: result.generator.options.id,
                });
            });

            it("should create the correct CHANGELOG.md", () => {
                assertChangeLog("CHANGELOG.md", {
                    id: result.generator.options.id,
                });
            });

            it.skipIf(process.env.CI)(
                "should create a git repository if git is true",
                () => {
                    result.generator.options.git
                        ? assert.file(".git")
                        : assert.noFile(".git");
                },
            );

            it("should always pass", () => {
                expect(1).toEqual(1);
            });
        },
    );
});
