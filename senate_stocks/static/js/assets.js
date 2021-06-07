'use strict';

const assetPageButtons = ['allAssetsButton','publicStocksButton','otherAssetsButton'];

const FILTER_OPTIONS = ['name','ticker'],
	FILTER_FUNCS = [compareAssetName, compareAssetTicker];

var offset = 0,
	assetsPerPage = 25,
	sortDateAsc = false,
	sortAlphaAsc = false;

/**
 * Generic function to sort elements from least to most
 * for use in Array.sort()
 *
 * @param {Function} func - the function to use to compare elements
 * @return {Number}
 *
 */
function asc(func) {
	return (a,b) => {
		if (func(a) < func(b)) { return -1; }
		else if (func(a) == func(b)) { return 0; }
		else { return 1; }
	}
}

/**
 * Generic function to sort elements from most to least
 * for use in Array.sort()
 *
 * @param {Function} func - the function to use to compare elements
 * @return {Number}
 *
 */
function desc(func) {
	return (a,b) => {
		if (func(a) > func(b)) { return -1; }
		else if (func(a) == func(b)) { return 0; }
		else { return 1; }
	}
}

async function getAssets() {
	let assetPromise = await fetch("/api/assets");

	if (assetPromise.ok) {
		const assets = await assetPromise.json();
		return assets;
	}
}
var results;
getAssets()
	.then(d => {
		// clear filter and sort fields on page reload
		resetFilterOptions();

		// populate page with all assets
		makePages(d);
		sortAssets(d,'Last trade (newest to oldest)')
		nextCards(d);

		document.getElementById("loading").remove();

		// deep copy of all assets to store what's
		// currently displayed on page
		results = JSON.parse(JSON.stringify(d));
		
		let nameDelay;
		document.getElementById("name")
			.addEventListener("input", e => {
				clearTimeout(nameDelay);
				nameDelay = setTimeout(() => { 
					results = filterAssets(d)
				},250);
			});

		let tickerDelay;
		document.getElementById("ticker")
			.addEventListener("input", e => {
				clearTimeout(tickerDelay);
				tickerDelay = setTimeout(() => {
					results = filterAssets(d)
				},250);
			});

		document.getElementById("sort")
			.addEventListener("input", e => {
				results = sortAssets(results,e.currentTarget.value);
			})

	});

/**
 * Reset filter options to default values
 */
function resetFilterOptions() {
		document.getElementById("name").value = '';
		document.getElementById(("ticker")).value = '';
		document.getElementById("sort").value = 'Last trade (newest to oldest)';
}

/**
 * Filters the asset cards based on user input
 */
function filterAssets(assets) {
	let values = FILTER_OPTIONS.map(x => document.getElementById(x).value);
	let filters = FILTER_FUNCS.map((func,i) => func(values[i]));

	let results = assets;
	for (const f of filters) {
		results = results.filter(f);
	}

	clearAssetCards();
	clearPages();
	makePages(results);
	nextCards(results);

	return results;
}

/**
 * Higher order function that returns a function to compare
 * an asset object's name with a given value
 *
 * @param {String} name 
 * @return {Function} - compares an asset with a specific
 * name value
 *
 */
function compareAssetName(name) {
	if (name == "") {
		return x => true;
	}
	else {
		return x => x.name.toUpperCase().includes(name.toUpperCase());
	}
}

/**
 * Higher order function that return a function to compare
 * an asset object's ticker with a given value
 *
 * @param {String} ticker
 * @return {Function} - compares an asset's ticker with a
 * specfic value
 *
 */
function compareAssetTicker(ticker) {
	if (ticker == "") {
		return x => true;
	}
	else {
		return x => x.ticker.toUpperCase().includes(ticker.toUpperCase());
	}
}

// sort function for dates
const compareDate = function(a, b) {
	let dateAList = a.latest.split('-').map(x => Number(x));
	let dateBList = b.latest.split('-').map(x => Number(x));

	for (let i = 0; i < dateAList.length; i++) {
		if (dateAList[i] > dateBList[i]) {
			return 1;
		}
		if (dateAList[i] < dateBList[i]) {
			return -1;
		}
	}

	return 0;
}

function changeActiveSortButton(id) {

	let sortOptions = document.getElementById("sortOptions");
	for(let button of sortOptions.querySelectorAll("button")) {
		if (button.id == id) {
			button.setAttribute("class","nav-link active");
		}	
		else {
			button.setAttribute("class","nav-link");
		}
	}
}

