/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Enums {
    export type SeriesfeedError = string;
    export const SeriesfeedError = {
        Unknown: "Unknown" as SeriesfeedError,
        NotFound: "Geen serie gevonden voor de gegeven data" as SeriesfeedError,
        CouldNotUpdateStatus: "Kon favorietenstatus niet bijwerken!" as SeriesfeedError
    };
}