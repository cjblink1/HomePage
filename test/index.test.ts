import { Main } from "../src/index";


describe("Initial test", () => {
    it("should be awesome", () => {
        expect(true).toBe(true);
    });

    it("should say hello", () => {
        var main = new Main();
        expect(main.sayHello()).toBe("Hello");
    });
});