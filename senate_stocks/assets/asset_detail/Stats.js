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

function NumberCard({ title, count }) {
  return (
    <Card style={{ width: '18rem' }} className="number-card">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className="text-center">{count}</Card.Text>
      </Card.Body>
    </Card>
  );
}

NumberCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
};

function Stats({
  count,
  transactionTypeMap,
  transactionAmountMap,
  topTraders,
  recentTrades,
}) {
  const donutChartDimensions = { width: 200, height: 200, margin: 10 };

  return (
    <Row>
      <Col xxl="auto">
        <NumberCard title="Total Trades" count={count} />
        <DashboardCard title="Recent Trades" width="18rem">
          <Carousel variant="dark">
            {recentTrades.map((t, i) => (
              <Carousel.Item key={'recent-trade-' + i}>
                <RecentTrade trade={t} />
              </Carousel.Item>
            ))}
          </Carousel>
        </DashboardCard>
        <DashboardCard title="Top Senators" width="18rem">
          <Table borderless size="sm">
            <TableHeader headings={['#', 'Name', '# of Trades']} />
            <TableBody data={Array.from(topTraders.entries()).slice(0, 4)} />
          </Table>
        </DashboardCard>
      </Col>
      <Col>
        <Row className="justify-content-evenly">
          <DashboardCard title="Buy Vs. Sell" width="18rem">
            <DonutChart
              data={transactionTypeMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
          <DashboardCard title="Trades By Amount" width="18rem">
            <DonutChart
              data={transactionAmountMap}
              dimensions={donutChartDimensions}
            />
          </DashboardCard>
          <NumberCard title="Party" count={count} />
        </Row>
        <Row>
          <NumberCard title="Map" count={count} />
        </Row>
      </Col>
    </Row>
  );
}

Stats.propTypes = {
  count: PropTypes.number,
  transactionTypeMap: PropTypes.map,
  transactionAmountMap: PropTypes.map,
  recentTrades: PropTypes.array,
  topTraders: PropTypes.map,
};

export default Stats;
