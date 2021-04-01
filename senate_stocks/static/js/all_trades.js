var filterFields = ["owner","ticker","asset_type","amount"];

/**
 * Generic function to filter trades based on the provided
 * fields of the Trade model
 *
 * @param collection - 
 *
 *
 */
function filterFunc(list, fields) {
	var results = [];
	for (let i = 0; i < list.length; i++) { 
		let match = true;
		for (let field of fields) {
			let e = document.getElementById(field);
			console.log(field);
			if (e.value) {
				if (e.value != "All") {
					if (e.value != list[i][field]) {
						match = false;
						break;
					}
				}
			}
			if (e.placeholder) {
				if (e.placeholder != "All")
					if (e.placeholder != list[i][field]) {
						match = false;
						break;
					}
			}
		}
		if (match) {
			results.push(list[i]);
		}
	}
	console.log(results);
	return results;
}

/**
 * Filters trades in the "all trades" tab on the
 * senator/asset detail pages
 *
 */
function filterTrades() {
	return filteredResults = filterFunc(allTrades,filterFields);
}

function displaySenatorResults() {
	clearDisplayedTrades("allTrades");
	let trades = filterTrades();
	let alert = document.getElementById("no-filter-trades-alert");

	if (trades.length == 0) {

		alert.hidden = false;	
		alert.setAttribute("style","opacity: 1;")
	}
	else {
		alert.setAttribute("style","opacity: 0;")
		alert.hidden = true;	
		for (let trade of filterTrades()) {
			displaySelectedTrade(trade,"allTrades");
		}			
	}
}
