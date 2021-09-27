"use strict";
const url = "/api/senators";

/**
 * Fetch senators from the API. These senators are stored in a
 * global variable to be used if the user wants to filter the
 * results.
 *
 * @param {String} url - API address
 *
 */
async function fetchSenators(url) {
  const response = await fetch(url);
  return response.json();
}

/**
 * Creates senator cards given a list of senator objects.
 *
 * @param {Array} senators
 *
 */
var results; // stores the senators currently displayed on page
function loadSenatorCards(senators) {
  let anchor = document.getElementById("senator-cards");
  for (const senator of senators) {
    let card = document.createElement("div");
    card.setAttribute("class", "card animated mb-3 shadow-sm sen-card");
    // card.setAttribute("style", "width:40vw;");

    let row = document.createElement("div");
    row.setAttribute("class", "row g-0");
    card.appendChild(row);
    let col = document.createElement("div");
    col.setAttribute("class", "col-md-4");
    row.appendChild(col);
    let img = document.createElement("img");
    img.setAttribute("src", senator.photo_url);
    img.setAttribute("class", "img-fluid senator-img");
    img.setAttribute("style", "object-fit:cover;height:100%;");
    col.appendChild(img);

    let col2 = document.createElement("div");
    col2.setAttribute("class", "col-md-8");
    let body = document.createElement("div");
    body.setAttribute("class", "card-body");
    col2.appendChild(body);
    row.appendChild(col2);
    let title = document.createElement("h5");
    title.setAttribute("class", "card-title");
    body.appendChild(title);
    let link = document.createElement("a");
    link.setAttribute("class", "link-dark card-link stretched-link");
    link.setAttribute("href", "/senator/" + senator.id);
    link.innerHTML = senator.first_name + " " + senator.last_name;
    title.appendChild(link);

    let info = document.createElement("div");
    info.setAttribute("class", "d-flex flex-row align-items-center");
    let subtitle = document.createElement("h6");
    subtitle.setAttribute("class", "flex-grow-1 card-subtitle");
    subtitle.innerHTML = "(" + senator.party + "-" + senator.state + ")";
    info.appendChild(subtitle);

    let badgeContainer = document.createElement("div");
    let badge = document.createElement("span");
    badge.setAttribute("class", "badge bg-primary");
    badge.innerHTML = senator.count + " trades";
    badgeContainer.appendChild(badge);
    info.appendChild(badgeContainer);
    body.appendChild(info);

    let latest = document.createElement("p");
    latest.setAttribute("class", "text-muted mb-auto latest-info");
    let small = document.createElement("small");
    let bold = document.createElement("b");
    bold.innerHTML = "Most recent: ";
    small.appendChild(bold);
    small.innerHTML =
      "Latest trade: " +
      senator.latest.asset_name.slice(0, 25) +
      " on " +
      Date.parse(senator.latest.transaction_date).toString("MMMM d, yyyy");
    latest.appendChild(small);
    body.appendChild(latest);

    anchor.appendChild(card);
  }
}
fetchSenators(url).then((d) => {
  // sort and load all senators to display when user first
  // visits page
  sortSenators(d, "Last trade (newest to oldest)");

  document.getElementById("loading-senators").remove();
  document.getElementById("senator-spinner").remove();
  document.getElementById("senator-result-count").removeAttribute("hidden");

  setNumberOfResults(d.length);
  resetFilterOptions();

  // set event listeners for filtering/sorting options
  document.getElementById("party").addEventListener("input", (e) => {
    results = filterSenators(d);
    setNumberOfResults(results.length);
  });

  document.getElementById("state").addEventListener("input", (e) => {
    results = filterSenators(d);
    setNumberOfResults(results.length);
  });

  let delay;
  document.getElementById("name").addEventListener("input", (e) => {
    clearTimeout(delay);
    delay = setTimeout(
      () => {
        results = filterSenators(d);
        setNumberOfResults(results.length);
      },
      250,
      e.currentTarget
    );
  });

  results = JSON.parse(JSON.stringify(d)); // deep copy senators array for sorting
  document.getElementById("sort").addEventListener("input", (e) => {
    results = sortSenators(results, e.originalTarget.value);
  });
});

