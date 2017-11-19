var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    class App {
        static main() {
            $(() => this.initialise());
        }
        static initialise() {
            SeriesfeedTransporter.Services.StyleService.loadGlobalStyle();
            new SeriesfeedTransporter.Controllers.NavigationController()
                .initialise();
            new SeriesfeedTransporter.Controllers.RoutingController()
                .initialise();
            new SeriesfeedTransporter.Controllers.SettingsController()
                .initialise();
        }
    }
    App.main();
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Config;
    (function (Config) {
        Config.BaseUrl = "https://www.seriesfeed.com";
        Config.BierdopjeBaseUrl = "http://www.bierdopje.com";
        Config.ImdbBaseUrl = "http://www.imdb.com";
        Config.TheTvdbBaseUrl = "http://www.thetvdb.com";
        Config.Id = {
            MainContent: "mainContent",
            CardContent: "cardContent"
        };
        Config.MaxAsyncCalls = 10;
        Config.CooldownInMs = 100;
    })(Config = SeriesfeedTransporter.Config || (SeriesfeedTransporter.Config = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ExportController {
            constructor() {
                this.initialise();
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const contentWrapper = $('<div/>');
                const exportIconWrapper = $('<div/>').css({ textAlign: 'center' });
                const exportIcon = $('<i/>').addClass('fa fa-5x fa-cloud-upload').css({ color: '#5a77ad' });
                exportIconWrapper.append(exportIcon);
                contentWrapper.append(exportIconWrapper);
                const text = $('<p/>').append('Wat wil je exporteren?');
                contentWrapper.append(text);
                cardContent.append(contentWrapper);
                this.addFavourites(cardContent);
                this.addTimeWasted(cardContent);
            }
            initialise() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Series exporteren");
                card.setBreadcrumbs(null);
            }
            addFavourites(cardContent) {
                const favourites = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Success, "fa-star-o", "Favorieten", () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ExportFavourites), "100%");
                favourites.instance.css({ marginTop: '0px' });
                cardContent.append(favourites.instance);
            }
            addTimeWasted(cardContent) {
                const timeWasted = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", () => { }, "100%");
                cardContent.append(timeWasted.instance);
            }
        }
        Controllers.ExportController = ExportController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        Enums.SeriesfeedShowDetails = {
            Name: "Naam",
            Url: "Seriesfeed URL",
            PosterUrl: "Poster URL",
            Status: "Status",
            Future: "Toekomst",
            EpisodeCount: "Aantal afleveringen"
        };
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ExportDetailsController {
            constructor(selectedShows) {
                this._selectedShows = selectedShows;
                this._selectedDetails = [];
                this._checkboxes = [];
                window.scrollTo(0, 0);
                document.title = "Details kiezen | Favorieten exporteren | Seriesfeed";
                this.initialiseCard();
                this.initialiseNextButton();
                this.initialise();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Details kiezen");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Type export", SeriesfeedTransporter.Enums.ShortUrl.Export),
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorietenselectie", SeriesfeedTransporter.Enums.ShortUrl.ExportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb("Serie details", null)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('700px');
                card.setContent();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Exporteren", () => new Controllers.ExportFileController(this._selectedShows, this._selectedDetails));
                this._nextButton.instance.hide();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const table = new SeriesfeedTransporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedTransporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const seriesColumn = $('<th/>').text('Serie detail');
                const exampleColumn = $('<th/>').text('Voorbeeld');
                table.addTheadItems([selectAllColumn, seriesColumn, exampleColumn]);
                let index = 0;
                for (let showDetail in SeriesfeedTransporter.Enums.SeriesfeedShowDetails) {
                    const row = $('<tr/>');
                    const selectColumn = $('<td/>');
                    const showColumn = $('<td/>');
                    const exampleColumn = $('<td/>');
                    const checkbox = new SeriesfeedTransporter.ViewModels.Checkbox(`exportType_${index}`);
                    checkbox.subscribe((isEnabled) => {
                        if (isEnabled) {
                            this._selectedDetails.push(showDetail);
                        }
                        else {
                            const position = this._selectedDetails.indexOf(showDetail);
                            this._selectedDetails.splice(position, 1);
                        }
                        this.setNextButton();
                    });
                    selectColumn.append(checkbox.instance);
                    this._checkboxes.push(checkbox);
                    const currentDetail = SeriesfeedTransporter.Enums.SeriesfeedShowDetails[showDetail];
                    const showLink = $('<span/>').text(currentDetail);
                    showColumn.append(showLink);
                    const firstShow = this._selectedShows[0];
                    const key = Object.keys(firstShow).find((property) => property.toLowerCase() === showDetail.toLowerCase());
                    const exampleRowContent = $('<span/>').text(firstShow[key]);
                    exampleColumn.append(exampleRowContent);
                    row.append(selectColumn);
                    row.append(showColumn);
                    row.append(exampleColumn);
                    table.addRow(row);
                    index++;
                }
                cardContent
                    .append(table.instance)
                    .append(this._nextButton.instance);
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
            setNextButton() {
                if (this._selectedShows.length === 1 && this._selectedDetails.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie met ${this._selectedDetails.length} detail exporteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1 && this._selectedDetails.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} series met ${this._selectedDetails.length} detail exporteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length === 1 && this._selectedDetails.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie met ${this._selectedDetails.length} details exporteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1 && this._selectedDetails.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series met ${this._selectedDetails.length} details exporteren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ExportDetailsController = ExportDetailsController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ExportFavouritesController {
            constructor() {
                this._selectedShows = [];
                this._checkboxes = [];
                this.initialiseCard();
                this.initialiseNextButton();
                this.initialise();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Favorieten selecteren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Type export", SeriesfeedTransporter.Enums.ShortUrl.Export),
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorietenselectie", SeriesfeedTransporter.Enums.ShortUrl.ExportFavourites)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth();
                card.setContent();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Exporteren", () => new Controllers.ExportDetailsController(this._selectedShows));
                this._nextButton.instance.hide();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const table = new SeriesfeedTransporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedTransporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const seriesColumn = $('<th/>').text('Serie');
                table.addTheadItems([selectAllColumn, seriesColumn]);
                const loadingData = $('<div/>');
                const loadingFavourites = $('<h4/>').css({ padding: '15px' });
                const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Favorieten ophalen...");
                const starIcon = $('<i/>').addClass('fa fa-star-o fa-spin');
                loadingData.append(loadingFavourites);
                loadingFavourites
                    .append(starIcon)
                    .append(loadingText);
                cardContent
                    .append(loadingData)
                    .append(this._nextButton.instance);
                SeriesfeedTransporter.Services.SeriesfeedExportService.getCurrentUsername()
                    .then((username) => {
                    SeriesfeedTransporter.Services.SeriesfeedExportService.getFavouritesByUsername(username)
                        .then((favourites) => {
                        favourites.forEach((show, index) => {
                            const row = $('<tr/>');
                            const selectColumn = $('<td/>');
                            const showColumn = $('<td/>');
                            const checkbox = new SeriesfeedTransporter.ViewModels.Checkbox(`show_${index}`);
                            checkbox.subscribe((isEnabled) => {
                                if (isEnabled) {
                                    this._selectedShows.push(show);
                                }
                                else {
                                    const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                                    this._selectedShows.splice(position, 1);
                                }
                                this.setNextButton();
                            });
                            selectColumn.append(checkbox.instance);
                            this._checkboxes.push(checkbox);
                            const showLink = $('<a/>').attr('href', show.url).attr('target', '_blank').text(show.name);
                            showColumn.append(showLink);
                            row.append(selectColumn);
                            row.append(showColumn);
                            table.addRow(row);
                        });
                        loadingData.replaceWith(table.instance);
                    });
                });
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
            setNextButton() {
                if (this._selectedShows.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie exporteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series exporteren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ExportFavouritesController = ExportFavouritesController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ExportFileController {
            constructor(selectedShows, selectedDetails) {
                this._selectedShows = selectedShows;
                this._selectedDetails = selectedDetails;
                window.scrollTo(0, 0);
                document.title = "Favorieten exporteren | Seriesfeed";
                this.initialise();
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const wrapper = $('<div/>').css({ textAlign: 'center' });
                cardContent.append(wrapper);
                this.addTsv(wrapper);
                this.addCsv(wrapper);
                this.addXml(wrapper);
                this.addJson(wrapper);
            }
            initialise() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Favorieten exporteren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.Import);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Type export", SeriesfeedTransporter.Enums.ShortUrl.Export),
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorietenselectie", SeriesfeedTransporter.Enums.ShortUrl.ExportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb("Serie details", ""),
                    new SeriesfeedTransporter.Models.Breadcrumb("Exporteren", null)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('550px');
                card.setContent();
            }
            addTsv(cardContent) {
                const currentDateTime = SeriesfeedTransporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".tsv";
                const dataLink = SeriesfeedTransporter.Services.ConverterService.toTsv(this._selectedShows, this._selectedDetails);
                const tsv = new SeriesfeedTransporter.ViewModels.CardButton("Excel (TSV)", "#209045");
                const icon = $('<i/>').addClass("fa fa-4x fa-file-excel-o").css({ color: '#FFFFFF' });
                tsv.topArea.append(icon);
                tsv.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', dataLink);
                cardContent.append(tsv.instance);
            }
            addCsv(cardContent) {
                const currentDateTime = SeriesfeedTransporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".csv";
                const dataLink = SeriesfeedTransporter.Services.ConverterService.toCsv(this._selectedShows, this._selectedDetails);
                const csv = new SeriesfeedTransporter.ViewModels.CardButton("Excel (CSV)", "#47a265");
                const icon = $('<i/>').addClass("fa fa-4x fa-file-text-o").css({ color: '#FFFFFF' });
                csv.topArea.append(icon);
                csv.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', dataLink);
                cardContent.append(csv.instance);
            }
            addXml(cardContent) {
                const currentDateTime = SeriesfeedTransporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".xml";
                const dataLink = SeriesfeedTransporter.Services.ConverterService.toXml(this._selectedShows, this._selectedDetails);
                const xml = new SeriesfeedTransporter.ViewModels.CardButton("XML", "#FF6600");
                const icon = $('<i/>').addClass("fa fa-4x fa-file-code-o").css({ color: '#FFFFFF' });
                xml.topArea.append(icon);
                xml.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', dataLink);
                cardContent.append(xml.instance);
            }
            addJson(cardContent) {
                const currentDateTime = SeriesfeedTransporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".json";
                const dataLink = SeriesfeedTransporter.Services.ConverterService.toJson(this._selectedShows, this._selectedDetails);
                const json = new SeriesfeedTransporter.ViewModels.CardButton("JSON", "#000000");
                const iconWrapper = $('<span/>').css({ position: 'relative' });
                const iconFile = $('<i/>').addClass("fa fa-4x fa-file-o").css({ color: '#FFFFFF' });
                const iconBrackets = $('<span/>').addClass("brackets").css({
                    color: '#FFFFFF',
                    position: 'absolute',
                    top: '19px',
                    left: '14.5px',
                    fontSize: '1.7em',
                    fontWeight: '900'
                }).text("{ }");
                iconWrapper.append(iconFile);
                iconWrapper.append(iconBrackets);
                json.topArea.append(iconWrapper);
                json.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', dataLink);
                cardContent.append(json.instance);
            }
        }
        Controllers.ExportFileController = ExportFileController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class SeriesfeedShowExportModel {
        }
        Models.SeriesfeedShowExportModel = SeriesfeedShowExportModel;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class ConverterService {
            static toJson(objects, filterKeys) {
                const filteredArray = this.filter(objects, filterKeys);
                return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredArray));
            }
            static filter(objects, filterKeys) {
                if (filterKeys == null || filterKeys.length === 0) {
                    return objects;
                }
                const filteredArray = new Array();
                objects.forEach((object) => {
                    const filteredObject = {};
                    filterKeys.forEach((key) => {
                        Object.getOwnPropertyNames(object).map((property) => {
                            if (key.toLowerCase() === property.toLowerCase()) {
                                filteredObject[property] = object[property];
                            }
                        });
                    });
                    filteredArray.push(filteredObject);
                });
                return filteredArray;
            }
            static toXml(objects, filterKeys) {
                const filteredArray = this.filter(objects, filterKeys);
                return "data:text/xml;charset=utf-8," + encodeURIComponent(this.getXml(filteredArray));
            }
            static getXml(objects) {
                let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
                objects.forEach((object, index) => {
                    xml += "<show>\n";
                    var keys = Object.keys(object);
                    keys.map((key) => {
                        xml += `\t<${key}>\n\t\t${object[key]}\n\t</${key}>\n`;
                    });
                    if (index < objects.length - 1) {
                        xml += "</show>\n";
                    }
                    else {
                        xml += "</show>";
                    }
                });
                return xml;
            }
            static toCsv(objects, filterKeys) {
                const filteredArray = this.filter(objects, filterKeys);
                return "data:text/csv;charset=utf-8," + encodeURIComponent(this.getCsv(filteredArray));
            }
            static getCsv(objects) {
                let csv = "";
                csv += this.getXsvKeyString(objects[0], ",");
                csv += this.getXsvValueString(objects, ",");
                return csv;
            }
            static toTsv(objects, filterKeys) {
                const filteredArray = this.filter(objects, filterKeys);
                return "data:text/tsv;charset=utf-8," + encodeURIComponent(this.getTsv(filteredArray));
            }
            static getTsv(objects) {
                let tsv = "";
                tsv += this.getXsvKeyString(objects[0], "\t");
                tsv += this.getXsvValueString(objects, "\t");
                return tsv;
            }
            static getXsvKeyString(object, separator) {
                const keys = Object.keys(object);
                let keyString = "";
                let index = 0;
                keys.map((key) => {
                    keyString += `"${key}"`;
                    if (index < keys.length - 1) {
                        keyString += separator;
                    }
                    else {
                        keyString += "\n";
                    }
                    index++;
                });
                return keyString;
            }
            static getXsvValueString(objects, separator) {
                let keyString = "";
                objects.forEach((object) => {
                    const keys = Object.keys(object);
                    let index = 0;
                    keys.map((key) => {
                        keyString += `"${object[key]}"`;
                        if (index < keys.length - 1) {
                            keyString += separator;
                        }
                        else {
                            keyString += "\n";
                        }
                        index++;
                    });
                });
                return keyString;
            }
        }
        Services.ConverterService = ConverterService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class SeriesfeedExportService {
            static getCurrentUsername() {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.BaseUrl + "/about/")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const userLink = data.find('.main-menu .profile-li .main-menu-dropdown li:first-child a').attr('href');
                    const userLinkParts = userLink.split('/');
                    return userLinkParts[2];
                })
                    .catch((error) => {
                    throw `Could not get username from ${SeriesfeedTransporter.Config.BaseUrl}. ${error}`;
                });
            }
            static getFavouritesByUsername(username) {
                const url = SeriesfeedTransporter.Config.BaseUrl + "/users/" + username + "/favourites";
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const dataRow = data.find("#favourites").find("tbody tr");
                    const favourites = new Array();
                    dataRow.each((index, favourite) => {
                        const show = new SeriesfeedTransporter.Models.SeriesfeedShowExportModel();
                        show.posterUrl = $($(favourite).find('td')[0]).find('img').attr('src');
                        show.name = $($(favourite).find('td')[1]).text();
                        show.url = SeriesfeedTransporter.Config.BaseUrl + $($(favourite).find('td')[1]).find('a').attr('href');
                        show.status = $($(favourite).find('td')[2]).text();
                        show.future = $($(favourite).find('td')[3]).text();
                        show.episodeCount = $($(favourite).find('td')[4]).text();
                        favourites.push(show);
                    });
                    return favourites;
                })
                    .catch((error) => {
                    window.alert(`Kan geen favorieten vinden voor ${username}. Dit kan komen doordat je niet meer ingelogd bent, geen favorieten hebt of er is iets mis met je verbinding.`);
                    throw `Could not get favourites from ${SeriesfeedTransporter.Config.BaseUrl}. ${error}`;
                });
            }
        }
        Services.SeriesfeedExportService = SeriesfeedExportService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportController {
            constructor() {
                this.initialise();
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const contentWrapper = $('<div/>');
                const exportIconWrapper = $('<div/>').css({ textAlign: 'center' });
                const exportIcon = $('<i/>').addClass('fa fa-5x fa-cloud-download').css({ color: '#2f8e85' });
                exportIconWrapper.append(exportIcon);
                contentWrapper.append(exportIconWrapper);
                const text = $('<p/>').append('Wat wil je importeren?');
                contentWrapper.append(text);
                cardContent.append(contentWrapper);
                this.addFavourites(cardContent);
                this.addTimeWasted(cardContent);
            }
            initialise() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Series importeren");
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Type import", SeriesfeedTransporter.Enums.ShortUrl.Import)
                ];
                card.setBreadcrumbs(breadcrumbs);
            }
            addFavourites(cardContent) {
                const favourites = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Success, "fa-star-o", "Favorieten", () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites), "100%");
                favourites.instance.css({ marginTop: '0px' });
                cardContent.append(favourites.instance);
            }
            addTimeWasted(cardContent) {
                const timeWasted = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted), "100%");
                cardContent.append(timeWasted.instance);
            }
        }
        Controllers.ImportController = ImportController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportFavouritesController {
            constructor() {
                this.initialise();
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this.addBierdopje(cardContent);
                this.addImdb(cardContent);
            }
            initialise() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Favorieten importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.Import);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bronkeuze", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites)
                ];
                card.setBreadcrumbs(breadcrumbs);
            }
            addBierdopje(cardContent) {
                const name = "Bierdopje.com";
                const bierdopje = new SeriesfeedTransporter.ViewModels.CardButton(name, "#3399FE");
                const img = $('<img/>')
                    .css({
                    maxWidth: "100%",
                    padding: '10px'
                })
                    .attr('src', "http://cdn.bierdopje.eu/g/layout/bierdopje.png")
                    .attr('alt', name);
                bierdopje.topArea.append(img);
                bierdopje.instance.click(() => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje));
                cardContent.append(bierdopje.instance);
            }
            addImdb(cardContent) {
                const name = "IMDb.com";
                const imdb = new SeriesfeedTransporter.ViewModels.CardButton(name, "#313131");
                const img = $('<img/>')
                    .css({
                    maxWidth: "40%",
                    padding: '10px'
                })
                    .attr('src', "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE._V1__zpsrwfm9zf4.png")
                    .attr('alt', name);
                imdb.topArea.append(img);
                imdb.instance.click(() => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb));
                cardContent.append(imdb.instance);
            }
        }
        Controllers.ImportFavouritesController = ImportFavouritesController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class BierdopjeFavouriteSelectionController {
            constructor(username) {
                this._username = username;
                this._selectedShows = [];
                this._checkboxes = [];
                this._currentCalls = 0;
                this.initialiseCard();
                this.initialiseCollectingData();
                this.initialiseNextButton();
                this.initialise();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten selecteren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bierdopje", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb(this._username, SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje),
                    new SeriesfeedTransporter.Models.Breadcrumb("Importeren", SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje + this._username)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth();
                card.setContent();
            }
            initialiseCollectingData() {
                this._collectingData = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Gegevens verzamelen...");
                this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' });
                this._collectingData.instance.hide();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Importeren", () => new Controllers.ImportBierdopjeFavouritesController(this._username, this._selectedShows));
                this._nextButton.instance.hide();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const table = new SeriesfeedTransporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedTransporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const seriesColumn = $('<th/>').text('Serie');
                table.addTheadItems([selectAllColumn, seriesColumn]);
                const loadingData = $('<div/>');
                const loadingFavourites = $('<h4/>').css({ padding: '15px' });
                const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Favorieten ophalen...");
                const starIcon = $('<i/>').addClass('fa fa-star-o fa-spin');
                loadingData.append(loadingFavourites);
                loadingFavourites
                    .append(starIcon)
                    .append(loadingText);
                cardContent
                    .append(loadingData)
                    .append(this._collectingData.instance)
                    .append(this._nextButton.instance);
                SeriesfeedTransporter.Services.BierdopjeService.getFavouritesByUsername(this._username)
                    .then((favourites) => {
                    favourites.forEach((show, index) => {
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>');
                        const showColumn = $('<td/>');
                        const checkbox = new SeriesfeedTransporter.ViewModels.Checkbox(`show_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this._currentCalls++;
                                this.setCollectingData();
                                SeriesfeedTransporter.Services.BierdopjeService.getTheTvdbIdByShowSlug(show.slug)
                                    .then((theTvdbId) => {
                                    show.theTvdbId = theTvdbId;
                                    this._currentCalls--;
                                    this.setCollectingData();
                                })
                                    .catch(() => {
                                    checkbox.uncheck();
                                    this._currentCalls--;
                                    this.setCollectingData();
                                });
                                this._selectedShows.push(show);
                            }
                            else {
                                const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                                this._selectedShows.splice(position, 1);
                            }
                            this.setNextButton();
                        });
                        selectColumn.append(checkbox.instance);
                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', SeriesfeedTransporter.Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                        showColumn.append(showLink);
                        row.append(selectColumn);
                        row.append(showColumn);
                        table.addRow(row);
                    });
                    loadingData.replaceWith(table.instance);
                });
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
            setCollectingData() {
                if (this._currentCalls === 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} serie)...`;
                    this._collectingData.instance.show();
                    return;
                }
                else if (this._currentCalls > 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} series)...`;
                    this._collectingData.instance.show();
                }
                else {
                    this._collectingData.instance.hide();
                    this.setNextButton();
                }
            }
            setNextButton() {
                if (this._currentCalls > 0) {
                    this._nextButton.instance.hide();
                    return;
                }
                if (this._selectedShows.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie importeren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series importeren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.BierdopjeFavouriteSelectionController = BierdopjeFavouriteSelectionController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportBierdopjeFavouritesController {
            constructor(username, selectedShows) {
                this._username = username;
                this._selectedShows = SeriesfeedTransporter.Services.ShowSorterService.sort(selectedShows, "name");
                window.scrollTo(0, 0);
                this.initialiseCard();
                this.initialiseTable();
                this.startImport();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje + this._username);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bierdopje", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb(this._username, SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje),
                    new SeriesfeedTransporter.Models.Breadcrumb("Importeren", SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje + this._username)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('600px');
                card.setContent();
            }
            initialiseTable() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._table = new SeriesfeedTransporter.ViewModels.Table();
                const statusIconColumn = $('<th/>');
                const seriesColumn = $('<th/>').text('Serie');
                const statusColumn = $('<th/>').text('Status');
                this._table.addTheadItems([statusIconColumn, seriesColumn, statusColumn]);
                this._selectedShows.forEach((show) => {
                    const row = $('<tr/>');
                    const showStatusIcon = $('<td/>');
                    const showColumn = $('<td/>');
                    const statusColumn = $('<td/>');
                    const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                    showStatusIcon.append(loadingIcon);
                    const showLink = $('<a/>').attr('href', SeriesfeedTransporter.Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                    showColumn.append(showLink);
                    row.append(showStatusIcon);
                    row.append(showColumn);
                    row.append(statusColumn);
                    this._table.addRow(row);
                });
                cardContent.append(this._table.instance);
            }
            startImport() {
                this._selectedShows.forEach((show, index) => {
                    const currentRow = this._table.getRow(index);
                    SeriesfeedTransporter.Services.SeriesfeedImportService.findShowByTheTvdbId(show.theTvdbId)
                        .then((seriesfeedShow) => SeriesfeedTransporter.Services.SeriesfeedImportService.addFavouriteByShowId(seriesfeedShow.seriesfeedId))
                        .then(() => {
                        const checkmarkIcon = $("<i/>").addClass("fa fa-check").css({ color: "#0d5f55", fontSize: "16px" });
                        currentRow.children().first().find("i").replaceWith(checkmarkIcon);
                        const addedFavourite = $("<span/>").text("Toegevoegd als favoriet.");
                        currentRow.children().last().append(addedFavourite);
                    })
                        .catch((error) => {
                        const parsedError = error.responseJSON[0];
                        let errorIcon;
                        let errorMessage;
                        switch (parsedError) {
                            case SeriesfeedTransporter.Enums.SeriesfeedError.CouldNotUpdateStatus:
                                errorIcon = $("<i/>").addClass("fa fa-info-circle").css({ color: "#5f7192", fontSize: "16px" });
                                errorMessage = $("<span/>").text("Deze serie is al een favoriet.");
                                break;
                            case SeriesfeedTransporter.Enums.SeriesfeedError.NotFound:
                                errorIcon = $("<i/>").addClass("fa fa-exclamation-triangle").css({ color: "#8e6c2f", fontSize: "16px", marginLeft: "-1px" });
                                errorMessage = $('<a/>').attr('href', SeriesfeedTransporter.Config.BaseUrl + "/series/suggest").attr('target', "_blank").text("Deze serie staat nog niet op Seriesfeed.");
                                break;
                            default:
                                errorIcon = $("<i/>").addClass("fa fa-exclamation-circle").css({ color: "#8e2f2f", fontSize: "16px" });
                                errorMessage = $("<span/>").text("Kon deze serie niet als favoriet instellen.");
                                break;
                        }
                        currentRow.children().first().find("i").replaceWith(errorIcon);
                        currentRow.children().last().append(errorMessage);
                        this._table.updateRow(index, currentRow);
                    });
                });
            }
            convertErrorToMessage(error) {
                const parsedError = error.responseJSON[0];
                switch (parsedError) {
                    case SeriesfeedTransporter.Enums.SeriesfeedError.CouldNotUpdateStatus:
                        return $("<span/>").text("Deze serie is al een favoriet.");
                    case SeriesfeedTransporter.Enums.SeriesfeedError.NotFound:
                        return $('<a/>').attr('href', SeriesfeedTransporter.Config.BaseUrl + "/voorstellen/").attr('target', "_blank").text("Deze serie staat nog niet op Seriesfeed.");
                    default:
                        return $("<span/>").text("Kon deze serie niet als favoriet instellen.");
                }
            }
        }
        Controllers.ImportBierdopjeFavouritesController = ImportBierdopjeFavouritesController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportBierdopjeFavouritesUserSelectionController {
            constructor() {
                this.initialiseCard();
                this.initialiseCurrentUser();
                this.initialiseCustomUser();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bierdopje", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb("Gebruiker", SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('700px');
            }
            initialiseCurrentUser() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._user = new SeriesfeedTransporter.ViewModels.User();
                this._user.setTopText("Huidige gebruiker");
                this._user.setWidth('49%');
                this._user.setUsername("Laden...");
                this._user.instance.css({ marginRight: '1%' });
                cardContent.append(this._user.instance);
                const refreshButtonAction = (event) => {
                    event.stopPropagation();
                    this.loadUser();
                };
                const refreshButton = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Link, "fa-refresh", null, refreshButtonAction);
                refreshButton.instance.css({
                    position: 'absolute',
                    left: '0',
                    bottom: '0'
                });
                this._user.instance.append(refreshButton.instance);
                this.loadUser();
            }
            loadUser() {
                SeriesfeedTransporter.Services.BierdopjeService.getUsername()
                    .then((username) => {
                    if (username == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    }
                    else {
                        this._user.onClick = () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje + username);
                        this._user.setUsername(username);
                        SeriesfeedTransporter.Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => this._user.setAvatarUrl(avatarUrl));
                    }
                });
            }
            initialiseCustomUser() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._customUser = new SeriesfeedTransporter.ViewModels.User();
                this._customUser.setTopText("Andere gebruiker");
                this._customUser.setWidth('49%');
                this._customUser.instance.css({ marginLeft: '1%' });
                cardContent.append(this._customUser.instance);
                const userInputWrapper = this.getUserSearchBox();
                this._customUser.replaceUsername(userInputWrapper);
            }
            getUserSearchBox() {
                const userInputWrapper = $('<div/>').css({ textAlign: 'center' });
                userInputWrapper.click((event) => event.stopPropagation());
                const userInput = SeriesfeedTransporter.Providers.TextInputProvider.provide('85%', "Gebruikersnaam");
                userInput.css({ margin: '0 auto', display: 'inline-block' });
                userInput.on('keyup', (event) => {
                    const key = event.keyCode || event.which;
                    if (key === 12 || key === 13) {
                        searchButton.instance.click();
                    }
                });
                const searchButtonAction = (event) => {
                    notFoundMessage.hide();
                    this.searchUser(userInput.val().toString().trim())
                        .then((hasResult) => {
                        if (!hasResult) {
                            notFoundMessage.show();
                        }
                    });
                };
                const searchButton = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Success, "fa-search", null, searchButtonAction, "15%");
                searchButton.instance.css({
                    marginTop: '0',
                    borderRadius: '0px 5px 5px 0px',
                    padding: '10px 14px',
                    fontSize: '14px'
                });
                const notFoundMessage = $('<div/>').css({
                    display: 'none',
                    textAlign: 'left',
                    color: '#9f9f9f'
                }).html("Gebruiker niet gevonden.");
                userInputWrapper.append(userInput);
                userInputWrapper.append(searchButton.instance);
                userInputWrapper.append(notFoundMessage);
                return userInputWrapper;
            }
            searchUser(username) {
                return SeriesfeedTransporter.Services.BierdopjeService.isExistingUser(username)
                    .then((isExistingUser) => {
                    if (!isExistingUser) {
                        this._customUser.onClick = null;
                        this._customUser.setAvatarUrl();
                    }
                    else {
                        this._customUser.onClick = () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje + username);
                        this._customUser.setUsername(username);
                        SeriesfeedTransporter.Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => {
                            if (avatarUrl == null || avatarUrl == "") {
                                this._customUser.setAvatarUrl("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAUCAYAAACnOeyiAAAAD0lEQVQYV2NkgALGocMAAAgWABX8twh4AAAAAElFTkSuQmCC");
                                return;
                            }
                            this._customUser.setAvatarUrl(avatarUrl);
                        });
                    }
                    return isExistingUser;
                });
            }
        }
        Controllers.ImportBierdopjeFavouritesUserSelectionController = ImportBierdopjeFavouritesUserSelectionController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImdbFavouriteSelectionController {
            constructor(user, selectedLists) {
                this._user = user;
                this._selectedLists = selectedLists;
                this._checkboxes = [];
                this._selectedShows = [];
                window.scrollTo(0, 0);
                this.initialiseNextButton();
                this.initialiseCard();
                this.initialise();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Importeren", () => { });
                this._nextButton.instance.hide();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("IMDb series selecteren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("IMDb", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb(this._user.username, SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb),
                    new SeriesfeedTransporter.Models.Breadcrumb("Importeren", SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb + this._user.username)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth();
                card.setContent();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const table = new SeriesfeedTransporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedTransporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const listHeaderColumn = $('<th/>').text('Item');
                const seriesTypeHeaderColumn = $('<th/>').text('Type');
                table.addTheadItems([selectAllColumn, listHeaderColumn, seriesTypeHeaderColumn]);
                cardContent
                    .append(table.instance)
                    .append(this._nextButton.instance);
                this._selectedLists.forEach((imdbList, listIndex) => {
                    imdbList.shows.forEach((show, showsIndex) => {
                        const checkbox = new SeriesfeedTransporter.ViewModels.Checkbox(`list_${listIndex}_show_${showsIndex}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this.setNextButton();
                                this._selectedShows.push(show);
                            }
                            else {
                                const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                                this._selectedShows.splice(position, 1);
                            }
                            this.setNextButton();
                        });
                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', SeriesfeedTransporter.Config.ImdbBaseUrl + "/title/" + show.slug).attr('target', '_blank').text(show.name);
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>').append(checkbox.instance);
                        const showColumn = $('<td/>').append(showLink);
                        const showTypeColumn = $('<td/>').text(show.imdbType);
                        row.append(selectColumn);
                        row.append(showColumn);
                        row.append(showTypeColumn);
                        table.addRow(row);
                    });
                });
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
            setNextButton() {
                if (this._selectedShows.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie selecteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series selecteren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ImdbFavouriteSelectionController = ImdbFavouriteSelectionController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImdbListSelectionControllerController {
            constructor(user) {
                this._user = user;
                this._checkboxes = [];
                this._selectedLists = [];
                this._currentCalls = 0;
                this.initialiseNextButton();
                this.initialiseCollectingData();
                this.initialiseCard();
                this.initialise();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Importeren", () => new Controllers.ImdbFavouriteSelectionController(this._user, this._selectedLists));
                this._nextButton.instance.hide();
            }
            initialiseCollectingData() {
                this._collectingData = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Gegevens verzamelen...");
                this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' });
                this._collectingData.instance.hide();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("IMDb lijsten selecteren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("IMDb", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb(this._user.username, SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb),
                    new SeriesfeedTransporter.Models.Breadcrumb("Importeren", SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb + this._user.id + "/" + this._user.username)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('650px');
                card.setContent();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const table = new SeriesfeedTransporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedTransporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const listHeaderColumn = $('<th/>').text('Lijst');
                const seriesCountHeaderColumn = $('<th/>').text('Aantal items');
                const createdOnHeaderColumn = $('<th/>').text('Aangemaakt op');
                const modifiedOnHeaderColumn = $('<th/>').text('Laatst bewerkt');
                table.addTheadItems([selectAllColumn, listHeaderColumn, seriesCountHeaderColumn, createdOnHeaderColumn, modifiedOnHeaderColumn]);
                const loadingData = $('<div/>');
                const loadingFavourites = $('<h4/>').css({ padding: '15px' });
                const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Lijsten ophalen...");
                const starIcon = $('<i/>').addClass('fa fa-list-ul fa-flip-x');
                loadingData.append(loadingFavourites);
                loadingFavourites
                    .append(starIcon)
                    .append(loadingText);
                cardContent
                    .append(loadingData)
                    .append(this._collectingData.instance)
                    .append(this._nextButton.instance);
                SeriesfeedTransporter.Services.ImdbImportService.getListsByUserId(this._user.id)
                    .then((imdbLists) => {
                    imdbLists.forEach((imdbList, index) => {
                        const checkbox = new SeriesfeedTransporter.ViewModels.Checkbox(`list_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this._currentCalls++;
                                this.setCollectingData();
                                SeriesfeedTransporter.Services.ImdbImportService.getSeriesByListIdAndUserId(imdbList.id, this._user.id)
                                    .then((shows) => {
                                    imdbList.shows = shows;
                                    this._currentCalls--;
                                    this.setCollectingData();
                                })
                                    .catch(() => {
                                    checkbox.uncheck();
                                    this._currentCalls--;
                                    this.setCollectingData();
                                });
                                this._selectedLists.push(imdbList);
                            }
                            else {
                                const position = this._selectedLists.map((list) => list.name).indexOf(imdbList.name);
                                this._selectedLists.splice(position, 1);
                            }
                            this.setNextButton();
                        });
                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', SeriesfeedTransporter.Config.ImdbBaseUrl + "/list/" + imdbList.id).attr('target', '_blank').text(imdbList.name);
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>').append(checkbox.instance);
                        const listColumn = $('<td/>').append(showLink);
                        const seriesCountColumn = $('<td/>').text(imdbList.seriesCount);
                        const createdOnColumn = $('<td/>').text(imdbList.createdOn);
                        const modifiedOnColumn = $('<td/>').text(imdbList.modifiedOn);
                        row.append(selectColumn);
                        row.append(listColumn);
                        row.append(seriesCountColumn);
                        row.append(createdOnColumn);
                        row.append(modifiedOnColumn);
                        table.addRow(row);
                    });
                    loadingData.replaceWith(table.instance);
                });
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
            setCollectingData() {
                if (this._currentCalls === 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} lijst)...`;
                    this._collectingData.instance.show();
                    return;
                }
                else if (this._currentCalls > 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} lijsten)...`;
                    this._collectingData.instance.show();
                }
                else {
                    this._collectingData.instance.hide();
                    this.setNextButton();
                }
            }
            setNextButton() {
                if (this._currentCalls > 0) {
                    this._nextButton.instance.hide();
                    return;
                }
                if (this._selectedLists.length === 1) {
                    this._nextButton.text = `${this._selectedLists.length} lijst selecteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedLists.length > 1) {
                    this._nextButton.text = `${this._selectedLists.length} lijsten selecteren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ImdbListSelectionControllerController = ImdbListSelectionControllerController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportImdbFavouritesUserSelectionController {
            constructor() {
                this.initialiseCard();
                this.initialiseCurrentUser();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("IMDb favorieten importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("IMDb", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb("Gebruiker", SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth();
            }
            initialiseCurrentUser() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._user = new SeriesfeedTransporter.ViewModels.User();
                this._user.setUsername("Laden...");
                this._user.instance.css({ marginRight: '1%' });
                cardContent.append(this._user.instance);
                const refreshButtonAction = (event) => {
                    event.stopPropagation();
                    this.loadUser();
                };
                const refreshButton = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Link, "fa-refresh", null, refreshButtonAction);
                refreshButton.instance.css({
                    position: 'absolute',
                    left: '0',
                    bottom: '0'
                });
                this._user.instance.append(refreshButton.instance);
                this.loadUser();
            }
            loadUser() {
                SeriesfeedTransporter.Services.ImdbImportService.getUser()
                    .then((user) => {
                    if (user == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    }
                    else {
                        this._user.onClick = () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb + user.id + "/" + user.username);
                        this._user.setUsername(user.username);
                        SeriesfeedTransporter.Services.ImdbImportService.getAvatarUrlByUserId(user.id)
                            .then((avatarUrl) => this._user.setAvatarUrl(avatarUrl));
                    }
                });
            }
        }
        Controllers.ImportImdbFavouritesUserSelectionController = ImportImdbFavouritesUserSelectionController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class ImdbList {
        }
        Models.ImdbList = ImdbList;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class ImdbUser {
            constructor(id, username) {
                this.id = id;
                this.username = username;
            }
        }
        Models.ImdbUser = ImdbUser;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class ImdbImportService {
            static getUser() {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.ImdbBaseUrl + "/helpdesk/contact")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const id = data.find('#navUserMenu p a').attr('href').split('/')[4];
                    const username = data.find('#navUserMenu p a').html().trim();
                    return new SeriesfeedTransporter.Models.ImdbUser(id, username);
                })
                    .catch((error) => {
                    throw `Could not get user from ${SeriesfeedTransporter.Config.ImdbBaseUrl}. ${error}`;
                });
            }
            static getAvatarUrlByUserId(userId) {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.ImdbBaseUrl + "/user/" + userId + "/")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('#avatar').attr('src');
                })
                    .catch((error) => {
                    throw `Could not get avatar for user id ${userId} from ${SeriesfeedTransporter.Config.ImdbBaseUrl}. ${error}`;
                });
            }
            static getListsByUserId(userId) {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.ImdbBaseUrl + "/user/" + userId + "/lists")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const dataRows = data.find('table.lists tr.row');
                    const imdbLists = new Array();
                    dataRows.each((index, dataRow) => {
                        const imdbList = new SeriesfeedTransporter.Models.ImdbList();
                        const imdbListUrl = $(dataRow).find('.name a').attr('href');
                        const imdbListUrlParts = imdbListUrl.split('/');
                        imdbList.id = imdbListUrlParts[imdbListUrlParts.length - 2];
                        imdbList.name = $(dataRow).find('.name a').text();
                        imdbList.seriesCount = $(dataRow).find('.name span').text();
                        imdbList.createdOn = $(dataRow).find('.created').text();
                        imdbList.modifiedOn = $(dataRow).find('.modified').text();
                        this.fixListTranslations(imdbList);
                        imdbLists.push(imdbList);
                    });
                    imdbLists.push(this.getWatchlistItem());
                    return imdbLists;
                })
                    .catch((error) => {
                    throw `Could not get lists for user id ${userId} from ${SeriesfeedTransporter.Config.ImdbBaseUrl}. ${error}`;
                });
            }
            static fixListTranslations(imdbList) {
                imdbList.seriesCount = imdbList.seriesCount
                    .replace(" Titles", "")
                    .replace('(', "")
                    .replace(')', "");
                const createdOnParts = imdbList.createdOn.split(' ');
                const createdOnMonth = Services.TimeAgoTranslatorService.getFullDutchTranslationOfMonthAbbreviation(createdOnParts[1]);
                imdbList.createdOn = imdbList.createdOn.replace(createdOnParts[1], createdOnMonth);
                const modifiedOnParts = imdbList.modifiedOn.split(' ');
                const modifiedOnTime = Services.TimeAgoTranslatorService.getDutchTranslationOfTime(modifiedOnParts[1]);
                imdbList.modifiedOn = imdbList.modifiedOn.replace(modifiedOnParts[1], modifiedOnTime).replace("ago", "geleden");
            }
            static getWatchlistItem() {
                const watchlist = new SeriesfeedTransporter.Models.ImdbList();
                watchlist.name = "Watchlist";
                watchlist.id = "watchlist";
                watchlist.seriesCount = "-";
                watchlist.createdOn = "-";
                watchlist.modifiedOn = "-";
                return watchlist;
            }
            static getSeriesByListId(listId) {
                const url = SeriesfeedTransporter.Config.ImdbBaseUrl + "/list/" + listId + "?view=compact";
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const seriesItems = data.find(".list_item:not(:first-child)");
                    const seriesList = [];
                    seriesItems.each((index, seriesItem) => {
                        var series = {
                            name: $(seriesItem).find(".title a").html(),
                            url: SeriesfeedTransporter.Config.ImdbBaseUrl + $(seriesItem).find(".title a").attr("href"),
                            type: $(seriesItem).find(".title_type").html()
                        };
                        if (series.type !== "Feature") {
                            seriesList.push(series);
                        }
                    });
                    return seriesList.sort((a, b) => b.name.localeCompare(a.name));
                })
                    .catch((error) => {
                    throw `Could not get series for list id ${listId} from ${SeriesfeedTransporter.Config.ImdbBaseUrl}. ${error}`;
                });
            }
            static getSeriesByListIdAndUserId(listId, userId) {
                const url = SeriesfeedTransporter.Config.ImdbBaseUrl + "/list/export?list_id=" + listId + "&author_id=" + userId;
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const csv = result.responseText;
                    const entries = csv.split('\n');
                    const entryKeys = entries[0].split('","');
                    const imdbSlugIndex = entryKeys.indexOf("const");
                    const titleIndex = entryKeys.indexOf("Title");
                    const titleTypeIndex = entryKeys.indexOf("Title type");
                    const shows = new Array();
                    entries.forEach((entry, index) => {
                        if (index === 0) {
                            return;
                        }
                        const entryValues = entry.split('","');
                        const titleType = entryValues[titleTypeIndex];
                        if (titleType == null) {
                            return;
                        }
                        if (titleType !== "Feature Film" && titleType !== "TV Movie") {
                            const show = new SeriesfeedTransporter.Models.Show();
                            show.imdbType = titleType;
                            show.slug = entryValues[imdbSlugIndex];
                            show.name = entryValues[titleIndex];
                            shows.push(show);
                        }
                    });
                    return Services.ShowSorterService.sort(shows, "name");
                })
                    .catch((error) => {
                    throw `Could not get list id ${listId} for user ${userId} from ${SeriesfeedTransporter.Config.ImdbBaseUrl}. ${error}`;
                });
            }
        }
        Services.ImdbImportService = ImdbImportService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class SeriesfeedImportService {
            static findShowByTheTvdbId(theTvdbId) {
                const localShow = this.findShowByTheTvdbIdInStorage(theTvdbId);
                if (localShow != null) {
                    return Promise.resolve(localShow);
                }
                return this.findShowByTheTvdbIdFromApi(theTvdbId)
                    .then((show) => {
                    show.theTvdbId = theTvdbId;
                    this.addShowToStorage(show);
                    return show;
                });
            }
            static findShowByTheTvdbIdInStorage(theTvdbId) {
                const localShows = Services.StorageService.get(SeriesfeedTransporter.Enums.LocalStorageKey.SeriesfeedShows);
                if (localShows != null) {
                    return localShows.find((show) => show.theTvdbId === theTvdbId);
                }
                return null;
            }
            static findShowByTheTvdbIdFromApi(theTvdbId) {
                const postData = {
                    type: 'tvdb_id',
                    data: theTvdbId
                };
                return Services.AjaxService.post("/ajax/serie/find-by", postData)
                    .then((result) => {
                    const show = new SeriesfeedTransporter.Models.Show();
                    show.seriesfeedId = result.id;
                    show.name = result.name;
                    show.slug = result.slug;
                    return show;
                })
                    .catch((error) => {
                    console.error(`Could not convert The TVDB id ${theTvdbId} on ${SeriesfeedTransporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
            static addShowToStorage(show) {
                let localShows = Services.StorageService.get(SeriesfeedTransporter.Enums.LocalStorageKey.SeriesfeedShows);
                if (localShows == null) {
                    localShows = new Array();
                }
                localShows.push(show);
                Services.StorageService.set(SeriesfeedTransporter.Enums.LocalStorageKey.SeriesfeedShows, localShows);
            }
            static addFavouriteByShowId(showId) {
                const postData = {
                    series: showId,
                    type: 'favourite',
                    selected: '0'
                };
                return Services.AjaxService.post("/ajax/serie/favourite", postData)
                    .catch((error) => {
                    console.error(`Could not favourite show id ${showId} on ${SeriesfeedTransporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
            static getEpisodeId(showId, episodeTag) {
                const localEpisodeId = this.findEpisodeIdInStorage(showId, episodeTag);
                if (localEpisodeId != null) {
                    return Promise.resolve(localEpisodeId);
                }
                return this.getEpisodeIdFromApi(showId, episodeTag)
                    .then((episodeId) => {
                    const localEpisode = new SeriesfeedTransporter.Models.LocalEpisode();
                    localEpisode.showId = showId;
                    localEpisode.episodeId = episodeId;
                    localEpisode.episodeTag = episodeTag;
                    this.addEpisodeToStorage(localEpisode);
                    return episodeId;
                });
            }
            static findEpisodeIdInStorage(showId, episodeTag) {
                const localEpisodes = Services.StorageService.get(SeriesfeedTransporter.Enums.LocalStorageKey.SeriesfeedEpisodes);
                if (localEpisodes != null) {
                    const localEpisode = localEpisodes.find((episode) => episode.showId === showId && episode.episodeTag === episodeTag);
                    return localEpisode != null ? localEpisode.episodeId : null;
                }
                return null;
            }
            static getEpisodeIdFromApi(showId, episodeTag) {
                const postData = {
                    type: 'series_season_episode',
                    serie: showId,
                    data: episodeTag
                };
                return Services.AjaxService.post("/ajax/serie/episode/find-by", postData)
                    .then((episodeData) => episodeData.id)
                    .catch((error) => {
                    console.error(`Could not get episode for show id ${showId} with episode tag ${episodeTag} on ${SeriesfeedTransporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
            static addEpisodeToStorage(localEpisode) {
                let localEpisodes = Services.StorageService.get(SeriesfeedTransporter.Enums.LocalStorageKey.SeriesfeedEpisodes);
                if (localEpisodes == null) {
                    localEpisodes = new Array();
                }
                localEpisodes.push(localEpisode);
                Services.StorageService.set(SeriesfeedTransporter.Enums.LocalStorageKey.SeriesfeedEpisodes, localEpisodes);
            }
            static markSeasonEpisodes(showId, seasonId, type) {
                const postData = {
                    series: showId,
                    season: seasonId,
                    seen: true,
                    type: type
                };
                return Services.AjaxService.post("/ajax/serie/episode/mark/all", postData)
                    .catch((error) => {
                    console.error(`Could not mark all episodes as ${type} for show id ${showId} and season id ${seasonId} on ${SeriesfeedTransporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
            static markEpisode(episodeId, type) {
                const postData = {
                    episode: episodeId,
                    type: type,
                    status: 'no'
                };
                return Services.AjaxService.post("/ajax/serie/episode/mark/", postData)
                    .catch((error) => {
                    console.error(`Could not mark episode ${episodeId} as ${type} on ${SeriesfeedTransporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
        }
        Services.SeriesfeedImportService = SeriesfeedImportService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportTimeWastedController {
            constructor() {
                this.initialise();
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this.addBierdopje(cardContent);
            }
            initialise() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Time Wasted importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.Import);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Time Wasted importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bronkeuze", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted)
                ];
                card.setBreadcrumbs(breadcrumbs);
            }
            addBierdopje(cardContent) {
                const name = "Bierdopje.com";
                const bierdopje = new SeriesfeedTransporter.ViewModels.CardButton(name, "#3399FE");
                const img = $('<img/>')
                    .css({
                    maxWidth: "100%",
                    padding: '10px'
                })
                    .attr('src', "http://cdn.bierdopje.eu/g/layout/bierdopje.png")
                    .attr('alt', name);
                bierdopje.topArea.append(img);
                bierdopje.instance.click(() => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje));
                cardContent.append(bierdopje.instance);
            }
        }
        Controllers.ImportTimeWastedController = ImportTimeWastedController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        let Column;
        (function (Column) {
            Column[Column["Status"] = 0] = "Status";
            Column[Column["ShowName"] = 1] = "ShowName";
            Column[Column["Season"] = 2] = "Season";
            Column[Column["EpisodesAcquired"] = 3] = "EpisodesAcquired";
            Column[Column["EpisodesSeen"] = 4] = "EpisodesSeen";
            Column[Column["EpisodeTotal"] = 5] = "EpisodeTotal";
        })(Column || (Column = {}));
        class ImportTimeWastedBierdopjeController {
            constructor(username, selectedShows) {
                this.Separator = '/';
                this._username = username;
                this._selectedShows = selectedShows;
                window.scrollTo(0, 0);
                this.initialiseCard();
                this.initialiseTable();
                this.startImport();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Bierdopje Time Wasted importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje + this._username);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Time Wasted importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bierdopje", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted),
                    new SeriesfeedTransporter.Models.Breadcrumb(this._username, SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje),
                    new SeriesfeedTransporter.Models.Breadcrumb("Serieselectie", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje + this._username),
                    new SeriesfeedTransporter.Models.Breadcrumb("Importeren", null)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('650px');
                card.setContent();
            }
            initialiseTable() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._table = new SeriesfeedTransporter.ViewModels.Table();
                const statusColumn = $('<th/>').css({ verticalAlign: "middle" });
                const seriesColumn = $('<th/>').text('Serie').css({ verticalAlign: "middle" });
                const seasonColumn = $('<th/>').text('Seizoen').css({ textAlign: "center", verticalAlign: "middle" });
                const episodesAcquiredColumn = $('<th/>').html("Afleveringen<br/>verkregen").css({ textAlign: "center", verticalAlign: "middle" });
                const episodesSeenColumn = $('<th/>').html("Afleveringen<br/>gezien").css({ textAlign: "center", verticalAlign: "middle" });
                const episodeTotalColumn = $('<th/>').html("Totaal<br/>afleveringen").css({ textAlign: "center", verticalAlign: "middle" });
                this._table.addTheadItems([statusColumn, seriesColumn, seasonColumn, episodesAcquiredColumn, episodesSeenColumn, episodeTotalColumn]);
                this._selectedShows.forEach((show) => {
                    const row = $('<tr/>');
                    const statusColumn = $('<td/>');
                    const showColumn = $('<td/>');
                    const seasonColumn = $('<td/>').css({ textAlign: "center" });
                    const episodesAcquiredColumn = $('<td/>').css({ textAlign: "center" });
                    const episodesSeenColumn = $('<td/>').css({ textAlign: "center" });
                    const episodeTotalColumn = $('<td/>').css({ textAlign: "center" });
                    const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                    statusColumn.append(loadingIcon.clone());
                    seasonColumn.append(loadingIcon.clone());
                    episodesAcquiredColumn.append(loadingIcon.clone());
                    episodesSeenColumn.append(loadingIcon.clone());
                    episodeTotalColumn.append(loadingIcon.clone());
                    const showLink = $('<a/>').attr('href', SeriesfeedTransporter.Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                    showColumn.append(showLink);
                    row.append(statusColumn);
                    row.append(showColumn);
                    row.append(seasonColumn);
                    row.append(episodesAcquiredColumn);
                    row.append(episodesSeenColumn);
                    row.append(episodeTotalColumn);
                    this._table.addRow(row);
                });
                cardContent.append(this._table.instance);
            }
            startImport() {
                const promises = new Array();
                this._selectedShows.forEach((show, index) => {
                    const promise = SeriesfeedTransporter.Services.BierdopjeService.getShowSeasonsByShowSlug(show.slug)
                        .then((seasons) => {
                        show.seasons = seasons;
                        const currentRow = this._table.getRow(index);
                        const seasonColumn = currentRow.children().get(Column.Season);
                        $(seasonColumn).text('-' + this.Separator + show.seasons.length);
                    });
                    promises.push(promise);
                });
                Promise.all(promises)
                    .then(() => setTimeout(this.getShowSeasonEpisodesBySeasonSlug(), SeriesfeedTransporter.Config.CooldownInMs));
            }
            getShowSeasonEpisodesBySeasonSlug() {
                const promises = new Array();
                this._selectedShows.forEach((show, rowIndex) => {
                    show.seasons.forEach((season, seasonIndex) => {
                        const promise = SeriesfeedTransporter.Services.BierdopjeService.getShowSeasonEpisodesBySeasonSlug(season.slug)
                            .then((episodes) => {
                            season.episodes = episodes;
                        });
                        promises.push(promise);
                    });
                });
                Promise.all(promises)
                    .then(() => setTimeout(this.aquireEpisodeIds(), SeriesfeedTransporter.Config.CooldownInMs));
            }
            aquireEpisodeIds() {
                const promises = new Array();
                this._selectedShows.forEach((show, rowIndex) => {
                    show.seasons.forEach((season, seasonIndex) => {
                        season.episodes.forEach((episode, episodeIndex) => {
                            const promise = SeriesfeedTransporter.Services.SeriesfeedImportService.getEpisodeId(show.seriesfeedId, episode.tag)
                                .then((episodeId) => {
                                episode.id = episodeId;
                            })
                                .catch((error) => {
                                const position = season.episodes.map((episode) => episode.tag).indexOf(episode.tag);
                                season.episodes.splice(position, 1);
                            });
                            promises.push(promise);
                        });
                    });
                    Promise.all(promises)
                        .then(() => {
                        const currentRow = this._table.getRow(rowIndex);
                        const episodesAcquiredColumn = currentRow.children().get(Column.EpisodesAcquired);
                        const episodesSeenColumn = currentRow.children().get(Column.EpisodesSeen);
                        const episodeTotalColumn = currentRow.children().get(Column.EpisodeTotal);
                        let episodeCount = 0;
                        let episodesAcquired = 0;
                        let episodesSeen = 0;
                        show.seasons.map((season) => {
                            season.episodes.map((episode) => {
                                if (episode.acquired) {
                                    episodesAcquired++;
                                }
                                if (episode.seen) {
                                    episodesSeen++;
                                }
                            });
                            return episodeCount += season.episodes.length;
                        });
                        $(episodesAcquiredColumn).text('-' + this.Separator + episodesAcquired);
                        $(episodesSeenColumn).text('-' + this.Separator + episodesSeen);
                        $(episodeTotalColumn).text(episodeCount);
                        setTimeout(this.markEpisodes(), SeriesfeedTransporter.Config.CooldownInMs);
                    });
                });
            }
            markEpisodes() {
                this._selectedShows.forEach((show, rowIndex) => {
                    const promises = new Array();
                    show.seasons.forEach((season, seasonIndex) => {
                        const seasonPromises = new Array();
                        const hasSeenAllEpisodes = season.episodes.every((episode) => episode.seen === true);
                        const hasAcquiredAllEpisodes = season.episodes.every((episode) => episode.acquired === true);
                        if (hasSeenAllEpisodes) {
                            const promise = SeriesfeedTransporter.Services.SeriesfeedImportService.markSeasonEpisodes(show.seriesfeedId, season.id, SeriesfeedTransporter.Enums.MarkType.Seen)
                                .then(() => this.updateCountColumn(rowIndex, Column.EpisodesSeen, season.episodes.length))
                                .catch(() => this.updateCountColumn(rowIndex, Column.EpisodesSeen, season.episodes.length));
                            seasonPromises.push(promise);
                        }
                        else if (hasAcquiredAllEpisodes) {
                            const promise = SeriesfeedTransporter.Services.SeriesfeedImportService.markSeasonEpisodes(show.seriesfeedId, season.id, SeriesfeedTransporter.Enums.MarkType.Obtained)
                                .then(() => this.updateCountColumn(rowIndex, Column.EpisodesAcquired, season.episodes.length))
                                .catch(() => this.updateCountColumn(rowIndex, Column.EpisodesAcquired, season.episodes.length));
                            seasonPromises.push(promise);
                        }
                        else {
                            season.episodes.forEach((episode) => {
                                if (episode.seen) {
                                    const promise = SeriesfeedTransporter.Services.SeriesfeedImportService.markEpisode(episode.id, SeriesfeedTransporter.Enums.MarkType.Seen)
                                        .then(() => this.updateCountColumn(rowIndex, Column.EpisodesSeen, 1))
                                        .catch(() => this.updateCountColumn(rowIndex, Column.EpisodesSeen, 1));
                                    seasonPromises.push(promise);
                                }
                                else if (episode.acquired) {
                                    const promise = SeriesfeedTransporter.Services.SeriesfeedImportService.markEpisode(episode.id, SeriesfeedTransporter.Enums.MarkType.Obtained)
                                        .then(() => this.updateCountColumn(rowIndex, Column.EpisodesAcquired, 1))
                                        .catch(() => this.updateCountColumn(rowIndex, Column.EpisodesAcquired, 1));
                                    seasonPromises.push(promise);
                                }
                            });
                        }
                        const seasonPromiseAll = Promise.all(seasonPromises)
                            .then(() => this.updateCountColumn(rowIndex, Column.Season, 1))
                            .catch(() => this.updateCountColumn(rowIndex, Column.Season, 1));
                        promises.push(seasonPromiseAll);
                    });
                    Promise.all(promises)
                        .then(() => {
                        const currentRow = this._table.getRow(rowIndex);
                        const statusColumn = currentRow.children().get(Column.Status);
                        const checkmarkIcon = $("<i/>").addClass("fa fa-check").css({ color: "#0d5f55", fontSize: "16px" });
                        $(statusColumn).find("i").replaceWith(checkmarkIcon);
                    });
                });
            }
            updateCountColumn(rowId, columnId, done) {
                if (columnId === Column.EpisodesSeen) {
                    this.updateActualCountColumn(rowId, Column.EpisodesSeen, done);
                    this.updateActualCountColumn(rowId, Column.EpisodesAcquired, done);
                }
                else {
                    this.updateActualCountColumn(rowId, columnId, done);
                }
            }
            updateActualCountColumn(rowId, columnId, done) {
                const row = this._table.getRow(rowId);
                const column = row.children().get(columnId);
                const columnsParts = $(column).text().split(this.Separator);
                const currentDoneText = columnsParts[0];
                const totalDoneText = columnsParts[1];
                let currentDone = isNaN(+currentDoneText) ? 0 : +currentDoneText;
                currentDone += done;
                $(column).text(currentDone + this.Separator + totalDoneText);
            }
        }
        Controllers.ImportTimeWastedBierdopjeController = ImportTimeWastedBierdopjeController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportTimeWastedBierdopjeShowSelectionController {
            constructor(username) {
                this._username = username;
                this._selectedShows = [];
                this._checkboxes = [];
                this._currentCalls = 0;
                this.initialiseCard();
                this.initialiseCollectingData();
                this.initialiseNextButton();
                this.initialise();
            }
            initialiseCard() {
                this._card = SeriesfeedTransporter.Services.CardService.getCard();
                this._card.setTitle("Bierdopje series selecteren");
                this._card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Time Wasted importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bierdopje", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted),
                    new SeriesfeedTransporter.Models.Breadcrumb(this._username, SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje),
                    new SeriesfeedTransporter.Models.Breadcrumb("Serieselectie", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje + this._username)
                ];
                this._card.setBreadcrumbs(breadcrumbs);
                this._card.setWidth();
                this._card.setContent();
            }
            initialiseCollectingData() {
                this._collectingData = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Gegevens verzamelen...");
                this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' });
                this._collectingData.instance.hide();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Importeren", () => new Controllers.ImportTimeWastedBierdopjeController(this._username, this._selectedShows));
                this._nextButton.instance.hide();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._table = new SeriesfeedTransporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedTransporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const seriesColumn = $('<th/>').text('Serie');
                const seriesStatusIcon = $('<th/>').text('Beschikbaarheid').css({ textAlign: 'center' });
                this._table.addTheadItems([selectAllColumn, seriesColumn, seriesStatusIcon]);
                const loadingData = $('<div/>');
                const loadingShows = $('<h4/>').css({ padding: '15px' });
                const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Shows ophalen...");
                const showIcon = $('<i/>').addClass('fa fa-television fa-flip-y');
                loadingData.append(loadingShows);
                loadingShows
                    .append(showIcon)
                    .append(loadingText);
                cardContent
                    .append(loadingData)
                    .append(this._collectingData.instance)
                    .append(this._nextButton.instance);
                SeriesfeedTransporter.Services.BierdopjeService.getTimeWastedByUsername(this._username)
                    .then((shows) => {
                    shows.forEach((show, index) => {
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>');
                        const showColumn = $('<td/>');
                        const statusColumn = $('<td/>').css({ textAlign: 'center' });
                        const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                        const checkmarkIcon = $("<i/>").addClass("fa fa-check").css({ color: "#0d5f55", fontSize: "16px" });
                        const warningIcon = $("<i/>").addClass("fa fa-exclamation-triangle").css({ color: "#8e6c2f", fontSize: "16px", marginLeft: "-1px", cursor: 'pointer' });
                        warningIcon.attr('title', "Deze serie staat nog niet op Seriesfeed.");
                        warningIcon.click(() => window.open(SeriesfeedTransporter.Config.BaseUrl + "/series/suggest", '_blank'));
                        statusColumn.append("<i/>");
                        const checkbox = new SeriesfeedTransporter.ViewModels.Checkbox(`show_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                statusColumn.find("i").replaceWith(loadingIcon);
                                this._currentCalls++;
                                this.setCollectingData();
                                SeriesfeedTransporter.Services.BierdopjeService.getTheTvdbIdByShowSlug(show.slug)
                                    .then((theTvdbId) => {
                                    show.theTvdbId = theTvdbId;
                                    SeriesfeedTransporter.Services.SeriesfeedImportService.findShowByTheTvdbId(show.theTvdbId)
                                        .then((result) => {
                                        show.seriesfeedId = result.seriesfeedId;
                                        statusColumn.find("i").replaceWith(checkmarkIcon);
                                        this._currentCalls--;
                                        this.setCollectingData();
                                    })
                                        .catch(() => {
                                        checkbox.uncheck();
                                        statusColumn.find("i").replaceWith(warningIcon);
                                        this._currentCalls--;
                                        this.setCollectingData();
                                    });
                                });
                                this._selectedShows.push(show);
                            }
                            else {
                                const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                                this._selectedShows.splice(position, 1);
                            }
                            this.setNextButton();
                        });
                        selectColumn.append(checkbox.instance);
                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', SeriesfeedTransporter.Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                        showColumn.append(showLink);
                        row.append(selectColumn);
                        row.append(showColumn);
                        row.append(statusColumn);
                        this._table.addRow(row);
                    });
                    loadingData.replaceWith(this._table.instance);
                });
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
            setCollectingData() {
                if (this._currentCalls === 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} serie)...`;
                    this._collectingData.instance.show();
                    return;
                }
                else if (this._currentCalls > 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} series)...`;
                    this._collectingData.instance.show();
                }
                else {
                    this._collectingData.instance.hide();
                    this.setNextButton();
                }
            }
            setNextButton() {
                if (this._currentCalls > 0) {
                    this._nextButton.instance.hide();
                    return;
                }
                if (this._selectedShows.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie importeren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series importeren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ImportTimeWastedBierdopjeShowSelectionController = ImportTimeWastedBierdopjeShowSelectionController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportTimeWastedBierdopjeUserSelectionController {
            constructor() {
                this.initialiseCard();
                this.initialiseCurrentUser();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Bierdopje Time Wasted importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Time Wasted importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bierdopje", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted),
                    new SeriesfeedTransporter.Models.Breadcrumb("Gebruiker", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje)
                ];
                card.setBreadcrumbs(breadcrumbs);
            }
            initialiseCurrentUser() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._user = new SeriesfeedTransporter.ViewModels.User();
                this._user.setUsername("Laden...");
                this._user.instance.css({ marginRight: '1%' });
                cardContent.append(this._user.instance);
                const refreshButtonAction = (event) => {
                    event.stopPropagation();
                    this.loadUser();
                };
                const refreshButton = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Link, "fa-refresh", null, refreshButtonAction);
                refreshButton.instance.css({
                    position: 'absolute',
                    left: '0',
                    bottom: '0'
                });
                this._user.instance.append(refreshButton.instance);
                this.loadUser();
            }
            loadUser() {
                SeriesfeedTransporter.Services.BierdopjeService.getUsername()
                    .then((username) => {
                    if (username == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    }
                    else {
                        this._user.onClick = () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje + username);
                        this._user.setUsername(username);
                        SeriesfeedTransporter.Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => this._user.setAvatarUrl(avatarUrl));
                    }
                });
            }
        }
        Controllers.ImportTimeWastedBierdopjeUserSelectionController = ImportTimeWastedBierdopjeUserSelectionController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class NavigationController {
            initialise() {
                SeriesfeedTransporter.Services.NavigationService.add(SeriesfeedTransporter.Enums.NavigationType.Series, 5, "Importeren", SeriesfeedTransporter.Enums.ShortUrl.Import);
                SeriesfeedTransporter.Services.NavigationService.add(SeriesfeedTransporter.Enums.NavigationType.Series, 6, "Exporteren", SeriesfeedTransporter.Enums.ShortUrl.Export);
            }
        }
        Controllers.NavigationController = NavigationController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class NavigationService {
            static add(navigationType, position, text, url) {
                const mainMenuItem = $("ul.main-menu .submenu .inner .top-level:eq(" + navigationType + ")");
                mainMenuItem.find(".main-menu-dropdown li:eq(" + position + ")").before("<li><a href='" + url + "'>" + text + "</a></li>");
            }
        }
        Services.NavigationService = NavigationService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class RoutingController {
            initialise() {
                this.initialVisitRouting();
                this.respondToBrowserNavigationChanges();
            }
            initialVisitRouting() {
                if (window.location.href.startsWith(SeriesfeedTransporter.Config.BaseUrl + SeriesfeedTransporter.Enums.ShortUrl.Import)
                    || window.location.href.startsWith(SeriesfeedTransporter.Config.BaseUrl + SeriesfeedTransporter.Enums.ShortUrl.Export)) {
                    const url = window.location.href.replace(SeriesfeedTransporter.Config.BaseUrl, '');
                    this.initialiseInitialVisit(url);
                    SeriesfeedTransporter.Services.RouterService.navigate(url);
                }
            }
            initialiseInitialVisit(url) {
                window.history.replaceState({ "shortUrl": url }, "", url);
                const mainContent = this.fixPageLayoutAndGetMainContent();
                const card = SeriesfeedTransporter.Services.CardService.initialise();
                mainContent.append(card.instance);
            }
            fixPageLayoutAndGetMainContent() {
                const wrapper = $('.contentWrapper .container').last().empty();
                wrapper.removeClass('container').addClass('wrapper bg');
                const container = $('<div></div>').addClass('container').attr('id', SeriesfeedTransporter.Config.Id.MainContent);
                wrapper.append(container);
                return container;
            }
            respondToBrowserNavigationChanges() {
                window.onpopstate = (event) => {
                    if (event.state == null) {
                        return;
                    }
                    SeriesfeedTransporter.Services.RouterService.navigate(event.state.shortUrl);
                };
            }
        }
        Controllers.RoutingController = RoutingController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class RouterService {
            static navigate(url) {
                if (url == null) {
                    return;
                }
                switch (url) {
                    case SeriesfeedTransporter.Enums.ShortUrl.Import:
                        this.import();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites:
                        this.importFavourites();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje:
                        this.importFavouritesBierdopje();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb:
                        this.importFavouritesImdb();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted:
                        this.importTimeWasted();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje:
                        this.importTimeWastedBierdopje();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.Export:
                        this.export();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.ExportFavourites:
                        this.exportFavourites();
                        break;
                    default:
                        this.navigateOther(url);
                        break;
                }
                window.scrollTo(0, 0);
                window.history.pushState({ "shortUrl": url }, "", url);
            }
            static import() {
                document.title = "Importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportController();
            }
            static importFavourites() {
                document.title = "Favorieten importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportFavouritesController();
            }
            static importFavouritesBierdopje() {
                document.title = "Bierdopje favorieten importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportBierdopjeFavouritesUserSelectionController();
            }
            static importFavouritesBierdopjeByUsername(username) {
                document.title = "Bierdopje favorieten importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.BierdopjeFavouriteSelectionController(username);
            }
            static importFavouritesImdb() {
                document.title = "IMDb series importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportImdbFavouritesUserSelectionController();
            }
            static importFavouritesImdbByUser(user) {
                document.title = "IMDb lijsten selecteren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImdbListSelectionControllerController(user);
            }
            static importTimeWasted() {
                document.title = "Time Wasted importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportTimeWastedController();
            }
            static importTimeWastedBierdopje() {
                document.title = "Bierdopje Time Wasted importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportTimeWastedBierdopjeUserSelectionController();
            }
            static importTimeWastedBierdopjeByUsername(username) {
                document.title = "Bierdopje Time Wasted importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportTimeWastedBierdopjeShowSelectionController(username);
            }
            static export() {
                document.title = "Exporteren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ExportController();
            }
            static exportFavourites() {
                document.title = `Favorieten exporteren | Seriesfeed`;
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ExportFavouritesController();
            }
            static navigateOther(url) {
                if (url.startsWith(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje)) {
                    const parts = url.split('/');
                    const username = parts[parts.length - 1];
                    this.importFavouritesBierdopjeByUsername(decodeURIComponent(username));
                    return;
                }
                if (url.startsWith(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb)) {
                    const parts = url.split('/');
                    const userId = parts[parts.length - 2];
                    const username = parts[parts.length - 1];
                    const user = new SeriesfeedTransporter.Models.ImdbUser(userId, decodeURIComponent(username));
                    this.importFavouritesImdbByUser(user);
                    return;
                }
                if (url.startsWith(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje)) {
                    const parts = url.split('/');
                    const username = parts[parts.length - 1];
                    this.importTimeWastedBierdopjeByUsername(decodeURIComponent(username));
                    return;
                }
            }
        }
        Services.RouterService = RouterService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class SettingsController {
            initialise() {
                if (!window.location.href.includes("users") || !window.location.href.includes("edit")) {
                    return;
                }
                const settingBlocks = $('.container.content .row');
                const localStorageBlock = this.getLocalStorageBlock();
                settingBlocks.append(localStorageBlock);
            }
            getLocalStorageBlock() {
                const block = $('<div/>').addClass('col-xs-12 col-md-6');
                const card = $('<div/>').attr('id', 'userscriptTool').addClass('blog-left cardStyle cardForm');
                const cardContent = $('<div/>').addClass('blog-content');
                const cardTitle = $('<h3/>').text("Userscripts");
                const cardParagraph = $('<p/>').text("Je maakt gebruik van het userscript \"Seriesfeed Transporter\". Dit script slaat gegevens van series en afleveringen op om de druk op de gerelateerde servers te verlagen. Deze data wordt gebruikt om (bij terugkerende acties) bekende data niet opnieuw te hoeven ophalen. Je kunt de lokale gegevens wissen als je problemen ondervindt met importeren/exporteren.");
                const dataDeleted = $('<p/>').text("De gegevens zijn gewist.").css({ marginBottom: '0', paddingTop: '5px' }).hide();
                const buttonAction = () => {
                    dataDeleted.hide();
                    SeriesfeedTransporter.Services.StorageService.clearAll();
                    setTimeout(() => dataDeleted.show(), 100);
                };
                const button = new SeriesfeedTransporter.ViewModels.Button('btn-success', 'fa-trash', "Lokale gegevens wissen", buttonAction);
                block.append(card);
                card.append(cardContent);
                cardContent.append(cardTitle);
                cardContent.append(cardParagraph);
                cardContent.append(button.instance);
                cardContent.append(dataDeleted);
                return block;
            }
        }
        Controllers.SettingsController = SettingsController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        Enums.ButtonType = {
            Default: "btn-default",
            Primary: "btn-primary",
            Success: "btn-success",
            Info: "btn-info",
            Warning: "btn-warning",
            Danger: "btn-danger",
            Link: "btn-link"
        };
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        Enums.LocalStorageKey = {
            BierdopjeShows: "bierdopje.shows",
            SeriesfeedShows: "seriesfeed.shows",
            SeriesfeedEpisodes: "seriesfeed.episodes"
        };
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        Enums.MarkType = {
            Obtained: "obtain",
            Seen: "seen"
        };
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        let NavigationType;
        (function (NavigationType) {
            NavigationType[NavigationType["Series"] = 0] = "Series";
            NavigationType[NavigationType["Fora"] = 1] = "Fora";
            NavigationType[NavigationType["Nieuws"] = 2] = "Nieuws";
            NavigationType[NavigationType["Community"] = 3] = "Community";
        })(NavigationType = Enums.NavigationType || (Enums.NavigationType = {}));
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        Enums.SeriesfeedError = {
            Unknown: "Unknown",
            NotFound: "Geen serie gevonden voor de gegeven data",
            CouldNotUpdateStatus: "Kon favorietenstatus niet bijwerken!"
        };
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        Enums.ShortUrl = {
            Import: "/series/import/",
            ImportFavourites: "/series/import/favourites/",
            ImportFavouritesBierdopje: "/series/import/favourites/bierdopje/",
            ImportFavouritesImdb: "/series/import/favourites/imdb/",
            ImportTimeWasted: "/series/import/timewasted/",
            ImportTimeWastedBierdopje: "/series/import/timewasted/bierdopje/",
            Export: "/series/export/",
            ExportFavourites: "/series/export/favourites/"
        };
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class Breadcrumb {
            constructor(text, shortUrl) {
                this.text = text;
                this.shortUrl = shortUrl;
            }
        }
        Models.Breadcrumb = Breadcrumb;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class Episode {
        }
        Models.Episode = Episode;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class LocalEpisode {
        }
        Models.LocalEpisode = LocalEpisode;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class Season {
        }
        Models.Season = Season;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class Show {
        }
        Models.Show = Show;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Providers;
    (function (Providers) {
        class TextInputProvider {
            static provide(width, placeholder, value) {
                return $('<input/>')
                    .attr('type', 'text')
                    .attr('placeholder', placeholder)
                    .attr('value', value)
                    .addClass('form-control')
                    .css({ maxWidth: width });
            }
        }
        Providers.TextInputProvider = TextInputProvider;
    })(Providers = SeriesfeedTransporter.Providers || (SeriesfeedTransporter.Providers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class AjaxService {
            static get(url) {
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
            static queue(request) {
                if (this._currentCalls < SeriesfeedTransporter.Config.MaxAsyncCalls) {
                    this._currentCalls++;
                    return request
                        .then((result) => {
                        this._currentCalls--;
                        return result;
                    })
                        .catch((error) => {
                        this._currentCalls--;
                        return error;
                    });
                }
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(this.queue(request));
                    }, 300);
                });
            }
            static post(url, data) {
                const request = new Promise((resolve, reject) => {
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: data,
                        dataType: "json"
                    }).done((data) => {
                        resolve(data);
                    }).fail((error) => {
                        reject(error);
                    });
                });
                return this.queue(request);
            }
        }
        AjaxService._currentCalls = 0;
        Services.AjaxService = AjaxService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class BierdopjeService {
            static getUsername() {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.BierdopjeBaseUrl + "/stats")
                    .then((result) => {
                    const statsData = $(result.responseText);
                    return statsData.find("#userbox_loggedin").find("h4").html();
                })
                    .catch((error) => {
                    throw `Could not get username from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static isExistingUser(username) {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                    .then((result) => {
                    const data = $(result.responseText);
                    return data.find("#page .maincontent .content-links .content h3").html() !== "Fout - Pagina niet gevonden";
                })
                    .catch((error) => {
                    throw `Could not check for existing user ${username} on ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}: ${error}`;
                });
            }
            static getAvatarUrlByUsername(username) {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                    .then((result) => {
                    const data = $(result.responseText);
                    return data.find('img.avatar').attr('src');
                })
                    .catch((error) => {
                    throw `Could not get avatar url for user ${username} from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static getFavouritesByUsername(username) {
                const url = SeriesfeedTransporter.Config.BierdopjeBaseUrl + "/users/" + username + "/shows";
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const data = $(result.responseText);
                    const dataRow = data.find(".content").find("ul").find("li").find("a");
                    const favourites = new Array();
                    dataRow.each((index, favourite) => {
                        const show = new SeriesfeedTransporter.Models.Show();
                        show.name = $(favourite).text();
                        show.slug = $(favourite).attr('href');
                        favourites.push(show);
                    });
                    return favourites;
                })
                    .catch((error) => {
                    window.alert(`Kan geen favorieten vinden voor ${username}. Dit kan komen doordat de gebruiker niet bestaat, geen favorieten heeft of er is iets mis met je verbinding.`);
                    throw `Could not get favourites for ${username} from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static getTheTvdbIdByShowSlug(showSlug) {
                const localTheTvdbId = this.getTvdbIdByShowSlugFromStorage(showSlug);
                if (localTheTvdbId != null) {
                    return Promise.resolve(localTheTvdbId);
                }
                return this.getTvdbIdByShowSlugFromApi(showSlug)
                    .then((theTvdbId) => {
                    this.addTvdbIdWithShowSlugToStorage(theTvdbId, showSlug);
                    return theTvdbId;
                });
            }
            static getTvdbIdByShowSlugFromStorage(showSlug) {
                const localShow = Services.StorageService.get(SeriesfeedTransporter.Enums.LocalStorageKey.BierdopjeShows);
                if (localShow != null) {
                    for (let i = 0; i < localShow.length; i++) {
                        if (localShow[i].slug === showSlug) {
                            return localShow[i].theTvdbId;
                        }
                    }
                }
                return null;
            }
            static getTvdbIdByShowSlugFromApi(showSlug) {
                const url = SeriesfeedTransporter.Config.BierdopjeBaseUrl + showSlug;
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const favouriteData = $(result.responseText);
                    const theTvdbId = favouriteData.find(`a[href^='${SeriesfeedTransporter.Config.TheTvdbBaseUrl}']`).html();
                    return theTvdbId;
                })
                    .catch((error) => {
                    throw `Could not get the TVDB of ${showSlug} from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static addTvdbIdWithShowSlugToStorage(theTvdbId, showSlug) {
                let localIds = Services.StorageService.get(SeriesfeedTransporter.Enums.LocalStorageKey.BierdopjeShows);
                if (localIds == null) {
                    localIds = new Array();
                }
                localIds.push({ theTvdbId: theTvdbId, slug: showSlug });
                Services.StorageService.set(SeriesfeedTransporter.Enums.LocalStorageKey.BierdopjeShows, localIds);
            }
            static getTimeWastedByUsername(username) {
                const url = SeriesfeedTransporter.Config.BierdopjeBaseUrl + "/user/" + username + "/timewasted";
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const bdTimeWastedData = $(result.responseText);
                    const timeWastedRows = bdTimeWastedData.find('table tr');
                    const shows = new Array();
                    timeWastedRows.each((index, timeWastedRow) => {
                        if (index === 0 || index === timeWastedRows.length - 1) {
                            return;
                        }
                        const show = new SeriesfeedTransporter.Models.Show();
                        show.name = $(timeWastedRow).find('td a').html();
                        show.slug = $(timeWastedRow).find('td a').attr('href');
                        shows.push(show);
                    });
                    return Services.ShowSorterService.sort(shows, "name");
                })
                    .catch((error) => {
                    throw `Could not get Time Wasted for user ${username} from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static getShowSeasonsByShowSlug(showSlug) {
                const url = SeriesfeedTransporter.Config.BierdopjeBaseUrl + showSlug + "/episodes/season/";
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const seasonsPageData = $(result.responseText);
                    const seasonsData = seasonsPageData.find('#page .maincontent .content .rightfloat select option');
                    const seasons = new Array();
                    seasonsData.each((index, seasonData) => {
                        const season = new SeriesfeedTransporter.Models.Season();
                        const seasonIdMatches = $(seasonData).text().match(/\d+/);
                        season.id = seasonIdMatches != null ? +seasonIdMatches[0] : 0;
                        season.slug = $(seasonData).attr('value');
                        seasons.push(season);
                    });
                    return seasons;
                })
                    .catch((error) => {
                    throw `Could not get seasons for show ${showSlug} from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static getShowSeasonEpisodesBySeasonSlug(seasonSlug) {
                const url = SeriesfeedTransporter.Config.BierdopjeBaseUrl + seasonSlug;
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const episodesPageData = $(result.responseText);
                    const episodesData = episodesPageData.find('.content .listing tr');
                    const episodes = new Array();
                    episodesData.each((index, episodeData) => {
                        if (index === 0) {
                            return;
                        }
                        const episode = new SeriesfeedTransporter.Models.Episode();
                        episode.tag = $(episodeData).find("td:eq(1)").text();
                        const acquiredStatus = $(episodeData).find('.AquiredItem[src="http://cdn.bierdopje.eu/g/if/blob-green.png"]').length;
                        episode.acquired = acquiredStatus === 1;
                        const seenStatus = $(episodeData).find('.SeenItem[src="http://cdn.bierdopje.eu/g/if/blob-green.png"]').length;
                        episode.seen = seenStatus === 1;
                        episodes.push(episode);
                    });
                    return episodes;
                })
                    .catch((error) => {
                    throw `Could not get episodes for show ${seasonSlug} from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
        }
        Services.BierdopjeService = BierdopjeService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class CardService {
            static initialise() {
                this.card = new SeriesfeedTransporter.ViewModels.Card();
                return this.card;
            }
            static getCard() {
                return this.card;
            }
        }
        Services.CardService = CardService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class DateTimeService {
            static getCurrentDateTime() {
                let now = new Date();
                let dd = now.getDate().toString();
                let mm = (now.getMonth() + 1).toString();
                let hh = now.getHours().toString();
                let mi = now.getMinutes().toString();
                const yyyy = now.getFullYear();
                if (+dd < 10) {
                    dd = '0' + dd;
                }
                if (+mm < 10) {
                    mm = '0' + mm;
                }
                if (+hh < 10) {
                    hh = '0' + hh;
                }
                if (+mi < 10) {
                    mi = '0' + mi;
                }
                return dd + '-' + mm + '-' + yyyy + '_' + hh + ':' + mi;
            }
        }
        Services.DateTimeService = DateTimeService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class ShowSorterService {
            static sort(shows, property) {
                return shows.sort((showA, showB) => {
                    if (showA[property] < showB[property]) {
                        return -1;
                    }
                    else if (showA[property] === showB[property]) {
                        return 0;
                    }
                    else {
                        return 1;
                    }
                });
            }
        }
        Services.ShowSorterService = ShowSorterService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class StorageService {
            static get(key) {
                const jsonValue = localStorage.getItem(key);
                return JSON.parse(jsonValue);
            }
            static set(key, value) {
                const jsonValue = JSON.stringify(value);
                localStorage.setItem(key, jsonValue);
            }
            static clearAll() {
                for (const key in SeriesfeedTransporter.Enums.LocalStorageKey) {
                    localStorage.removeItem(SeriesfeedTransporter.Enums.LocalStorageKey[key]);
                }
            }
        }
        Services.StorageService = StorageService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class TimeAgoTranslatorService {
            static getDutchTranslationOfTime(original) {
                switch (original) {
                    case "years":
                    case "year":
                        return "jaar";
                    case "months":
                        return "maanden";
                    case "month":
                        return "maand";
                    case "weeks":
                        return "weken";
                    case "week":
                        return "week";
                    case "days":
                        return "dagen";
                    case "day":
                        return "dag";
                    case "hours":
                    case "hour":
                        return "uur";
                    case "minutes":
                        return "minuten";
                    case "minute":
                        return "minuut";
                    case "seconds":
                        return "seconden";
                    case "second":
                        return "seconde";
                }
            }
            static getFullDutchTranslationOfMonthAbbreviation(month) {
                switch (month) {
                    case "Jan":
                        return "januari";
                    case "Feb":
                        return "februari";
                    case "Mar":
                        return "maart";
                    case "Apr":
                        return "april";
                    case "May":
                        return "mei";
                    case "Jun":
                        return "juni";
                    case "Jul":
                        return "juli";
                    case "Aug":
                        return "augustus";
                    case "Sep":
                        return "september";
                    case "Oct":
                        return "oktober";
                    case "Nov":
                        return "november";
                    case "Dec":
                        return "december";
                }
            }
        }
        Services.TimeAgoTranslatorService = TimeAgoTranslatorService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class Button {
            constructor(buttonType, iconClass, text, action, width) {
                this.instance = $('<div/>').addClass('btn');
                this.icon = $('<i/>').addClass('fa');
                this.text = $('<span/>');
                this.setButtonType(buttonType);
                this.setClick(action);
                this.setIcon(iconClass);
                this.setText(text);
                this.setWidth(width);
                this.instance.append(this.icon);
                this.instance.append(this.text);
            }
            setButtonType(buttonType) {
                if (this.currentButtonType != null || this.currentButtonType !== "") {
                    this.instance.removeClass(this.currentButtonType);
                    this.currentButtonType = null;
                }
                this.instance.addClass(buttonType);
                this.currentButtonType = buttonType;
            }
            setClick(action) {
                this.instance.unbind('click');
                if (action == null) {
                    return;
                }
                this.instance.click(action);
            }
            setIcon(iconClass) {
                if (this.currentIconClass != null || this.currentIconClass !== "") {
                    this.icon.removeClass(this.currentIconClass);
                    this.currentIconClass = null;
                }
                this.icon.addClass(iconClass);
                this.currentIconClass = iconClass;
            }
            setText(text) {
                if (text == null) {
                    this.text.text('');
                    return;
                }
                this.text.text(text);
            }
            setWidth(width) {
                this.instance.css({
                    width: width == null ? 'auto' : width
                });
            }
        }
        ViewModels.Button = Button;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class Card {
            constructor() {
                this.instance = $('<div/>').addClass("cardStyle cardForm formBlock").css({ transition: 'max-width .3s ease-in-out' });
                this.backButton = this.createBackButton();
                const titleContainer = $('<h2/>').css({ height: '60px' });
                this.title = $('<span/>');
                this.breadcrumbs = this.createBreadcrumbs();
                this.content = $('<div/>').attr('id', SeriesfeedTransporter.Config.Id.CardContent).addClass("cardFormInner");
                this.instance.append(titleContainer);
                titleContainer.append(this.title);
                titleContainer.append(this.backButton);
                this.instance.append(this.breadcrumbs);
                this.instance.append(this.content);
            }
            createBackButton() {
                return $('<i/>').css({
                    display: 'none',
                    float: 'left',
                    padding: '5px',
                    margin: '-4px',
                    cursor: 'pointer',
                    position: 'relative',
                    left: '10px'
                }).addClass("fa fa-arrow-left");
            }
            createBreadcrumbs() {
                const breadcrumbs = $('<h2/>').css({
                    display: 'none',
                    fontSize: '12px',
                    padding: '10px 15px',
                    background: '#5f7192',
                    borderRadius: '0 0 0 0',
                    mozBorderRadius: '0 0 0 0',
                    webkitBorderRadius: '0 0 0 0'
                });
                return breadcrumbs;
            }
            setBackButtonUrl(url) {
                this.backButton.hide();
                this.backButton.click(() => { });
                if (url == null) {
                    return;
                }
                this.backButton.show();
                this.backButton.click(() => SeriesfeedTransporter.Services.RouterService.navigate(url));
            }
            setTitle(title) {
                if (title == null) {
                    title = '';
                }
                this.title.text(title);
            }
            setBreadcrumbs(breadcrumbs) {
                this.breadcrumbs.hide();
                this.breadcrumbs.empty();
                if (breadcrumbs == null || breadcrumbs.length === 0) {
                    return;
                }
                for (let i = 0; i < breadcrumbs.length; i++) {
                    const breadcrumb = breadcrumbs[i];
                    const link = $('<span/>').text(breadcrumb.text);
                    if (breadcrumb.shortUrl != null) {
                        link
                            .css({ cursor: 'pointer', color: '#bfc6d2' })
                            .click(() => SeriesfeedTransporter.Services.RouterService.navigate(breadcrumb.shortUrl));
                    }
                    this.breadcrumbs.append(link);
                    if (i < breadcrumbs.length - 1) {
                        const chevronRight = $('<i/>')
                            .addClass('fa fa-chevron-right')
                            .css({
                            fontSize: '9px',
                            padding: '0 5px',
                            cursor: 'default'
                        });
                        this.breadcrumbs.append(chevronRight);
                    }
                    else {
                        link.css({ color: '#ffffff' });
                    }
                }
                this.breadcrumbs.show();
            }
            setContent(content) {
                this.content.empty();
                if (content == null) {
                    return;
                }
                this.content.append(content);
            }
            clear() {
                this.setTitle(null);
                this.setBackButtonUrl(null);
                this.setBreadcrumbs(null);
                this.setContent(null);
                this.setWidth();
            }
            setWidth(width) {
                this.instance.css({
                    maxWidth: width != null ? width : '400px'
                });
            }
        }
        ViewModels.Card = Card;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class CardButton {
            constructor(text, topAreaColour) {
                this.instance = $('<a/>').addClass("portfolio mix_all");
                const wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle");
                this.topArea = $('<div/>').addClass("portfolio-hover").css({ height: '100px' });
                const info = $('<div/>').addClass("portfolio-info");
                const title = $('<div/>').addClass("portfolio-title");
                const h4 = $('<h4/>').text(text);
                this.instance
                    .css({
                    textDecoration: 'none',
                    display: 'inline-block',
                    width: '100%',
                    transition: 'all .24s ease-in-out'
                })
                    .hover(() => this.instance.css({
                    webkitBoxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)',
                    boxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)'
                }), () => this.instance.css({
                    webkitBoxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)'
                }));
                this.topArea
                    .css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100px',
                    background: topAreaColour
                });
                this.instance.append(wrapper);
                wrapper.append(this.topArea);
                wrapper.append(info);
                info.append(title);
                title.append(h4);
            }
        }
        ViewModels.CardButton = CardButton;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class Checkbox {
            constructor(name) {
                this.instance = $('<fieldset/>');
                this.input = $('<input/>').attr('type', 'checkbox').addClass('hideCheckbox');
                this.label = $('<label/>');
                const span = $('<span/>').addClass('check');
                this.instance.append(this.input);
                this.instance.append(this.label);
                this.label.append(span);
                if (name != null && name !== '') {
                    this.name = name;
                }
                this.subscribers = [];
                this.input.click(() => this.toggleCheck());
            }
            set name(value) {
                this.input
                    .attr('id', value)
                    .attr('name', value);
                this.label.attr('for', value);
            }
            toggleCheck() {
                if (this.input.attr('checked') == null) {
                    this.input.attr('checked', 'checked');
                    this.callSubscribers(true);
                }
                else {
                    this.input.removeAttr('checked');
                    this.callSubscribers(false);
                }
            }
            callSubscribers(isEnabled) {
                this.subscribers.forEach((subscriber) => {
                    subscriber(isEnabled);
                });
            }
            subscribe(subscriber) {
                this.subscribers.push(subscriber);
            }
            check() {
                if (this.input.attr('checked') == null) {
                    this.input.click();
                    this.input.attr('checked', 'checked');
                }
            }
            uncheck() {
                if (this.input.attr('checked') != null) {
                    this.input.click();
                    this.input.removeAttr('checked');
                }
            }
        }
        ViewModels.Checkbox = Checkbox;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class ReadMoreButton {
            constructor(text, action) {
                this.instance = $('<div/>').addClass('readMore').css({ paddingRight: '10px' });
                const innerButton = $('<div/>').css({ textAlign: 'right' });
                this.link = $('<a/>');
                this.instance.append(innerButton);
                innerButton.append(this.link);
                this.text = text;
                this.setClick(action);
            }
            set text(value) {
                if (value == null) {
                    this.link.text('');
                    return;
                }
                this.link.text(value);
            }
            setClick(action) {
                this.instance.css({ cursor: 'default' }).unbind('click');
                if (action == null) {
                    return;
                }
                this.instance
                    .css({ cursor: 'pointer' })
                    .click(action);
            }
        }
        ViewModels.ReadMoreButton = ReadMoreButton;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class Table {
            constructor() {
                this.instance = $('<table/>').addClass('table table-hover responsiveTable stacktable large-only thicken-header');
                const thead = $('<thead/>');
                this.headerRow = $('<tr/>');
                this.tbody = $('<tbody/>');
                thead.append(this.headerRow);
                this.instance.append(thead);
                this.instance.append(this.tbody);
            }
            addHeaderItem(th) {
                this.headerRow.append(th);
            }
            addTheadItems(thCollection) {
                thCollection.map((th) => this.headerRow.append(th));
            }
            addRow(tr) {
                this.tbody.append(tr);
            }
            getRow(index) {
                const row = this.tbody.children()[index];
                return $(row);
            }
            updateRow(index, value) {
                const row = this.tbody.children()[index];
                return $(row).replaceWith(value);
            }
        }
        ViewModels.Table = Table;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class User {
            constructor() {
                this.unknownUserAvatarUrl = "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMjI2NDEyMjYyMF5BMl5BanBnXkFtZTcwMzM3MDk0OQ._SY100_SX100__zpshzfut2yd.jpg";
                this.instance = $('<div/>').addClass("portfolio mix_all");
                const wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle").css({ cursor: 'inherit' });
                this.topText = $('<h4/>').css({ padding: '15px 0 0 15px' });
                const hover = $('<div/>').addClass("portfolio-hover").css({ padding: '15px 15px 5px 15px', height: '170px' });
                this.avatar = $('<img/>').addClass("user-img").css({ maxHeight: '150px' }).attr('src', this.unknownUserAvatarUrl);
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
            setTopText(text) {
                this.topText.text(text);
            }
            setUsername(username) {
                this.username.text(username);
            }
            replaceUsername(element) {
                this.username.replaceWith(element);
            }
            setAvatarUrl(avatarUrl) {
                if (avatarUrl == null || avatarUrl === "") {
                    this.avatar.attr('src', this.unknownUserAvatarUrl);
                }
                this.avatar.attr('src', avatarUrl);
            }
            setWidth(width) {
                this.instance.css({
                    width: width != null ? width : 'auto'
                });
            }
            set onClick(action) {
                this.instance.css({ cursor: 'default' }).unbind('mouseenter mouseleave click');
                if (action == null) {
                    return;
                }
                this.instance
                    .css({ cursor: 'pointer' })
                    .hover(() => this.instance.css({
                    webkitBoxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)',
                    boxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)'
                }), () => this.instance.css({
                    webkitBoxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)'
                }))
                    .click(action);
            }
        }
        ViewModels.User = User;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class StyleService {
            static loadGlobalStyle() {
                const css = `<style>
            input[type="checkbox"] + label span {
                margin-top: -3px;
            }

            fieldset {
                margin-top: 0px !important;
            }

            .progress {
                width: 90%;
                margin: 0 auto;
            }

            .progress-bar {
                background: #447C6F;
            }

            .fa-flip-x {
                animation-name: flipX;
                animation-duration: 2s;
                animation-iteration-count: infinite;
                animation-direction: alternate;
                animation-timing-function: ease-in-out;
            }

            @keyframes flipX {
                0% {
                    transform: rotateX(0);
                }
                50% {
                    transform: rotateX(180deg);
                }
            }

            .fa-flip-y {
                animation-name: flipY;
                animation-duration: 2s;
                animation-iteration-count: infinite;
                animation-direction: alternate;
                animation-timing-function: ease-in-out;
            }

            @keyframes flipY {
                0% {
                    transform: rotateY(0);
                }
                50% {
                    transform: rotateY(180deg);
                }
            }

            .table.thicken-header thead {
                border-bottom: 2px solid #d9d9d9;
            }

            .brackets {
                text-rendering: auto;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        </style>`;
                $('body').append(css);
            }
        }
        Services.StyleService = StyleService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
