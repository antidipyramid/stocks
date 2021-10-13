import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Stats from './Stats';
import Explorer from './Explorer';
import AllTrades from '../common/AllTrades';
import useTableData from '../common/hooks/useTableData';
import useApiData from '../common/hooks/useApiData';
import useMapData from '../common/hooks/useMapData';
import {
  amounts,
  owners,
  assetTypes,
  states,
  parties,
  transactionTypes,
  columns,
} from '../common/Constants';

function App() {
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

  const [tableData, setTableData] = useTableData(columns, []);

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

  useEffect(() => {
    console.log(
      apiData,
      transactionTypeMap,
      transactionAmountMap,
      recentTrades,
      partyMap,
      stateMap
    );

    if (apiData) {
      setTableData(apiData.asset_related_trades);
    }
  }, [apiData]);

  const checkIfLoading = (placeholder, data) =>
    isLoading ? placeholder : data;

  return (
    <Container>
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
        <Tab eventKey="explorer" title="Trade Explorer">
          <Explorer data={checkIfLoading([], allTrades)} />
        </Tab>
        <Tab eventKey="all" title="All Trades">
          <AllTrades
            tableInfo={checkIfLoading([], tableData)}
            title="All Trades"
          />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;
