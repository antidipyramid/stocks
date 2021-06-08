// set the dimensions and margins of the graph
var amount_margin = {top: 30, right: 30, bottom: 120, left: 50},
  amount_width = 600 - amount_margin.left - amount_margin.right,
  amount_height = 400 - amount_margin.top - amount_margin.bottom;

// append the svg object to the body of the page
var amount_svg = d3.select("#amount-graph")
  .append("svg")
  .attr("width", amount_width + amount_margin.left + amount_margin.right)
  .attr("height", amount_height + amount_margin.top + amount_margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + amount_margin.left + "," + amount_margin.top + ")");

var amountTooltip = d3.select("#amount-graph")
    .append("div")
    .style("opacity", 1)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("color","white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
		.style("font-family", "Roboto Mono")
    .style("font-size", "1em")
    .style("visibility","hidden")
    .style("display","none");

// Parse the Data
function loadAmountGraph(data) {
  let amountXVals = ['$1,001 - $15,000','$15,001 - $50,000', '$50,001 - $100,000', '$100,001 - $250,000', '$250,001 - $500,000', '$500,001 - $1,000,000','$1,000,001 - $5,000,000','$5,000,001 - $25,000,000','$25,000,001 - $50,000,000','Over $50,000,000',];
  // if data doesn't have a value for a type of owner
  // set that owner to 0 so we can display it in graph
  amountXVals.forEach((val) => {
    if(!data.has(val)) { data.set(val,0) };
  });

  // let sortedData = Array.from(data.entries()).sort((a,b) => d3.descending(a[1],b[1]));
  let count = Array.from( data.entries() ).reduce((acc,curr) => acc + curr[1],0);
  let maxY = d3.max(data.entries(),x => x[1]);

  console.log(data);
  // X axis
  var amount_x = d3.scaleBand()
    .range([ 0, amount_width ])
    .domain(amountXVals)
    .padding(0.5);
  amount_svg.append("g")
    .attr("transform", "translate(0," + amount_height + ")")
    .call(d3.axisBottom(amount_x)
      .tickSize(0)
      .tickPadding(15))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-30)")
    .style("text-anchor", "end")
    .style("font-family","Roboto Mono")
    .style("font-weight","bold")
    .style("font-size","1em")

  amount_svg.select(".domain").remove();

  // Add Y axis
  var amount_y = d3.scaleLinear()
    .domain([-(0.02 * maxY), maxY])
    .range([ amount_height, -(0.02 * maxY)]);
  amount_svg.append("g")
    .call(d3.axisLeft(amount_y)
      .tickSize(0)
      .tickValues([]));

  amount_svg.select(".domain").remove();

  // Bars
  amount_svg.selectAll("mybar")
    .data(data.entries())
    .enter()
    .append("rect")
    .attr("rx",BAR_ROUND)
    .attr("ry",BAR_ROUND)
    .attr("x", d => amount_x( d[0] ))
    .attr("y", amount_y(0))
    .attr("width", amount_x.bandwidth())
    .attr("height", 0)
    .attr("fill", BAR_COLOR)
    .attr("opacity",BAR_OPACITY)
    .on("mouseover", function(e,d) {
      d3.select(this)
        .style("opacity","1");
        // .style("fill", GRAPH_HOVER_COLOR);

			amountTooltip
				.html("<b>" + d[1] + " trades</b> worth <i>" + d[0] + "</i>.")
				.style("visibility","visible")
				.style("display","");
    })
		.on("mousemove", function(e,d) {
			let x = e.layerX + TOOLTIP_OFFSET, 
				y = e.layerY + TOOLTIP_OFFSET;
      
			amountTooltip
				.style("left",x+"px")
				.style("top",y+"px")
		})
    .on("mouseout", function(d) {
      d3.select(this)
        .style("opacity","0.7");
        // .style("fill", BAR_COLOR);

			amountTooltip
				.style("visibility","hidden")
				.style("display","none");
    });

  // Text labels
  amount_svg.selectAll("labels")
    .data(data.entries())
    .enter()
    .append("text")
    .attr("x", d => amount_x( d[0] ) + amount_x.bandwidth() / 2)
    .attr("y", d => amount_y( d[1] ))
    .attr("dy", "-5px")
    .text(d => ((d[1] / count) * 100).toFixed() + "%")
    .attr("font-family","Roboto Mono")
    .attr("text-anchor","middle")

	// Animation
	amount_svg.selectAll("rect")
		.transition()
		.duration(800)
		.attr("y", d => amount_y( d[1] ))
    .attr("height", d => amount_height - amount_y(d[1]))
}
