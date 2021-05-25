var allTrades,
	currentTrades,
	tradeGenerator;

const TRADES_PER_CLICK = 10;
/**
 * Groups trades into dictionary by date for display
 * by the github-style heatmap.
 *
 * @param data - array of Trade instances
 */
function processHeatmapData(data) {
	allTrades = data;
	let heatmapData = new Map();
	for (let trade of data) {
		let date = trade.transaction_date;
		let volume = getVolume(trade.amount);
		if (heatmapData.has(trade.transaction_date)) {
			let obj = heatmapData.get(date)
			obj.trades.push(trade);
			obj.volume = obj.volume + volume
		}
		else {
			heatmapData.set(date, {trades: [trade], volume: volume});
		}
	}
	console.log(heatmapData);
	currentTrades = heatmapData;
	return heatmapData;
}

/**
 * Takes the amount field in of Trade instance, converts to num
 * and returns median
 *
 * @param amount
 *
 */
function getVolume(amount) {
	let bounds = amount.split("-");
	bounds.forEach((x,i,a) => { 
		a[i] = Number(x.replace(/[ ,$]/g,""));
	});
	return bounds.reduce((a,b) => a+b) / 2;
}


/**
 * Clears trades displayed underneath the heatmap in anticipation of displaying
 * trades for the user's selected date
 */
