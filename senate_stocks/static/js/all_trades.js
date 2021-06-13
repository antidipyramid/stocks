const filterFields = ["asset_type","transaction_type","amount"],
	dates = ["dateStartInput","dateEndInput"],
	DISPLAY_NUM = 25;

var	CURR_INDEX = 0,
	oldFilterValues = new Map(),
	allTrades,
	allTradesFiltered;

filterFields.forEach(x => oldFilterValues.set(x,""));

var allTradesUrl = '/api';
let path = window.location.pathname.split('/');
if (path[1] == 'senator') { allTradesUrl += '/senators/' + path[2] }
else { allTradesUrl += '/assets/' + path[2] }

/**
 * Fetches all related trades from API
 *
 * @param {String} url
 * @return {Array} list of Trade objects
 */
async function fetchAllTrades(url=allTradesUrl) {
	const response = await fetch(url);
	return response.json()
}
fetchAllTrades()
	.then(d => {
		// store all trades and currently displayed trades in
		// global variables for filtering
		allTradesFiltered = d.asset_related_trades.map(x => x);
		allTrades = d.asset_related_trades;

		allTradesFiltered.slice(0,DISPLAY_NUM).forEach(t => displaySelectedTrade(t,"allTrades",true))		
		CURR_INDEX += DISPLAY_NUM;	

		resetFilterFields();

		// set event for date picker
		dates.forEach(id => {
			document.getElementById(id).
				addEventListener("changeDate", e => {
					setTimeout(() => {
						// get values from both the start and end date inputs
						let values = dates.map(ele => {
								let v = document.getElementById(ele).value;
								// don't try to convert if field is empty
								return (v == '') ? '' : convertPickerDate(v);
							});

						console.log(values);
						allTradesFiltered = allTrades
							.filter(t => filterDate(t,values[0],values[1]));

						// re-filter all other filter inputs
						filterFields.forEach(field => {
							let val = document.getElementById("trades")
								.querySelector("#"+field).value;
							executeFilter(field,val);
						});

						updateResults();
					},150);
				});
		});	

		// set click event for 'see more trades' button
		document.getElementById("all-trades-more")
			.addEventListener("click", e => {
				displayNextTrades(allTradesFiltered,false);
				updateMoreTradesButton();
			});

		// set click event for each filter option
		filterFields.forEach(field => {
			document.getElementById("trades")
				.querySelector("#"+field)
				.addEventListener("input", e => { 
					executeFilter(field,e.currentTarget.value)
					updateResults();
				})
		});

		// set click event for reset button
		document.getElementById("reset-button")
			.addEventListener("click", e => {
				resetFilterFields();
				allTradesFiltered = allTrades.map(t => t);
				updateResults();
			});
	});

function updateResults() {
	clearDisplayedTrades("allTrades");
	displayNextTrades(allTradesFiltered);
	updateMoreTradesButton();
	updateNoTradesAlert();
}

function convertPickerDate(date) {
	let s = date.split("/");
	return s[2] + "-" + s[0] + "-" + s[1];
}

function updateNoTradesAlert() {
	// if there are trades to display, hide 'no trades' alert
	// and show 'show more button', otherwise do opposite
	if (allTradesFiltered.length == 0) {
		document.getElementById("all-trades-more")
			.setAttribute("style","visibility:hidden;display:none;");
		document.getElementById("no-filter-trades-alert")
			.setAttribute("style","visibility:visible;display:;");
	}
	else {
		document.getElementById("all-trades-more")
			.setAttribute("style","visibility:visible;display:;");
		document.getElementById("no-filter-trades-alert")
			.setAttribute("style","visibility:hidden;display:none;");
	}
}

function executeFilter(field, value) {
	if (oldFilterValues.get(field) == "" || oldFilterValues.get(field) == "All") {
		allTradesFiltered = allTradesFiltered
			.filter(t => (value == "All") ? true : (t[field] == value));
	}
	else {
		allTradesFiltered = allTrades.map(x => x);
		allTradesFiltered = filterFunc(allTradesFiltered, filterFields);
	}
	oldFilterValues.set(field,value);
	console.log(allTradesFiltered);
}

/**
 * Resets filter fields on page load.
 */
function resetFilterFields() {
	filterFields.forEach(f => {
		let ele = document.getElementById("trades")
			.querySelector("#"+f);

		if (ele.tagName == 'SELECT') {
			ele.value = "All";
		}
		else {
			ele.value = "";
		}
	});

	dates.forEach(id => document.getElementById(id).value = '');
}

/**
 * Disables 'show more trades' button if there are
 * no trades to display.
 */
function updateMoreTradesButton() {
	if (CURR_INDEX >= allTradesFiltered.length) {
		document.getElementById("all-trades-more").innerHTML = "No More Trades";
		document.getElementById("all-trades-more").setAttribute("disabled",true);
	}
	else {
		document.getElementById("all-trades-more").innerHTML = "Show More Trades";
		document.getElementById("all-trades-more").removeAttribute("disabled")

	}
}

/**
 * Displays the next few trades in the table
 * 
 * @param {Boolean} reset - if true, start from zero, otherwise
 * use stored value
 *
 */
function displayNextTrades(trades, reset=true) {
	if (reset) {
		CURR_INDEX = 0;
		trades
			.slice(0,DISPLAY_NUM)
			.forEach(t => displaySelectedTrade(t,"allTrades",true));
		CURR_INDEX += DISPLAY_NUM;	
	} 
	else {
		trades
			.slice(CURR_INDEX,CURR_INDEX+DISPLAY_NUM)
			.forEach(t => displaySelectedTrade(t,"allTrades",true));
		CURR_INDEX += DISPLAY_NUM;	
	}
}


