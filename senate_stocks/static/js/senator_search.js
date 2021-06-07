'use strict';
const SENATOR_CARDS = 'senator-cards',
	SEN_PHOTO_CLASSES = 'card-img-top',
	CARD_STYLE = 'width:15rem;',
	COL2_STYLE =  'text-align:center;',
	BUTTON_CLASSES = 'btn btn-info btn-sm',
	BUTTON_STYLE = 'display:inline-block;',
	BUTTON_LINK = '/senator/',
	LIST_GROUP_CLASSES = 'list-group list-group-flush',
	SENATOR_ATTRS = ['Name', 'State', 'Party']

const senatorList = [],
	url = '/api/senators';

/**
 * Fetch senators from the API. These senators are stored in a 
 * global variable to be used if the user wants to filter the
 * results.
 *
 * @param {String} url - API address
 *
 */
async function fetchSenators(url) {
	const response = await fetch(url);
	console.log(response);
	return response.json();
}

/**
 * Creates senator cards given a list of senator objects.
 *
 * @param {Array} senators
 *
 */
var results;
function loadSenatorCards(senators) {
	let anchor = document.getElementById("senator-cards");
	for (const senator of senators) {
		let card = document.createElement("div");
		card.setAttribute("class", "card animated mb-3 shadow-sm sen-card");
		card.setAttribute("style", "width:25rem;");

		let row = document.createElement("div");
		row.setAttribute("class", "row g-0");
		card.appendChild(row);
		let col = document.createElement("div");
		col.setAttribute("class","col-md-4");
		row.appendChild(col);
		let img = document.createElement("img");
		img.setAttribute("src", senator.photo_url);
		img.setAttribute("class", "img-fluid senator-img");
		img.setAttribute("style", "object-fit:cover;height:100%;")
		col.appendChild(img);

		let col2 = document.createElement("div");
		col2.setAttribute("class", "col-md-8");
		let body = document.createElement("div")
		body.setAttribute("class", "card-body");
		col2.appendChild(body);
		row.appendChild(col2);
		let title = document.createElement("h5");
		title.setAttribute("class", "card-title");
		body.appendChild(title);
		let link = document.createElement("a");
		link.setAttribute("class", "link-dark card-link stretched-link");
		link.setAttribute("href", "/senator/" + senator.id);
		link.innerHTML = senator.first_name + " " + senator.last_name;
		title.appendChild(link);

		let info = document.createElement("div");
		info.setAttribute("class", "d-flex flex-row align-items-center");
		let subtitle = document.createElement("h6");
		subtitle.setAttribute("class", "flex-grow-1 card-subtitle");
		subtitle.innerHTML = "(" + senator.party + "-" + senator.state + ")";
		info.appendChild(subtitle);

		let badgeContainer = document.createElement("div");
		let badge = document.createElement("span");
		badge.setAttribute("class", "badge bg-primary");
		badge.innerHTML = senator.count + " trades";
		badgeContainer.appendChild(badge);
		info.appendChild(badgeContainer);
		body.appendChild(info);

		let latest = document.createElement("p");
		latest.setAttribute("class", "text-muted mb-auto latest-info");
		let small = document.createElement("small");
		let bold = document.createElement("b");
		bold.innerHTML = "Most recent: ";
		small.appendChild(bold);
		small.innerHTML = "Latest trade: " + senator.latest.asset_name.slice(0,25) + " on " + Date.parse( senator.latest.transaction_date ).toString("MMMM d, yyyy");
		latest.appendChild(small);
		body.appendChild(latest);

	anchor.appendChild(card);
	}
}
fetchSenators(url)
	.then(d => { 
		loadSenatorCards(d);
		results = JSON.parse(JSON.stringify(d));
		console.log(results);
		document.getElementById("num-results").innerHTML = d.length;

		document.getElementById("party")
			.addEventListener("input", e => {
				results = filterSenators(d);
				document.getElementById("num-results").innerHTML = results.length;
			})

		document.getElementById("state")
			.addEventListener("input", e => {
				results = filterSenators(d);
				document.getElementById("num-results").innerHTML = results.length;
			})

		let delay;
		document.getElementById("name")
			.addEventListener("input", e => {
				clearTimeout(delay);
				delay = setTimeout(curr => {
					results = filterSenators(d);
					document.getElementById("num-results").innerHTML = results.length;
				},250,e.currentTarget);
			})

		document.getElementById("sort")
			.addEventListener("input", e => {
				results = sortSenators(results,e.originalTarget.value);
			})
	})


/**
 * Clear all senators from page
 *
 * @param {String} id - parent element of senator cards
 */
function clearSenators(id='senator-cards') {
	let senatorsParent = document.getElementById(id);
	while (senatorsParent.childNodes[0]){
		senatorsParent.removeChild(senatorsParent.childNodes[0]);
	}
}


/**
 * Filters senators for display on senators page
 *
 * @param {Array} senators - list of Senator instances
 */
function filterSenators(senators) {
	let values = ['party','name','state'].map(id => {
		return document.getElementById(id).value;
	});
	let filters = [compareParty,compareName,compareState].map((func,i) => {
		return func(values[i]);	
	});

	let results = senators;
	for (const f of filters) {
		results = results.filter(f);
	}

	clearSenators();
	loadSenatorCards(results);
	return results;
}

