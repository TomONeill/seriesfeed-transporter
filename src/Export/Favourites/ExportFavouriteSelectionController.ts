/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Controllers {
    export class ExportFavouritesController {
        private _selectedShows: Array<Models.SeriesfeedShowExportModel>;
        private _checkboxes: Array<ViewModels.Checkbox>;
        private _nextButton: ViewModels.ReadMoreButton;

        constructor() {
            this._selectedShows = [];
            this._checkboxes = [];

            this.initialiseCard();
            this.initialiseNextButton();
            this.initialise();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Bierdopje favorieten selecteren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportFavouritesBierdopje);
            const breadcrumbs = [
                new Models.Breadcrumb("Type export", Enums.ShortUrl.Export),
                new Models.Breadcrumb("Favorietenselectie", Enums.ShortUrl.ExportFavourites)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth();
            card.setContent();
        }

        private initialiseNextButton(): void {
            this._nextButton = new ViewModels.ReadMoreButton("Exporteren", () => new ExportDetailsController(this._selectedShows));
            this._nextButton.instance.hide();
        }

        private initialise(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            const table = new ViewModels.Table();
            const checkboxAll = new ViewModels.Checkbox('select-all');
            checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
            const selectAllColumn = $('<th/>').append(checkboxAll.instance);
            const seriesColumn = $('<th/>').text('Serie');
            table.addTheadItems([selectAllColumn, seriesColumn]);

            const loadingData = $('<div/>');
            const loadingFavourites = $('<h4/>').css({ padding: '15px' });
            const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Favorieten ophalen...");
            const starIcon = $('<i/>').addClass('fa fa-star-o fa-spin');
            loadingData.append(loadingFavourites);
            loadingFavourites
                .append(starIcon)
                .append(loadingText);
            cardContent
                .append(loadingData)
                .append(this._nextButton.instance);

            Services.SeriesfeedExportService.getCurrentUsername()
                .then((username) => {
                    Services.SeriesfeedExportService.getFavouritesByUsername(username)
                        .then((favourites) => {
                            favourites.forEach((show, index) => {
                                const row = $('<tr/>');
                                const selectColumn = $('<td/>');
                                const showColumn = $('<td/>');

                                const checkbox = new ViewModels.Checkbox(`show_${index}`);
                                checkbox.subscribe((isEnabled) => {
                                    if (isEnabled) {
                                        this._selectedShows.push(show);
                                    } else {
                                        const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                                        this._selectedShows.splice(position, 1);
                                    }

                                    this.setNextButton();
                                });

                                selectColumn.append(checkbox.instance);
                                this._checkboxes.push(checkbox);

                                const showLink = $('<a/>').attr('href', show.url).attr('target', '_blank').text(show.name);
                                showColumn.append(showLink);

                                row.append(selectColumn);
                                row.append(showColumn);

                                table.addRow(row);
                            });
                            loadingData.replaceWith(table.instance);
                        });
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

        private setNextButton(): void {
            if (this._selectedShows.length === 1) {
                this._nextButton.text = `${this._selectedShows.length} serie exporteren`;
                this._nextButton.instance.show();
            } else if (this._selectedShows.length > 1) {
                this._nextButton.text = `${this._selectedShows.length} series exporteren`;
                this._nextButton.instance.show();
            } else {
                this._nextButton.instance.hide();
            }
        }
    }
}