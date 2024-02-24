import assert from "yeoman-assert";
import { RunResult } from "yeoman-test";
import AppGenerator from "../src/app.js";
import { AppOptions } from "../src/@types/index.js";

type AssertionOptions = Partial<
    Pick<
        AppOptions,
        "type" | "id" | "name" | "description" | "author" | "git" | "pkg"
    >
>;

export function getNodeDependencyObject(
    dependencies: Array<string>,
    store: Record<string, string>,
): Record<string, string> {
    return dependencies.reduce<Record<string, string>>((dependencies, key) => {
        const value = store[key];

        if (value === undefined) {
            return dependencies;
        }

        return {
            ...dependencies,
            [key]: value,
        };
    }, {});
}

export function assertReadMe(file: string, { id }: AssertionOptions): void {
    assert.fileContent(file, `# ${id}`);
    assert.fileContent(
        file,
        `This is the README for your project "${id}". After writing up a brief description, we recommend including the following sections.`,
    );
}

export function assertLicense(
    file: string,
    { author }: AssertionOptions,
): void {
    assert.fileContent(file, "The MIT License (MIT)");
    assert.fileContent(
        file,
        `Copyright (c) ${new Date().getFullYear()} ${author}`,
    );
}

export function assertAllContributorsRc(
    file: string,
    { id, author }: AssertionOptions,
): void {
    assert.fileContent(file, `"projectName": "${id}"`);
    assert.fileContent(file, `"projectOwner": "${author}"`);
}

export function assertChangeLog(file: string, { id }: AssertionOptions): void {
    assert.fileContent(
        file,
        `All notable changes to the "${id}" project will be documented in this file.`,
    );
}

export function assertOptionValues(
    result: RunResult<AppGenerator>,
    { type, name, id, description, author, git, pkg }: AssertionOptions,
): void {
    assert.equal(result.generator.options.type, type);
    assert.equal(result.generator.options.name, name);
    assert.equal(result.generator.options.id, id);
    assert.equal(result.generator.options.description, description);
    assert.equal(result.generator.options.author, author);
    assert.equal(result.generator.options.git, process.env.CI ? false : git);
    assert.equal(result.generator.options.pkg, pkg);
    assert.equal(
        // @ts-expect-error This is necessary as the env 'options' property doesn't seem to be correctly typed on the Environment.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        result.generator.env.options.nodePackageManager,
        pkg,
    );
}

export function assertHuskyGitHooks({ pkg }: AssertionOptions): void {
    assert.fileContent(".husky/commit-msg", `${pkg} commitlint --edit $1`);
    assert.fileContent(".husky/pre-commit", `${pkg} lint-staged`);
}

export function assertContributing(
    file: string,
    { id, pkg }: AssertionOptions,
): void {
    assert.fileContent(file, `/${id}/issues/new/choose`);
    assert.fileContent(file, `/${id}.git`);
    assert.fileContent(file, `cd ${id}`);

    if (pkg === undefined) {
        return;
    }

    assert.fileContent(file, `${pkg} install`);
    assert.fileContent(file, `If in doubt, you can use the \`${pkg} commit\``);
    assert.fileContent(file, `Be sure to run \`${pkg} test\``);
    assert.fileContent(file, `Run the \`${pkg} contrib:add\``);
    assert.fileContent(file, `${pkg} contrib:add <username>`);
}
