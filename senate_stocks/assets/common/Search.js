import React from 'react';

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  WithSearch,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
} from '@elastic/react-search-ui';
import { Layout, SingleSelectFacet } from '@elastic/react-search-ui-views';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

const config = {
  debug: true,
  hasA11yNotifications: true,
  onResultClick: () => {
    /* Not implemented */
  },
  onSearch: async (state) => {
    const { resultsPerPage, current } = state;
    return fetch('/api/assets')
      .then((response) => response.json())
      .then((jsonResponse) => {
        return {
          results: jsonResponse.map((result) =>
            Object.keys(result).reduce((acc, key) => {
              return { ...acc, [key]: { raw: result[key] } };
            }, {})
          ),
          totalResults: jsonResponse.length,
          totalPages: Math.ceil(jsonResponse.length / resultsPerPage),
        };
      });
  },
};

export default function Search() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => (
          <div className="App">
            <ErrorBoundary>
              <Layout
                header={<SearchBox />}
                sideContent={
                  <div>
                    <Sorting
                      label={'Sort by'}
                      sortOptions={[
                        {
                          name: 'Relevance',
                          value: '',
                          direction: '',
                        },
                        {
                          name: 'Title',
                          value: 'title',
                          direction: 'asc',
                        },
                      ]}
                    />
                    {/* <Facet */}
                    {/*   field="states" */}
                    {/*   label="States" */}
                    {/*   filterType="any" */}
                    {/*   isFilterable={true} */}
                    {/* /> */}
                    {/* <Facet */}
                    {/*   field="world_heritage_site" */}
                    {/*   label="World Heritage Site?" */}
                    {/* /> */}
                    {/* <Facet field="visitors" label="Visitors" filterType="any" /> */}
                    {/* <Facet */}
                    {/*   field="acres" */}
                    {/*   label="Acres" */}
                    {/*   view={SingleSelectFacet} */}
                    {/* /> */}
                  </div>
                }
                bodyContent={
                  <Results titleField="name" shouldTrackClickThrough={true} />
                }
                bodyHeader={
                  <React.Fragment>
                    <PagingInfo />
                    <ResultsPerPage />
                  </React.Fragment>
                }
                bodyFooter={<Paging />}
              />
            </ErrorBoundary>
          </div>
        )}
      </WithSearch>
    </SearchProvider>
  );
}
