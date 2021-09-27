// set the dimensions and margins of the graph
var assetTypeMargin = { top: 30, right: 30, bottom: 50, left: 10 },
  assetTypeWidth = 250 - assetTypeMargin.left - assetTypeMargin.right,
  assetTypeHeight = 350 - assetTypeMargin.top - assetTypeMargin.bottom;

// append the svg object to the body of the page
var assetTypeSvg = d3
  .select("#asset-type-graph")
  .append("svg")
  .attr("width", assetTypeWidth + assetTypeMargin.left + assetTypeMargin.right)
  .attr(
    "height",
    assetTypeHeight + assetTypeMargin.top + assetTypeMargin.bottom
  )
  .append("g")
  .attr(
    "transform",
    "translate(" + assetTypeMargin.left + "," + assetTypeMargin.top + ")"
  );

var assetTypeTooltip = d3
  .select("#asset-type-graph")
  .append("div")
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("font-family", "Roboto Mono")
  .style("opacity", 1)
  .style("visibility", "hidden")
  .style("display", "none");

// Parse the Data
function loadAssetTransTypeGraph(data) {
  let sortedData = Array.from(data.entries()).sort((a, b) =>
    d3.descending(a[1], b[1])
  );
  let count = sortedData.reduce((acc, curr) => acc + curr[1], 0);
  let maxY = d3.max(sortedData, (x) => x[1]);

  var assetTypeXGrid = d3
    .axisBottom(assetTypeX)
    .tickSize(-assetTypeWidth + 10 + 30)
    .tickFormat("")
    .ticks(5);

  // var innerWidth = -assetTypeWidth + 10 + 30;

  // assetTypeSvg
  //   .append("g")
  //   .attr("class", "x-axis-grid")
  //   .attr("transform", "translate(0," + innerWidth + ")")
  //   .call(assetTypeXGrid);

  // X axis
  var assetTypeX = d3
    .scaleBand()
    .range([0, assetTypeWidth])
    .domain(sortedData.map((d) => d[0]))
    .padding(0.5);
  assetTypeSvg
    .append("g")
    .attr("transform", "translate(0," + assetTypeHeight + ")")
    .call(d3.axisBottom(assetTypeX).tickSize(0).tickPadding(15))
    .selectAll("text")
    // .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "middle")
    .style("font-family", "Roboto Mono")
    .style("font-weight", "bold")
    .style("font-size", "1.3em");

  assetTypeSvg.select(".domain").remove();

  // Add Y axis
  var assetTypeY = d3
    .scaleLinear()
    .domain([-(0.02 * maxY), maxY])
    .range([assetTypeHeight, -(0.02 * maxY)]);
  assetTypeSvg
    .append("g")
    .call(d3.axisLeft(assetTypeY).tickSize(0).tickValues([]));

  assetTypeSvg.select(".domain").remove();

  // Bars
  assetTypeSvg
    .selectAll("mybar")
    .data(sortedData)
    .enter()
    .append("rect")
    .attr("rx", BAR_ROUND)
    .attr("ry", BAR_ROUND)
    .attr("x", (d) => assetTypeX(d[0]))
    .attr("y", assetTypeY(0))
    .attr("width", assetTypeX.bandwidth())
    .attr("height", 0)
    .attr("fill", (d, i) => BAR_COLOR(i))
    .attr("opacity", BAR_OPACITY)
    .on("mouseover", function (e, d) {
      d3.select(this).style("opacity", "1");
      // .style("fill", GRAPH_HOVER_COLOR)

      switch (d[0]) {
        case "Purchase":
          assetTypeTooltip.html("<b>" + d[1] + " </b> trades purchased.");
          break;
        case "Sale":
          assetTypeTooltip.html(
            "<b>" + d[1] + " </b> trades sold (either partially or in full)."
          );
          break;
        case "Exchange":
          assetTypeTooltip.html("<b>" + d[1] + " </b> trades exchanged.");
          break;
      }

      assetTypeTooltip.style("visibility", "visible").style("display", "");
    })
    .on("mousemove", function (e, d) {
      let x = e.layerX + TOOLTIP_OFFSET,
        y = e.layerY + TOOLTIP_OFFSET;
      assetTypeTooltip.style("left", x + "px").style("top", y + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("opacity", "0.7");
      // .style("fill", BAR_COLOR);

      assetTypeTooltip.style("visibility", "hidden").style("display", "none");
    });

  // Text labels
  assetTypeSvg
    .selectAll("labels")
    .data(sortedData)
    .enter()
    .append("text")
    .attr("x", (d) => assetTypeX(d[0]) + assetTypeX.bandwidth() / 2)
    .attr("y", (d) => assetTypeY(d[1]))
    .attr("dy", "-5px")
    .text((d) => ((d[1] / count) * 100).toFixed() + "%")
    .attr("font-family", "Roboto Mono")
    .attr("text-anchor", "middle");

  // Animation
  assetTypeSvg
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", (d) => assetTypeY(d[1]))
    .attr("height", (d) => assetTypeHeight - assetTypeY(d[1]));
}
