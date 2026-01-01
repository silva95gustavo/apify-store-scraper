import { buildFilters } from "../src/filters";

describe("buildFilters", () => {
    test("returns undefined when no filters are provided", () => {
        const result = buildFilters({});
        expect(result).toBeUndefined();
    });

    test("builds filter for actorId only", () => {
        const result = buildFilters({ actorId: "N8vqwV9wL9wpIsLDz" });
        expect(result).toBe('objectID:"N8vqwV9wL9wpIsLDz"');
    });

    test("builds combined filter for both actorId and username", () => {
        const result = buildFilters({
            actorId: "N8vqwV9wL9wpIsLDz",
            username: "silva95gustavo",
        });
        expect(result).toBe(
            'objectID:"N8vqwV9wL9wpIsLDz" AND username:"silva95gustavo"'
        );
    });

    test("handles special characters", () => {
        const result = buildFilters({ username: 'user"name' });
        expect(result).toBe('username:"user\\"name"');
    });
});
