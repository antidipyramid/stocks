document.getElementById('navbar-search')
	.addEventListener('click', () => {
			let query = document.getElementById('navbar-search-input').value;
			search(query,'navbar-results');
		}
	);
