/// <reference path="../typings/index.d.ts" />

module SeriesfeedTransporter.Controllers {
    export class NavigationController {
        public initialise(): void {
            Services.NavigationService.add(Enums.NavigationType.Series, 6, "Importeren", Enums.ShortUrl.Import);
            Services.NavigationService.add(Enums.NavigationType.Series, 7, "Exporteren", Enums.ShortUrl.Export);
        }
    }
}