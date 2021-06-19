document.querySelectorAll(".card")
	.forEach(card => {
		card.addEventListener("mouseover", e => {
			e.currentTarget.setAttribute("class","card mb-2 shadow");
		});
		card.addEventListener("mouseout", e => {
			e.currentTarget.setAttribute("class","card shadow-sm mb-2");
		});
	});
