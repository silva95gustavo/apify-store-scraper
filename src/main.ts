import { HttpCrawler, HttpCrawlingContext } from "@crawlee/http";
import { Actor } from "apify";
import { searchClient } from "@algolia/client-search";
import { DatasetItem } from "./types";
import { buildFilters } from "./filters";

interface Input {
    actorId?: string | null;
    limit?: number | null;
    query?: string | null;
    username?: string | null;
}

await Actor.init();

const input = (await Actor.getInput<Input>()) ?? ({} as Input);

const proxyConfiguration = await Actor.createProxyConfiguration({
    checkAccess: true,
});

const client = searchClient(
    process.env.ALGOLIA_APP_ID || "",
    process.env.ALGOLIA_API_KEY || ""
);

const crawler = new HttpCrawler({
    proxyConfiguration,
    requestHandler: async ({ pushData }: HttpCrawlingContext) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await client.searchSingleIndex<any>({
            indexName: "prod_PUBLIC_STORE",
            searchParams: {
                query: input.query || undefined,
                filters: buildFilters(input),
                hitsPerPage: Math.min(input.limit ?? 100, 100),
                page: 0,
            },
        });
        const datasetItems: DatasetItem[] = response.hits.map((hit) => ({
            actorId: hit.objectID,
            categories: hit.categories,
            description: hit.description,
            name: hit.name,
            pictureUrl: hit.pictureUrl,
            stats: hit.stats,
            title: hit.title,
            userFullName: hit.userFullName,
            username: hit.username,
        }));
        await pushData(datasetItems);
    },
});

await crawler.run([
    {
        url: "https://ow0o5i3qo7-dsn.algolia.net/1/indexes/prod_PUBLIC_STORE/query",
        useExtendedUniqueKey: true,
        skipNavigation: true,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Algolia-API-Key": "0ecccd09f50396a4dbbe5dbfb17f4525",
            "X-Algolia-Application-Id": "OW0O5I3QO7",
        },
        payload: JSON.stringify({
            query: input.query || undefined,
            length: 10,
            offset: 0,
            filters: buildFilters(input),
            restrictSearchableAttributes: [],
            attributesToHighlight: [],
            attributesToRetrieve: [
                "objectId",
                "title",
                "name",
                "username",
                "userFullName",
                "stats",
                "description",
                "pictureUrl",
                "categories",
                "actorReviewRating",
                "actorReviewCount",
                "bookmarkCount",
            ],
        }),
    },
]);

await Actor.exit();
