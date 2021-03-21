// takes json data returned from query to db api
// and parses it for use by D3
function process_data(json_data) {
	let assets = new Map();
	console.log(json_data)
	for (let trade of json_data) {
		if (assets.has(trade.asset)) {
			let val = assets.get(trade.asset)
			val.freq++;
			assets.set(trade.asset,val); 
		}
		else {
			let val = {freq: 1,
				name: trade.asset_name }
			assets.set(trade.asset,val);
		}
	}
	const compareTrades = function(a,b) {
		if (a[1] < b[1]) {
			return -1;
		}
		if (a[1] == b[1]) {
			return 0;
		}
		else {
			return 1;
		}
	}

	trades_by_freq = [...assets].sort(compareTrades);
	console.log(trades_by_freq);
	return trades_by_freq;
}

// get graph data
function fetch_data() {
	return new Promise( (resolve,reject) => {
		let data;
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				data = JSON.parse(this.response).related_trades;		
				resolve(data);
			}
		}
		xhttp.open('GET','http://127.0.0.1:8000/api/senators/73', true);
		xhttp.send();
	});
}

// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 40, left: 150},
	width = 460 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#histogram")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

let suffix = document.documentURI.split("/");

// get the data
let url = "http://127.0.0.1:8000/api/";
url = url.concat(suffix[suffix.length-2],'s/',suffix[suffix.length-1])
d3.json(url)
	.then( function(data) { return process_data(data.related_trades); })
	.then(function(data) {
		// Add X axis
		var x = d3.scaleLinear()
			.domain([0, 20])
			.range([ 0, width]);
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

		// Y axis
		var y = d3.scaleBand()
			.range([ 0, height ])
			.domain(data.map(function(d) { return d[1].name; }))
			.padding(.1);
		svg.append("g")
			.call(d3.axisLeft(y))

		//Bars
		svg.selectAll("myRect")
			.data(data)
			.enter()
			.append("rect")
			.attr("x", x(0) )
			.attr("y", function(d) { return y(d[1].name); })
			.attr("width", function(d) { return x(0); })
			.attr("height", y.bandwidth() )
			.attr("fill", "#69b3a2")
			.on("mouseover", function(d) {
				d3.select(this)
					.style("fill", "yellow");

				//rect.style("fill", (d) => "yeddllow")
				})
			.on("mouseout", function(d) {
				d3.select(this)
					.style("fill", "#69b3a2")
				});

		// Animation
		svg.selectAll("rect")
			.transition()
			.duration(800)
			.attr("y", function(d) { return y(d[1].name); })
			.attr("width", function(d) { return x(d[1].freq); })
			.delay(function(d,i){console.log(i) ; return(i*100)})
					
			
	});
