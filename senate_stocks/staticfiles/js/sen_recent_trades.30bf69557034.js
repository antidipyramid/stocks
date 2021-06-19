/**
 * Adds trades to most recent trades table on asset
 * detail page
 *
 * @param {Array} data - a list of Trade objects
 *
 */
function loadSenMostRecentTrades(data) {
	let table = document.getElementById("most-recent-trades-table");
	for (const trade of data) {
		let row = document.createElement('tr');
		let th = document.createElement('th');
		th.setAttribute("scope","row");
		th.innerHTML = Date.parse(trade.transaction_date)
			.toString("MMMM d, yyyy");
		row.appendChild(th);

		let fields = ['senator','owner','ticker','asset_type',
			'transaction_type','amount'];
		for (const field of fields) {
			let td = document.createElement('td');
			td.innerHTML = trade[field];
			row.appendChild(td);
		}
		table.appendChild(row);
	}
}
