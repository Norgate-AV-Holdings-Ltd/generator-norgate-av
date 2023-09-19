const path = require("path");
// const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-norgate-av:app", () => {
    beforeAll(() => {
        return helpers
            .run(path.join(__dirname, "../generators/app"))
            .withPrompts({ someAnswer: true });
    });

    it("creates files", () => {
        expect(1).toEqual(1);
    });
});
