/// <reference path="../typings/index.d.ts" />

module SeriesfeedTransporter.Config {
    export const BaseUrl = "https://www.seriesfeed.com";
    export const BierdopjeBaseUrl = "http://www.bierdopje.com";
    export const ImdbBaseUrl = "https://www.imdb.com";
    export const TheTvdbBaseUrl = "https://www.thetvdb.com";
    export const Id = {
        MainContent: "mainContent",
        CardContent: "cardContent"
    };
    export const MaxAsyncCalls = 10;
    export const CooldownInMs = 100;
}