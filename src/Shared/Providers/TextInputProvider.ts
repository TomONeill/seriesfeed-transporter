/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Providers {
    export class TextInputProvider {
        public static provide(width: string, placeholder?: string, value?: string): JQuery<HTMLElement> {
            return $('<input/>')
                .attr('type', 'text')
                .attr('placeholder', placeholder)
                .attr('value', value)
                .addClass('form-control')
                .css({ maxWidth: width });
        }
    }
}