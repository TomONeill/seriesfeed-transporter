/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Controllers {
    export class ExportDetailsController {
        private _selectedShows: Array<Models.SeriesfeedShowExportModel>;
        private _selectedDetails: Array<string>;
        private _checkboxes: Array<ViewModels.Checkbox>;
        private _nextButton: ViewModels.ReadMoreButton;

        constructor(selectedShows: Array<Models.SeriesfeedShowExportModel>) {
            this._selectedShows = selectedShows;
            this._selectedDetails = [];
            this._checkboxes = [];

            window.scrollTo(0, 0);
            document.title = "Details kiezen | Favorieten exporteren | Seriesfeed";
            this.initialiseCard();
            this.initialiseNextButton();
            this.initialise();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Details kiezen");
            card.setBackButtonUrl(Enums.ShortUrl.ImportFavouritesBierdopje);
            const breadcrumbs = [
                new Models.Breadcrumb("Type export", Enums.ShortUrl.Export),
                new Models.Breadcrumb("Favorietenselectie", Enums.ShortUrl.ExportFavourites),
                new Models.Breadcrumb("Serie details", null)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth('700px');
            card.setContent();
        }

        private initialiseNextButton(): void {
            this._nextButton = new ViewModels.ReadMoreButton("Exporteren", () => new ExportFileController(this._selectedShows, this._selectedDetails));
            this._nextButton.instance.hide();
        }

        private initialise(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            const table = new ViewModels.Table();
            const checkboxAll = new ViewModels.Checkbox('select-all');
            checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
            const selectAllColumn = $('<th/>').append(checkboxAll.instance);
            const seriesColumn = $('<th/>').text('Serie detail');
            const exampleColumn = $('<th/>').text('Voorbeeld');
            table.addTheadItems([selectAllColumn, seriesColumn, exampleColumn]);

            let index = 0;
            for (let showDetail in Enums.SeriesfeedShowDetails) {
                const row = $('<tr/>');
                const selectColumn = $('<td/>');
                const showColumn = $('<td/>');
                const exampleColumn = $('<td/>');

                const checkbox = new ViewModels.Checkbox(`exportType_${index}`);
                checkbox.subscribe((isEnabled) => {
                    if (isEnabled) {
                        this._selectedDetails.push(showDetail);
                    } else {
                        const position = this._selectedDetails.indexOf(showDetail);
                        this._selectedDetails.splice(position, 1);
                    }

                    this.setNextButton();
                });

                selectColumn.append(checkbox.instance);
                this._checkboxes.push(checkbox);

                const currentDetail = (<any>Enums.SeriesfeedShowDetails)[showDetail];
                const showLink = $('<span/>').text(currentDetail);
                showColumn.append(showLink);

                const firstShow = this._selectedShows[0];
                const key = Object.keys(firstShow).find((property) => property.toLowerCase() === showDetail.toLowerCase());
                const exampleRowContent = $('<span/>').text((<any>firstShow)[key]);
                exampleColumn.append(exampleRowContent);

                row.append(selectColumn);
                row.append(showColumn);
                row.append(exampleColumn);

                table.addRow(row);
                index++;
            }

            cardContent
                .append(table.instance)
                .append(this._nextButton.instance);
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
            if (this._selectedShows.length === 1 && this._selectedDetails.length === 1) {
                this._nextButton.text = `${this._selectedShows.length} serie met ${this._selectedDetails.length} detail exporteren`;
                this._nextButton.instance.show();
            } else if (this._selectedShows.length > 1 && this._selectedDetails.length === 1) {
                this._nextButton.text = `${this._selectedShows.length} series met ${this._selectedDetails.length} detail exporteren`;
                this._nextButton.instance.show();
            } else if (this._selectedShows.length === 1 && this._selectedDetails.length > 1) {
                this._nextButton.text = `${this._selectedShows.length} serie met ${this._selectedDetails.length} details exporteren`;
                this._nextButton.instance.show();
            } else if (this._selectedShows.length > 1 && this._selectedDetails.length > 1) {
                this._nextButton.text = `${this._selectedShows.length} series met ${this._selectedDetails.length} details exporteren`;
                this._nextButton.instance.show();
            } else {
                this._nextButton.instance.hide();
            }
        }
    }
}