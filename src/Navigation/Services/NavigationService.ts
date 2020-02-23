/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Services {
    export class NavigationService {
        public static add(navigationType: Enums.NavigationType, position: number, text: string, url: string): void {
            const mainMenuItem = document.querySelector<HTMLLIElement>("ul.main-menu .submenu .inner li.top-level:nth-child(" + navigationType + ")");
            const menuItem = ElementService.createElement<HTMLLIElement>("<li><a href='" + url + "'>" + text + "</a></li>");
            mainMenuItem.querySelector(".main-menu-dropdown li:nth-child(" + position + ")")?.before(menuItem);
        }
    }
}