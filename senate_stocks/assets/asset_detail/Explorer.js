import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { D3Chart } from '../common/D3Chart';
import DashboardCard from '../common/DashboardCard';
import PriceGraph from './PriceGraph';
import GraphOptions from '../common/GraphOptions';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Explorer({ data }) {
  const [selectedTrade, setSelectedTrade] = useState({}),
    [selectedYear, setSelectedYear] = useState(2021),
    [selectedTransactionType, setSelectedTransactionType] = useState(null),
    [selectedTransactionAmount, setSelectedTransactionAmount] = useState(null);

  useEffect(() => {
    console.log(
      selectedYear,
      selectedTransactionType,
      selectedTransactionAmount,
      selectedTrade
    );
  }, [
    selectedTrade,
    selectedTransactionAmount,
    selectedYear,
    selectedTransactionType,
  ]);

  const graphOptions = [
    {
      title: 'Year',
      dropdown: [2021, 2020, 2019],
      update: setSelectedYear,
    },
    {
      title: 'Transaction Type',
      dropdown: ['Purchase', 'Sale (Partial)', 'Sale', 'Exchange'],
      update: setSelectedTransactionType,
    },
    {
      title: 'Amount',
      dropdown: [
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
      update: setSelectedTransactionAmount,
    },
  ];

  return (
    <Row>
      <Col md={9}>
        <DashboardCard
          title="Trade Explorer"
          width="100%"
          options={<GraphOptions options={graphOptions} />}
        >
          <PriceGraph
            data={data}
            dimensions={{ height: 300, width: 700, margin: 100 }}
            selectFunction={setSelectedTrade}
            year={selectedYear}
          />
        </DashboardCard>
      </Col>
      <Col md={3}>
        <DashboardCard title="Selected Trades" width="100%">
          <div>
            {Object.entries(selectedTrade).map((val, i) => (
              <p key={'selected-trade-' + i}>
                {val[0]} : {val[1]}
              </p>
            ))}
          </div>
        </DashboardCard>
      </Col>
    </Row>
  );
}

Explorer.propTypes = {
  data: PropTypes.map,
  dimensions: PropTypes.object,
};