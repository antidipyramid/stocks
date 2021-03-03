// contains the D3 code to create the homepage heatmap
var margin = {top: 80, right: 25, bottom: 30, left:40},
	width = 500-margin.left-margin.right,
	height = 300-margin.top-margin.bottom;

var svg = d3.select("#heatmap")
	.append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
	.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

var yAxis = ["4", "3", "2", "1"]
var xAxis = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

var x = d3.scaleBand()
	.range([0, width])
	.domain(xAxis)
	.padding(0.01);

var x_Axis = svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x)
				.tickSize(0))

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

empty_data = []
for(let i = 0; i < xAxis.length; i++) {
	for(let j=0; j < yAxis.length; j++) {
		console.log(xAxis[i],yAxis[j])
		empty_data.push([xAxis[i],yAxis[j]])
	}
}

var empty = svg.selectAll(".myEmpty")
				.data(empty_data)
				.enter()
				.append("rect");

empty.attr("x", (d) => {return x(d[0])})
	.attr("y", (d) => {return y(d[1])})
	.attr("width", x.bandwidth())
	.attr("height", y.bandwidth())
	.attr("fill", "#ced4da");

var div = d3.select("body").append("div")
				.attr("class","tooltip")
				.style("opacity",0)

d3.json("http://127.0.0.1:8000/api").then(function(data) {

	const dayOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] 

	svg.selectAll()
		.data(data, function(d) {

			//return d.day+":"+d.week;})
			return d.ticker})


		.enter()
		.append("rect")
		.attr("x", function(d) {
			let dateList = d.transaction_date.split('-').map((x) => Number(x))
			let date = new Date(dateList[0],dateList[1],dateList[2])
			return x(dayOfWeek[date.getDay()]) })
		.attr("y", function(d) {
			let date2 = Date.parse(d.transaction_date)
	
			let firstSun = Date.today().last().sunday()
			let mil = firstSun.toDateString()
			if (date2.between(firstSun,Date.today())) { return y("4") }
			
			let secSun = firstSun.last().sunday()
			if (date2.between(secSun,Date.parse(mil))) { return y("3") } 

			mil = secSun.toDateString()
			let thirdSun = secSun.last().sunday()
			if (date2.between(thirdSun,Date.parse(mil))) { return y("2") } 
			else { return y("1") } })
		.attr("width", x.bandwidth())
		.attr("height", y.bandwidth())
		.style("fill", function(d) {return myColor(d.value) })
		.on("mouseover", function(d) {
			div.transition()
				.duration(200)
				.style("opacity", .9);
			div.html(d.transaction_date)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY-50) + "px");
			})
		.on("mouseout", function(d) {
			div.transition()
				.duration(500)
				.style("opacity",0);
		});
})

