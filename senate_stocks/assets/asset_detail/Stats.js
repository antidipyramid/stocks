import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Carousel from 'react-bootstrap/Carousel';

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

TableCard.propTypes = {
  title: PropTypes.string,
};

function Stats({ count }) {
  return (
    <Row>
      <Col xxl="auto">
        <NumberCard title="Total Trades" count={count} />
        <RecentTradesCard />
        <TableCard title="Top Senators" />
      </Col>
      <Col>
        <Row className="justify-content-evenly">
          <NumberCard title="Buy vs. Sell" count={count} />
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
};

export default Stats;