function clearDisplayedTrades(id) {
	let anchor = document.getElementById(id);
	while (anchor.hasChildNodes()) {
		anchor.removeChild(anchor.childNodes[0]);
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

const WIDTH = 1000, HEIGHT = 150, CELLSIZE = 17, CELLMARGIN = 1.5;

const COLOR = d3.scaleThreshold()
	.domain([5000,10000,50000,100000,500000,1000000])
	.range(['#ffeceb','#ffb1ad','#ff7770','#ff5147','#ff2a1f','#f50c00']);

const t = d3.transition()
	.duration(500);


var heatSvg;
function update(year,data) {
	document.getElementById("selected-date")
		.innerHTML = "Trades in " + year;
	tradeGenerator = null;

	heatSvg = d3.select("#heatmap")
		.selectAll("svg")
		.data(d3.range(year,year+1))
		.join(
			enter => enter.append("svg")
			.attr("width",WIDTH)
			.attr("height",HEIGHT)
			.append("g")
			.call(enter => enter
				.attr("transform", "translate(" + ((WIDTH - (CELLSIZE + CELLMARGIN) * 53) / 2) + "," + (HEIGHT - (CELLSIZE + CELLMARGIN) * 7 - 1) + ")")),

			exit => {
				exit.select("g").select("g").remove()		
				return d3.select("#heatmap").select("svg").select("g");
			}
		);


	loadGraph(year,data);
}

function toggleNoTradesAlert(hide) {
	if (hide) {
		document.getElementById("no-trades-alert")
			.setAttribute("style", "visibility:hidden");
		document.getElementById("more-trades-button")
			.setAttribute("style", "visibility:visible;display:block;");
	}
	else {
		document.getElementById("no-trades-alert")
			.setAttribute("style", "visibility:visible;display:block;");
		document.getElementById("more-trades-button")
			.setAttribute("style", "visibility:hidden;display:none");
	}
}

/**
 * Generates the next few trades to display when user clicks
 * view more trades button
 *
 * @param {Array} trades - A list of trade objects
 * @param {Number} num - The number of trades to yield
 * @return {Array} - The few trades to display
 *
 */
function *nextTrades(trades, num=10) {
	let curr = 0;
	let nextTradesToDisplay = []
	for(let [ date, obj ] of trades) {
		for(let trade of obj.trades) {
			if (curr < num) {
				curr += 1;
				nextTradesToDisplay.push(trade)
			}
			else {
				yield nextTradesToDisplay;
				nextTradesToDisplay = [];
				curr = 0;
			}
		}
	}

	if (nextTradesToDisplay.length > 0) {
		yield nextTradesToDisplay;
	}
}

/**
 * Wrapper function for next trade generator. When there are
 * no more trades, disable the button
 *
 */
function getNextTrades() {
	if (!tradeGenerator) {
		tradeGenerator = nextTrades(currentTrades);
	}

	let tradesToDisplay = tradeGenerator.next();
	console.log(tradesToDisplay);
	if (tradesToDisplay.value) {
		let timeout = 0;
		for (const trade of tradesToDisplay.value) {
			setTimeout(function() {
				let row = displaySelectedTrade(trade,"selected-trades-table");
				document.getElementById("more-trades-button").scrollIntoView({behavior:'smooth'});
			},timeout+100);
			timeout += 100;
		}	
	}

	if (tradesToDisplay.done) {
		document.getElementById('more-trades-button')
			.setAttribute('disabled','true');
		document.getElementById('more-trades-button')
			.innerHTML = "No More Trades"
	}
}

/**
 * Resets the get next trades button so the user can
 * display more trades after selecting a new date
 *
 */
function resetNextTradesButton() {
	document.getElementById('more-trades-button')
		.setAttribute('disabled','false');
	document.getElementById('more-trades-button')
		.innerHTML = "No More Trades";
}

var trades;
function loadGraph(year,data=trades) {
			currentTrades = data;	
			// remove dates from other years from map
			// we'll use to display trades in table
			for (let date of currentTrades.keys()) {
				if (Number(date.split('-')[0]) != year) {
					currentTrades.delete( date );
				}
			}

	trades = data;
			let prevSelection;
			heatSvg.append("g")
				.attr("fill", "#f3f6e7")
				.attr("stroke", "#000")
				.attr("stroke-width", "0.1px")
				.selectAll("rect")
				.data(d => d3.timeDays(new Date(d,0,1), new Date(d+1,0,1)))
				.enter().append("rect")
				.attr("width", CELLSIZE - CELLMARGIN)
				.attr("height", CELLSIZE - CELLMARGIN)
				.style("fill", d => {
					if (d.compareTo(Date.today()) > 0) {
						return "#8a9293";
					}
				})
				.attr("x", d => {
					return d3.timeWeek.count(d3.timeYear(d),d)*(CELLSIZE+CELLMARGIN);})
				.attr("y", d => d.getDay()*(CELLSIZE+CELLMARGIN))
				.datum(d3.timeFormat("%Y-%m-%d"))
				.attr("id", d => d)
				.attr("fill", d => {
					if (trades.has(d)) {
						return COLOR(trades.get(d).volume);
					}
				})
				.on("click", (event, d) => {
					if (Date.parse(d).compareTo(Date.today()) > 0) {
						return;
					}

					if (prevSelection) {
						d3.select(document.getElementById(prevSelection))
							.attr("stroke","#000")
							.attr("stroke-width","0.1px");
					}

					document.getElementById("selected-date").innerHTML = "Trades on " + Date.parse(d).toString("MMMM dS, yyyy");

					d3.select(document.getElementById(d))
						.attr("stroke","#eef525")
						.attr("stroke-width","2px");
					prevSelection = d;

					if (trades.has(d)) {
						toggleNoTradesAlert(true);
						clearDisplayedTrades("selected-trades-table");

						let timeout = 100;
						for (let trade of trades.get(d).trades) {
							setTimeout(
								() => displaySelectedTrade(trade, "selected-trades-table"),
								timeout+100);
							timeout += 100;
						}
					}
					else {
						toggleNoTradesAlert(false);
						clearDisplayedTrades("selected-trades-table");
					}
				})
			// resetNextTradesButton();
			clearDisplayedTrades("selected-trades-table");
			if (currentTrades.size > 0) {
				toggleNoTradesAlert(true);
				getNextTrades();
			}
			else {
				toggleNoTradesAlert(false);
			}




}

// update(2021);