/**
 * Resets filter options to default values
 */
function resetFilterOptions() {
  document.getElementById("name").value = "";
  document.getElementById("party").value = "All";
  document.getElementById("state").value = "All";
  document.getElementById("sort").value = "Last trade (newest to oldest)";
}

/**
 * Displays the number of senator results found
 *
 * @param {String} id - element that displays number of results
 * @param {Number} num - number of results
 *
 */
function setNumberOfResults(num, id = "num-results") {
  document.getElementById(id).innerHTML = num;
}

/**
 * Clear all senators from page
 *
 * @param {String} id - parent element of senator cards
 */
function clearSenators(id = "senator-cards") {
  let senatorsParent = document.getElementById(id);
  while (senatorsParent.childNodes[0]) {
    senatorsParent.removeChild(senatorsParent.childNodes[0]);
  }
}

/**
 * Filters senators for display on senators page
 *
 * @param {Array} senators - list of Senator instances
 */
function filterSenators(senators) {
  let values = ["party", "name", "state"].map((id) => {
    return document.getElementById(id).value;
  });
  let filters = [compareParty, compareName, compareState].map((func, i) => {
    return func(values[i]);
  });

  let results = senators;
  for (const f of filters) {
    results = results.filter(f);
  }

  clearSenators();
  loadSenatorCards(results);
  return results;
}

/**
 * Second order func that compares a senator object's party a given value.
 *
 * @param {String} party
 * @return {Function} - compares a senator object to a
 * specific party value
 *
 */
function compareParty(party) {
  if (party == "All") {
    return (x) => true;
  } else {
    return (x) => party == x.party;
  }
}

/**
 * Second order func that compares a senator object's state to any value
 *
 * @param {String} state
 * @return {Function} - compares a senator object to a specific
 * state value
 *
 */
function compareState(state) {
  if (state == "All") {
    return (x) => true;
  } else {
    return (x) => state == x.state;
  }
}

/**
 * Second order function that compares a senator object's name
 *
 * @param {name} name
 * @return {Function} - compares a senator object's name to a specific name
 *
 */
function compareName(name) {
  if (name == "") {
    return (x) => true;
  } else {
    return (x) =>
      (x.first_name + " " + x.last_name)
        .toUpperCase()
        .includes(name.toUpperCase());
  }
}

/**
 * Generic function to sort elements from least to most
 * for use in Array.sort()
 *
 * @param {Function} func - the function to use to compare elements
 * @return {Number}
 *
 */
function asc(func) {
  return (a, b) => {
    if (func(a) < func(b)) {
      return -1;
    } else if (func(a) == func(b)) {
      return 0;
    } else {
      return 1;
    }
  };
}

/**
 * Generic function to sort elements from most to least
 * for use in Array.sort()
 *
 * @param {Function} func - the function to use to compare elements
 * @return {Number}
 *
 */
function desc(func) {
  return (a, b) => {
    if (func(a) > func(b)) {
      return -1;
    } else if (func(a) == func(b)) {
      return 0;
    } else {
      return 1;
    }
  };
}

/**
 * Sorts senator cards according to user selection of sort method
 *
 * @param {Array} senators - list of senators to sort
 * @param {String} val - the sort method the user selected
 *
 */
function sortSenators(senators, val) {
  let sorted;
  switch (val) {
    case "Trades (most to least)":
      sorted = senators.sort(desc((x) => x.count));
      break;
    case "Trades (least to most)":
      sorted = senators.sort(asc((x) => x.count));
      break;
    case "Last trade (newest to oldest)":
      sorted = senators.sort(
        desc((x) => Date.parse(x.latest.transaction_date).getTime())
      );
      break;
    case "Last trade (oldest to newest)":
      sorted = senators.sort(
        asc((x) => Date.parse(x.latest.transaction_date).getTime())
      );
      break;
  }

  clearSenators();
  loadSenatorCards(senators);
  return sorted;
}
