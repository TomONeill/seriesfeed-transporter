/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedTransporter.Services {
    export class ImdbImportService {
        public static getUser(): Promise<Models.ImdbUser> {
            return Services.AjaxService.get(Config.ImdbBaseUrl + "/helpdesk/contact")
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    const id = data.find('#navUserMenu p a').attr('href').split('/')[4];
                    const username = data.find('#navUserMenu p a').html().trim();

                    return new Models.ImdbUser(id, username);
                })
                .catch((error) => {
                    throw `Could not get user from ${Config.ImdbBaseUrl}. ${error}`;
                });
        }

        public static getAvatarUrlByUserId(userId: string): Promise<string> {
            return Services.AjaxService.get(Config.ImdbBaseUrl + "/user/" + userId + "/")
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('#avatar').attr('src');
                })
                .catch((error) => {
                    throw `Could not get avatar for user id ${userId} from ${Config.ImdbBaseUrl}. ${error}`;
                });
        }

        public static getListsByUserId(userId: string): Promise<Models.ImdbList[]> {
            return Services.AjaxService.get(Config.ImdbBaseUrl + "/user/" + userId + "/lists")
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    const dataRows = data.find('table.lists tr.row');
                    const imdbLists = new Array<Models.ImdbList>();

                    dataRows.each((index, dataRow) => {
                        const imdbList = new Models.ImdbList();
                        const imdbListUrl = $(dataRow).find('.name a').attr('href');
                        const imdbListUrlParts = imdbListUrl.split('/');

                        imdbList.id = imdbListUrlParts[imdbListUrlParts.length - 2];
                        imdbList.name = $(dataRow).find('.name a').text();
                        imdbList.seriesCount = $(dataRow).find('.name span').text();
                        imdbList.createdOn = $(dataRow).find('.created').text();
                        imdbList.modifiedOn = $(dataRow).find('.modified').text();

                        this.fixListTranslations(imdbList);

                        imdbLists.push(imdbList);
                    });

                    imdbLists.push(this.getWatchlistItem());

                    return imdbLists;
                })
                .catch((error) => {
                    throw `Could not get lists for user id ${userId} from ${Config.ImdbBaseUrl}. ${error}`;
                });
        }

        private static fixListTranslations(imdbList: Models.ImdbList): void {
            imdbList.seriesCount = imdbList.seriesCount
                .replace(" Titles", "")
                .replace('(', "")
                .replace(')', "");

            const createdOnParts = imdbList.createdOn.split(' ');
            const createdOnMonth = Services.TimeAgoTranslatorService.getFullDutchTranslationOfMonthAbbreviation(createdOnParts[1]);
            imdbList.createdOn = imdbList.createdOn.replace(createdOnParts[1], createdOnMonth);

            const modifiedOnParts = imdbList.modifiedOn.split(' ');
            const modifiedOnTime = Services.TimeAgoTranslatorService.getDutchTranslationOfTime(modifiedOnParts[1]);
            imdbList.modifiedOn = imdbList.modifiedOn.replace(modifiedOnParts[1], modifiedOnTime).replace("ago", "geleden");
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
            const url = Config.ImdbBaseUrl + "/list/" + listId + "?view=compact";

            return Services.AjaxService.get(url)
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    const seriesItems = data.find(".list_item:not(:first-child)");

                    const seriesList: any[] = [];

                    seriesItems.each((index, seriesItem) => {
                        var series = {
                            name: $(seriesItem).find(".title a").html(),
                            url: Config.ImdbBaseUrl + $(seriesItem).find(".title a").attr("href"),
                            type: $(seriesItem).find(".title_type").html()
                        };

                        if (series.type !== "Feature") {
                            seriesList.push(series);
                        }
                    });

                    return seriesList.sort((a, b) => b.name.localeCompare(a.name));
                })
                .catch((error) => {
                    throw `Could not get series for list id ${listId} from ${Config.ImdbBaseUrl}. ${error}`;
                });
        }

        public static getSeriesByListIdAndUserId(listId: string, userId: string): Promise<Models.Show[]> {
            const url = Config.ImdbBaseUrl + "/list/export?list_id=" + listId + "&author_id=" + userId;

            return Services.AjaxService.get(url)
                .then((result) => {
                    const csv = result.responseText;
                    const entries = csv.split('\n') as Array<string>;

                    const entryKeys = entries[0].split('","');
                    const imdbSlugIndex = entryKeys.indexOf("const");
                    const titleIndex = entryKeys.indexOf("Title");
                    const titleTypeIndex = entryKeys.indexOf("Title type");

                    const shows = new Array<Models.Show>();

                    entries.forEach((entry, index) => {
                        if (index === 0) {
                            return;
                        }

                        const entryValues = entry.split('","');
                        const titleType = entryValues[titleTypeIndex];

                        if (titleType == null) {
                            return;
                        }

                        if (titleType !== "Feature Film" && titleType !== "TV Movie") {
                            const show = new Models.Show();
                            show.imdbType = titleType;
                            show.slug = entryValues[imdbSlugIndex];
                            show.name = entryValues[titleIndex];
                            shows.push(show);
                        }
                    });

                    return Services.ShowSorterService.sort(shows, "name");
                })
                .catch((error) => {
                    throw `Could not get list id ${listId} for user ${userId} from ${Config.ImdbBaseUrl}. ${error}`;
                });
        }
    }
}