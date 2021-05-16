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
/**
 * Filters senators for display on senators page
 *
 * @param allSenators list of all senator instances
 * @param rest of paramters are ids
 */
function filterSenators(allSenators) {
	var results = [];
	for (let senator of allSenators) {

		let match = true;
		for (let i = 1; i < arguments.length; i++) {
			let arg = arguments[i].toLowerCase();
			let ele = document.getElementById(arg);
			let data = senator[arg].toLowerCase(),
				query = ele.value.toLowerCase();
			if (query == "all") {
				continue;
			}
			// if ele is a text input, check if query
			// matches any part of data
			if(ele.tagName.toLowerCase() == "input") {
				if (data.indexOf(query) < 0) {
					match = false;
					break;
				}
			}
			// otherwise, just check if they're equal
			else {
				if (data != query) {
					match = false;
					break;
				}
			}
		}

		if (match) {
			results.push(senator);
		}
	}
	return results;	
}

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
 * Clear all senators from page
 *
 * @param id element id string 
 */
function clearSenators(id) {
	let senatorsParent = document.getElementById(id);
	while (senatorsParent.childNodes[0]){
		senatorsParent.removeChild(senatorsParent.childNodes[0]);
	}
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
				e.currentTarget.setAttribute("class","card animated text-white mb-3 bg-secondary");
				e.currentTarget.querySelector(".latest-info")
					.setAttribute("class","text-white mb-auto latest-info");
			};
			card.onmouseout = (e) => {
				e.currentTarget.setAttribute("class","card animated mb-3");
			e.currentTarget.querySelector(".latest-info")
				.setAttribute("class","text-muted mb-auto latest-info");
			};
		});
