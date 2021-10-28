import React from 'react';
import Card from 'react-bootstrap/Card';

require('datejs');

export function FeaturedSenator({ senator, img }) {
  if (!senator) {
    return 'Loading';
  } else {
    return (
      <Card className="mb-3 mx-3" style={{ width: '20rem' }}>
        <Card.Img variant="top" src={img} height="300" />
        <Card.Body>
          <Card.Title>
            <a href={'/senator/' + senator.id}>
              {senator.first_name + ' ' + senator.last_name}
            </a>
            <span className="text-muted">
              {' (' + senator.party + '-' + senator.state + ')'}
            </span>
          </Card.Title>
          <Card.Text>
            <ul className="result-info">
              <li>
                <span className="result-key text-muted">
                  Latest trade date:
                </span>{' '}
                {Date.parse(senator.latest.transaction_date).toString(
                  'MMMM d, yyyy'
                )}
              </li>
              <li>
                <span className="result-key text-muted">
                  Most recently traded asset:
                </span>{' '}
                {senator.latest.asset_name}
              </li>
              <li>
                <span className="result-key text-muted">Number of trades:</span>{' '}
                {senator.count}
              </li>
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export function FeaturedAsset({ asset, img }) {
  if (!asset) {
    return 'Loading';
  } else {
    return (
      <Card className="mb-3 mx-3" style={{ width: '20rem' }}>
        <Card.Img variant="top" src={img} height="300" />
        <Card.Body>
          <Card.Title>
            <a href={'/asset/' + asset.id}>{asset.name}</a>
            <span className="text-muted">
              {asset.ticker !== '--' ? ' (' + asset.ticker + ')' : ''}
            </span>
          </Card.Title>
          <Card.Text>
            <ul className="result-info">
              <li>
                <span className="result-key text-muted">Last traded on: </span>{' '}
                {Date.parse(asset.latest).toString('MMMM d, yyyy')}
              </li>
              <li>
                <span className="result-key text-muted">Last traded by:</span>{' '}
                {asset.last_senator}
              </li>
              <li>
                <span className="result-key text-muted">Number of trades:</span>{' '}
                {asset.count}
              </li>
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}
