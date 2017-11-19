/// <reference path="../typings/index.d.ts" />

module SeriesfeedTransporter.Controllers {
    export class SettingsController {
        public initialise() {
            if (!window.location.href.includes("users") || !window.location.href.includes("edit")) {
                return;
            }

            const settingBlocks = $('.container.content .row');

            const localStorageBlock = this.getLocalStorageBlock();

            settingBlocks.append(localStorageBlock);

            // TODO: Sync Bierdopje to Seriesfeed here?
        }

        private getLocalStorageBlock(): JQuery<HTMLElement> {
            const block = $('<div/>').addClass('col-xs-12 col-md-6');
            const card = $('<div/>').attr('id', 'userscriptTool').addClass('blog-left cardStyle cardForm');
            const cardContent = $('<div/>').addClass('blog-content');
            const cardTitle = $('<h3/>').text("Userscript Seriesfeed Transporter");
            const cardParagraph = $('<p/>').text("Dit script slaat gegevens van series en afleveringen op om de druk op de gerelateerde servers te verlagen. Deze data wordt gebruikt om (bij terugkerende acties) bekende data niet opnieuw te hoeven ophalen. Je kunt de lokale gegevens wissen als je problemen ondervindt met importeren/exporteren.");
            const dataDeleted = $('<p/>').text("De gegevens zijn gewist.").css({ marginBottom: '0', paddingTop: '5px' }).hide();
            const buttonAction = () => {
                dataDeleted.hide();
                Services.StorageService.clearAll();
                setTimeout(() => dataDeleted.show(), 100);
            };
            const button = new ViewModels.Button('btn-success', 'fa-trash', "Lokale gegevens wissen", buttonAction);

            block.append(card);
            card.append(cardContent);
            cardContent.append(cardTitle);
            cardContent.append(cardParagraph);
            cardContent.append(button.instance);
            cardContent.append(dataDeleted);

            return block;
        }
    }
}