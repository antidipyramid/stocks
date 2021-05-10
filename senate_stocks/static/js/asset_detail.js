var selectedBubble;

/**
 *
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

function clearSenatorSelect() {
	let senatorSelect = document.getElementById("senatorSelect");
	while (senatorSelect.hasChildNodes()) {
		// if (senatorSelect.childNodes[i].getAttribute("selected")) { continue; }
	
		senatorSelect.removeChild(senatorSelect.childNodes[0]);
	}
}

/**
 * Whenever the trades displayed on asset line graph changes,
 * we need to update the list of senators that users can filter against
 *
 * @param trades
 *
 */
function updateSenatorSelect(trades) {
	let senatorSelect = document.getElementById("senatorSelect");
	let selectedSenator = senatorSelect.value;
	clearSenatorSelect();

	// add back the All option
	let allOption = document.createElement("option");
	allOption.setAttribute("value","All");
	allOption.innerHTML = "All";
	senatorSelect.appendChild(allOption);

	if (selectedSenator == "All") {
		allOption.setAttribute("selected","true");
	}

	let seen = new Set();
	for(let date of trades) {
		for (let trade of date[1][1]) {
			let senator = trade["senator"]
			if (!seen.has(senator)) {
				let newSenatorOption = document.createElement("option");
				newSenatorOption.setAttribute("value",senator);
				newSenatorOption.innerHTML = senator;
				senatorSelect.appendChild(newSenatorOption);
				seen.add(senator);

				if (selectedSenator == senator) {
					newSenatorOption.setAttribute("selected","true");
				}
			}
		}
	}
}

function passSenatorFilter(trade) {
	if (document.getElementById("senatorSelect").value == "All") {
		return true;
	}
	return trade.senator == document.getElementById("senatorSelect").value;
}

function passTransTypeFilter(trade) {
	if (document.getElementById("transaction_type").value == "All") {
		return true;
	}
	else if (document.getElementById('transaction_type').value == "Sale") {
		if (trade.transaction_type.indexOf('Sale') > -1) {
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return trade.transaction_type == document.getElementById("transaction_type").value;
	}
}

function passAmountFilter(trade) {
	if (document.getElementById("amount").value == "All") {
		return true;
	}

	return trade.amount == document.getElementById("amount").value;
}

function passFilterTests(trade) {
	return passSenatorFilter(trade) && passTransTypeFilter(trade) &&
		passAmountFilter(trade);
}

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 60},
	width = 1200 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#heatmap")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

// Add a clipPath: everything out of this area won't be drawn.
var clip = svg.append("defs").append("svg:clipPath")
	.attr("id", "clip")
	.append("svg:rect")
	.attr("width", width )
	.attr("height", height )
	.attr("x", 0)
	.attr("y", 0);

function displayTradesInRange(filteredTrades) {
	noTradesAlert = document.getElementById("no-trades-alert");
	if (filteredTrades.length > 0) {
		noTradesAlert.setAttribute("style","visibility:hidden;display:none;");
		clearDisplayedTrades("selected-trades-table");
		for (let d of filteredTrades) {
			for (let trade of d[1][1]) {
				displaySelectedTrade(trade, "selected-trades-table", true);
			}
		}
	}
	else {
		clearDisplayedTrades("selected-trades-table");
		noTradesAlert.setAttribute("style","visibility:visible;");
	}
}

