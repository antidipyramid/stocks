const updateNavbar = function() {
	if (window.scrollY > 0) {
		document.getElementById("navbar")
			.setAttribute("class","navbar navbar-expand-lg navbar-dark fixed-top bg-dark");
	}
	else {
		document.getElementById("navbar")
			.setAttribute("class","navbar navbar-dark navbar-expand-lg fixed-top");
	}
}

let throttlePause;
const throttle = (callback, time) => {
	if (throttlePause) {
		return;
	}

	throttlePause = true;
	setTimeout(() => {
		callback();
		throttlePause = false;
	},time);
};

if (window.location.pathname == "/") {
	window.addEventListener("scroll",() => throttle(updateNavbar,50));
}
else {
	document.getElementById("navbar")
		.setAttribute("class","navbar navbar-expand-lg navbar-dark fixed-top bg-dark");
}
