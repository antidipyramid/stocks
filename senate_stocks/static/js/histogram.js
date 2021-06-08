var tradesByOwner = new Map();

const compareTrades = function(a,b) {
	if (a.freq < b.freq) {
		return -1;
	}
	if (a.freq == b.freq) {
		return 0;
	}
	else {
		return 1;
	}
}

// set the dimensions and margins of the graph
var margin = {top: 0, right: 50, bottom: 0, left: 45},
	width = 250 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#most-traded-graph")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

var mostTradedTooltip = d3.select("#most-traded-graph")
    .append("div")
    .style("opacity", 1)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
		.style("font-family", "Roboto Mono")
		.style("visibility","hidden")
		.style("display","none");

const BAR_HEIGHT = 25;

//get the data
function loadHistogram(data) {
	// sort the map by asset frequency
	let count = Array.from(data.values()).reduce((acc,curr) => acc + curr.freq, 0);
	let sortedData = Array.from(data.values()).sort((a,b) => d3.descending(a.freq,b.freq))
		.slice(0,9);
	console.log(sortedData);
	console.log(count);
	// Add X axis
	var x = d3.scaleLinear()
		.domain([0, d3.max(sortedData,d => d.freq)])
		.range([ 0, width]);
	var x_Axis = svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x)
			.tickSize(0)
			.tickValues([]))
		.select('.domain').remove();
		
	x_Axis.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end")

	// Y axis
	var y = d3.scaleBand()
		.range([ 0, height ])
		.domain(sortedData.map(function(d) { return d.ticker; }))
		.padding(.1);
	svg.append("g")
		.call(d3.axisLeft(y)
			.tickPadding(5)
			.tickSize(0))
		.attr("font-family","Roboto Mono")
		.attr("font-weight","bold")
    .style("font-size","1em")
		.select('.domain').remove();


	//Bars
	svg.append("g")
		.selectAll("myRect")
		.data(sortedData)
		.enter()
		.append("rect")
		.attr("rx",BAR_ROUND)
		.attr("ry",BAR_ROUND)
		.attr("x", x(0) )
		// .attr("y", d => (y(d.ticker) + y.bandwidth()) / 2)
		.attr("y", function(d) { return y(d.ticker); })
		.attr("width", function(d) { return x(0); })
		.attr("height", BAR_HEIGHT )
		.attr("fill", (d,i) => BAR_COLOR(i))
		.attr("opacity",".7")
		.on("mouseover", function(e,d) {
			d3.select(this)
				.style("opacity","1")
				// .style("fill", GRAPH_HOVER_COLOR);

			mostTradedTooltip
				.html("<b>Asset Name:</b> <i>" + d.name + "</i><br><b>" + d.freq + " trades</b>")
				.style("visibility","visible")
				.style("display","");
		})
		.on("mousemove", function(e,d) {
			let x = e.layerX + TOOLTIP_OFFSET, 
				y = e.layerY + TOOLTIP_OFFSET;
			mostTradedTooltip
				.style("left",x+"px")
				.style("top",y+"px")
		})
		.on("mouseout", function(d) {
			d3.select(this)
				.style("opacity","0.7")
			
			mostTradedTooltip
				.style("visibility","hidden")
				.style("display","none");
		});

	svg.append("g")
		.selectAll("labels")
		.data(sortedData)
		.enter()
		.append("text")
		.attr("y", d => y(d.ticker) + y.bandwidth() / 2)
		.attr("x", d => x(d.freq))
		.attr("dx", "5px")
		.attr("font-family","Roboto Mono")
		.style("font-size","1.1em")
		.text(d => ((d.freq / count) * 100).toFixed() + "%")

	// Animation
	svg.selectAll("rect")
		.transition()
		.duration(800)
		// .attr("y", function(d) { return y(d.ticker); })
		.attr("width", function(d) { return x(d.freq); })
		// .delay(function(d,i){console.log(i) ; return(i*100)})
}