/**
 * When user clicks on entry in heatmap, this function displays
 * the relevant trades for that date
 *
 * @param trade
 *
 */
function displaySelectedTrade(trade, tableId, senator=false) {
	let anchor = document.getElementById(tableId);

	let fields = ['owner', 'ticker', 'asset_name', 'asset_type', 'transaction_type',
		'amount', 'comments'];

	// make the first "key" column
	let row = document.createElement("tr");
	let datum = document.createElement("th")
	datum.setAttribute("scope","col");
	datum.innerHTML = ( new Date(trade.transaction_date) ).toString("MMMM dS, yyyy");
	row.appendChild(datum);

	if (senator) {
		datum = document.createElement("td");
		let link = document.createElement("a");
		link.setAttribute("href","/senator/".concat(trade.senator_id));
		link.innerHTML = trade.senator;
		datum.appendChild(link);
		row.appendChild(datum);
	}

	// cycle through attribute names
	for (let field of fields) {
		datum = document.createElement("td");
		datum.innerHTML = trade[field]
		row.appendChild(datum);
	}

	if (trade.transaction_type == 'Purchase') {
		row.setAttribute("style","background-color:rgb(255,0,0,.1)");
	}
	else if (trade.transaction_type == 'Exchange') {
		row.setAttribute("style","background-color:rgb(128,128,.1)");
	}
	else {
		row.setAttribute("style","background-color:rgb(0,128,0,.1)");
	}

	// add link to official disclosure site
	datum = document.createElement("td");
	let link = document.createElement("a");
	link.setAttribute("href",trade.url);
	link.innerHTML = "Link";
	datum.appendChild(link);
	row.appendChild(datum);

	anchor.appendChild(row);
	return row;
}

/**
 * Uses vanillajs-datepicker to make a date range picker
 */
function makeDatePicker(id) {
	let e = document.getElementById(id);
	let rangepicker = new DateRangePicker(e, {
		// ...options
	});
}

/**
 * Filters trades by date and returns results
 *
 *
 */
function filterDate(trade, start, end) {
		let tradeDate = trade.transaction_date.split('-').map(x => Number(x));
		//skip if field is blank
		if (start != "") {
			// split up date string and cast as integers
			let filterStart = start.split('-').map(x => Number(x));

			// dates are strings in yyyy-mm-dd format so we can
			// compare in order (first compare yr, then month, then day)
			for (let i = 0; i < tradeDate.length; i++) {
				if (tradeDate[i] < filterStart[i]) { return false; }
				if (tradeDate[i] > filterStart[i]) { break; }
			}
		}	
		if (end != "") {
			let filterEnd = end.split('-').map(x => Number(x));

			for (let i = 0; i < tradeDate.length; i++) {
				if (tradeDate[i] > filterEnd[i]) { return false; }
				if (tradeDate[i] < filterEnd[i]) { break; }
			}
		}	
		return true;

	// for(let ele of list) {
	// 	let date = new Date(ele.transaction_date);

	// 	if (start != "") {
	// 		if (date.compareTo(Date.parse(start)) < 0) {
	// 			continue;
	// 		}
	// 	}	

	// 	if (end != "") {
	// 		if (date.compareTo(Date.parse(end)) > 0) {
	// 			continue;
	// 		}
	// 	}
	// 	results.push(ele);
	// }	
	// return results;
}



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
			let e = document.getElementById("trades")
				.querySelector("#"+field);
			if (e.value) {
				if (e.value != "All") {
					if (e.value.toLowerCase() != list[i][field].toLowerCase()) {
						if (list[i][field].toLowerCase().indexOf(e.value.toLowerCase()) < 0) {
							match = false;
							break;
						}
					}
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
	let startInput = document.getElementById("dateStartInput").value,
		endInput = document.getElementById("dateEndInput").value;

	let trades = allTrades;
	if (startInput != "" || endInput != "") {
		trades = filterDates(allTrades,startInput,endInput);
	}

	return filterFunc(trades,filterFields);
}

function displaySenatorResults() {
	clearDisplayedTrades("allTrades");
	let trades = filterTrades();
	let alert = document.getElementById("no-filter-trades-alert");

	if (trades.length == 0) {
		alert.hidden = false;
		alert.style.visibility = 'visible;';	
	}
	else {
		alert.style.visibility = 'hidden;';	
		alert.hidden = true;
		for (let trade of filterTrades()) {
			displaySelectedTrade(trade,"allTrades",true);
		}			
	}
}

/**
 * Resets dropdown select form back to first option (all)
 *
 * @param id
 *
 */
function clearOptionInput(id) {
	let form = document.getElementById(id)
	for(let child of form.children) {
		if (child.value == "All") {
			form.value = child.value;
			form.setAttribute("selected","")
		}
		else {
			form.removeAttribute("selected");
		}
	}
}

/**
 * Resets text input form to empty
 *
 * @param id
 *
 */
function clearTextInput(id) {
	document.getElementById(id).value = "";
}

/**
 * Resets all input forms for all trades table on detail page.
 *
 */
function clearTradesFilterForms() {
	for(let name of filterFields) {
		form = document.getElementById(name);

		if (form.tagName.toLowerCase() == "select") {
			clearOptionInput(name);
		}
		else if (form.tagName.toLowerCase() == "input") {
			clearTextInput(name);
		}
	}

	for(let name of dates) {
		clearTextInput(name);
	}

	filterTrades();
	displaySenatorResults();
}
