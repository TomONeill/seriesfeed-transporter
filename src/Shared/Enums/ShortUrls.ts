/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Enums {
    export type ShortUrl = string;
    export const ShortUrl = {
        Import: "/series/import/" as ShortUrl,
        ImportFavourites: "/series/import/favourites/" as ShortUrl,
        ImportFavouritesBierdopje: "/series/import/favourites/bierdopje/" as ShortUrl,
        ImportFavouritesImdb: "/series/import/favourites/imdb/" as ShortUrl,
        ImportTimeWasted: "/series/import/timewasted/" as ShortUrl,
        ImportTimeWastedBierdopje: "/series/import/timewasted/bierdopje/" as ShortUrl,
        Export: "/series/export/" as ShortUrl,
        ExportFavourites: "/series/export/favourites/" as ShortUrl
    };
}