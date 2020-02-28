/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedTransporter.Controllers {
    export class ImdbListSelectionControllerController {
        private _user: Models.ImdbUser;
        private _selectedLists: Array<Models.ImdbList>;
        private _checkboxes: Array<ViewModels.Checkbox>;
        private _nextButton: ViewModels.ReadMoreButton;
        private _collectingData: ViewModels.ReadMoreButton;
        private _currentCalls: number;

        constructor(user: Models.ImdbUser) {
            this._user = user;
            this._checkboxes = [];
            this._selectedLists = [];
            this._currentCalls = 0;

            this.initialiseNextButton();
            this.initialiseCollectingData();
            this.initialiseCard();
            this.initialise();
        }

        private initialiseNextButton(): void {
            this._nextButton = new ViewModels.ReadMoreButton("Importeren", () => new Controllers.ImdbFavouriteSelectionController(this._user, this._selectedLists));
            this._nextButton.instance.hide();
        }

        private initialiseCollectingData(): void {
            this._collectingData = new ViewModels.ReadMoreButton("Gegevens verzamelen...");
            this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' })
            this._collectingData.instance.hide();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("IMDb lijsten selecteren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportFavouritesImdb);
            const breadcrumbs = [
                new Models.Breadcrumb("Favorieten importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("IMDb", Enums.ShortUrl.ImportFavourites),
                new Models.Breadcrumb(this._user.username, Enums.ShortUrl.ImportFavouritesImdb),
                new Models.Breadcrumb("Importeren", Enums.ShortUrl.ImportFavouritesImdb + this._user.username)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth('650px');
            card.setContent();
        }

        private initialise(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            const table = new ViewModels.Table();
            const checkboxAll = new ViewModels.Checkbox('select-all');
            checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
            const selectAllColumn = $('<th/>').append(checkboxAll.instance);
            const listHeaderColumn = $('<th/>').text('Lijst');
            const seriesCountHeaderColumn = $('<th/>').text('Aantal items');
            const createdOnHeaderColumn = $('<th/>').text('Aangemaakt op');
            const modifiedOnHeaderColumn = $('<th/>').text('Laatst bewerkt');
            table.addTheadItems([selectAllColumn, listHeaderColumn, seriesCountHeaderColumn, createdOnHeaderColumn, modifiedOnHeaderColumn]);

            const loadingData = $('<div/>');
            const loadingFavourites = $('<h4/>').css({ padding: '15px' });
            const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Lijsten ophalen...");
            const starIcon = $('<i/>').addClass('fa fa-list-ul fa-flip-x');
            loadingData.append(loadingFavourites);
            loadingFavourites
                .append(starIcon)
                .append(loadingText);
            cardContent
                .append(loadingData)
                .append(this._collectingData.instance)
                .append(this._nextButton.instance);

            Services.ImdbImportService.getLists()
                .then((imdbLists) => {
                    imdbLists.forEach((imdbList, index) => {
                        const checkbox = new ViewModels.Checkbox(`list_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this._currentCalls++;
                                this.setCollectingData();
                                Services.ImdbImportService.getSeriesByListId(imdbList.id)
                                    .then((shows) => {
                                        imdbList.shows = shows;
                                        this._currentCalls--;
                                        this.setCollectingData();
                                    })
                                    .catch(() => {
                                        checkbox.uncheck();
                                        
                                        this._currentCalls--;
                                        this.setCollectingData();
                                    });
                                this._selectedLists.push(imdbList);
                            } else {
                                const position = this._selectedLists.map((list) => list.name).indexOf(imdbList.name);
                                this._selectedLists.splice(position, 1);
                            }

                            this.setNextButton();
                        });

                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', Config.ImdbBaseUrl + "/list/" + imdbList.id).attr('target', '_blank').text(imdbList.name);

                        const row = $('<tr/>');
                        const selectColumn = $('<td/>').append(checkbox.instance);
                        const listColumn = $('<td/>').append(showLink);
                        const seriesCountColumn = $('<td/>').text(imdbList.seriesCount);
                        const createdOnColumn = $('<td/>').text(imdbList.createdOn);
                        const modifiedOnColumn = $('<td/>').text(imdbList.modifiedOn);

                        row.append(selectColumn);
                        row.append(listColumn);
                        row.append(seriesCountColumn);
                        row.append(createdOnColumn);
                        row.append(modifiedOnColumn);

                        table.addRow(row);
                    });
                    loadingData.replaceWith(table.instance);
                });
        }

        private toggleAllCheckboxes(isEnabled: boolean): void {
            this._checkboxes.forEach((checkbox) => {
                if (isEnabled) {
                    checkbox.check();
                } else {
                    checkbox.uncheck();
                }
            });
        }

        private setCollectingData(): void {
            if (this._currentCalls === 1) {
                this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} lijst)...`;
                this._collectingData.instance.show();
                return;
            } else if (this._currentCalls > 1) {
                this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} lijsten)...`;
                this._collectingData.instance.show();
            } else {
                this._collectingData.instance.hide();
                this.setNextButton();
            }
        }

        private setNextButton(): void {
            if (this._currentCalls > 0) {
                this._nextButton.instance.hide();
                return;
            }

            if (this._selectedLists.length === 1) {
                this._nextButton.text = `${this._selectedLists.length} lijst selecteren`;
                this._nextButton.instance.show();
            } else if (this._selectedLists.length > 1) {
                this._nextButton.text = `${this._selectedLists.length} lijsten selecteren`;
                this._nextButton.instance.show();
            } else {
                this._nextButton.instance.hide();
            }
        }
    }
}