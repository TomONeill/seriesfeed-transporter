/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.ViewModels {
    export class User {
        public instance: JQuery<HTMLElement>;
        private topText: JQuery<HTMLElement>;
        private username: JQuery<HTMLElement>;
        private avatar: JQuery<HTMLElement>;
        private unknownUserAvatarBase64 = "data:image/jpeg;base64,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";

        constructor() {
            this.instance = $('<div/>').addClass("portfolio mix_all");
            const wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle").css({ cursor: 'inherit' });
            this.topText = $('<h4/>').css({ padding: '15px 0 0 15px' });
            const hover = $('<div/>').addClass("portfolio-hover").css({ padding: '15px 15px 5px 15px', height: '170px' });
            this.avatar = $('<img/>').addClass("user-img").css({ maxHeight: '150px' }).attr('src', this.unknownUserAvatarBase64);
            this.username = $('<h3/>').addClass("user-name");
            const info = $('<div/>').addClass("portfolio-info").css({ height: '90px' });
            const title = $('<div/>').addClass("portfolio-title");

            this.instance
                .css({
                    position: 'relative',
                    display: 'inline-block',
                    width: '100%',
                    transition: 'all .24s ease-in-out'
                });

            hover
                .css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                });


            this.instance.append(wrapper);
            wrapper.append(this.topText);
            wrapper.append(hover);
            hover.append(this.avatar);
            wrapper.append(info);
            info.append(title);
            title.append(this.username);
        }

        public setTopText(text: string): void {
            this.topText.text(text);
        }

        public setUsername(username: string): void {
            this.username.text(username);
        }

        public replaceUsername(element: JQuery<HTMLElement>): void {
            this.username.replaceWith(element);
        }

        public setAvatarUrl(avatarUrl?: string): void {
            if (avatarUrl == null || avatarUrl === "") {
                this.avatar.attr('src', this.unknownUserAvatarUrl);
            }

            this.avatar.attr('src', avatarUrl);
        }

        public setWidth(width: string): void {
            this.instance.css({
                width: width != null ? width : 'auto'
            });
        }

        public set onClick(action: () => void) {
            this.instance.css({ cursor: 'default' }).unbind('mouseenter mouseleave click');

            if (action == null) {
                return;
            }

            this.instance
                .css({ cursor: 'pointer' })
                .hover(
                () => this.instance.css({
                    webkitBoxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)',
                    boxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)'
                }),
                () => this.instance.css({
                    webkitBoxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)'
                })
                )
                .click(action);
        }
    }
}