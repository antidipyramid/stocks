// global variables to store data that the d3 visualizations
// on asset detail page will use
var senatorNameMap = new Map(), // how many trades from each senator?
	assetTradeAmountMap = new Map(), // how much was each trade worth?
	assetTransTypeMap = new Map(), // what type of transaction was each trade?
	assetMostRecentTrades = [],
	tradeList;

const BAR_COLOR = d3.scaleOrdinal(d3.schemeCategory10);

const apiUrl = '/api/assets/' + 
	window.location.pathname.split('/').pop();

const amounts = ['$1,001 - $15,000','$15,001 - $50,000', '$50,001 - $100,000', '$100,001 - $250,000', '$250,001 - $500,000', '$500,001 - $1,000,000','$1,000,001 - $5,000,000','$5,000,001 - $25,000,000','$25,000,001 - $50,000,000','Over $50,000,000',];
amounts.forEach(a => assetTradeAmountMap.set(a,0));

const trans_types = ["Purchase", "Sale", "Exchange"];
trans_types.forEach(t => assetTransTypeMap.set(t,0));

const BAR_ROUND = 3,
	BAR_OPACITY = "0.7",
	GRAPH_HOVER_COLOR = "yellow"
	TOOLTIP_OFFSET = 10;

/**
 * Fetches the asset's data from the API.
 * Fields returned for each asset: id, ticker,
 * name, count, latest (date of last trade), 
 * last_senator (last senator to trade this asset),
 * trades (all trades made by any senator of this asset)
 *
 * @param {String} url - exact url to fetch info from api
 * @return {object} an object containing the response from api
 *
 */
async function getAssetApiData(url=apiUrl) {
	const response = await fetch(url);
	return response.json();
}

/**
 * Processes the data returned by getAssetApiData
 * and stores it in the global variables to be used 
 * by the d3 visualizations
 *
 * @param {object} assetJson - json object returned by api
 *
 */
async function processAssetData(assetJson) {
	for (const trade of assetJson.asset_related_trades) {
		// process for senators graph
		if (senatorNameMap.has(trade.senator)) {
			senatorNameMap.set(trade.senator,senatorNameMap.get(trade.senator)+1);
		}
		else {
			senatorNameMap.set(trade.senator,1);
		}

		// process for trade amount graph
		assetTradeAmountMap.set(trade.amount,assetTradeAmountMap.get(trade.amount)+1);

		// process for transaction type map
		if (trade.transaction_type == "Purchase" || trade.transaction_type == "Exchange") {
			assetTransTypeMap.set(trade.transaction_type,assetTransTypeMap.get(trade.transaction_type)+1);
		}
		else {
			assetTransTypeMap.set("Sale",assetTransTypeMap.get("Sale")+1);
		}
	}

	// sort trades to get most recent
	assetJson.asset_related_trades.sort((a,b) => {
		if (a.transaction_date > b.transaction_date) { return -1; }
		else if (a.transaction_date == b.transaction_date) { return 0; }
		else { return 1; }
	})

	assetMostRecentTrades = assetJson.asset_related_trades.slice(0,5);
}

getAssetApiData()
	.then(d => { processAssetData(d) })
	.then(() => {
		console.log(assetMostRecentTrades);
		loadActiveSenatorGraph(senatorNameMap)
		loadAssetTransTypeGraph(assetTransTypeMap);
		loadAssetAmountGraph(assetTradeAmountMap);
		loadMostRecentTrades(assetMostRecentTrades);
	})
