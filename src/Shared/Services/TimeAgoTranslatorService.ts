/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Services {
    export class TimeAgoTranslatorService {
        public static getDutchTranslationOfMonth(month: string): string {
            switch (month) {
                case "January":
                    return "januari";
                case "February":
                    return "februari";
                case "March":
                    return "maart";
                case "April":
                    return "april";
                case "May":
                    return "mei";
                case "June":
                    return "juni";
                case "July":
                    return "juli";
                case "August":
                    return "augustus";
                case "September":
                    return "september";
                case "October":
                    return "oktober";
                case "November":
                    return "november";
                case "December":
                    return "december";
            }
        }
    }
}