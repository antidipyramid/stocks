import React, { useState, useEffect, useMemo } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import SenatorCard from './SenatorCard';
import SenatorStats from './SenatorStats';
import TradeTable from '../common/TradeTable';
import SenatorTradeExplorer from './SenatorTradeExplorer';
import useApiData from '../common/hooks/useApiData';
import useMapData from '../common/hooks/useMapData';
import { SelectColumnFilter } from '../common/TradeTable';
import {
  amounts,
  owners,
  assetTypes,
  states,
  parties,
  transactionTypes,
} from '../common/Constants';

require('datejs');

function getTransactionDateMap(trades) {
  let map = new Map();
  for (const trade of trades) {
    if (map.has(trade.transaction_date)) {
      map.get(trade.transaction_date).push(trade);
    } else {
      map.set(trade.transaction_date, [trade]);
    }
  }

  return map;
}

function SenatorDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [assetInfo, setAssetInfo] = useState({});
  const apiData = useApiData(
    '/api/senators/' + window.location.pathname.split('/').pop()
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
    [transactionOwnerMap, setTransactionOwnerMap] = useMapData('owner', owners),
    [recentTrades, setRecentTrades] = useState([]),
    [topAssets, setTopAssets] = useMapData('asset_name', []),
    [allTrades, setAllTrades] = useState([]);

  const [transactionDateMap, setTransactionDateMap] = useState({});

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'Date',
            accessor: (row) => {
              let arr = row.transaction_date.split('-'),
                date_string = arr[1] + '/' + arr[2] + '/' + arr[0];

              return Date.parse(date_string);
            },
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
            filter: 'fuzzyText',
          },
          {
            Header: 'Ticker',
            accessor: 'ticker',
            disableSortBy: true,
            filter: 'fuzzyText',
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

  useEffect(() => {
    if (apiData) {
      setTransactionTypeMap(apiData.related_trades);
      setTransactionAmountMap(apiData.related_trades);
      setTransactionOwnerMap(apiData.related_trades);
      setRecentTrades(apiData.related_trades.slice(0, 4));
      setAllTrades(apiData.related_trades);
      setTopAssets(apiData.related_trades);

      setTransactionDateMap(getTransactionDateMap(apiData.related_trades));

      setIsLoading(false);
    }
  }, [apiData]);

  const checkIfLoading = (placeholder, data) =>
    isLoading ? placeholder : data;

  return (
    <Row className="justify-content-center mt-3 mx-5">
      <Col md="auto">
        {isLoading ? 'Loading' : <SenatorCard senator={apiData} />}
      </Col>
      <Col>
        <Tabs
          defaultActiveKey="stats"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="stats" title="Stats At-A-Glance">
            <SenatorStats
              count={isLoading ? 0 : Number(apiData.count)}
              transactionTypeMap={checkIfLoading(new Map(), transactionTypeMap)}
              transactionAmountMap={checkIfLoading(
                new Map(),
                transactionAmountMap
              )}
              transactionDateMap={checkIfLoading(new Map(), transactionDateMap)}
              transactionOwnerMap={checkIfLoading(
                new Map(),
                transactionOwnerMap
              )}
              topAssets={checkIfLoading(new Map(), topAssets)}
              recentTrades={checkIfLoading([], recentTrades)}
            />
          </Tab>
          <Tab eventKey="heatmap" title="Trade Heatmap">
            <SenatorTradeExplorer
              data={checkIfLoading(new Map(), transactionDateMap)}
            />
          </Tab>
          <Tab eventKey="all" title="All Trades">
            <TradeTable data={allTrades} columns={columns} />
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
}

export default SenatorDashboard;
