/// <reference path="../../typings/index.d.ts" />

module SeriesfeedTransporter.Services {
    export class ConverterService {
        public static toJson(objects: Array<Object>, filterKeys?: Array<string>): string {
            const filteredArray = this.filter(objects, filterKeys);

            return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredArray));
        }

        private static filter(objects: Array<Object>, filterKeys?: Array<string>): Array<Object> {
            if (filterKeys == null || filterKeys.length === 0) {
                return objects;
            }

            const filteredArray = new Array<Object>();
            
            objects.forEach((object) => {
                const filteredObject = {};
            
                filterKeys.forEach((key) => {
                    Object.getOwnPropertyNames(object).map((property) => {
                        if (key.toLowerCase() === property.toLowerCase()) {
                            (<any>filteredObject)[property] = (<any>object)[property];
                        }
                    });
                });
            
                filteredArray.push(filteredObject);
            });

            return filteredArray;
        }

        public static toXml(objects: Array<Object>, filterKeys?: Array<any>): string {
            const filteredArray = this.filter(objects, filterKeys);

            return "data:text/xml;charset=utf-8," + encodeURIComponent(this.getXml(filteredArray));
        }

        private static getXml(objects: Array<any>): string {
            let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;

            objects.forEach((object, index) => {
                xml += "<show>\n";

                var keys = Object.keys(object);
                keys.map((key) => {
                    xml += `\t<${key}>\n\t\t${object[key]}\n\t</${key}>\n`;
                });

                if (index < objects.length - 1) {
                    xml += "</show>\n";
                } else {
                    xml += "</show>";
                }
            });

            return xml;
        }

        public static toCsv(objects: Array<Object>, filterKeys?: Array<string>): string {
            const filteredArray = this.filter(objects, filterKeys);

            return "data:text/csv;charset=utf-8," + encodeURIComponent(this.getCsv(filteredArray));
        }

        private static getCsv(objects: Array<Object>): string {
            let csv = "";

            csv += this.getXsvKeyString(objects[0], ",");
            csv += this.getXsvValueString(objects, ",");

            return csv;
        }

        public static toTsv(objects: Array<Object>, filterKeys?: Array<string>): string {
            const filteredArray = this.filter(objects, filterKeys);

            return "data:text/tsv;charset=utf-8," + encodeURIComponent(this.getTsv(filteredArray));
        }

        private static getTsv(objects: Array<Object>): string {
            let tsv = "";

            tsv += this.getXsvKeyString(objects[0], "\t");
            tsv += this.getXsvValueString(objects, "\t");

            return tsv;
        }

        private static getXsvKeyString(object: Object, separator: "," | "\t"): string {
            const keys = Object.keys(object);
            let keyString = "";
            let index = 0;
            keys.map((key) => {
                keyString += `"${key}"`;

                if (index < keys.length - 1) {
                    keyString += separator;
                } else {
                    keyString += "\n";
                }

                index++;
            });

            return keyString;
        }

        private static getXsvValueString(objects: Array<any>, separator: "," | "\t"): string {
            let keyString = "";

            objects.forEach((object) => {
                const keys = Object.keys(object);
                let index = 0;
                keys.map((key) => {
                    keyString += `"${object[key]}"`;

                    if (index < keys.length - 1) {
                        keyString += separator;
                    } else {
                        keyString += "\n";
                    }

                    index++;
                });
            });

            return keyString;
        }
    }
}