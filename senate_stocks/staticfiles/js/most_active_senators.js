
// set the dimensions and margins of the graph
var active_margin = {top: 0, right: 50, bottom: 0, left: 200},
	activeWidth = 500 - active_margin.left - active_margin.right,
	activeHeight = 300 - active_margin.top - active_margin.bottom;

// append the activeSvg object to the body of the page
var activeSvg = d3.select("#most-active-senators")
	.append("svg")
	.attr("width", activeWidth + active_margin.left + active_margin.right)
	.attr("height", activeHeight + active_margin.top + active_margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + active_margin.left + "," + active_margin.top + ")");

var activeTooltip = d3.select("#most-active-senators")
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
		.style("display","none")

const BAR_HEIGHT = 25;

//get the data
function loadActiveSenatorGraph(data) {
	// sort the map by asset frequency
	let count = Array.from(data.values()).reduce((acc,curr) => acc + curr, 0);
	let sortedData = Array.from(data.entries()).sort((a,b) => d3.descending(a[1],b[1]))
		.slice(0,9);
	console.log(sortedData);
	console.log(count);
	// Add X axis
	var activeX = d3.scaleLinear()
		.domain([0, d3.max(sortedData,d => d[1])])
		.range([ 0, activeWidth]);
	var activeXAxis = activeSvg.append("g")
		.attr("transform", "translate(0," + activeHeight + ")")
		.call(d3.axisBottom(activeX)
			.tickSize(0)
			.tickValues([]))
		.select('.domain').remove();
		
	activeXAxis.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end")

	// Y axis
	var activeY = d3.scaleBand()
		.range([ 0, activeHeight ])
		.domain(sortedData.map(d => d[0]))
		.padding(.1);
	activeSvg.append("g")
		.call(d3.axisLeft(activeY)
			.tickPadding(5)
			.tickSize(0))
		.attr("font-family","Roboto Mono")
		.attr("font-weight","bold")
    .style("font-size","1em")
		.select('.domain').remove();


	//Bars
	activeSvg.append("g")
		.selectAll("myRect")
		.data(sortedData)
		.enter()
		.append("rect")
		.attr("rx",BAR_ROUND)
		.attr("ry",BAR_ROUND)
		.attr("x", activeX(0) )
		// .attr("y", d => (y(d.ticker) + y.bandwidth()) / 2)
		.attr("y", d => activeY( d[0] ))
		.attr("width", function(d) { return activeX(0); })
		.attr("height", BAR_HEIGHT )
		.attr("fill", (d,i) => BAR_COLOR(i))
		.attr("opacity",".7")
		.on("mouseover", function(e,d) {
			d3.select(this)
        .style("opacity","1")
				// .style("fill", GRAPH_HOVER_COLOR);

			activeTooltip
				.html("<b>" + d[1] + " trades</b>")
				.style("visibility","visible")
				.style("display","");
		})
		.on("mousemove", function(e,d) {
			let x = e.layerX + TOOLTIP_OFFSET, 
				y = e.layerY + TOOLTIP_OFFSET;
			activeTooltip
				.style("left",x+"px")
				.style("top",y+"px")
		})
		.on("mouseout", function(d) {
			d3.select(this)
        .style("opacity","0.7")
				// .style("fill", BAR_COLOR);
			
			activeTooltip
				.style("visibility","hidden")
				.style("display","none");
		});

	activeSvg.append("g")
		.selectAll("labels")
		.data(sortedData)
		.enter()
		.append("text")
		.attr("y", d => activeY(d[0]) + activeY.bandwidth() / 2)
		.attr("x", d => activeX(d[1]))
		.attr("dx", "5px")
		.attr("font-family","Roboto Mono")
		.style("font-size","1.1em")
		.text(d => ((d[1] / count) * 100).toFixed() + "%")

	// Animation
	activeSvg.selectAll("rect")
		.transition()
		.duration(800)
		// .attr("y", function(d) { return y(d.ticker); })
		.attr("width", d => activeX( d[1] ))
		// .delay(function(d,i){console.log(i) ; return(i*100)})
}
