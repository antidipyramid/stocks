/**
 *
 *
 */
function displayTradeInfo(trade) {
	document.getElementById("asset-name").innerHTML = "Asset: " + trade.asset_name;
	document.getElementById("senator").innerHTML = "Senator: " + trade.senator;
	document.getElementById("ticker").innerHTML = "Ticker: " + trade.ticker;
	document.getElementById("amount").innerHTML = "Amount: " + trade.amount;
	document.getElementById("comments").innerHTML = "Comments: " + trade.comments;
	document.getElementById("date").innerHTML = "Date: " + trade.transaction_date;
}
