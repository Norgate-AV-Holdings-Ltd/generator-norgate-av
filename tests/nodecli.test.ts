import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "yeoman-assert";
import helpers, { RunResult } from "yeoman-test";
import { describe, beforeAll, afterAll, expect, it } from "vitest";
import AppGenerator from "../src/app.js";
import { NodeEnvironment } from "../src/environments/index.js";
import { ConfigHelper } from "../src/helpers/index.js";
import config from "../config/default.json";
import { UnresolvedConfig } from "../src/@types/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generator = path.resolve(__dirname, "../dist/generators/app");

await ConfigHelper.initialize(config as UnresolvedConfig);

const node = new NodeEnvironment();
await node.initialize();

const { devDependencies, dependencies } = node.packageJson;
const engine = node.getNodeEngine().split(".")[0];

describe("generator-norgate-av:app", () => {
    describe.each([
        {
            type: "nodecli",
            name: "test",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: false,
            pkg: "pnpm",
            openWith: "skip",
        },
        {
            type: "node-cli",
            name: "test",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: true,
            pkg: "yarn",
            openWith: "skip",
        },
        {
            type: "cli-js",
            name: "test",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: true,
            pkg: "npm",
            openWith: "skip",
        },
    ])(
        'nodecli with type $type, package manager $pkg, and git "$git"',
        ({ type, name, id, description, author, git, pkg, openWith }) => {
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
                        pkg,
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
                    ".husky/commit-msg",
                    ".husky/pre-commit",
                    ".vscode/extensions.json",
                    ".vscode/settings.json",
                    "src/app.js",
                    ".all-contributorsrc",
                    ".changelogrc.json",
                    ".commitlintrc.json",
                    ".czrc",
                    ".editorconfig",
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
                ]);
            });

            it("should create the correct package.json", () => {
                assert.jsonFileContent("package.json", {
                    name: id,
                    displayName: name,
                    description,
                    engines: {
                        node: `>=${engine}`,
                    },
                    devDependencies: {
                        "@commitlint/config-conventional":
                            devDependencies!["@commitlint/config-conventional"],
                        "@semantic-release/changelog":
                            devDependencies!["@semantic-release/changelog"],
                        "@semantic-release/git":
                            devDependencies!["@semantic-release/git"],
                        "@types/config": devDependencies!["@types/config"],
                        "@types/node": devDependencies!["@types/node"],
                        "@types/nodemon": devDependencies!["@types/nodemon"],
                        "all-contributors-cli":
                            devDependencies!["all-contributors-cli"],
                        commitizen: devDependencies!.commitizen,
                        "cross-env": devDependencies!["cross-env"],
                        "cz-conventional-changelog":
                            devDependencies!["cz-conventional-changelog"],
                        doctoc: devDependencies!.doctoc,
                        husky: devDependencies!.husky,
                        "lint-staged": devDependencies!["lint-staged"],
                        nodemon: devDependencies!.nodemon,
                        prettier: devDependencies!.prettier,
                        "semantic-release":
                            devDependencies!["semantic-release"],
                    },
                    dependencies: {
                        config: dependencies!.config,
                        dotenv: dependencies!.dotenv,
                        envalid: dependencies!.envalid,
                    },
                });
            });

            it("should create the correct README.md", () => {
                assert.fileContent("README.md", `# ${id}`);
                assert.fileContent(
                    "README.md",
                    `This is the README for your project "${id}". After writing up a brief description, we recommend including the following sections.`,
                );
            });

            it("should create the correct .nvmrc", () => {
                assert.fileContent(".nvmrc", node.getNodeEngine());
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
                assert.fileContent("CONTRIBUTING.md", `${pkg} install`);
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `If in doubt, you can use the \`${pkg} commit\``,
                );
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `Be sure to run \`${pkg} test\``,
                );
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `Run the \`${pkg} contrib:add\``,
                );
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `${pkg} contrib:add <username>`,
                );
            });

            it("should create the correct CHANGELOG.md", () => {
                assert.fileContent(
                    "CHANGELOG.md",
                    `All notable changes to the "${id}" project will be documented in this file.`,
                );
            });

            it("should create the correct .all-contributorsrc", () => {
                assert.fileContent(
                    ".all-contributorsrc",
                    `"projectName": "${id}"`,
                );
            });

            it("should create the correct husky git hooks", () => {
                assert.fileContent(
                    ".husky/commit-msg",
                    `${pkg} commitlint --edit $1`,
                );
                assert.fileContent(".husky/pre-commit", `${pkg} lint-staged`);
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
});
