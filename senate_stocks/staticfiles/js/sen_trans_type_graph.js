
// set the dimensions and margins of the graph
var type_margin = {top: 30, right: 30, bottom: 50, left: 10},
  type_width = 250 - type_margin.left - type_margin.right,
  type_height = 350 - type_margin.top - type_margin.bottom;

// append the svg object to the body of the page
var type_svg = d3.select("#type-graph")
  .append("svg")
    .attr("width", type_width + type_margin.left + type_margin.right)
    .attr("height", type_height + type_margin.top + type_margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + type_margin.left + "," + type_margin.top + ")");

var transTypeTooltip = d3.select("#type-graph")
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

// Parse the Data
function loadTransTypeGraph(data) {
  
  // if data doesn't have a value for a type of owner
  // set that owner to 0 so we can display it in graph
  let typeXVals = ["Purchase", "Sale", "Exchange"];
  typeXVals.forEach((val) => {
      if(!data.has(val)) { data.set(val,0) };
    });

  let sortedData = Array.from(data.entries()).sort((a,b) => d3.descending(a[1],b[1]));
  let count = sortedData.reduce((acc,curr) => acc + curr[1],0);
  let maxY = d3.max(sortedData,x => x[1]);

  // X axis
  var type_x = d3.scaleBand()
    .range([ 0, type_width ])
    .domain(typeXVals)
    .padding(0.5);
  type_svg.append("g")
    .attr("transform", "translate(0," + type_height + ")")
    .call(d3.axisBottom(type_x)
      .tickSize(0)
      .tickPadding(15))
    .selectAll("text")
      // .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "middle")
    .style("font-family","Roboto Mono")
    .style("font-weight","bold")
    .style("font-size","1.3em")
  
  type_svg.select(".domain").remove();

  // Add Y axis
  var type_y = d3.scaleLinear()
    .domain([-(0.02 * maxY), maxY])
    .range([ type_height, -(0.02 * maxY)]);
  type_svg.append("g")
    .call(d3.axisLeft(type_y)
      .tickSize(0)
      .tickValues([]));

  type_svg.select(".domain").remove();
  
  // Bars
  type_svg.selectAll("mybar")
    .data(sortedData)
    .enter()
    .append("rect")
    .attr("rx",BAR_ROUND)
    .attr("ry",BAR_ROUND)
    .attr("x", d => type_x( d[0] ))
    .attr("y", type_y( 0 ))
      .attr("width", type_x.bandwidth())
    .attr("height", 0)
    .attr("fill", BAR_COLOR)
    .attr("opacity",BAR_OPACITY)
		.on("mouseover", function(e,d) {
			d3.select(this)
        .style("opacity","1");
				// .style("fill", GRAPH_HOVER_COLOR);

      switch (d[0]) {
        case 'Purchase':
          transTypeTooltip
            .html("<b>" + d[1] + " </b> trades purchased.");
          break;
        case 'Sale':
          transTypeTooltip
            .html("<b>" + d[1] + " </b> trades sold (either partially or in full).");
          break;
        case 'Exchange': 
          transTypeTooltip
            .html("<b>" + d[1] + " </b> trades exchanged.");
          break;
      }

      transTypeTooltip
				.style("visibility","visible")
				.style("display","");
		})
		.on("mousemove", function(e,d) {
			let x = e.layerX + TOOLTIP_OFFSET, 
				y = e.layerY + TOOLTIP_OFFSET;
			transTypeTooltip
				.style("left",x+"px")
				.style("top",y+"px")
		})
		.on("mouseout", function(d) {
			d3.select(this)
        .style("opacity","0.7");
				// .style("fill", BAR_COLOR);

      transTypeTooltip
				.style("visibility","hidden")
				.style("display","none");
		});

  // Text labels
  type_svg.selectAll("labels")
    .data(sortedData)
    .enter()
    .append("text")
    .attr("x", d => type_x( d[0] ) + type_x.bandwidth() / 2)
    .attr("y", d => type_y( d[1] ))
    .attr("dy", "-5px")
    .text(d => ((d[1] / count) * 100).toFixed() + "%")
		.attr("font-family","Roboto Mono")
    .attr("text-anchor","middle")

	// Animation
	type_svg.selectAll("rect")
		.transition()
		.duration(800)
		.attr("y", d => type_y( d[1] ))
    .attr("height", d => type_height - type_y(d[1]))
}
