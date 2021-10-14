import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import DashboardCard from '../common/DashboardCard';
import Heatmap from './Heatmap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AllTrades from '../common/AllTrades';
import useTableData from '../common/hooks/useTableData';
import TradeTable from '../common/TradeTable';
import {
  amounts,
  owners,
  assetTypes,
  states,
  parties,
  transactionTypes,
  columns,
} from '../common/Constants';

export default function SenatorTradeExplorer({ data }) {
  const [selectedDate, setSelectedDate] = useState([]);
  const [tableData, setTableData] = useTableData(columns, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'Date',
            accessor: 'transaction_date',
          },
          {
            Header: 'Senator',
            accessor: 'senator',
          },
          {
            Header: 'Owner',
            accessor: 'owner',
          },
          {
            Header: 'Asset Type',
            accessor: 'asset_type',
          },
          {
            Header: 'Transaction Type',
            accessor: 'transaction_type',
          },
          {
            Header: 'Amount',
            accessor: 'amount',
          },
          {
            Header: 'Comments',
            accessor: 'comments',
          },
          {
            Header: 'Link To Original',
            accessor: 'url',
            Cell: (value) => <a href={value}>Link</a>,
          },
        ],
      },
    ],
    []
  );

  return (
    <Row>
      <Row>
        <DashboardCard title="Heatmap" width="100%">
          <Heatmap
            data={data}
            selectFunction={setSelectedDate}
            dimensions={{ width: 600, height: 300, margin: 10 }}
          />
        </DashboardCard>
      </Row>
      <Row>
        <DashboardCard title="Selected Trades" width="100%">
          <TradeTable columns={columns} data={selectedDate} />
        </DashboardCard>
      </Row>
    </Row>
  );
}

SenatorTradeExplorer.propTypes = {
  data: PropTypes.map,
};
