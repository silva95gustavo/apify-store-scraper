export type DatasetItem = {
    actorId: string;
    categories: string[];
    description: string;
    name: string;
    pictureUrl: string;
    stats: Record<string, unknown>;
    title: string;
    userFullName: string;
    username: string;
};

export type Input = {
    actorId?: string | null;
    query?: string | null;
    username?: string | null;
};
