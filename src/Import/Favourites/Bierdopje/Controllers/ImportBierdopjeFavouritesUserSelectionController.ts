/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedTransporter.Controllers {
    export class ImportBierdopjeFavouritesUserSelectionController {
        private _user: ViewModels.User;
        private _customUser: ViewModels.User;

        constructor() {
            this.initialiseCard();
            this.initialiseCurrentUser();
            this.initialiseCustomUser();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Bierdopje favorieten importeren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportFavourites);
            const breadcrumbs = [
                new Models.Breadcrumb("Favorieten importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Bierdopje", Enums.ShortUrl.ImportFavourites),
                new Models.Breadcrumb("Gebruiker", Enums.ShortUrl.ImportFavouritesBierdopje)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth('700px');
        }

        private initialiseCurrentUser(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this._user = new ViewModels.User();
            this._user.setTopText("Huidige gebruiker");
            this._user.setWidth('49%');
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
            Services.BierdopjeService.getUsername()
                .then((username) => {
                    if (username == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    } else {
                        this._user.onClick = () => Services.RouterService.navigate(Enums.ShortUrl.ImportFavouritesBierdopje + username);
                        this._user.setUsername(username);
                        Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => this._user.setAvatarUrl(avatarUrl));
                    }
                });
        }

        private initialiseCustomUser(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this._customUser = new ViewModels.User();
            this._customUser.setTopText("Andere gebruiker");
            this._customUser.setWidth('49%');
            this._customUser.instance.css({ marginLeft: '1%' });
            cardContent.append(this._customUser.instance);

            const userInputWrapper = this.getUserSearchBox();
            this._customUser.replaceUsername(userInputWrapper);
        }

        private getUserSearchBox(): JQuery<HTMLElement> {
            const userInputWrapper = $('<div/>').css({ textAlign: 'center' });
            userInputWrapper.click((event: any) => event.stopPropagation());
            const userInput = Providers.TextInputProvider.provide('85%', "Gebruikersnaam");
            userInput.css({ margin: '0 auto', display: 'inline-block' });
            userInput.on('keyup', (event: any) => {
                const key = event.keyCode || event.which;
                if (key === 12 || key === 13) {
                    searchButton.instance.click();
                }
            })
            const searchButtonAction = (event: MouseEvent) => {
                notFoundMessage.hide();
                this.searchUser(userInput.val().toString().trim())
                    .then((hasResult) => {
                        if (!hasResult) {
                            notFoundMessage.show();
                        }
                    });
            };
            const searchButton = new ViewModels.Button(Enums.ButtonType.Success, "fa-search", null, searchButtonAction, "15%");
            searchButton.instance.style.marginTop = "0";
            searchButton.instance.style.borderRadius = "0px 5px 5px 0px";
            searchButton.instance.style.padding = "10px 14px";
            searchButton.instance.style.fontSize = "14px";
            const notFoundMessage = $('<div/>').css({
                display: 'none',
                textAlign: 'left',
                color: '#9f9f9f'
            }).html("Gebruiker niet gevonden.");

            userInputWrapper.append(userInput);
            userInputWrapper.append(searchButton.instance);
            userInputWrapper.append(notFoundMessage);

            return userInputWrapper;
        }

        private searchUser(username: string): Promise<boolean> {
            return Services.BierdopjeService.isExistingUser(username)
                .then((isExistingUser) => {
                    if (!isExistingUser) {
                        this._customUser.onClick = null;
                        this._customUser.setAvatarUrl();
                    } else {
                        this._customUser.onClick = () => Services.RouterService.navigate(Enums.ShortUrl.ImportFavouritesBierdopje + username);
                        this._customUser.setUsername(username);
                        Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => {
                                if (avatarUrl == null || avatarUrl == "") {
                                    this._customUser.setAvatarUrl("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAUCAYAAACnOeyiAAAAD0lEQVQYV2NkgALGocMAAAgWABX8twh4AAAAAElFTkSuQmCC");
                                    return;
                                }
                                this._customUser.setAvatarUrl(avatarUrl);
                            });
                    }
                    return isExistingUser;
                });
        }
    }
}