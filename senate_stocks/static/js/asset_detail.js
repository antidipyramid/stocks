/**
 * Takes the amount field in of Trade instance, converts to num
 * and returns median
 *
 * @param amount
 *
 */
function getVolume(amount) {
  let bounds = amount.split("-");
  bounds.forEach((x,i,a) => { 
    a[i] = Number(x.replace(/[ ,$]/g,""));
  });
  return bounds.reduce((a,b) => a+b) / 2;
}

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 1000 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#heatmap")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Read the data
function createGraph(prices,trades) {
  console.log(trades);
  // Add X axis --> it is a date format
  var x = d3.scaleTime()
    .domain(d3.extent(prices, function(d) { console.log(d[0]); return d3.timeParse("%Y-%m-%d")(d[0]); }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(prices, function(d) { console.log(d[1]); return Number(d[1]); })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([5000,1000000])
    .range([ 4, 40]);


  // Add the line
  svg.append("path")
    .datum(prices)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d[0])) })
      .y(function(d) { return y(d[1]) })
    )

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(trades)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d3.timeParse("%Y-%m-%d")(d.fields.transaction_date))} )
    .attr("cy", function (d) { return y(45); } )
    .attr("r", function (d) { return z(getVolume(d.fields.amount)); } )
    .style("fill", function (d) { return "red"; } )
    .style("opacity", "0.7")
    .attr("stroke", "white")
    .style("stroke-width", "2px")
}