function changeActivePageNumber(pageNumber) {
	// remove active status from old active page
	let oldActivePage = document.querySelector(".pagination")
		.querySelector(".active");

	// if we're moving away from page 1, re-enable previous button
	if (oldActivePage.id == "page-1") {
		let prevPage = document.getElementById("prev-page");
		prevPage.setAttribute("class","page-item");
		prevPage.removeAttribute("aria-disabled");
	}

	oldActivePage.setAttribute("class","page-item");
	oldActivePage.removeAttribute("aria-current");
	
	// add active status to current active page
	let newActivePage = document.getElementById("page-"+pageNumber);
	newActivePage.setAttribute("class","page-item active");
	newActivePage.setAttribute("aria-current","page");

	// if our new active page is page 1, disable previous button
	if (newActivePage.id == "page-1") {
		let prevPage = document.getElementById("prev-page");
		prevPage.setAttribute("class","page-item disabled");
		prevPage.setAttribute("aria-disabled","true");
	}
	
	// if our new active page is the last page, disable next button
	if (newActivePage.nextSibling.id == "next-page") {
		let nextPage = document.getElementById("next-page");
		nextPage.setAttribute("class","page-item disabled");
		nextPage.setAttribute("aria-disabled","true");
	}
}

function sortAssets(assets, val) {
	let sorted;
	switch (val) {
		case 'Trades (most to least)':
			sorted = assets.sort(desc(x => x.count));
			break;
		case 'Trades (least to most)':
			sorted = assets.sort(asc(x => x.count));
			break;
		case 'Last trade (oldest to newest)':
			sorted = assets.sort(compareDate);
			break;
		case 'Last trade (newest to oldest)':
			sorted = assets.sort((a,b) => compareDate(a,b) * -1);
			break;
	}

	// changeActiveSortButton(value);
	nextCards(sorted);
	return sorted;
}

/**
 * Clears pages navigation at bottom of page
 *
 */
function clearPages() {
	let pages = document.getElementById("pages").querySelectorAll("li");
	for (let i = 1; i < pages.length-1; i++) {
		document.getElementById("pages").removeChild(pages[i]);
	}
}
/**
 * Create the page numbers at the bottom of the screen.
 *
 */
function makePages(assets) {
	let numPages = Math.ceil(assets.length / assetsPerPage);
	let nextPageButton = document.getElementById("next-page");

	for(let i = 1; i <= numPages; i++) {
		let outer = document.createElement("li");
		outer.setAttribute("class","page-item");
		outer.setAttribute("id","page-"+i);
		let inner = document.createElement("a");
		inner.setAttribute("class","page-link");
		inner.addEventListener("click", () => nextCards(assets,i));
		inner.innerHTML = i;
		outer.appendChild(inner);
		document.getElementById("pages").insertBefore(outer,nextPageButton);
	}

	//make first page button active
	document.getElementById("pages").children[1]
		.setAttribute("class","page-item active");
}

function clearAssetCards() {
	let cards = document.getElementById("asset-cards");
	while(cards.childNodes[0]) {
		cards.removeChild(cards.childNodes[0]);
	}
}

function nextCards(assets, pageNumber) {
	clearAssetCards();

	let i, end;
	// if nextCards is called with no pageNumber, 
	// we're on the first page of results
	if (typeof pageNumber == 'undefined') {
		offset = 0;
		i = offset;
		end = offset + assetsPerPage;
		pageNumber = 1;
	}
	else {
		i = (pageNumber - 1) * assetsPerPage;
		end = i + assetsPerPage;
	}

	for(i; i < end; i++) {
		if (i < assets.length) {
			// console.log(assets[i]);
			// timeout is just for the visual effect
			setTimeout((j => createCard(assets[j]))(i), i*50);
		}
	}
	offset = offset + assetsPerPage; 

	changeActivePageNumber(pageNumber);
}

function prevCards() { 
	offset = offset - 2 * assetsPerPage;
	if (offset > -1) {
		nextCards();
	}
	else {
		offset = 0;
	}
}
// nextCards();

