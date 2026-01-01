import { runActorWithInput } from "./helper";

describe("Integration tests", () => {
    test(
        "Limit respected in results",
        async () => {
            const { datasetItems } = await runActorWithInput({
                query: "google ads",
                limit: 4,
            });

            expect(datasetItems.length).toBe(4);
        },
        60 * 1000
    );

    test(
        "Query text is respected",
        async () => {
            const { datasetItems } = await runActorWithInput({
                query: "linkedin ads",
                limit: 1,
            });

            // Check that the title contains "linkedin" (case insensitive).
            // We don't assert exact match to allow for variations in titles and changes to ranking of results.
            expect(datasetItems[0].title.toLowerCase()).toContain("linkedin");
        },
        60 * 1000
    );
});
