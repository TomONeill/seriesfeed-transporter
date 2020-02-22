/// <reference path="../typings/index.d.ts" />

module SeriesfeedTransporter.Controllers {
    export class SettingsController {
        public initialise() {
            if (!window.location.href.includes("users") || !window.location.href.includes("edit")) {
                return;
            }

            const settingBlocks = document.querySelector(".container.content .row");
            const localStorageBlock = this.getLocalStorageBlock();
            settingBlocks.append(localStorageBlock);

            // TODO: Sync Bierdopje to Seriesfeed here?
        }

        private getLocalStorageBlock(): HTMLDivElement {
            const localStorageBlockHtml = `
            <div class="col-xs-12 col-md-6">
                <div id="userscriptTool" class="blog-left cardStyle cardForm">
                    <div class="blog-content">
                        <h3>Userscript Seriesfeed Transporter</h3>
                        <p>Dit script slaat gegevens van series en afleveringen op om de druk op de gerelateerde servers te verlagen. Deze data wordt gebruikt om (bij terugkerende acties) bekende data niet opnieuw te hoeven ophalen. Je kunt de lokale gegevens wissen als je problemen ondervindt met importeren/exporteren.</p>
                        <fieldset class="fieldset-save">
                            <input type="button" class="btn btn-success delete btn-right" value="Lokale gegevens wissen" sft-handle="btn-delete" />
                        </fieldset>
                        <span sft-handle="msg-deleted" hidden="true" style="margin-bottom: 0px; padding-top: 5px;">De gegevens zijn gewist.</span>
                    </div>
                </div>
            </div>
            `;
            const localStorageBlock = Services.ElementService.createElement<HTMLDivElement>(localStorageBlockHtml);
            const deleteButton = localStorageBlock.querySelector<HTMLInputElement>("[sft-handle=btn-delete]");
            const deletedMessage = localStorageBlock.querySelector<HTMLSpanElement>("[sft-handle=msg-deleted]");
            deleteButton.onclick = () => {
                deletedMessage.hidden = true;
                Services.StorageService.clearAll();
                setTimeout(() => deletedMessage.hidden = false, 100);
            };

            return localStorageBlock;
        }
    }
}