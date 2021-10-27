import React, { useState, useEffect, useMemo } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Stats from './Stats';
import Explorer from './Explorer';
import AllTrades from '../common/AllTrades';
import useTableData from '../common/hooks/useTableData';
import useApiData from '../common/hooks/useApiData';
import useMapData from '../common/hooks/useMapData';
import TradeTable from '../common/TradeTable';
import { SelectColumnFilter } from '../common/TradeTable';
import {
  amounts,
  owners,
  assetTypes,
  states,
  parties,
  transactionTypes,
} from '../common/Constants';

import { dateRowAccessor } from '../common/utilities';

require('datejs');

function App() {
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'Date',
            accessor: (row) => dateRowAccessor(row),
            disableFilters: true,
            Cell: ({ value }) => value.toString('M/d/yy'),
          },
          {
            Header: 'Senator',
            accessor: 'senator',
            disableSortBy: true,
            disableFilters: true,
          },
          {
            Header: 'Asset',
            accessor: 'asset_name',
            disableSortBy: true,
            disableFilters: true,
          },
          {
            Header: 'Ticker',
            accessor: 'ticker',
            disableSortBy: true,
            disableFilters: true,
          },
          {
            Header: 'Owner',
            accessor: 'owner',
            Filter: SelectColumnFilter,
            filter: 'includes',
          },
          {
            Header: 'Asset Type',
            accessor: 'asset_type',
            Filter: SelectColumnFilter,
            filter: 'includes',
          },
          {
            Header: 'Transaction Type',
            accessor: 'transaction_type',
            Filter: SelectColumnFilter,
            filter: 'includes',
          },
          {
            Header: 'Amount',
            accessor: 'amount',
            Filter: SelectColumnFilter,
            filter: 'includes',
          },
          {
            Header: 'Comments',
            accessor: 'comments',
            disableSortBy: true,
            disableFilters: true,
          },
          {
            Header: 'Link To Original',
            accessor: 'url',
            disableSortBy: true,
            Cell: (value) => <a href={value}>Link</a>,
            disableFilters: true,
          },
        ],
      },
    ],
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [assetInfo, setAssetInfo] = useState({});
  const apiData = useApiData(
    '/api/assets/' + window.location.pathname.split('/').pop()
  );

  const [numberOfTrades, setNumberOfTrades] = useState(0),
    [transactionTypeMap, setTransactionTypeMap] = useMapData(
      'transaction_type',
      transactionTypes
    ),
    [transactionAmountMap, setTransactionAmountMap] = useMapData(
      'amount',
      amounts
    ),
    [partyMap, setPartyMap] = useMapData('senator_party', parties),
    [stateMap, setStateMap] = useMapData(
      'senator_state',
      Object.values(states)
    ),
    [recentTrades, setRecentTrades] = useState([]),
    [topTraders, setTopTraders] = useMapData('senator', []),
    [allTrades, setAllTrades] = useState([]);

  useEffect(() => {
    if (apiData) {
      setTransactionTypeMap(apiData.asset_related_trades);
      setTransactionAmountMap(apiData.asset_related_trades);
      setPartyMap(apiData.asset_related_trades);
      setStateMap(apiData.asset_related_trades);
      setRecentTrades(apiData.asset_related_trades.slice(0, 4));
      setAllTrades(apiData.asset_related_trades);
      setTopTraders(apiData.asset_related_trades);

      setIsLoading(false);
    }
  }, [apiData]);

  const checkIfLoading = (placeholder, data) =>
    isLoading ? placeholder : data;

  return (
    <Container
      fluid
      style={{ 'padding-left': '10vw', 'padding-right': '10vw' }}
    >
      <h1>
        {isLoading ? 'Loading' : apiData.name + ' (' + apiData.ticker + ')'}
      </h1>
      <Tabs
        defaultActiveKey="stats"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="stats" title="Stats At-A-Glance">
          <Stats
            count={isLoading ? 0 : Number(apiData.count)}
            transactionTypeMap={checkIfLoading(new Map(), transactionTypeMap)}
            transactionAmountMap={checkIfLoading(
              new Map(),
              transactionAmountMap
            )}
            topTraders={checkIfLoading(new Map(), topTraders)}
            recentTrades={checkIfLoading([], recentTrades)}
            partyMap={checkIfLoading(new Map(), partyMap)}
            stateMap={checkIfLoading(new Map(), stateMap)}
          />
        </Tab>
        <Tab
          eventKey="explorer"
          title="Trade Explorer"
          disabled={apiData && apiData.ticker === '--'}
        >
          {apiData && apiData.ticker !== '--' && (
            <Explorer data={checkIfLoading([], allTrades)} />
          )}
        </Tab>
        <Tab eventKey="all" title="All Trades">
          <TradeTable data={allTrades} columns={columns} />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;
