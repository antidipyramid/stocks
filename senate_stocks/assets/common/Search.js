import React from 'react';

import {
  ErrorBoundary,
  SearchProvider,
  WithSearch,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
} from '@elastic/react-search-ui';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import SearchForm from './SearchForm';
import SearchPagination from './SearchPagination';
import fetchAPIResults from './fetchAPIResults';
import SearchResultsInfo from './SearchResultsInfo';
import SearchSortOptions from './SearchSortOptions';
import ResultsPerPageSelect from './ResultsPerPageSelect';

import '@elastic/react-search-ui-views/lib/styles/styles.css';

const resultsSortOptions = [
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
    direction: 'desc',
  },
  {
    name: 'Most Recent Trade',
    value: 'latest',
    direction: 'desc',
  },
  {
    name: 'Oldest Trade',
    value: 'latest',
    direction: 'asc',
  },
  {
    name: 'Number of Trades (ascending)',
    value: 'count',
    direction: 'asc',
  },
  {
    name: 'Number of Trades (descending)',
    value: 'count',
    direction: 'desc',
  },
];

const config = {
  debug: true,
  hasA11yNotifications: true,
  onResultClick: () => {
    /* Not implemented */
  },
  onSearch: (state) =>
    fetchAPIResults(state, '/api/assets/?search=').then((jsonResponse) => {
      return {
        totalResults: jsonResponse.count,
        totalPages: Math.ceil(jsonResponse.count / state.resultsPerPage),
        results: jsonResponse.results.map((result) =>
          // results array needs to be in format Search UI can understand
          Object.keys(result).reduce((acc, key) => {
            return { ...acc, [key]: { raw: result[key] } };
          }, {})
        ),
      };
    }),
};

export default function Search() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => (
          <div className="App">
            <ErrorBoundary>
              <Row className="mb-3">
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
              </Row>
              <Row className="mb-3 align-items-center">
                <Col>
                  <PagingInfo
                    view={({ start, end, totalResults }) => (
                      <SearchResultsInfo
                        start={start}
                        end={end}
                        totalResults={totalResults}
                      />
                    )}
                  />
                </Col>
                <Col sm="auto">
                  <b>Sort by</b>
                </Col>
                <Col sm="auto">
                  <Sorting
                    label={'Sort by'}
                    sortOptions={resultsSortOptions}
                    view={({ value, options, onChange }) => (
                      <SearchSortOptions
                        value={value}
                        options={options}
                        onChange={onChange}
                      />
                    )}
                  />
                </Col>
                <Col sm="auto">
                  <b>Show</b>
                </Col>
                <Col sm="auto">
                  <ResultsPerPage
                    view={({ value, options, onChange }) => (
                      <ResultsPerPageSelect
                        value={value}
                        options={options}
                        onChange={onChange}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Results
                titleField="name"
                shouldTrackClickThrough={true}
                urlField="url"
              />
              <Row className="justify-content-center">
                <Col className="align-self-center" sm="auto">
                  <Paging
                    view={({ current, totalPages, onChange }) => (
                      <SearchPagination
                        current={current}
                        totalPages={totalPages}
                        onChange={onChange}
                      />
                    )}
                  />
                </Col>
              </Row>
            </ErrorBoundary>
          </div>
        )}
      </WithSearch>
    </SearchProvider>
  );
}
