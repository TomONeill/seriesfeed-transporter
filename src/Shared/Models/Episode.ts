/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Models {
    export class Episode {
        public id: number;
        public tag: string;
        public acquired: boolean;
        public seen: boolean;
    }
}