function compareParty(party) {
	if (party == 'All') {
		return x => true;
	}
	else {
		return x => party == x.party;
	}
}

function compareState(state) {
	if (state == 'All') {
		return x => true;
	}
	else {
		return x => state == x.state;
	}
}

function compareName(name) {
	if (name == '') {
		return x => true;
	}
	else {
		return x => ( x.first_name + " " + x.last_name )
			.toUpperCase().includes(name.toUpperCase());
	}
}

function asc(func) {
	return (a,b) => {
		if (func(a) < func(b)) { return -1; }
		else if (func(a) == func(b)) { return 0; }
		else { return 1; }
	}
}

function desc(func) {
	return (a,b) => {
		if (func(a) > func(b)) { return -1; }
		else if (func(a) == func(b)) { return 0; }
		else { return 1; }
	}
}

function sortSenators(senators, val) {
	let sorted;
	switch (val) {
		case 'Trades (most to least)':
			sorted = senators.sort(desc(x => x.count));
			break;
		case 'Trades (least to most)':
			sorted = senators.sort(asc(x => x.count));
			break;
		case 'Last trade (newest to oldest)':
			sorted = senators.sort(desc(x => Date.parse(x.latest.transaction_date).getTime()));
			break;
		case 'Last trade (oldest to newest)':
			sorted = senators.sort(asc(x => Date.parse(x.latest.transaction_date).getTime()));
			break;
	}

	clearSenators();
	loadSenatorCards(senators);
	return sorted;
}





// function filterSenators(allSenators) {
// 	var results = [];
// 	for (let senator of allSenators) {

// 		let match = true;
// 		for (let i = 1; i < arguments.length; i++) {
// 			let arg = arguments[i].toLowerCase();
// 			let ele = document.getElementById(arg);
// 			let data = senator[arg].toLowerCase(),
// 				query = ele.value.toLowerCase();
// 			if (query == "all") {
// 				continue;
// 			}
// 			// if ele is a text input, check if query
// 			// matches any part of data
// 			if(ele.tagName.toLowerCase() == "input") {
// 				if (data.indexOf(query) < 0) {
// 					match = false;
// 					break;
// 				}
// 			}
// 			// otherwise, just check if they're equal
// 			else {
// 				if (data != query) {
// 					match = false;
// 					break;
// 				}
// 			}
// 		}

// 		if (match) {
// 			results.push(senator);
// 		}
// 	}
// 	return results;	
// }

/**
 * Resets senators by re-displaying all senators
 *
 * @param senators - list of sentors instances
 *
 */
function resetSenators(senators) {
	clearSenators('senator-cards');
	for (let senator of senators) {
		displaySenator(senator);
	}

	for (let attr of SENATOR_ATTRS) {
		let ele = document.getElementById(attr.toLowerCase());
		if (ele.tagName.toLowerCase() == "input") {
			ele.value = "";
		}
		else {
			clearOptionInput(attr.toLowerCase());
		}
	}
}


/**
 * Creates and displays senator card
 *
 *
 */
function displaySenator(senator) {
	let anchor = document.getElementById(SENATOR_CARDS);
	let col = document.createElement('div');
	col.className = 'col';
	anchor.appendChild(col);
	let card = document.createElement('div');
	card.className = 'card m-3 animated'
	card.style = CARD_STYLE;
	col.appendChild(card);

	let photo = document.createElement('img');
	photo.className = SEN_PHOTO_CLASSES;
	photo.src = senator.photo_url;
	card.appendChild(photo);

	let body = document.createElement('div');
	body.className = 'card-body';
	card.appendChild(body);

	let col2 = document.createElement('div');
	col2.className = 'col';
	col2.style = COL2_STYLE;
	body.appendChild(col2);

	let button = document.createElement('a');
	button.className = BUTTON_CLASSES;
	button.style = BUTTON_STYLE;
	button.href = BUTTON_LINK + senator.id;
	button.role = 'button';
	button.innerHTML = senator.name;
	col2.appendChild(button);

	let listGroup = document.createElement('ul');
	listGroup.className = LIST_GROUP_CLASSES;
	for(let field of SENATOR_ATTRS) {
		let f = document.createElement('li');
		f.className = "list-group-item";
		f.innerHTML = field + ': ' + senator[field.toLowerCase()];
		listGroup.appendChild(f);
	}
	card.appendChild(listGroup);
}


/**
 * Displays results after filtering by user
 *
 */
function displayFilteredSenators(allSenators) {
	clearSenators(SENATOR_CARDS);
	let filteredSenators = filterSenators(allSenators,...SENATOR_ATTRS);
	for (let senator of filteredSenators) {
		displaySenator(senator);
	}
}

/**
* Mouseover behavior for senator cards
*
*/
document.querySelectorAll(".sen-card")
	.forEach((card) => {
			// card.onclick = (e) => {
			// 	e.currentTarget.querySelector(".card-link").click();
			// }
			card.onmouseover = (e) => {
				e.currentTarget.setAttribute("class","card animated mb-3 shadow sen-card");
				// e.currentTarget.querySelector(".latest-info")
				// 	.setAttribute("class","text-white mb-auto latest-info");
			};
			card.onmouseout = (e) => {
				e.currentTarget.setAttribute("class","card animated mb-3 shadow-sm sen-card");
			// e.currentTarget.querySelector(".latest-info")
			// 	.setAttribute("class","text-muted mb-auto latest-info");
			};
		});
