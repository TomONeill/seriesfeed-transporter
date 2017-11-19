/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Models {
    export class Breadcrumb {
        public shortUrl: Enums.ShortUrl;
        public text: string;

        constructor(text: string, shortUrl: Enums.ShortUrl) {
            this.text = text;
            this.shortUrl = shortUrl;
        }
    }
}