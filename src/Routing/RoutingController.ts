/// <reference path="../typings/index.d.ts" />

module SeriesfeedTransporter.Controllers {
    export class RoutingController {
        public initialise(): void {
            this.initialVisitRouting();
            this.respondToBrowserNavigationChanges();
        }

        private initialVisitRouting(): void {
            if (window.location.href.startsWith(Config.BaseUrl + Enums.ShortUrl.Import)
                || window.location.href.startsWith(Config.BaseUrl + Enums.ShortUrl.Export)) {
                const url = window.location.href.replace(Config.BaseUrl, "") as Enums.ShortUrl;
                this.initialiseInitialVisit(url);
                Services.RouterService.navigate(url);
            }
        }

        private initialiseInitialVisit(url: Enums.ShortUrl): void {
            window.history.replaceState({ "shortUrl": url }, "", url);
            const mainContent = this.fixPageLayoutAndGetMainContent();
            const card = Services.CardService.initialise();
            mainContent.append(card.instance[0]);
        }

        private fixPageLayoutAndGetMainContent(): HTMLElement {
            const contentContainers = document.querySelectorAll(".contentWrapper .container");
            const lastContainer = contentContainers[contentContainers.length - 1];
            lastContainer.classList.remove("container");
            lastContainer.classList.add("wrapper", "bg");
            lastContainer.innerHTML = "";
            const container = document.createElement("div");
            container.id = Config.Id.MainContent;
            container.classList.add("container");
            lastContainer.append(container);
            return container;
        }

        private respondToBrowserNavigationChanges(): void {
            window.onpopstate = (event: PopStateEvent) => {
                if (event.state == null) {
                    return;
                }

                Services.RouterService.navigate(event.state.shortUrl);
            }
        }
    }
}