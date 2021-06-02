// set the dimensions and margins of the graph
var owner_margin = {top: 30, right: 30, bottom: 50, left: 10},
  owner_width = 250 - owner_margin.left - owner_margin.right,
  owner_height = 350 - owner_margin.top - owner_margin.bottom;

// append the svg object to the body of the page
var owner_svg = d3.select("#owner-graph")
  .append("svg")
    .attr("width", owner_width + owner_margin.left + owner_margin.right)
    .attr("height", owner_height + owner_margin.top + owner_margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + owner_margin.left + "," + owner_margin.top + ")");

var ownerTooltip = d3.select("#owner-graph")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
		.style("font-family", "Roboto Mono")

// Parse the Data
function loadOwnerGraph(data) {
  
  // if data doesn't have a value for a type of owner
  // set that owner to 0 so we can display it in graph
  let ownerXVals = ["Self","Spouse","Child", "Joint"];
  ownerXVals.forEach((val) => {
      if(!data.has(val)) { data.set(val,0) };
    });

  let sortedData = Array.from(data.entries()).sort((a,b) => d3.descending(a[1],b[1]));
  let count = sortedData.reduce((acc,curr) => acc + curr[1],0);
  let maxY = d3.max(sortedData,x => x[1]);

  // X axis
  var owner_x = d3.scaleBand()
    .range([ 0, owner_width ])
    .domain(ownerXVals)
    .padding(0.5);
  owner_svg.append("g")
    .attr("transform", "translate(0," + owner_height + ")")
    .call(d3.axisBottom(owner_x)
      .tickSize(0)
      .tickPadding(15))
    .selectAll("text")
      // .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "middle")
    .style("font-family","Roboto Mono")
    .style("font-weight","bold")
    .style("font-size","1.3em")
  
  owner_svg.select(".domain").remove();

  // Add Y axis
  var owner_y = d3.scaleLinear()
    .domain([-(0.02 * maxY), maxY])
    .range([ owner_height, -(0.02 * maxY)]);
  owner_svg.append("g")
    .call(d3.axisLeft(owner_y)
      .tickSize(0)
      .tickValues([]));

  owner_svg.select(".domain").remove();
  
  // Bars
  owner_svg.selectAll("mybar")
    .data(sortedData)
    .enter()
    .append("rect")
    .attr("rx",BAR_ROUND)
    .attr("ry",BAR_ROUND)
    .attr("x", d => owner_x( d[0] ))
    .attr("y", owner_y(0))
      .attr("width", owner_x.bandwidth())
    .attr("height", 0)
      .attr("fill", BAR_COLOR)
    .attr("opacity",BAR_OPACITY)
		.on("mouseover", function(e,d) {
			d3.select(this)
				.style("fill", GRAPH_HOVER_COLOR);
      
      ownerTooltip
        .html("<b>" + d[1] + " </b>trades list <i>\'" + d[0] + "\'</i> as owner.")
        .style("opacity",1);
		})
    .on("mousemove", function(e,d) {
			let x = e.layerX + TOOLTIP_OFFSET, 
				y = e.layerY + TOOLTIP_OFFSET;
			ownerTooltip
				.style("left",x+"px")
				.style("top",y+"px")
    })
		.on("mouseout", function(d) {
			d3.select(this)
				.style("fill", BAR_COLOR);

      ownerTooltip.style("opacity",0);
		});

  // Text labels
  owner_svg.selectAll("labels")
    .data(sortedData)
    .enter()
    .append("text")
    .attr("x", d => owner_x( d[0] ) + owner_x.bandwidth() / 2)
    .attr("y", d => owner_y( d[1] ))
    .attr("dy", "-5px")
    .text(d => ((d[1] / count) * 100).toFixed() + "%")
		.attr("font-family","Roboto Mono")
    .attr("text-anchor","middle")

	// Animation
	owner_svg.selectAll("rect")
		.transition()
		.duration(800)
		.attr("y", d => owner_y( d[1] ))
    .attr("height", d => owner_height - owner_y(d[1]))
}
