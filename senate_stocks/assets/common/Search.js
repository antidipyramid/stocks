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

import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import SearchForm from './SearchForm';

import { v4 as uuidv4 } from 'uuid';

import { Layout, SingleSelectFacet } from '@elastic/react-search-ui-views';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

const config = {
  debug: true,
  hasA11yNotifications: true,
  onResultClick: () => {
    /* Not implemented */
  },
  onSearch: async (state) => {
    const { resultsPerPage, searchTerm, current, sortField, sortDirection } =
      state;
    const pageNumber = current + 1;
    return fetch(
      '/api/assets/?search=' +
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
                header={
                  <>
                    <SearchBox
                      view={({ value, onSubmit, onChange }) => {
                        return (
                          <SearchForm
                            value={value}
                            onSubmit={onSubmit}
                            onChange={onChange}
                          />
                        );
                      }}
                    />
                  </>
                }
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
                          name: 'Name (A-Z)',
                          value: 'name',
                          direction: 'asc',
                        },
                        {
                          name: 'Name (Z-A)',
                          value: 'name',
                          direction: 'dec',
                        },
                        {
                          name: 'Number of Trades (ascending)',
                          value: 'count',
                          direction: 'asc',
                        },
                        {
                          name: 'Number of Trades (descending)',
                          value: 'count',
                          direction: 'dec',
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
                  <Results
                    titleField="name"
                    shouldTrackClickThrough={true}
                    urlField="url"
                  />
                }
                bodyHeader={
                  <React.Fragment>
                    <PagingInfo />
                    <ResultsPerPage />
                  </React.Fragment>
                }
                bodyFooter={
                  <Paging
                    view={({ current, totalPages, onChange }) => (
                      <Pagination>
                        <Pagination.First
                          onClick={() => onChange(1)}
                          disabled={current === 1}
                        />
                        <Pagination.Prev
                          disabled={current === 1}
                          onClick={() => onChange(current - 1)}
                        />
                        {[...Array(totalPages + 1).keys()]
                          .slice(1)
                          .map((number) => (
                            <Pagination.Item
                              key={uuidv4()}
                              active={number === current}
                              onClick={() => onChange(number)}
                            >
                              {number}
                            </Pagination.Item>
                          ))}
                        <Pagination.Next
                          onClick={() => onChange(current + 1)}
                          disabled={current === totalPages}
                        />
                        <Pagination.Last
                          onClick={() => onChange(totalPages)}
                          disabled={current === totalPages}
                        />
                      </Pagination>
                    )}
                  />
                }
              />
            </ErrorBoundary>
          </div>
        )}
      </WithSearch>
    </SearchProvider>
  );
}
