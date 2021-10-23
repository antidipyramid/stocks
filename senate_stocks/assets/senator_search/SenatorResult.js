import React from 'react';
import Card from 'react-bootstrap/Card';

export default function SenatorResult({ result }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <a href={'/senator/' + result.id.raw}>
            {result.first_name.raw + ' ' + result.last_name.raw}
          </a>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {'(' + result.party.raw + '-' + result.state.raw + ')'}
        </Card.Subtitle>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
