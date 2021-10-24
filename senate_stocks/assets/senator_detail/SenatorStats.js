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
        <Col md={3} className="d-flex align-items-stretch">
          <DashboardCard title="Total Trades" width="100%">
            <p className="dashboard-number text-center">{count}</p>
          </DashboardCard>
        </Col>
        <Col md={3} className="d-flex align-items-stretch">
          <DashboardCard title="Buy Vs. Sell" width="100%">
            <DonutChart
              data={transactionTypeMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
        </Col>
        <Col md={3} className="d-flex align-items-stretch">
          <DashboardCard title="Trades By Amount" width="100%">
            <DonutChart
              data={transactionAmountMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
        </Col>
        <Col md={3} className="d-flex align-items-stretch">
          <DashboardCard title="Ownership" width="100%">
            <DonutChart
              data={transactionOwnerMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
        </Col>
      </Row>
      <Row>
        <Col md={3} className="d-flex align-items-stretch">
          <DashboardCard title="Recent Trades" width="100%">
            <Carousel variant="dark">
              {recentTrades.map((t, i) => (
                <Carousel.Item key={'recent-trade-' + i}>
                  <RecentTrade trade={t} />
                </Carousel.Item>
              ))}
            </Carousel>
          </DashboardCard>
        </Col>
        <Col md={3} className="d-flex align-items-stretch">
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
