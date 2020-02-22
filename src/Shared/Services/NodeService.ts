/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Services {
    export class NodeService {
        public static createNode(html: string) {
            var wrapper = document.createElement("div");
            wrapper.innerHTML = html;
            return wrapper.firstChild;
        }
    }
}