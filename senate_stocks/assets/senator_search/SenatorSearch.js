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
import { MultiCheckboxFacet } from '@elastic/react-search-ui-views';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { states, parties } from '../common/Constants';

import { v4 as uuidv4 } from 'uuid';

import SearchForm from '../common/SearchForm';
import SearchPagination from '../common/SearchPagination';
import fetchAPIResults from '../common/fetchAPIResults';
import SearchResultsInfo from '../common/SearchResultsInfo';
import SearchSortOptions from '../common/SearchSortOptions';
import SenatorResult from './SenatorResult';
import CheckboxFilter from '../common/CheckboxFilter';
import ResultsPerPageSelect from '../common/ResultsPerPageSelect';
import applyDisjunctiveFaceting from '../common/disjuctive';

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
    fetchAPIResults(state, '/api/senators/?search=').then((json) =>
      applyDisjunctiveFaceting(json, state, '/api/senators/?search=', [
        'party',
        'state',
      ]).then((jsonResponse) => {
        return {
          results: jsonResponse.results.map((result) =>
            // results array needs to be in format Search UI can understand
            Object.keys(result).reduce((acc, key) => {
              return { ...acc, [key]: { raw: result[key] } };
            }, {})
          ),
          totalResults: jsonResponse.count,
          totalPages: Math.ceil(jsonResponse.count / state.resultsPerPage),
          facets: jsonResponse.aggregations && {
            state: [jsonResponse.aggregations.state],
            party: [jsonResponse.aggregations.party],
          },
        };
      })
    ),
};

export default function SenatorSearch() {
  return (
    <Container>
      <SearchProvider config={config}>
        <WithSearch
          mapContextToProps={({ results, wasSearched }) => ({
            results,
            wasSearched,
          })}
        >
          {({ results, wasSearched }) => (
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
                <Row>
                  <Col sm={3}>
                    <Sorting
                      label={'Sort by'}
                      sortOptions={resultsSortOptions}
                      view={({ value, options, onChange }) => (
                        <SearchSortOptions
                          mapping={parties}
                          value={value}
                          options={options}
                          onChange={onChange}
                        />
                      )}
                    />

                    <Facet
                      field="state"
                      label="State"
                      view={({ label, options, onRemove, onSelect }) => (
                        <div className="mt-3 mb-3">
                          <div className="text-muted">{label} Filter</div>
                          <CheckboxFilter
                            mapping={states}
                            options={options}
                            onRemove={onRemove}
                            onSelect={onSelect}
                          />
                        </div>
                      )}
                      filterType="any"
                    />
                    <Facet
                      field="party"
                      label="Party"
                      view={({ label, options, onRemove, onSelect }) => (
                        <div className="mb-3">
                          <div className="text-muted">{label} Filter</div>
                          <CheckboxFilter
                            attrName="party"
                            options={options}
                            onRemove={onRemove}
                            onSelect={onSelect}
                          />
                        </div>
                      )}
                      filterType="any"
                    />
                  </Col>
                  <Col>
                    {results &&
                      results.map((result) => (
                        <SenatorResult key={uuidv4()} result={result} />
                      ))}
                  </Col>
                </Row>
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
    </Container>
  );
}
