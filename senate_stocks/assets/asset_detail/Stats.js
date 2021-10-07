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
        <Col md={3}>
          <DashboardCard title="Total Trades" width="100%">
            <p className="dashboard-number text-center">{count}</p>
          </DashboardCard>
        </Col>
        <Col md={3}>
          <DashboardCard title="Buy Vs. Sell" width="100%">
            <DonutChart
              data={transactionTypeMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
        </Col>
        <Col md={3}>
          <DashboardCard title="Trades By Amount" width="100%">
            <DonutChart
              data={transactionAmountMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
        </Col>
        <Col md={3}>
          <DashboardCard title="Party Spread" width="100%">
            <DonutChart data={partyMap} dimensions={donutChartDimensions} />
          </DashboardCard>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <DashboardCard title="Recent Trades" width="100%">
            <Carousel variant="dark">
              {recentTrades.map((t, i) => (
                <Carousel.Item key={'recent-trade-' + i}>
                  <RecentTrade trade={t} />
                </Carousel.Item>
              ))}
            </Carousel>
          </DashboardCard>
          <DashboardCard title="Top Senators" width="100%">
            <Table borderless size="sm">
              <TableHeader headings={['#', 'Name', '# of Trades']} />
              <TableBody data={Array.from(topTraders.entries()).slice(0, 4)} />
            </Table>
          </DashboardCard>
        </Col>
        <Col md={9}>
          <Row>
            <DashboardCard title="Map" width="100%">
              <USMap
                data={stateMap}
                dimensions={{ height: 600, width: 750, margin: 10 }}
              />
            </DashboardCard>
          </Row>
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
