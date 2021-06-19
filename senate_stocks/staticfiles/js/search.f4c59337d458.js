function displaySearchResult(parent, inner, link) {
	let result = document.createElement("a")
	result.href = link
	result.className = "list-group-item list list-group-item-action list-group-item-light"
	result.innerHTML = inner
	results.setAttribute('transition-duration','1s')
	results.setAttribute('transition-timing-function','linear')
	document.getElementById(parent).appendChild(result)
}

function clearResults(id) {
	let resultsEle = document.getElementById(id);
	
	while(resultsEle.firstChild) {
		resultsEle.removeChild(resultsEle.lastChild);
	}
}

function showResults(resultsId, results) {
	for (const senator of results.senators) {
		let desc = 'Senator: ' + senator.first_name + ' ' + senator.last_name,
			link = 'senator/' + senator.id;
		displaySearchResult(resultsId,desc,link);
	}

	for (const asset of results.assets) {
		let desc = 'Asset: ' + asset.name,
			link = 'asset/' + asset.id;
		displaySearchResult(resultsId,desc,link);
	}
}

var delay;
function delayedSearch(searchId, resultsId) {
	clearTimeout(delay);
	delay = setTimeout(() => {
		clearResults(resultsId);
		let query = document.getElementById(searchId).value;
		if (query.length > 0) {
			fetch('api/search/' + query)
				.then(r => r.json())
				.then(d => {
					clearResults(resultsId);
					showResults(resultsId,d);
				});
		}
	},250);
}

function search(query, resultsId) {
	fetch('/api/search/' + query)
		.then(r => r.json())
		.then(d => {
				clearResults(resultsId);
				showResults(resultsId,d);
			}
		);
}
