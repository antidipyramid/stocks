// these global variables store the data that the d3 visualizations
// on the senator detail page will use
var heatmapMap = new Map(),
	assetNameMap = new Map(),
	assetOwnerMap = new Map(),
	tradeAmountMap = new Map(),
	transactionTypeMap = new Map();

const BAR_ROUND = 3,
	BAR_COLOR = "var(--off-black)",
	BAR_OPACITY = "0.7",
	GRAPH_HOVER_COLOR = "yellow"
	TOOLTIP_OFFSET = 5;

const apiUrl = "/api/senators/" + 
	window.location.pathname.split("/").pop();
async function getSenatorApiData(url=apiUrl) {
	const response = await fetch(url);
	return response.json();
}


/**
 * Fetches all of the senator's trades from the API,
 * then processes the data to be used by the various d3
 * visualizations.
 *
 */
async function processData(senatorApiJson) {
	for (let trade of senatorApiJson.related_trades) {
		// process for heatmap
		let volume = getVolume(trade.amount);
		if (heatmapMap.has(trade.transaction_date)) {
			let obj = heatmapMap.get(trade.transaction_date);
			obj.trades.push(trade);
			obj.volume = obj.volume + volume

			heatmapMap.get(trade.transaction_date).trades
				.push(trade);
		}
		else {
			heatmapMap.set(trade.transaction_date, {trades: [trade], volume: volume});
		}

		// process for most traded assets graph
		if (assetNameMap.has(trade.asset)) {
			assetNameMap.get(trade.asset).freq++;
		}
		else {
			assetNameMap.set(trade.asset, {freq: 1, name: trade.asset_name, ticker: trade.ticker});
		}

		// process for asset owner graph
		if (assetOwnerMap.has(trade.owner)) {
			assetOwnerMap.set(trade.owner,assetOwnerMap.get(trade.owner)+1);
		}
		else {
			assetOwnerMap.set(trade.owner,1);
		}


		// process for transaction type map
		if (trade.transaction_type == "Purchase" || trade.transaction_type == "Exchange") {
			if (transactionTypeMap.has(trade.transaction_type)) {
				transactionTypeMap.set(trade.transaction_type,transactionTypeMap.get(trade.transaction_type)+1);
			}			
			else {
				transactionTypeMap.set(trade.transaction_type,1);
			}
		}
		else {
			if (transactionTypeMap.has("Sale")) {
				transactionTypeMap.set("Sale",transactionTypeMap.get("Sale")+1);
			}
			else {
				transactionTypeMap.set("Sale",1)
			}
		}

		// process for amount map
		if (tradeAmountMap.has(trade.amount)) {
			tradeAmountMap.set(trade.amount,tradeAmountMap.get(trade.amount)+1);
		}
		else {
			tradeAmountMap.set(trade.amount,0);
		}
	}
}

getSenatorApiData()
	.then((data) => processData(data))
	.then(() => {
		update(2021,heatmapMap);
		loadHistogram(assetNameMap);
		loadOwnerGraph(assetOwnerMap);
		loadTransTypeGraph(transactionTypeMap);
		loadAmountGraph(tradeAmountMap);
	})

