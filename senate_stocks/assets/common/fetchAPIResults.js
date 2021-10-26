export default async function fetchAPIResults(state, urlBase) {
  const {
    resultsPerPage,
    filters,
    searchTerm,
    current,
    sortField,
    sortDirection,
  } = state;
  const pageNumber = current + 1;
  const filterStrings = filters.map((f) => f.field + '=' + f.values.join('|'));
  const url =
    urlBase +
    searchTerm +
    '&page=' +
    (pageNumber - 1) +
    '&page_size=' +
    resultsPerPage +
    '&order=' +
    (sortDirection === 'asc' ? sortField : '-' + sortField) +
    '&' +
    filterStrings.join('&');
  return fetch(url).then((response) => response.json());
  // .then((jsonResponse) => {
  //   return {
  //     results: jsonResponse.results.map((result) =>
  //       // results array needs to be in format Search UI can understand
  //       Object.keys(result).reduce((acc, key) => {
  //         return { ...acc, [key]: { raw: result[key] } };
  //       }, {})
  //     ),
  //     totalResults: jsonResponse.count,
  //     totalPages: Math.ceil(jsonResponse.count / resultsPerPage),
  //     facets: jsonResponse.aggregations && {
  //       state: [jsonResponse.aggregations.state],
  //       party: [jsonResponse.aggregations.party],
  //     },
  //   };
  // });
}
