export default async function fetchAPIResults(state, urlBase) {
  const { resultsPerPage, searchTerm, current, sortField, sortDirection } =
    state;
  const pageNumber = current + 1;
  return fetch(
    urlBase +
      searchTerm +
      '&page=' +
      (pageNumber - 1) +
      '&order=' +
      (sortDirection === 'asc' ? sortField : '-' + sortField)
  )
    .then((response) => response.json())
    .then((jsonResponse) => {
      return {
        results: jsonResponse.results.map((result) =>
          // results array needs to be in format Search UI can understand
          Object.keys(result).reduce((acc, key) => {
            return { ...acc, [key]: { raw: result[key] } };
          }, {})
        ),
        totalResults: jsonResponse.count,
        totalPages: Math.ceil(jsonResponse.count / resultsPerPage),
      };
    });
}
