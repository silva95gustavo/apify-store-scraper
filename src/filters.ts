import { Input } from "./types";

export function buildFilters(
    input: Pick<Input, "actorId" | "username">
): string | undefined {
    const filters: string[] = [];

    if (input.actorId) {
        filters.push(`objectID:${JSON.stringify(input.actorId)}`);
    }

    if (input.username) {
        filters.push(`username:${JSON.stringify(input.username)}`);
    }

    if (filters.length === 0) {
        return undefined;
    }

    return filters.join(" AND ");
}
