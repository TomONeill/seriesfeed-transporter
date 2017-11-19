/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Models {
    export class Season {
        public id: number;
        public slug: string;
        public episodes: Models.Episode[];
    }
}