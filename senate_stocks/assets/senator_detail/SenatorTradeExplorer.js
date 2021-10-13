import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DashboardCard from '../common/DashboardCard';
import Heatmap from './Heatmap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AllTrades from '../common/AllTrades';
import useTableData from '../common/hooks/useTableData';
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [tableData, setTableData] = useTableData(columns, []);

  useEffect(() => {
    console.log('changed date');
    if (selectedDate) {
      setTableData(selectedDate);
    }
  }, [selectedDate]);

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
          <AllTrades
            tableInfo={tableData ? tableData : []}
            title="Selected Trade"
          />
        </DashboardCard>
      </Row>
    </Row>
  );
}

SenatorTradeExplorer.propTypes = {
  data: PropTypes.map,
};
