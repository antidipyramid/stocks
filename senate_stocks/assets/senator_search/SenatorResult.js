import React from 'react';
import Card from 'react-bootstrap/Card';

require('datejs');

export default function SenatorResult({ result }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <a href={'/senator/' + result.id.raw}>
            {result.first_name.raw + ' ' + result.last_name.raw}
          </a>
          <span className="text-muted">
            {' (' + result.party.raw + '-' + result.state.raw + ')'}
          </span>
        </Card.Title>
        <Card.Text>
          <ul className="result-info">
            <li>
              <span className="result-key text-muted">Latest trade date:</span>{' '}
              {Date.parse(result.latest.raw.transaction_date).toString(
                'MMMM d, yyyy'
              )}
            </li>
            <li>
              <span className="result-key text-muted">
                Most recently traded asset:
              </span>{' '}
              {result.latest.raw.asset_name}
            </li>
            <li>
              <span className="result-key text-muted">Number of trades:</span>{' '}
              {result.count.raw}
            </li>
          </ul>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
