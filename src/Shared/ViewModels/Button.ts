/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.ViewModels {
    export class Button {
        public instance: HTMLDivElement;
        private icon: HTMLElement;
        private text: HTMLSpanElement;
        private currentIconClass: string;
        private currentButtonType: string;

        constructor(buttonType: Enums.ButtonType, iconClass: string, text?: string, action?: (event: any) => void, width?: string) {
            this.instance = document.createElement("div");
            this.instance.classList.add("btn");
            this.icon = document.createElement("i");
            this.icon.classList.add("fa");
            this.text = document.createElement("span");

            this.setButtonType(buttonType);
            this.setClick(action);
            this.setIcon(iconClass);
            this.setText(text);
            this.setWidth(width);

            this.instance.append(this.icon);
            this.instance.append(this.text);
        }

        public setButtonType(buttonType: Enums.ButtonType): void {
            if (this.currentButtonType != null || this.currentButtonType !== "") {
                this.instance.classList.remove(this.currentButtonType);
                this.currentButtonType = null;
            }
            this.instance.classList.add(buttonType);
            this.currentButtonType = buttonType;
        }

        public setClick(action?: (event: any) => void): void {
            this.instance.removeEventListener("click", action);

            if (action == null) {
                return;
            }

            this.instance.addEventListener("click", action);
        }

        public setIcon(iconClass: string): void {
            if (this.currentIconClass != null || this.currentIconClass !== "") {
                this.icon.classList.remove(this.currentIconClass);
                this.currentIconClass = null;
            }
            this.icon.classList.add(iconClass);
            this.currentIconClass = iconClass;
        }

        public setText(text: string): void {
            if (text == null) {
                this.text.innerText = "";
                return;
            }
            
            this.text.innerText = text;
        }

        public setWidth(width: string): void {
            this.instance.style.width = (width == null) ? "auto" : width;
        }
    }
}