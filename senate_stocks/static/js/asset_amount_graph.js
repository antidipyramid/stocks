// set the dimensions and margins of the graph
var assetAmountMargin = { top: 20, right: 0, bottom: 100, left: 50 },
  assetAmountWidth = 700 - assetAmountMargin.left - assetAmountMargin.right,
  assetAmountHeight = 400 - assetAmountMargin.top - assetAmountMargin.bottom;

// append the svg object to the body of the page
var assetAmountSvg = d3
  .select("#asset-amount-graph")
  .append("svg")
  .attr(
    "width",
    assetAmountWidth + assetAmountMargin.left + assetAmountMargin.right
  )
  .attr(
    "height",
    assetAmountHeight + assetAmountMargin.top + assetAmountMargin.bottom
  )
  .call(responsivefy)
  .append("g")
  .attr(
    "transform",
    "translate(" + assetAmountMargin.left + "," + assetAmountMargin.top + ")"
  );

var assetAmountTooltip = d3
  .select("#asset-amount-graph")
  .append("div")
  .attr("class", "tooltip")
  .style("background-color", "black")
  .style("color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("font-family", "Roboto Mono")
  .style("font-size", "1em")
  .style("visibility", "hidden")
  .style("display", "none")
  .style("opacity", 1);

// Parse the Data
function loadAssetAmountGraph(data) {
  // let sortedData = Array.from(data.entries()).sort((a,b) => d3.descending(a[1],b[1]));
  let count = Array.from(data.entries()).reduce(
    (acc, curr) => acc + curr[1],
    0
  );
  let maxY = d3.max(data.entries(), (x) => x[1]);

  // X axis
  var assetAmountX = d3
    .scaleBand()
    .range([0, assetAmountWidth])
    .domain(data.keys())
    .padding(0.5);
  assetAmountSvg
    .append("g")
    .attr("transform", "translate(0," + assetAmountHeight + ")")
    .call(d3.axisBottom(assetAmountX).tickSize(0).tickPadding(15))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-30)")
    .style("text-anchor", "end")
    .style("font-family", "Roboto Mono")
    .style("font-weight", "bold")
    .style("font-size", "1em");

  assetAmountSvg.select(".domain").remove();

  // Add Y axis
  var assetAmountY = d3
    .scaleLinear()
    .domain([-(0.02 * maxY), maxY])
    .range([assetAmountHeight, -(0.02 * maxY)]);
  assetAmountSvg
    .append("g")
    .call(d3.axisLeft(assetAmountY).tickSize(0).tickValues([]));

  assetAmountSvg.select(".domain").remove();

  // Bars
  assetAmountSvg
    .selectAll("mybar")
    .data(data.entries())
    .enter()
    .append("rect")
    .attr("rx", BAR_ROUND)
    .attr("ry", BAR_ROUND)
    .attr("x", (d) => assetAmountX(d[0]))
    .attr("y", assetAmountY(0))
    .attr("width", assetAmountX.bandwidth())
    .attr("height", 0)
    .attr("fill", (d, i) => BAR_COLOR(i))
    .attr("opacity", BAR_OPACITY)
    .on("mouseover", function (e, d) {
      d3.select(this).style("opacity", "1");
      // .style("fill", GRAPH_HOVER_COLOR);

      assetAmountTooltip
        .html("<b>" + d[1] + " trades</b> worth <i>" + d[0] + "</i>.")
        .style("visibility", "visible")
        .style("display", "");
    })
    .on("mousemove", function (e, d) {
      let x = e.layerX + TOOLTIP_OFFSET,
        y = e.layerY + TOOLTIP_OFFSET;

      assetAmountTooltip.style("left", x + "px").style("top", y + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("opacity", "0.7");
      // .style("fill", BAR_COLOR);

      assetAmountTooltip.style("visibility", "hidden").style("display", "none");
    });

  // Text labels
  assetAmountSvg
    .selectAll("labels")
    .data(data.entries())
    .enter()
    .append("text")
    .attr("x", (d) => assetAmountX(d[0]) + assetAmountX.bandwidth() / 2)
    .attr("y", (d) => assetAmountY(d[1]))
    .attr("dy", "-5px")
    .text((d) => ((d[1] / count) * 100).toFixed() + "%")
    .attr("font-family", "Roboto Mono")
    .attr("text-anchor", "middle");

  // Animation
  assetAmountSvg
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", (d) => assetAmountY(d[1]))
    .attr("height", (d) => assetAmountHeight - assetAmountY(d[1]));
}
