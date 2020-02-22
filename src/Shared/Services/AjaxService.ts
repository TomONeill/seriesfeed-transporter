/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Services {
    class QueueMessage {
        private readonly _request: Promise<any>;
        private _result: any;

        constructor(request: Promise<any>) {
            this._request = request;
        }

        public get request() { return this._request; }
        public get result() { return this._result; }
        public set result(result: any) { this._result = result; }
    }

    export class AjaxService {
        private static _currentCalls = 0;
        private static _queuedMessages = new Array<QueueMessage>();
        private static _queueHandler = null as any;

        public static get(url: string): Promise<any> {
            const request = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: (pageData) => {
                        resolve(pageData);
                    },
                    onerror: (error) => {
                        reject(error);
                    }
                });
            });

            return this.queue(request);
        }

        private static queue(request: Promise<any>): Promise<any> {
            console.log(`queuing a new message (currently in queue: ${this._queuedMessages.length})`);

            const message = new QueueMessage(request);
            this._queuedMessages.push(message);
            if (this._queueHandler == null) {
                console.info("started the queue handler.");
                this.queueHandler();
            }

            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    console.info("checking if request has been resolved...");
                    if (message.result != null) {
                        console.info("request has been resolved.");
                        clearInterval(interval);
                        resolve(message.result);
                    }
                }, 100);
            });
        };

        private static queueHandler() {
            this._queueHandler = setInterval(() => {
                if (this._queuedMessages.length === 0) {
                    console.warn("no more messages to handle. stopping the queue handler.");
                    clearInterval(this._queueHandler);
                    this._queueHandler = undefined;
                    return;
                }

                console.log("current messages in queue:", this._currentCalls);

                if (this._currentCalls < Config.MaxAsyncCalls) {
                    this._currentCalls++;
                    console.log("handling a new message");
                    var message = this._queuedMessages.shift();
                    return message.request
                        .then((result) => {
                            console.log("handled message", message.request, "resulting in", result);
                            message.result = result;
                            this._currentCalls--;
                        })
                        .catch(() => {
                            console.error("handling message", message, "caused an error.");
                            this._currentCalls--;
                        });
                }

                console.warn("could not handle any more messages at this time; max concurrent handlers are active");
            }, 100);
        }

        public static post(url: string, data: {}): Promise<any> {
            const request = new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    dataType: "json"
                }).done((data: any) => {
                    resolve(data);
                }).fail((error: any) => {
                    reject(error);
                });
            });

            return this.queue(request);
        }
    }
}