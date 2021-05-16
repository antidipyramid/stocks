const assetPageButtons = ['allAssetsButton','publicStocksButton','otherAssetsButton'];
var offset = 0,
	assetsPerPage = 50,
	sortDateAsc = false,
	sortAlphaAsc = false,
	assets;

const compareDateRev = (a, b) => compareDate(a,b) * -1;

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

const compareName = function(a, b) {
	if (a.name.toLowerCase() > b.name.toLowerCase()) {
		return 1;
	}
	if (a.name.toLowerCase() < b.name.toLowerCase()) {
		return -1;
	}
	else {
		return 0;
	}
}

const compareNameRev = (a, b) => compareName(a,b) * -1

async function getAssets() {
	let assetPromise = await fetch("/api/assets");

	if (assetPromise.ok) {
		assets = await assetPromise.json();
		return assets;
	}
}
getAssets()
	.then(makePages)
	.then(nextCards)
	.then(() => document.getElementById("loading").remove());

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
	let pages = document.getElementById("pages");
	for(let page of pages.children) {
		if (page.innerHTML == String(pageNumber)) {
			page.setAttribute("class","page-item active");
		}	
		else {
			page.setAttribute("class","page-item");
		}
	}
}

function sortCards(value) {

	switch (value) {
		case 'sortByDate':
			if (!sortDateAsc) {
				assets.sort(compareDate);
				sortDateAsc = true;
				document.getElementById(value).innerHTML = "By Date 🠕";	
			}
			else {
				assets.sort(compareDateRev);
				sortDateAsc = false;
				document.getElementById(value).innerHTML = "By Date 🠗";	
			}
			break;

		case 'sortAlphabetically':
			if (!sortAlphaAsc) {
				assets.sort(compareName);
				sortAlphaAsc = true;
				document.getElementById(value).innerHTML = "A-Z 🠕";	
			}
			else {
				assets.sort(compareNameRev);
				sortAlphaAsc = false;
				document.getElementById(value).innerHTML = "A-Z 🠗";	
			}
			break;

	}

	changeActiveSortButton(value);
	nextCards(1);

}

function makePages() {
	numPages = Math.ceil(assets.length / assetsPerPage);
	let nextPageButton = document.getElementById("nextPageButton");

	for(let i = 1; i <= numPages; i++) {
		let outer = document.createElement("li");
		outer.setAttribute("class","page-item");
		let inner = document.createElement("a");
		inner.setAttribute("class","page-link");
		inner.setAttribute("onclick","nextCards(" + i + ")");
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

function nextCards(pageNumber) {
	clearAssetCards();

	let i, end;
	if (typeof pageNumber == 'undefined') {
		i = offset;
		end = offset + assetsPerPage;
	}
	else {
		i = (pageNumber - 1) * assetsPerPage;
		end = i + assetsPerPage;
	}

	for(i; i < end; i++) {
		console.log(i);
		if (i < assets.length) {
			setTimeout(() => createCard(assets[i]), i*50);
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
	console.log(asset);
	let col = document.createElement("div");
	col.setAttribute("class","col asset-card");
	document.getElementById("asset-cards").appendChild(col);

	let card = document.createElement("div");
	card.setAttribute("class","card m-3 animated");
	card.setAttribute("style","width: 20rem;");
	col.appendChild(card);

	let header = document.createElement("h6");
	header.setAttribute("class","card-header");
	card.appendChild(header);

	let flex = document.createElement("div");
	flex.setAttribute("class","d-flex justify-content-between align-items-center");
	flex.innerHTML = asset.name;
	header.appendChild(flex);

	let span = document.createElement("span");
	span.setAttribute("class","badge bg-secondary rounded-pill");
	span.innerHTML = asset.count + " trades";
	flex.appendChild(span);

	let cardBody = document.createElement("div");
	cardBody.setAttribute("class","card-body");
	card.appendChild(cardBody);

	let bodyFlex = document.createElement("div");
	bodyFlex.setAttribute("class","d-flex justify-content-between");
	cardBody.appendChild(bodyFlex);

	let ticker = document.createElement("h6");
	ticker.setAttribute("class","asset-ticker");
	ticker.innerHTML = asset.ticker;
	bodyFlex.appendChild(ticker);

	let lastTrade = document.createElement("small");
	lastTrade.setAttribute("class","text-muted");
	lastTrade.innerHTML = "Last traded on " + Date.parse(asset.latest).toString("MMMM d, yyyy") + "\n by " + asset.last_senator;
	bodyFlex.appendChild(lastTrade);

	let link = document.createElement("a");
	link.setAttribute("href","/asset/" + asset.id);
	link.setAttribute("type","button");
	link.setAttribute("class","btn btn-outline-dark btn-sm mt-3");
	link.innerHTML = "View Asset";
	cardBody.appendChild(link);

	// set hover behavior
	card.addEventListener("mouseover", function(e) {
		e.currentTarget.setAttribute("class", "card text-white bg-secondary m-3 animated");
		e.currentTarget.querySelector("small")
			.setAttribute("class","text-white");
		e.currentTarget.querySelector(".badge")
			.setAttribute("class","badge bg-info rounded-pill");
		e.currentTarget.querySelector(".btn")
			.setAttribute("class","btn btn-info btn-sm mt-3");
	});
	card.addEventListener("mouseleave", function(e) {
		e.currentTarget.setAttribute("class", "card m-3 animated");
		e.currentTarget.querySelector("small")
			.setAttribute("class","text-muted");
		e.currentTarget.querySelector(".badge")
			.setAttribute("class","badge bg-secondary rounded-pill");
		e.currentTarget.querySelector(".btn")
			.setAttribute("class","btn btn-outline-dark btn-sm mt-3");
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
		if (card.querySelector(".asset-ticker").innerHTML == "--") {
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
		if (card.querySelector(".asset-ticker").innerHTML != "--") {
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
