import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "yeoman-assert";
import helpers, { RunResult } from "yeoman-test";
import { describe, beforeAll, afterAll, expect, it, vi } from "vitest";
import Generator from "yeoman-generator";
import { PythonEnvironment } from "../src/environments/index.js";
import { ConfigHelper } from "../src/helpers/index.js";
import config from "../config/default.json";
import { UnresolvedConfig } from "../src/@types/index.js";
import AppGenerator from "../src/app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generator = path.resolve(__dirname, "../dist/generators/app");

await ConfigHelper.initialize(config as UnresolvedConfig);

const python = new PythonEnvironment();
await python.initialize();

const spawn = vi.spyOn(Generator.prototype, "spawn");

const files = [
    ".github/workflows/main.yml",
    ".github/dependabot.yml",
    ".vscode/extensions.json",
    ".vscode/settings.json",
    "src/main.py",
    ".editorconfig",
    ".gitattributes",
    ".gitignore",
    ".python-version",
    "CONTRIBUTING.md",
    "CHANGELOG.md",
    "GitVersion.yml",
    "LICENSE",
    "README.md",
    "requirements.txt",
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
                spawn.mockClear();
            });

            it("should assign the correct values", () => {
                assert.equal(result.generator.options.type, type);
                assert.equal(result.generator.options.name, name);
                assert.equal(result.generator.options.id, id);
                assert.equal(result.generator.options.description, description);
                // assert.equal(result.generator.options.author, author);
                assert.equal(
                    result.generator.options.git,
                    process.env.CI ? false : git,
                );
            });

            it(`should create a directory named '${name}' and CD into it`, () => {
                assert.equal(path.basename(process.cwd()), name);
            });

            it("should create the correct files", () => {
                assert.file(files);
            });

            it("should create the correct README.md", () => {
                assert.fileContent("README.md", `# ${id}`);
                assert.fileContent(
                    "README.md",
                    `This is the README for your project "${id}". After writing up a brief description, we recommend including the following sections.`,
                );
            });

            it("should create the correct .python-version", () => {
                assert.fileContent(".python-version", python.getEngine());
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
                    `All notable changes to the "${id}" project will be documented in this file.`,
                );
            });

            it("should create the correct CONTRIBUTING.md", () => {
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `/${id}/issues/new/choose`,
                );
                assert.fileContent("CONTRIBUTING.md", `/${id}.git`);
                assert.fileContent("CONTRIBUTING.md", `cd ${id}`);
            });

            it.skipIf(process.env.CI)(
                "should have spawned a command to create a git repository if git is true",
                () => {
                    git &&
                        expect(spawn).toHaveBeenCalledWith("git", [
                            "init",
                            "--quiet",
                        ]);
                },
            );

            it.skipIf(process.env.CI)(
                "should create a git repository if git is true",
                () => {
                    git ? assert.file(".git") : assert.noFile(".git");
                },
            );

            it.skipIf(process.env.CI)(
                "should have spawned a commands to add and commit files if git is true",
                () => {
                    git &&
                        expect(spawn).toHaveBeenCalledWith("git", [
                            "add",
                            "-A",
                        ]);

                    git &&
                        expect(spawn).toHaveBeenCalledWith("git", [
                            "commit",
                            "-m",
                            "chore: initial commit",
                            "--no-verify",
                            "--quiet",
                        ]);
                },
            );

            // it("should spawn a command to create a virtual environment", () => {
            //     expect(spawn).toHaveBeenCalledWith("python3", [
            //         "-m",
            //         "venv",
            //         `${path.join(process.cwd(), ".venv")}`,
            //     ]);
            // });

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
                assert.equal(result.generator.options.type, type);
                assert.equal(result.generator.options.destination, destination);
                assert.equal(result.generator.options.name, destination);
                assert.equal(result.generator.options.id, id);
                assert.equal(result.generator.options.description, description);
                // assert.equal(result.generator.options.author, author);
                assert.equal(
                    result.generator.options.git,
                    process.env.CI ? false : git,
                );
            });

            it(`should create a directory named '${destination}' and CD into it`, () => {
                assert.equal(path.basename(process.cwd()), destination);
            });

            it("should create the correct files", () => {
                assert.file(files);
            });

            it("should create the correct README.md", () => {
                assert.fileContent("README.md", `# ${id}`);
                assert.fileContent(
                    "README.md",
                    `This is the README for your project "${id}". After writing up a brief description, we recommend including the following sections.`,
                );
            });

            it("should create the correct .python-version", () => {
                assert.fileContent(".python-version", python.getEngine());
            });

            it("should create the correct LICENSE", () => {
                assert.fileContent("LICENSE", "The MIT License (MIT)");
                assert.fileContent(
                    "LICENSE",
                    `Copyright (c) ${new Date().getFullYear()}`,
                );
            });

            it("should create the correct CONTRIBUTING.md", () => {
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `/${id}/issues/new/choose`,
                );
                assert.fileContent("CONTRIBUTING.md", `/${id}.git`);
                assert.fileContent("CONTRIBUTING.md", `cd ${id}`);
            });

            it("should create the correct CHANGELOG.md", () => {
                assert.fileContent(
                    "CHANGELOG.md",
                    `All notable changes to the "${id}" project will be documented in this file.`,
                );
            });

            it.skipIf(process.env.CI)(
                "should have spawned a command to create a git repository if git is true",
                () => {
                    git &&
                        expect(spawn).toHaveBeenCalledWith("git", [
                            "init",
                            "--quiet",
                        ]);
                },
            );

            it.skipIf(process.env.CI)(
                "should create a git repository if git is true",
                () => {
                    git ? assert.file(".git") : assert.noFile(".git");
                },
            );

            it.skipIf(process.env.CI)(
                "should have spawned a commands to add and commit files if git is true",
                () => {
                    git &&
                        expect(spawn).toHaveBeenCalledWith("git", [
                            "add",
                            "-A",
                        ]);

                    git &&
                        expect(spawn).toHaveBeenCalledWith("git", [
                            "commit",
                            "-m",
                            "chore: initial commit",
                            "--no-verify",
                            "--quiet",
                        ]);
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

            it("should assign the correct default values", () => {
                assert.equal(result.generator.options.id, "test-project");
                assert.equal(result.generator.options.description, "");
                assert.equal(result.generator.options.author, "");
                assert.equal(result.generator.options.git, !process.env.CI);
            });

            it(`should create a directory named '${destination}' and CD into it`, () => {
                assert.equal(path.basename(process.cwd()), destination);
            });

            it("should create the correct files", () => {
                assert.file(files);
            });

            it("should create the correct README.md", () => {
                assert.fileContent(
                    "README.md",
                    `# ${result.generator.options.id}`,
                );
                assert.fileContent(
                    "README.md",
                    `This is the README for your project "${result.generator.options.id}". After writing up a brief description, we recommend including the following sections.`,
                );
            });

            it("should create the correct .python-version", () => {
                assert.fileContent(".python-version", python.getEngine());
            });

            it("should create the correct LICENSE", () => {
                assert.fileContent("LICENSE", "The MIT License (MIT)");
                assert.fileContent(
                    "LICENSE",
                    `Copyright (c) ${new Date().getFullYear()}`,
                );
            });

            it("should create the correct CONTRIBUTING.md", () => {
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `/${result.generator.options.id}/issues/new/choose`,
                );
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `/${result.generator.options.id}.git`,
                );
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `cd ${result.generator.options.id}`,
                );
            });

            it("should create the correct CHANGELOG.md", () => {
                assert.fileContent(
                    "CHANGELOG.md",
                    `All notable changes to the "${result.generator.options.id}" project will be documented in this file.`,
                );
            });

            it.skipIf(process.env.CI)(
                "should have spawned a command to create a git repository if git is true",
                () => {
                    result.generator.options.git &&
                        expect(spawn).toHaveBeenCalledWith("git", [
                            "init",
                            "--quiet",
                        ]);
                },
            );

            it.skipIf(process.env.CI)(
                "should create a git repository if git is true",
                () => {
                    result.generator.options.git
                        ? assert.file(".git")
                        : assert.noFile(".git");
                },
            );

            it.skipIf(process.env.CI)(
                "should have spawned a commands to add and commit files if git is true",
                () => {
                    result.generator.options.git &&
                        expect(spawn).toHaveBeenCalledWith("git", [
                            "add",
                            "-A",
                        ]);

                    result.generator.options.git &&
                        expect(spawn).toHaveBeenCalledWith("git", [
                            "commit",
                            "-m",
                            "chore: initial commit",
                            "--no-verify",
                            "--quiet",
                        ]);
                },
            );

            it("should always pass", () => {
                expect(1).toEqual(1);
            });
        },
    );
});
