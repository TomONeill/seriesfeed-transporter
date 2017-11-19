/// <reference path="./typings/index.d.ts" />

module SeriesfeedTransporter {
    class App {
        public static main(): void {
            $(() => this.initialise());
        }

        private static initialise(): void {
            Services.StyleService.loadGlobalStyle();

            new Controllers.NavigationController()
                .initialise();

            new Controllers.RoutingController()
                .initialise();

            new Controllers.SettingsController()
                .initialise();
        }
    }

    App.main();
}