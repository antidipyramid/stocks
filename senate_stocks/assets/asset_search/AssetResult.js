import React from 'react';
import Card from 'react-bootstrap/Card';

require('datejs');

export default function AssetResult({ result }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <a href={'/asset/' + result.id.raw}>{result.name.raw}</a>
          <span className="text-muted">
            {result.ticker.raw !== '--' ? ' (' + result.ticker.raw + ')' : ''}
          </span>
        </Card.Title>
        <Card.Text>
          <ul className="result-info">
            <li>
              <span className="result-key text-muted">Last traded on: </span>{' '}
              {Date.parse(result.latest.raw).toString('MMMM d, yyyy')}
            </li>
            <li>
              <span className="result-key text-muted">Last traded by:</span>{' '}
              {result.last_senator.raw}
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
