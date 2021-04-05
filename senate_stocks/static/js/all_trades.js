var filterFields = ["owner","ticker","asset_type","asset_name","transaction_type","amount"];
var dates = ["dateStartInput","dateEndInput"];

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
function filterDates(list, start, end) {
	var results = [];
	for(let ele of list) {
		let date = new Date(ele.transaction_date);
		
		if (start != "") {
			if (date.compareTo(Date.parse(start)) < 0) {
				continue;
			}
		}	

		if (end != "") {
			if (date.compareTo(Date.parse(end)) > 0) {
				continue;
			}
		}
		results.push(ele);
	}	
	return results;
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
			let e = document.getElementById(field);
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
		alert.setAttribute("style","opacity: 1;");
	}
	else {
		alert.setAttribute("style","opacity: 0;");
		alert.hidden = true;	
		for (let trade of filterTrades()) {
			displaySelectedTrade(trade,"allTrades");
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