function createCard(asset) {
	// console.log(asset);
	let col = document.createElement("div");
	col.setAttribute("class","col asset-card");
	document.getElementById("asset-cards").appendChild(col);

	let card = document.createElement("div");
	card.setAttribute("class","card m-3 animated shadow-sm");
	card.setAttribute("style","width: 20rem;");
	col.appendChild(card);

	let header = document.createElement("h6");
	header.setAttribute("class","card-header");
	card.appendChild(header);

	let flex = document.createElement("div");
	flex.setAttribute("class","d-flex justify-content-between align-items-center");

	let div = document.createElement("div");
	div.setAttribute("class", "flex-grow-1");
	div.innerHTML = asset.name + "  (<span class='ticker'>" + asset.ticker + "</span>)"
	flex.appendChild(div);
	header.appendChild(flex);

	let span = document.createElement("span");
	span.setAttribute("class","badge bg-secondary");
	span.innerHTML = asset.count + " trades";
	flex.appendChild(span);

	let cardBody = document.createElement("div");
	cardBody.setAttribute("class","card-body");
	card.appendChild(cardBody);

	let bodyFlex = document.createElement("div");
	bodyFlex.setAttribute("class","d-flex justify-content-between");
	cardBody.appendChild(bodyFlex);

	// let ticker = document.createElement("h6");
	// ticker.setAttribute("class","asset-ticker");
	// ticker.innerHTML = asset.ticker;
	// bodyFlex.appendChild(ticker);

	let lastTrade = document.createElement("small");
	lastTrade.setAttribute("class","text-muted");
	lastTrade.innerHTML = "Last traded on " + Date.parse(asset.latest).toString("MMMM d, yyyy") + "\n by Sen. " + asset.last_senator;
	bodyFlex.appendChild(lastTrade);

	// let link = document.createElement("a");
	// link.setAttribute("href","/asset/" + asset.id);
	// link.setAttribute("type","button");
	// link.setAttribute("class","btn btn-outline-info btn-sm mt-3");
	// link.innerHTML = "View Asset";
	// cardBody.appendChild(link);
	
	let linkWrapper = document.createElement("h6");
	linkWrapper.setAttribute("class", "asset-link")
	let link = document.createElement("a");
	link.setAttribute("class","stretched-link link-dark");
	link.innerHTML = "<br>View asset";
	link.href = "/asset/" + asset.id;
	linkWrapper.appendChild(link);
	cardBody.appendChild(linkWrapper);

	// set hover behavior
	card.addEventListener("mouseover", function(e) {
		e.currentTarget.setAttribute("class", "card m-3 animated shadow");
		// e.currentTarget.querySelector("small")
			// .setAttribute("class","text-white");
		e.currentTarget.querySelector(".badge")
			.setAttribute("class","badge bg-primary");
		// e.currentTarget.querySelector(".btn")
		// 	.setAttribute("class","btn btn-info btn-sm mt-3");
	});
	card.addEventListener("mouseleave", function(e) {
		e.currentTarget.setAttribute("class", "card m-3 animated shadow-sm");
		// e.currentTarget.querySelector("small")
		// 	.setAttribute("class","text-muted");
		e.currentTarget.querySelector(".badge")
			.setAttribute("class","badge bg-secondary");
		// e.currentTarget.querySelector(".btn")
		// 	.setAttribute("class","btn btn-outline-info btn-sm mt-3");
	});
}

function changeActiveButton(id) {
	for(let buttonID of assetPageButtons) {
		if (buttonID == id) {
			document.getElementById(buttonID).setAttribute("class","nav-link active");
		}
		else {
			document.getElementById(buttonID).setAttribute("class","nav-link");
		}
	}
}

function filterPublicStocks(id) {
	let assetCards = document.
		getElementById("asset-cards").
		querySelectorAll(".asset-card");

	for (let card of assetCards) {
		if (card.querySelector(".ticker").innerHTML == "--") {
			card.setAttribute("style","visibility:hidden;display:none;");
		}
		else {
			card.setAttribute("style","visibility:visible;display:");
		}
	}
	changeActiveButton(id);
}

function filterOtherAssets(id) {
	let assetCards = document.
		getElementById("asset-cards").
		querySelectorAll(".asset-card");

	for (let card of assetCards) {
		if (card.querySelector(".ticker").innerHTML != "--") {
			card.setAttribute("style","visibility:hidden;display:none;");
		}
		else {
			card.setAttribute("style","visibility:visible;display:");
		}
	}
	changeActiveButton(id);
}

function displayAllAssets(id) {
	let assetCards = document.
		getElementById("asset-cards").
		querySelectorAll(".asset-card");

	for (let card of assetCards) {
		card.setAttribute("style","visibility:visible;display:");
	}

	changeActiveButton(id);
}
