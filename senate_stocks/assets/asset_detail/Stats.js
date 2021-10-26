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
import USMap from './USMap';

function Stats({
  count,
  transactionTypeMap,
  transactionAmountMap,
  topTraders,
  recentTrades,
  partyMap,
  stateMap,
}) {
  const donutChartDimensions = { width: 200, height: 200, margin: 10 };

  return (
    <div>
      <Row>
        <Col md={3} className="d-flex align-items-stretch">
          <DashboardCard title="Total Trades" width="100%">
            <p className="dashboard-number text-center">{count}</p>
          </DashboardCard>
        </Col>
        <Col md={3} className="d-flex align-items-stretch">
          <DashboardCard title="Buy Vs. Sell" width="100%">
            <DonutChart
              containerID="transaction-type-graph"
              data={transactionTypeMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
        </Col>
        <Col md={3} className="d-flex align-items-stretch">
          <DashboardCard title="Trades By Amount" width="100%">
            <DonutChart
              containerID="amount-graph"
              data={transactionAmountMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
        </Col>
        <Col md={3} className="d-flex align-items-stretch">
          <DashboardCard title="Party Spread" width="100%">
            <DonutChart
              containerID="party-graph"
              data={partyMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
        </Col>
      </Row>
      <Row>
        <Col
          md={3}
          style={{ 'flex-wrap': 'wrap' }}
          className="d-flex align-items-stretch"
        >
          <DashboardCard title="Most Recent Trade" width="100%">
            {recentTrades.length > 0 && <RecentTrade trade={recentTrades[0]} />}
          </DashboardCard>
          <DashboardCard title="Top Senators" width="100%">
            <Table borderless size="sm">
              <TableHeader headings={['#', 'Name', '# of Trades']} />
              <TableBody data={Array.from(topTraders.entries()).slice(0, 4)} />
            </Table>
          </DashboardCard>
        </Col>
        <Col md={9} className="d-flex align-items-stretch">
          <DashboardCard title="Map" width="100%">
            <USMap
              containerID="state-map"
              data={stateMap}
              dimensions={{ height: 400, width: 800, margin: 0 }}
            />
          </DashboardCard>
        </Col>
      </Row>
    </div>
  );
}

Stats.propTypes = {
  count: PropTypes.number,
  transactionTypeMap: PropTypes.map,
  transactionAmountMap: PropTypes.map,
  recentTrades: PropTypes.array,
  topTraders: PropTypes.map,
  partyMap: PropTypes.map,
  stateMap: PropTypes.map,
};

export default Stats;
