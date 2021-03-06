function executeSearch() {
  let query = document.getElementById("searchbox").value
  console.log(query)
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		console.log(this.responseText)
	}
  };
  xhttp.open("GET",f'http://127.0.0.1:8000/api/search/{query}',true);
  xhttp.send();

}
