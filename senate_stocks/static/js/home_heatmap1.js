'use strict';
// contains the D3 code to create the homepage heatmap


/**
 * Returns an array of empty data points to serve as 
 * placeholders in heatmap for days of the month
 *
 * @param {number} month
 * @param {number} year
 * @return {array}
 */
function emptyMonth(month, year) {
	let days = Date.getDaysInMonth(year,month);
	//get the first day of the month
	let curr_day = new Date((month+1) + "/1/" + year);
	let week = 0; let data = [];
	for(let i = 0; i < days; i++) {
		let dayOfWeek = curr_day.getDay();
		data.push({x: xAxis[curr_day.getDay()], y: week});
		if (dayOfWeek == 6) {
			week++;
		}
		curr_day.addDays(1);
	}
	return data;
}

/**
 * Given a trade date, return the corresponding row (i.e. week)
 * of the heatmap
 *
 * @param {string} date - Date string as stored in Trade model in Django db
 * @return {number}
 *
 */
function getWeekNumber(date) {
	let tradeDate = Date.parse(date)
	let curr = new Date.parse(date)
						.moveToFirstDayOfMonth()
						.next().sunday();
	for(let week = 0; week < 5; week++) {
		if (curr.compareTo(tradeDate) > 0) {
			return yAxis[week]; 
		}
		curr.next().sunday();
	}
}

// update title of calendar with current month
document.getElementById("cal-title")
	.innerHTML = "February 2021";
	// .innerHTML = Date.today().toString("MMMM") + " 2021";

var margin = {top: 30, right: 30, bottom: 30, left:30},
	width = 600-margin.left-margin.right,
	height = 450-margin.top-margin.bottom;

var svg = d3.select("#heatmap")
	.append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
	.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

const yAxis = ["0", "1", "2", "3", "4", "5"]
const xAxis = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

var x = d3.scaleBand()
	.range([0, width])
	.domain(xAxis)
	.padding(0.1);

var x_Axis = svg.append("g")
				.call(d3.axisTop(x)
					.tickSize(0)
					.tickValues(xAxis))
					.attr("font-family","Lato")
					.attr("class","text-muted")

x_Axis.select('.domain').remove()

var y = d3.scaleBand()
	.range([ height, 0 ])
	.domain(yAxis)
	.padding(0.1);

var y_Axis = svg.append("g")
				.call(d3.axisLeft(y)
					.tickSize(0)
					.tickValues([]));

y_Axis.select('.domain').remove()

var myColor = d3.scaleLinear()
	.range(['white', 'red'])
	.domain([1,100])

var empty = svg.selectAll(".myEmpty")
				.data(emptyMonth(1,Date.today().getFullYear()))
				.enter()
				.append("g");

// fill in calendar with "blank" squares
empty
	.append("rect")
	.attr("x", (d) => x(d.x))
	.attr("y", (d) => y(5-d.y))
	.attr("rx", 6)
	.attr("rx", 6)
	.attr("stroke","black")
	.attr("stroke-width","2px")
	.attr("width", x.bandwidth())
	.attr("height", y.bandwidth())
	.attr("fill", "#525252")

// add day numbers to calendar
empty.append("text")
	.attr("x", (d) => x(d.x)+5)
	.attr("y", (d) => y(5-d.y)+15)
	.attr("pointer-events","none")
	.style("fill","white")
	.text((d, i) => i+1)

var tooltipDiv = d3.select("body").append("div")
	.style("opacity","0")
	.attr("class","tooltip")
	.style("background-color","#212529")
	.style("border","solid")
	.style("border-width","2px")
	.style("border-radius","6px")
	.style("visibility","hidden")
	.style("display","none")
	.style("font-family","Roboto Mono")
	.style("color","white")
	.style("padding","10px")
	.style("max-width","500px")
	.attr("pointer-events","none")

const getTooltipHtml = (tradeList, date) => {
	let senatorList = new Map(),
		tooltipHtml = "".concat("<b>Trades on ",
			Date.parse(date).toString("MMMM d, yyyy") + "</b><br>");
	
	for (let trade of tradeList) {
		if ( senatorList.has(trade.senator) ) {
			senatorList.get(trade.senator)
				.add(trade.asset_name);
		}	
		else {
			senatorList.set(trade.senator,new Set([trade.asset_name]));
		}
	}
	// senatorList.forEach((trades,senator) => {
	// 	console.log(senator, trades);
	// 	tooltipHtml += "<br>Senator " + senator + " traded " + Array.from(trades) + "<br>";
	// })

	for (const [senator,trades] of senatorList) {
		tooltipHtml += "<br>Senator " + senator +" traded:<br>";
		for (const asset of trades) {
			tooltipHtml += "<i>-" + asset.trim() + "</i><br>";
		}
	}
	return tooltipHtml;
}
	
// move tooltip a little bit away from pointer
const offsetX = 20,
	offsetY = -20;
// mouseover behavior for dates on calendar
var tooltipShow = (e,d) => {
	let x = e.layerX + offsetX, 
		y = e.layerY + offsetY;
	e.currentTarget.setAttribute("stroke","#ede68a")
	tooltipDiv
		.style("left",x+"px")
		.style("top",y+"px")
		.style("opacity","0.8")
		.style("visibility","visible")
		.style("display","")
		.html(getTooltipHtml(newData.get(d.transaction_date),d.transaction_date))
}

// mousemove behavior for dates on calendar
var tooltipMove = (e,d) => {
	let x = e.layerX + offsetX, 
		y = e.layerY + offsetY;
	tooltipDiv
		.style("left",x+"px")
		.style("top",y+"px")
}

// mouseleave behavior for dates on calendar
var tooltipHide = (e,d) => {
	e.currentTarget.setAttribute("stroke","black")
	tooltipDiv
		.style("opacity","0")
		.style("visibility","hidden")
		.style("display","none");
}

var newData;
d3.json("http://127.0.0.1:8000/api").then(function(data) {
	newData = new Map();
	let	newArray = [];
	for (let date of data) {
		if (newData.has(date.transaction_date)) {
			newData.get(date.transaction_date).push(date)
		}
		else {
			newData.set(date.transaction_date,[date]);
		}
		newArray.push({x: xAxis[Date.parse(date.transaction_date).getDay()],
										y: getWeekNumber(date.transaction_date),
			transaction_date: date.transaction_date});
	}

	svg.selectAll("rect")
		.data(newArray, d => ''.concat(d.x,',',d.y))
		.join(
			enter => enter,
			update => update.style("fill","#ec625f")
					.on("mouseover",tooltipShow)
					.on("mousemove",tooltipMove)
					.on("mouseleave",tooltipHide),
			exit => exit
		)
});
