import crypto from "crypto";
import { DatasetItem, Input } from "../../src/types";
import { runActorWithInput } from "./helper";

// Interface for sanitized dataset items to ensure stable snapshots
interface StableDatasetItem {
    actorId: string;
    categories: string[];
    name: string;
    pictureUrl: string;
    title: string;
    userFullName: string;
    username: string;
}

// Function to sanitize dataset items for snapshot stability
// Removes dynamic parts and sorts for consistent comparisons
function sanitizeItems(items: DatasetItem[]): StableDatasetItem[] {
    const stable = items
        .map((it) => ({
            actorId: it.actorId,
            categories: it.categories,
            name: it.name,
            pictureUrl: it.pictureUrl.slice(0, 20), // Truncate to first few chars
            title: it.title,
            userFullName: it.userFullName,
            username: it.username,
        }))
        .sort((a, b) => a.actorId.localeCompare(b.actorId));

    return stable;
}

const testCases: { description: string; input: Input }[] = [
    {
        description: "Actor ID provided, one result",
        input: {
            actorId: "N8vqwV9wL9wpIsLDz",
        },
    },
    {
        description: "Actor ID, query and username provided, one result",
        input: {
            actorId: "N8vqwV9wL9wpIsLDz",
            query: "google ads",
            username: "silva95gustavo",
        },
    },
    {
        description: "Query with zero matches",
        input: {
            query: crypto.randomBytes(32).toString("hex"),
        },
    },
];

// Test suite for snapshot testing the actor with different inputs
describe("Actor snapshots", () => {
    testCases.forEach((testCase) =>
        test(
            testCase.description,
            async () => {
                // Run the actor and get results
                const { datasetItems } = await runActorWithInput(
                    testCase.input
                );
                const stable = sanitizeItems(datasetItems);

                // Assert that the sanitized output matches the snapshot
                expect(stable).toMatchSnapshot();
            },
            5 * 60 * 1000 // 5 minute timeout
        )
    );
});
