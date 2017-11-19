/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Models {
    export class Show {
        public seriesfeedId: number;
        public theTvdbId: string;
        public imdbType: string;
        public name: string;
        public slug: string;
        public seasons: Array<Models.Season>;
    }
}