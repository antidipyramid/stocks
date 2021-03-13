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
		dayOfWeek = curr_day.getDay();
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
		if (tradeDate.getDate() < curr.getDate()) {
			return y(yAxis[5-week]); 
		}
		curr.addDays(7);
	}
	return y(yAxis[0]);
}

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
	.padding(0.01);

var x_Axis = svg.append("g")
				.call(d3.axisTop(x)
					.tickSize(0)
					.tickValues(xAxis));

x_Axis.select('.domain').remove()

var y = d3.scaleBand()
	.range([ height, 0 ])
	.domain(yAxis)
	.padding(0.01);

var y_Axis = svg.append("g")
				.call(d3.axisLeft(y)
					.tickSize(0)
					.tickValues([]));

y_Axis.select('.domain').remove()

var myColor = d3.scaleLinear()
	.range(['white', 'red'])
	.domain([1,100])

var empty = svg.selectAll(".myEmpty")
				.data(emptyMonth(0,Date.today().getFullYear()))
				.enter()
				.append("rect");

empty.attr("x", (d) => {return x(d.x)})
	.attr("y", (d) => {return y(5-d.y)})
	.attr("width", x.bandwidth())
	.attr("height", y.bandwidth())
	.attr("fill", "#ced4da");

var div = d3.select("body").append("div")
				.attr("class","tooltip")
				.style("opacity",0)

d3.json("http://127.0.0.1:8000/api").then(function(data) {
	svg.selectAll()
		.data(data, (d) => d.ticker)
		.enter()
		.append("rect")
		.attr("x", (d) => x(xAxis[Date.parse(d.transaction_date).getDay()]) )
		.attr("y", (d) => getWeekNumber(d.transaction_date))	
		.attr("width", x.bandwidth())
		.attr("height", y.bandwidth())
		.style("fill", (d) => "red")
		.on("mouseover", function(d) {
			/**
			div.transition()
				.duration(200)
				.style("opacity", .9);
			div.html(d.transaction_date)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY-50) + "px");
				*/

			displayTradeInfo(d);			
			rect.style("fill", (d) => "yellow")
			})
		.on("mouseout", function(d) {
			div.transition()
				.duration(500)
				.style("opacity",0);
		});
})

