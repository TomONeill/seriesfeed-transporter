/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedTransporter.Controllers {
    export class ImportImdbFavouritesUserSelectionController {
        private _user: ViewModels.User;

        constructor() {
            this.initialiseCard();
            this.initialiseCurrentUser();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("IMDb favorieten importeren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportFavourites);
            const breadcrumbs = [
                new Models.Breadcrumb("Favorieten importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("IMDb", Enums.ShortUrl.ImportFavourites),
                new Models.Breadcrumb("Gebruiker", Enums.ShortUrl.ImportFavouritesImdb)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth();
        }

        private initialiseCurrentUser(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this._user = new ViewModels.User();
            this._user.setUsername("Laden...");
            this._user.instance.css({ marginRight: '1%' });

            cardContent.append(this._user.instance);

            const refreshButtonAction = (event: MouseEvent) => {
                event.stopPropagation();
                this.loadUser();
            };
            const refreshButton = new ViewModels.Button(Enums.ButtonType.Link, "fa-refresh", null, refreshButtonAction);
            refreshButton.instance.style.position = "absolute";
            refreshButton.instance.style.left = "0";
            refreshButton.instance.style.bottom = "0";
            this._user.instance.append(refreshButton.instance);
            this.loadUser();
        }

        private loadUser(): void {
            Services.ImdbImportService.getUser()
                .then((user) => {
                    if (user == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    } else {
                        this._user.onClick = () => Services.RouterService.navigate(Enums.ShortUrl.ImportFavouritesImdb + user.username);
                        this._user.setUsername(user.username);
                        this._user.setAvatarUrl(user.avatarUrl)
                    }
                })
                .catch(() => {
                    this._user.onClick = null;
                    this._user.setAvatarUrl();
                    this._user.setUsername("Gegevens ophalen mislukt");
                });
        }
    }
}