//Read the data
function createGraph(prices_obj,trades_obj) {
	var prices = Object.entries(prices_obj);
	var trades = Object.entries(trades_obj);
	// Add X axis --> it is a date format
	var x = d3.scaleTime()
		.domain(d3.extent(prices, function(d) { return d3.timeParse("%Y-%m-%d")(d[0]); }))
		.range([ 0, width ]);
	var xAxis = svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.attr("font-family","Roboto Mono")
		.attr("font-weight",500);

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, d3.max(prices, function(d) { return Number(d[1]); })])
		.range([ height, 0 ]);
	svg.append("g")
		.call(d3.axisLeft(y))
		.attr("font-family","Roboto Mono")
		.attr("font-weight",500);

	// Add a scale for bubble size
	var z = d3.scaleLinear()
		.domain([5000,10000,50000,100000,500000,1000000])
		.range([10,15,20,25,30,35]);


	// // Add the line for stock price
	var line = svg.append("path")
		.attr("clip-path", "url(#clip)")
		.datum(prices)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 2)
		.attr("id", "line")
		.attr("d", d3.line()
			.x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d[0])) })
			.y(function(d) { return y(d[1]) })
		)

	displayTradesInRange(trades);

	// A function that update the chart
	function updateLine(selectedYear) {
		// Create new data with the selection?
		let tradesFilter = JSON.parse(JSON.stringify(trades));
		if (selectedYear == "All") {
			x.domain(d3.extent(prices, function(d) { return d3.timeParse("%Y-%m-%d")(d[0]); }))
		}
		else {
			let year = Number(selectedYear);
			if (year == Date.today().getFullYear()) {
				x.domain([d3.timeParse("%Y-%m-%d")("".concat(year,"-01-01")),
					d3.timeParse("%Y-%m-%d")(Date.today().toString("yyyy-MM-dd"))]);
			}
			else {
				x.domain([d3.timeParse("%Y-%m-%d")("".concat(year,"-01-01")),
					d3.timeParse("%Y-%m-%d")("".concat(year,"-12-31"))]);
			}
			tradesFilter = tradesFilter.filter(d => Date.parse(d[0]).getFullYear() == year);
		}
		xAxis.transition().duration(1000).call(d3.axisBottom(x));

		// filter out trades that don't match
		for (let date of tradesFilter) {
			date[1][1] = date[1][1].filter(passFilterTests);
			if (date[1][1].length > 0) {
				date[1][0] = date[1][1].reduce(function(acc,curr) {
					return acc + getVolume(curr.amount);
				}, 0);
			}
		}

		// remove dates with no matching trades
		tradesFilter = tradesFilter.filter(date => date[1][1].length > 0)
		svg.select("#bubbles").remove();

		var bub = svg.append("g")
			.attr("id","bubbles")
			.selectAll("dot")
			.data(tradesFilter)

		var bubEnter = bub.enter()

		// draw bubbles for each trade
		bubEnter
			.append("circle")
			.attr("class","tradeBubble")
			.attr("cx", function (d) { return x(d3.timeParse("%Y-%m-%d")(d[0]))} )
			.attr("cy", function (d) { return y(prices_obj[d[0]]); } )
			.attr("r", function (d) { return 0; } )
			.style("fill", function (d) { return 'red' } )
			.style("opacity", "0.3")
			.attr("stroke", "white")
			.style("stroke-width", "2px")

		// draw center dot in bubble
		bubEnter
			.append("circle")
			.attr("class", "centerDot")
			.attr("cx", function (d) { return x(d3.timeParse("%Y-%m-%d")(d[0]))} )
			.attr("cy", function (d) { return y(prices_obj[d[0]]); } )
			.attr("r", 0)
			.style("fill", "black")
			.style("opacity", "1")

		// add mouseover behavior for bubbles
		bubEnter
			.selectAll("circle")
			.on("mouseover", function(event,d) { 
				let xy = d3.pointer(event,bub.node()) 
				tooltip
					.transition()
					.duration(200)
					.style("opacity",.7);
				tooltip
					.html(d[0] + " " + d[1][0] + " " + prices_obj[d[0]])
					.style("left", xy[0]+"px")
					.style("top", xy[1]+"px")
					.style("visibility","visible")
					.style("display","")
			})
			.on("mousemove", function(event,d) {
				let xy = d3.pointer(event,bub.node()) 
				tooltip
					.html(d[0] + " " + d[1][0] + " " + prices_obj[d[0]])
					.style("left", xy[0]+"px")
					.style("top", xy[1]+"px")
			} )
			.on("mouseleave", function(event, d) {
				tooltip
					.transition()
					.duration(200)
					.style("opacity", 0)
					.on("end", () => {
						tooltip
							.style("visibility","hidden")
							.style("display","none")
					})
			} )
			.on("click", onClick);

		// Give these new data to update line
		line
			.transition()
			.duration(1000)
			.attr("d", d3.line()
				.x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d[0])) })
				.y(function(d) { return y(d[1]) })
			)
			.attr("stroke", function(d){ return "steelblue" })
			.on("end", function(d) {
				bubEnter
					.selectAll(".tradeBubble")
					.transition()
					.duration(1000)
					.attr("r", function (d) { return z(d[1][0]); } )

				bubEnter
					.selectAll(".centerDot")
					.transition()
					.duration(1000)
					.attr("r", 3)
			})

		bub.exit().remove();
		updateSenatorSelect(tradesFilter);
		return tradesFilter;
	}

	var updateBubbles = function(d) {
		var selectedYear = document.getElementById("yearSelect").value;
		let filteredTrades = updateLine(selectedYear);

		document.getElementById("selected-date").innerHTML = "All Trades In ".concat(selectedYear);
		displayTradesInRange(filteredTrades);
	}

	d3.select("#yearSelect").on("change", updateBubbles);
	d3.select("#transaction_type").on("change", updateBubbles);
	d3.select("#amount").on("change", updateBubbles);
	d3.select("#senatorSelect").on("change", updateBubbles);

	// -1- Create a tooltip div that is hidden by default:
	var tooltip = d3.select("#heatmap")
		.append("div")
		.style("opacity", 0)
		.attr("class", "tooltip")
		.style("background-color", "black")
		.style("border-radius", "5px")
		.style("padding", "10px")
		.style("color", "white")
		.attr("font-family", "Roboto Mono");

	var color = function(trade) {
		switch(trade.transaction_type) {
			case 'Sale (Full)':
				return 'red';
			case 'Sale (Partial)':
				return 'red';
			case 'Purchase':
				return 'green';
		}
	};

	// -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
	// var showTooltip = function(d) {
	// 	tooltip
	// 		.transition()
	// 		.duration(200)
	// 	tooltip
	// 		.style("opacity", .7)
	// 		.html(d[0] + " ")
	// 		.style("left", (d3.pointer("mouseover")[0]))
	// 		.style("top", (d3.pointer("mouseover")[1]))

	// }
	// var moveTooltip = function(d) {
	// 	tooltip
	// 		.style("left", (d3.pointer("mouseover")[0]))
	// 		.style("top", (d3.pointer("mouseover")[1]))
	// }
	// var hideTooltip = function(d) {
	// 	tooltip
	// 		.transition()
	// 		.duration(200)
	// 		.style("opacity", 0)
	// }

	var onClick = function(event, d) {
		// update table heading + delete no trades alert
		document.getElementById("selected-date").innerHTML = "Trades on ".concat(Date.parse(d[1][1][0].transaction_date).toString("MMMM d, yyyy"));
		document.getElementById("no-trades-alert").hidden = true;

		clearDisplayedTrades("selected-trades-table");

		// change the color of selected bubble
		// then reset the color of any previously selected bubble
		d3.select(event.target)
			.style("fill","#ffba08")
			.style("opacity",".9")
			.style("stroke","black");

		if (selectedBubble) {
			d3.select(selectedBubble)
				.style("fill","red")
				.style("opacity",".3")
				.style("stroke","white");
		}
		selectedBubble = event.target
		
		let timeout = 100;
		for (let trade of d[1][1]) {
			setTimeout(function() {
				displaySelectedTrade(trade, "selected-trades-table", true);
				},timeout+100);
			timeout = timeout + 100;
		}
	}

	updateLine("All");

	// Add dots for trades
	// var bubbles = svg.append('g')
	// 	.attr("id","bubbles")
	// 	.selectAll("dot")
	// 	.data(Object.entries(trades))
	// 	.enter()
	// 	.append("circle")
	// 	.attr("cx", function (d) { return x(d3.timeParse("%Y-%m-%d")(d[0]))} )
	// 	.attr("cy", function (d) { return y(prices_obj[d[0]]); } )
	// 	.attr("r", function (d) { return z(d[1][0]); } )
	// 	.style("fill", function (d) { return 'red' } )
	// 	.style("opacity", "0.5")
	// 	.attr("stroke", "white")
	// 	.style("stroke-width", "2px")
	// 	.on("mouseover", showTooltip )
	// 	.on("mousemove", moveTooltip )
	// 	.on("mouseleave", hideTooltip )
	// 	.on("click", onClick)
}