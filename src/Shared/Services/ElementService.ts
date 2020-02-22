/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Services {
    export class ElementService {
        public static createElement<T extends Element>(html: string): T {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = html;
            return <T>wrapper.firstElementChild;
        }
    }
}