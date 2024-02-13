import {
    describe,
    beforeAll,
    afterAll,
    beforeEach,
    afterEach,
    expect,
    it,
} from "vitest";

describe("app", () => {
    beforeAll(() => {
        console.log("This will run before all tests");
    });

    afterAll(() => {
        console.log("This will run after all tests");
    });

    beforeEach(() => {
        console.log("This will run before each test");
    });

    afterEach(() => {
        console.log("This will run after each test");
    });

    it("should always pass", () => {
        expect(1).toEqual(1);
    });
});
