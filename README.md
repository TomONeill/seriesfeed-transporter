# Seriesfeed Transporter
Import and export your favourites and time wasted on Seriesfeed.com
<BR/>
Enjoy.
<BR/><BR/>
Version <strong>1.1</strong>

<A HREF="https://github.com/TomONeill/seriesfeed-transporter/raw/master/seriesfeed-transporter-latest.user.js">INSTALL</A>

# Features
- Import your Favourites from Bierdopje.com
- Import Time Wasted from Bierdopje.com
- (soon) Import lists from IMDb.com as favourites
- Export your favourites to Excel or other formats (`TSV`, `CSV`, `XML`, `JSON`)
- (soon) Sync Bierdopje updates with Seriesfeed

# Screenshots
Click to zoom:<br/>
<a href="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/menu.PNG" target="_blank"><img src="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/menu.PNG" width="100px" /></a><a href="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/import.PNG" target="_blank"><img src="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/import.PNG" width="250px" /></a><a href="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/import%20favourites.PNG" target="_blank"><img src="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/import%20favourites.PNG" width="250px" /></a><a href="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/import%20time%20wasted.PNG" target="_blank"><img src="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/import%20time%20wasted.PNG" width="250px" /></a><a href="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/export%20favourites%20details.PNG" target="_blank"><img src="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/export%20favourites%20details.PNG" width="250px" /></a><a href="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/export%20favourites.PNG" target="_blank"><img src="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/export%20favourites.PNG" width="250px" /></a><a href="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/settings.PNG" target="_blank"><img src="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/screenshots/settings.PNG" width="250px" /></a>

# Changelog
<A HREF="https://raw.githubusercontent.com/TomONeill/seriesfeed-transporter/master/changelog.txt">View changelog</A>

# Other userscripts
Check out other userscripts for Seriesfeed by me:<BR/>
<ul>
    <li><A HREF="https://github.com/TomONeill/Seriesfeed-Move">Seriesfeed Move</A>: drag and drop frontpage items to your liking.</li>
    <li><A HREF="https://github.com/TomONeill/seriesfeed-favourites-dropdown">Seriesfeed Favourites Dropdown</A>: Choose your favourites from a dropdown on any page, just like Bierdopje!</li>
	  <li><A HREF="https://github.com/TomONeill/seriesfeed-episode-inverter">Seriesfeed Episode Inverter</A>: Choose whether episodes are sorted ascending or descending.</li>
    <li><A HREF="https://github.com/TomONeill/Seriesfeed-Season-Separator">Seriesfeed Season Separator</A>: Draws a thick line between seasons.</li>
</ul>

# Donate
If you like my work so much you feel like doing something nice for me, a complete stranger of the internet, you can.<BR />
<A HREF="https://www.paypal.me/TomONeill">Donate here</A>.

# Development
If you want to help with the development, you can. To setup the dev in combination with Tampermonkey/other, do the following:
1. Open the repository in your favourite IDE.
2. Open CMD, PowerShell or the terminal (VS Code tip: use CTRL + \`).<br/>
2.5: If not already, `cd` to this repository.
3. Type: `tsc --watch` to run the TypeScript compiler. The `tsconfig.json` file will determine the location of the output.
4. Add a userscript with the following:
```
	// ==UserScript==
	// @name         Seriesfeed Transporter
	// @namespace    https://www.seriesfeed.com
	// @version      dev
	// @description  Import and export your favourites and time wasted on Seriesfeed.com.
	// @match        https://*.seriesfeed.com/*
	// @grant        unsafeWindow
	// @grant        GM_xmlhttpRequest
	// @connect      www.bierdopje.com
	// @connect      www.imdb.com
	// @domain       www.bierdopje.com
	// @domain       www.imdb.com
	// @require      https://code.jquery.com/jquery-3.2.1.min.js
	// @require      file://{YOUR_CLONE}/seriesfeed-transporter-latest.user.js
	// @author       Tom
	// @copyright    2017 - 2020, Tom
	// ==/UserScript==
	/* jshint -W097 */
	/* global $, GM_xmlhttpRequest, Promise, console */
	'use strict';
```
5. Make sure you have ticked the box `Allow access to file URLs` for the Tampermonkey/other extension.

Any change will compile (some would say transpile) and a browser refresh will do the rest.
