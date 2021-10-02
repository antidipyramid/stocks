import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Carousel from 'react-bootstrap/Carousel';

import BuySellChart from './BuySellChart';

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

function RecentTrade() {
  return (
    <div>
      <p>Date:</p>
      <p>Senator:</p>
      <p>Owner:</p>
      <p>Asset Type:</p>
      <p>Transaction Type:</p>
      <p>Amount:</p>
    </div>
  );
}

function RecentTradesCard() {
  return (
    <Card style={{ width: '18rem' }} className="number-card">
      <Card.Body>
        <Card.Title>Recent Trades</Card.Title>
        <Carousel variant="dark">
          <Carousel.Item>
            <RecentTrade />
          </Carousel.Item>
          <Carousel.Item>
            <RecentTrade />
          </Carousel.Item>
          <Carousel.Item>
            <RecentTrade />
          </Carousel.Item>
        </Carousel>
      </Card.Body>
    </Card>
  );
}

function TableCard({ title }) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          <Table borderless size="sm">
            <thead>
              <th>#</th>
              <th>Name</th>
              <th># of Trades</th>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((num) => (
                <tr key={num}>
                  <td className="text-center">{num + '.'}</td>
                  <td>Bernie Sanders</td>
                  <td className="text-center">12</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

function BuySellCard({ data }) {
  return (
    <Card style={{ width: '18rem' }} className="number-card">
      <Card.Body>
        <Card.Title>Buy Vs. Sell</Card.Title>
        <Card.Text>
          <BuySellChart
            data={data}
            dimensions={{
              width: 300,
              height: 200,
              margin: { top: 10, left: 10, right: 10, bottom: 10 },
            }}
          />
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

BuySellCard.propTypes = {
  data: PropTypes.map,
};

TableCard.propTypes = {
  title: PropTypes.string,
};

function Stats({ count, transactionTypeMap }) {
  return (
    <Row>
      <Col xxl="auto">
        <NumberCard title="Total Trades" count={count} />
        <RecentTradesCard />
        <TableCard title="Top Senators" />
      </Col>
      <Col>
        <Row className="justify-content-evenly">
          <BuySellCard data={transactionTypeMap} />
          <NumberCard title="Trades By Amount" count={count} />
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
};

export default Stats;
