import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "yeoman-assert";
import helpers, { RunResult } from "yeoman-test";
import { describe, beforeAll, afterAll, expect, it } from "vitest";
import AppGenerator from "../src/app.js";
import { NodeEnvironment } from "../src/environments/index.js";
import { ConfigHelper } from "../src/helpers/index.js";
import config from "../config/default.json";
import { UnresolvedConfig, NodePackageManager } from "../src/@types/index.js";
import { getNodeDependencyObject } from "./helpers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generator = path.resolve(__dirname, "../dist/generators/app");

await ConfigHelper.initialize(config as UnresolvedConfig);

const node = new NodeEnvironment();
await node.initialize();

const engine = node.getNodeEngine().split(".")[0];

const devDependencies = [
    "@commitlint/cli",
    "@commitlint/config-conventional",
    "@semantic-release/changelog",
    "@semantic-release/git",
    "@types/node",
    "alive-server",
    "all-contributors-cli",
    "commitizen",
    "cz-conventional-changelog",
    "doctoc",
    "husky",
    "lint-staged",
    "prettier",
    "semantic-release",
];

const files = [
    ".github/workflows/main.yml",
    ".github/dependabot.yml",
    ".husky/commit-msg",
    ".husky/pre-commit",
    ".vscode/extensions.json",
    ".vscode/settings.json",
    "assets/css/styles.css",
    "assets/img/favicon.ico",
    "assets/img/yeoman-logo-svg-vector.svg",
    "assets/js/app.js",
    "assets/js/counter.js",
    "public/index.html",
    ".alive-server.json",
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
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "GitVersion.yml",
    "LICENSE",
    "package.json",
    "README.md",
];

describe("generator-norgate-av:html", () => {
    describe.each([
        {
            type: "html",
            name: "test",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: false,
            pkg: "pnpm",
            openWith: "skip",
        },
        {
            type: "web",
            name: "test",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: true,
            pkg: "yarn",
            openWith: "skip",
        },
        {
            type: "vanilla",
            name: "test",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: true,
            pkg: "npm",
            openWith: "skip",
        },
    ])(
        "prompts: app --type $type --name $name --id $id --description $description --author $author --git $git --pkg $pkg --openWith $openWith",
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
                assert.equal(result.generator.options.pkg, pkg);
                assert.equal(
                    // @ts-expect-error This is necessary as the env 'options' property doesn't seem to be correctly typed on the Environment.
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    result.generator.env.options.nodePackageManager,
                    pkg,
                );
            });

            it(`should create a directory named '${name}' and CD into it`, () => {
                assert.equal(path.basename(process.cwd()), name);
            });

            it("should create the correct files", () => {
                assert.file(files);
            });

            it("should create the correct package.json", () => {
                assert.jsonFileContent("package.json", {
                    name: id,
                    displayName: name,
                    description,
                    engines: {
                        node: `>=${engine}`,
                    },
                    devDependencies: getNodeDependencyObject(
                        devDependencies,
                        node.packageJson.devDependencies as Record<
                            string,
                            string
                        >,
                    ),
                });
            });

            it("should create the correct index.html", () => {
                assert.fileContent("public/index.html", `<title>${id}</title>`);
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

    describe.each([
        {
            destination: "test",
            type: "html",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: false,
            pkg: "pnpm",
            yes: true,
        },
        {
            destination: "test",
            type: "web",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: true,
            pkg: "yarn",
            yes: true,
        },
        {
            destination: "test",
            type: "vanilla",
            id: "test-id",
            description: "test-description",
            author: "Yeoman",
            git: true,
            pkg: "npm",
            yes: true,
        },
    ])(
        "cli: app $destination --type $type --id $id --description $description --author $author --git $git --pkg $pkg --yes $yes",
        ({ destination, type, id, description, author, git, pkg, yes }) => {
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
                        pkg: pkg as NodePackageManager,
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
                assert.equal(result.generator.options.pkg, pkg);
                assert.equal(
                    // @ts-expect-error This is necessary as the env 'options' property doesn't seem to be correctly typed on the Environment.
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    result.generator.env.options.nodePackageManager,
                    pkg,
                );
            });

            it(`should create a directory named '${destination}' and CD into it`, () => {
                assert.equal(path.basename(process.cwd()), destination);
            });

            it("should create the correct files", () => {
                assert.file(files);
            });

            it("should create the correct package.json", () => {
                assert.jsonFileContent("package.json", {
                    name: id,
                    displayName: destination,
                    description,
                    engines: {
                        node: `>=${engine}`,
                    },
                    devDependencies: getNodeDependencyObject(
                        devDependencies,
                        node.packageJson.devDependencies as Record<
                            string,
                            string
                        >,
                    ),
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

    describe.each([
        {
            destination: "Test Project",
            type: "html",
            yes: true,
        },
        {
            destination: "Test Project",
            type: "web",
            yes: true,
        },
        {
            destination: "Test Project",
            type: "vanilla",
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
                assert.equal(result.generator.options.pkg, "pnpm");
                assert.equal(
                    // @ts-expect-error This is necessary as the env 'options' property doesn't seem to be correctly typed on the Environment.
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    result.generator.env.options.nodePackageManager,
                    "pnpm",
                );
            });

            it(`should create a directory named '${destination}' and CD into it`, () => {
                assert.equal(path.basename(process.cwd()), destination);
            });

            it("should create the correct files", () => {
                assert.file(files);
            });

            it("should create the correct package.json", () => {
                assert.jsonFileContent("package.json", {
                    name: result.generator.options.id,
                    displayName: destination,
                    description: result.generator.options.description,
                    engines: {
                        node: `>=${engine}`,
                    },
                    devDependencies: getNodeDependencyObject(
                        devDependencies,
                        node.packageJson.devDependencies as Record<
                            string,
                            string
                        >,
                    ),
                });
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
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `${result.generator.options.pkg} install`,
                );
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `If in doubt, you can use the \`${result.generator.options.pkg} commit\``,
                );
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `Be sure to run \`${result.generator.options.pkg} test\``,
                );
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `Run the \`${result.generator.options.pkg} contrib:add\``,
                );
                assert.fileContent(
                    "CONTRIBUTING.md",
                    `${result.generator.options.pkg} contrib:add <username>`,
                );
            });

            it("should create the correct CHANGELOG.md", () => {
                assert.fileContent(
                    "CHANGELOG.md",
                    `All notable changes to the "${result.generator.options.id}" project will be documented in this file.`,
                );
            });

            it("should create the correct .all-contributorsrc", () => {
                assert.fileContent(
                    ".all-contributorsrc",
                    `"projectName": "${result.generator.options.id}"`,
                );
            });

            it("should create the correct husky git hooks", () => {
                assert.fileContent(
                    ".husky/commit-msg",
                    `${result.generator.options.pkg} commitlint --edit $1`,
                );
                assert.fileContent(
                    ".husky/pre-commit",
                    `${result.generator.options.pkg} lint-staged`,
                );
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
