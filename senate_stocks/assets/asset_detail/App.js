import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Stats from './Stats';

const amounts = [
    '$1,001 - $15,000',
    '$15,001 - $50,000',
    '$50,001 - $100,000',
    '$100,001 - $250,000',
    '$250,001 - $500,000',
    '$500,001 - $1,000,000',
    '$1,000,001 - $5,000,000',
    '$5,000,001 - $25,000,000',
    '$25,000,001 - $50,000,000',
    'Over $50,000,000',
  ],
  states = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ],
  parties = ['R', 'D', 'I'],
  transactionTypes = ['Purchase', 'Sale', 'Exchange'];

function initTransactionTypeMap() {
  let transactionTypeMap = new Map();
  for (const type of transactionTypes) {
    transactionTypeMap.set(type, 0);
  }

  return transactionTypeMap;
}

function initTransactionAmountMap() {
  let transactionAmountMap = new Map();
  for (const amount of amounts) {
    transactionAmountMap.set(amount, 0);
  }

  return transactionAmountMap;
}

function initStateMap() {
  let stateMap = new Map();
  for (const state of states) {
    stateMap.set(state, 0);
  }

  return stateMap;
}

function initPartyMap() {
  let partyMap = new Map();
  for (const party of parties) {
    partyMap.set(party, 0);
  }

  return partyMap;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [assetInfo, setAssetInfo] = useState({});

  const [numberOfTrades, setNumberOfTrades] = useState(0),
    [transactionTypeMap, setTransactionTypeMap] = useState({}),
    [transactionAmountMap, setTransactionAmountMap] = useState({}),
    [partyMap, setPartyMap] = useState({}),
    [stateMap, setStateMap] = useState({}),
    [recentTrades, setRecentTrades] = useState([]),
    [topTraders, setTopTraders] = useState({});

  useEffect(() => {
    // fetch asset info from django db
    let url = '/api/assets/' + window.location.pathname.split('/').pop();
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setAssetInfo(data);

        // React needs a new object to update Map state
        const tempTransactionAmountMap = initTransactionAmountMap(),
          tempTransactionTypeMap = initTransactionTypeMap(),
          tempPartyMap = initPartyMap(),
          tempTopTraders = new Map(),
          tempStateMap = initStateMap();

        for (const trade of data.asset_related_trades) {
          // process for senators graph
          if (tempTopTraders.has(trade.senator)) {
            tempTopTraders.set(
              trade.senator,
              tempTopTraders.get(trade.senator) + 1
            );
          } else {
            tempTopTraders.set(trade.senator, 1);
          }

          // process for trade amount graph
          tempTransactionAmountMap.set(
            trade.amount,
            tempTransactionAmountMap.get(trade.amount) + 1
          );

          // process for transaction type map
          if (
            trade.transaction_type == 'Purchase' ||
            trade.transaction_type == 'Exchange'
          ) {
            tempTransactionTypeMap.set(
              trade.transaction_type,
              tempTransactionTypeMap.get(trade.transaction_type) + 1
            );
          } else {
            tempTransactionTypeMap.set(
              'Sale',
              tempTransactionTypeMap.get('Sale') + 1
            );
          }
        }

        // sort trades to get most recent
        data.asset_related_trades.sort((a, b) => {
          if (a.transaction_date > b.transaction_date) {
            return -1;
          } else if (a.transaction_date == b.transaction_date) {
            return 0;
          } else {
            return 1;
          }
        });

        setTransactionTypeMap(tempTransactionTypeMap);
        setTransactionAmountMap(tempTransactionAmountMap);
        setTopTraders(tempTopTraders);
        setRecentTrades(data.asset_related_trades.slice(0, 3));

        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log(transactionTypeMap, transactionAmountMap, recentTrades);
  }, [isLoading]);

  const checkIfLoading = (placeholder, data) =>
    isLoading ? placeholder : data;

  return (
    <Container>
      <h1>{isLoading ? 'Loading' : assetInfo.name}</h1>
      <Tabs
        defaultActiveKey="stats"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="stats" title="Stats At-A-Glance">
          <Stats
            count={isLoading ? 0 : Number(assetInfo.count)}
            transactionTypeMap={checkIfLoading(new Map(), transactionTypeMap)}
          />
        </Tab>
        <Tab eventKey="explorer" title="Trade Explorer">
          <p>Hi</p>
        </Tab>
        <Tab eventKey="all" title="All Trades" disabled></Tab>
      </Tabs>
    </Container>
  );
}

export default App;
