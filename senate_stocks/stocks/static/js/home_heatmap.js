// contains the D3 code to create the homepage heatmap
console.log("HERE!");

var margin = {top: 80, right: 25, bottom: 30, left:40},
	width = 450-margin.left-margin.right,
	height = 450-margin.top-margin.bottom;

var svg = d3.select("#heatmap")
	.append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
	.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

var yAxis = ["v1", "v2", "v3", "v4"]
var xAxis = ["A", "B", "C", "E"]

var x = d3.scaleBand()
	.range([0, width])
	.domain(xAxis)
	.padding(0.01);
svg.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))

console.log("HERE!!2");
var y = d3.scaleBand()
	.range([ height, 0 ])
	.domain(yAxis)
	.padding(0.01);
svg.append("g")
	.call(d3.axisLeft(y));

var myColor = d3.scaleLinear()
	.range(['white', '#69b3a2'])
	.domain([1,100])

d3.csv("./data.csv").then(function(data) {
	svg.selectAll()
		.data(data, function(d) {return d.x+":"+d.y;})
		.enter()
		.append("rect")
		.attr("x", function(d) {return x(d.x)})
		.attr("y", function(d) {return y(d.y) })
		.attr("width", x.bandwidth())
		.attr("height", y.bandwidth())
		.style("fill", function(d) {return myColor(d.value) })
}).then(function(data) {
	console.log("Promise fulfilled!");
});
