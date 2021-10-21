import fetchAPIResults from './fetchAPIResults';

// Adapted from applyDisjunctiveFaceting.js in search-ui/examples/elasticSearch

function combineAggregationsFromResponses(initialAggregations, responses) {
  const acc = { ...initialAggregations };
  console.log(acc);
  for (const response of responses) {
    for (const key in response.aggregations) {
      if (key in acc) {
        acc[key].data = acc[key].data.concat(response.aggregations[key].data);
        acc[key].data = acc[key].data.filter(function (field) {
          return !this[field.value] && (this[field.value] = true);
        }, Object.create(null));
      } else {
        acc[key] = { ...response.aggregations[key] };
      }
    }
  }
  return acc;
}

// To calculate a disjunctive facet correctly, you need to calculate the facet counts as if the filter was
// not applied. If you did not do this, list of facet values would collapse to just one value, which is
// whatever you have filtered on in that facet.
function removeFilterByName(state, facetName) {
  return {
    ...state,
    filters: state.filters.filter((f) => f.field !== facetName),
  };
}

function removeAllFacetsExcept(body, facetName) {
  return {
    ...body,
    aggs: {
      [facetName]: body.aggs[facetName],
    },
  };
}

function changeSizeToZero(body) {
  return {
    ...body,
    size: 0,
  };
}

async function getDisjunctiveFacetCounts(
  state,
  urlBase,
  disjunctiveFacetNames
) {
  return Promise.all(
    // Note that this could be optimized by *not* executing a request
    // if not filter is currently applied for that field. Kept simple here for clarity.
    disjunctiveFacetNames.map((facetName) => {
      let newState = removeFilterByName(state, facetName);
      const { filters, searchTerm } = newState;
      const filterStrings = filters.map(
        (f) => f.field + '=' + f.values.join('|')
      );
      // let body = buildRequest(newState);
      // body = changeSizeToZero(body);
      // body = removeAllFacetsExcept(body, facetName);
      return fetchAPIResults(
        newState,
        urlBase + searchTerm + '&' + filterStrings.join('&')
      );
    })
  );
}

/**
 * This function will re-calculate facets that need to be considered
 * "disjunctive" (also known as "sticky"). Calculating sticky facets correctly
 * requires a second query for each sticky facet.
 *
 * @param {*} json
 * @param {*} state
 * @param {string[]} disjunctiveFacetNames
 *
 * @return {Promise<Object>} A map of updated aggregation counts for the specified facet names
 */
export default async function applyDisjunctiveFaceting(
  json,
  state,
  urlBase,
  disjunctiveFacetNames
) {
  const disjunctiveFacetCounts = await getDisjunctiveFacetCounts(
    state,
    urlBase,
    disjunctiveFacetNames
  );
  const disjunctiveAggregations = combineAggregationsFromResponses(
    json.aggregations,
    disjunctiveFacetCounts
  );

  return {
    ...json,
    aggregations: {
      ...disjunctiveAggregations,
    },
  };
}
