/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedTransporter.Models {
    export class ImdbUser {
        constructor(username: string, avatarUrl: string) {
            this.username = username;
            this.avatarUrl = avatarUrl;
        }

        public username: string;
        public avatarUrl: string;
    }
}