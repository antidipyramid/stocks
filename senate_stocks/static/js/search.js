function newResult(parent, inner, link) {
	let result = document.createElement("a")
	result.href = link
	result.className = "list-group-item list list-group-item-action list-group-item-light"
	result.innerHTML = inner
	results.setAttribute('transition-duration','1s')
	results.setAttribute('transition-timing-function','linear')
	parent.appendChild(result)
}

function executeSearch() {
	let query = document.getElementById("searchbox").value
	
	let results = document.getElementById("results")
	if (!query) {
		while (results.lastChild) {
			results.removeChild(results.lastChild)
		}
		return;
	}

	var xhttp = new XMLHttpRequest()
	xhttp.responseType = "json"

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if (results.firstChild == null) {
				newResult(results,"","")
			}

			let curr = results.firstChild
			for (i = 0; i < xhttp.response.senators.length; i++) {
				let desc = "Senator: ".concat(xhttp.response.senators[i].first_name,
												" ",xhttp.response.senators[i].last_name)
				let link = "senator/".concat(xhttp.response.senators[i].id)

				if (curr) {
					curr.innerHTML = desc
					curr.href = link
					curr = curr.nextSibling
				}
				else {
					newResult(results,desc,link)	
				}
			}
			for (i = 0; i < xhttp.response.assets.length; i++) {
				let desc = "Asset: ".concat(xhttp.response.assets[i].name)
				let link = "asset/".concat(xhttp.response.assets[i].id)

				if (curr) {
					curr.innerHTML = desc
					curr.href = link
					curr = curr.nextSibling
				}
				else {
					newResult(results,desc,link)	
				}
			}
			while (curr) {
				let tmp = curr.nextSibling
				results.removeChild(curr)
				curr = tmp
			}
		}
	};
	xhttp.open("GET","api/search/" + query,true);
	xhttp.send();
}

var delay;
function delayedSearch() {
	clearTimeout(delay);
	delay = setTimeout(() => {
		executeSearch()
	},250);
}
