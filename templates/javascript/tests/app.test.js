import { describe, it, expect } from "vitest";
import { helloWorld } from "../src/app.js";

describe("app", () => {
    it("should return 'Hello, World!'", () => {
        expect(helloWorld()).toBe("Hello, World!");
    });

    it("should always pass", () => {
        expect(true).toBe(true);
    });
});
