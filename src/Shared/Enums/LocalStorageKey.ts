/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Enums {
    export type LocalStorageKey = string;
    export const LocalStorageKey = {
        BierdopjeShows: "bierdopje.shows" as LocalStorageKey,
        SeriesfeedShows: "seriesfeed.shows" as LocalStorageKey,
        SeriesfeedEpisodes: "seriesfeed.episodes" as LocalStorageKey
    };
}