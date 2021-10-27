import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Carousel from 'react-bootstrap/Carousel';

import DonutChart from '../common/DonutChart';
import DashboardCard from '../common/DashboardCard';
import { TableHeader, TableBody } from '../common/DashboardTable';
import RecentTrade from '../common/RecentTrade';

function SenatorStats({
  count,
  transactionTypeMap,
  transactionAmountMap,
  transactionOwnerMap,
  topAssets,
  transactionDateMap,
  recentTrades,
}) {
  const donutChartDimensions = { width: 200, height: 200, margin: 10 };

  return (
    <div>
      <Row>
        <Col xs={12} sm={6} xxl={3} className="d-flex align-items-stretch">
          <DashboardCard title="Total Trades" width="100%">
            <p className="dashboard-number text-center">{count}</p>
          </DashboardCard>
        </Col>
        <Col xs={12} sm={6} xxl={3} className="d-flex align-items-stretch">
          <DashboardCard title="Buy Vs. Sell" width="100%">
            <DonutChart
              containerID="transaction-type-graph"
              data={transactionTypeMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
        </Col>
        <Col xs={12} sm={6} xxl={3} className="d-flex align-items-stretch">
          <DashboardCard title="Trades By Amount" width="100%">
            <DonutChart
              containerID="amount-graph"
              data={transactionAmountMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
        </Col>
        <Col xs={12} sm={6} xxl={3} className="d-flex align-items-stretch">
          <DashboardCard title="Ownership" width="100%">
            <DonutChart
              containerID="owner-graph"
              data={transactionOwnerMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} xxl={3} className="d-flex align-items-stretch">
          <DashboardCard title="Most Recent Trade" width="100%">
            {recentTrades.length > 0 && <RecentTrade trade={recentTrades[0]} />}
          </DashboardCard>
        </Col>
        <Col xs={12} sm={6} xxl={3} className="d-flex align-items-stretch">
          <DashboardCard title="Most Traded Assets" width="100%">
            <Table borderless size="sm">
              <TableHeader headings={['#', 'Asset', '# of Trades']} />
              <TableBody data={Array.from(topAssets.entries()).slice(0, 5)} />
            </Table>
          </DashboardCard>
        </Col>
      </Row>
    </div>
  );
}

SenatorStats.propTypes = {
  count: PropTypes.number,
  transactionTypeMap: PropTypes.map,
  transactionAmountMap: PropTypes.map,
  transactionOwnerMap: PropTypes.map,
  transactionDateMap: PropTypes.map,
  recentTrades: PropTypes.array,
  topAssets: PropTypes.map,
  partyMap: PropTypes.map,
  stateMap: PropTypes.map,
};

export default SenatorStats;
