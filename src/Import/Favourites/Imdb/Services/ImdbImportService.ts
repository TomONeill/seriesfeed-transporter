/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedTransporter.Services {
    export class ImdbImportService {
        public static getUser(): Promise<Models.ImdbUser> {
            return Services.AjaxService.get(Config.ImdbBaseUrl + "/profile")
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    const username = data.find('.own-profile h1').text();
                    const avatarUrl = data.find('#avatar').attr('src');

                    return new Models.ImdbUser(username, avatarUrl);
                })
                .catch((error) => {
                    throw `Could not get user from ${Config.ImdbBaseUrl}. ${error}`;
                });
        }

        public static getLists(): Promise<Models.ImdbList[]> {
            return Services.AjaxService.get(Config.ImdbBaseUrl + "/profile/lists")
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    const dataRows = data.find('ul.lists-for-user > li');
                    const imdbLists = new Array<Models.ImdbList>();

                    dataRows.each((index, dataRow) => {
                        const imdbList = new Models.ImdbList();
                        const imdbListUrl = $(dataRow).find('a.list-name').attr('href');
                        const imdbListUrlParts = imdbListUrl.split('/');

                        imdbList.id = imdbListUrlParts[imdbListUrlParts.length - 2];
                        imdbList.name = $(dataRow).find('a.list-name').text();
                        const seriesCountRaw = $(dataRow).find('.list-meta').text();
                        imdbList.seriesCount = /(.*) titles/.exec(seriesCountRaw)[1];
                        const dateMetaData = $(dataRow).find('div:nth-child(5)').text();
                        imdbList.createdOn = /Created (.*)/.exec(dateMetaData)[1];
                        imdbList.modifiedOn = /Modified (.*) \|/.exec(dateMetaData)[1];

                        this.fixListTranslations(imdbList);

                        imdbLists.push(imdbList);
                    });

                    imdbLists.push(this.getWatchlistItem());

                    return imdbLists;
                })
                .catch((error) => {
                    throw `Could not get lists from ${Config.ImdbBaseUrl}. ${error}`;
                });
        }

        private static fixListTranslations(imdbList: Models.ImdbList): void {
            const createdOnParts = imdbList.createdOn.split(' ');
            const createdOnMonth = Services.TimeAgoTranslatorService.getDutchTranslationOfMonth(createdOnParts[1]);
            imdbList.createdOn = imdbList.createdOn.replace(createdOnParts[1], createdOnMonth);

            const modifiedOnParts = imdbList.modifiedOn.split(' ');
            const modifiedOnMonth = Services.TimeAgoTranslatorService.getDutchTranslationOfMonth(modifiedOnParts[1]);
            imdbList.modifiedOn = imdbList.modifiedOn.replace(modifiedOnParts[1], modifiedOnMonth);
        }

        private static getWatchlistItem(): Models.ImdbList {
            const watchlist = new Models.ImdbList();
            watchlist.name = "Watchlist";
            watchlist.id = "watchlist";
            watchlist.seriesCount = "-";
            watchlist.createdOn = "-";
            watchlist.modifiedOn = "-";

            return watchlist;
        }

        public static getSeriesByListId(listId: string): Promise<any[]> {
            const url = Config.ImdbBaseUrl + "/list/" + listId + "/export";

            return Services.AjaxService.get(url)
                .then((response) => {
                    const exportData = Papa.parse(response.responseText, { header: true, skipEmptyLines: true }).data;
                    const shows: Models.ImdbShow[] = [];

                    exportData.forEach((exportItem) => {
                        const show = new Models.ImdbShow();
                        show.name = exportItem["Title"];
                        show.url = exportItem["URL"];
                        show.type = exportItem["Title Type"];

                        if (show.type !== Enums.ImdbTitleType.Feature) {
                            shows.push(show);
                        }
                    });

                    return shows.sort((a, b) => b.name.localeCompare(a.name)).reverse();
                })
                .catch((error) => {
                    throw `Could not get series for list id ${listId} from ${Config.ImdbBaseUrl}. ${error}`;
                });
        }
    }
}