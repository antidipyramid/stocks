import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Stats from './Stats';
import Explorer from './Explorer';
import AllTrades from '../common/AllTrades';
import useTableData from '../common/hooks/useTableData';

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
  owners = ['Self', 'Spouse', 'Child', 'Joint'],
  assetTypes = [
    'Stock',
    'Corporate Bond',
    'Municipal Security',
    'Non-Public Stock',
    'Other Securities',
  ],
  states = {
    AL: 'Alabama',
    AK: 'Alaska',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    DC: 'District Of Columbia',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming',
  },
  parties = ['R', 'D', 'I'],
  transactionTypes = ['Purchase', 'Sale (Partial)', 'Sale (Full)', 'Exchange'],
  columns = [
    { title: 'Date', field: 'transaction_date', type: 'date' },
    { title: 'Senator', field: 'senator', filtering: false },
    {
      title: 'Owner',
      field: 'owner',
      lookup: Object.fromEntries(owners.map((o) => [o, o])),
    },
    {
      title: 'Asset Type',
      field: 'asset_type',
      lookup: Object.fromEntries(assetTypes.map((t) => [t, t])),
    },
    {
      title: 'Transaction Type',
      field: 'transaction_type',
      lookup: Object.fromEntries(transactionTypes.map((t) => [t, t])),
    },
    {
      title: 'Amount',
      field: 'amount',
      lookup: Object.fromEntries(amounts.map((a) => [a, a])),
    },
    { title: 'Comments', field: 'comments', filtering: false, sorting: false },
    {
      title: 'Link To Original',
      field: 'url',
      render: (rowData) => <a href={rowData.url}>Link</a>,
      filtering: false,
      sorting: false,
    },
  ];

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
  for (const state of Object.values(states)) {
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
    [topTraders, setTopTraders] = useState({}),
    [allTrades, setAllTrades] = useState([]);

  const [tableData, setTableData] = useTableData(columns, []);

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
          tempTransactionTypeMap.set(
            trade.transaction_type,
            tempTransactionTypeMap.get(trade.transaction_type) + 1
          );

          //process for party map
          tempPartyMap.set(
            trade.senator_party,
            tempPartyMap.get(trade.senator_party) + 1
          );

          // process for state map
          tempStateMap.set(
            states[trade.senator_state],
            tempStateMap.get(states[trade.senator_state]) + 1
          );
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
        setPartyMap(tempPartyMap);
        setStateMap(tempStateMap);
        setAllTrades(data.asset_related_trades);

        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log(
      assetInfo,
      transactionTypeMap,
      transactionAmountMap,
      recentTrades,
      partyMap,
      stateMap
    );

    setTableData(assetInfo.asset_related_trades);
  }, [isLoading]);

  useEffect(() => {
    console.log(tableData);
  }, [tableData]);

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
