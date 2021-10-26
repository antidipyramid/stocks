import React from 'react';
import Card from 'react-bootstrap/Card';

export default function SenatorCard({ senator }) {
  return (
    <Card style={{ width: '15vw' }}>
      <Card.Img variant="top" src={senator.photo_url} />
      <Card.Body>
        <Card.Title>
          {senator.first_name + ' ' + senator.last_name}
          <span className="text-muted">
            {' (' + senator.party + '-' + senator.state + ')'}
          </span>
        </Card.Title>
        <Card.Text />
      </Card.Body>
    </Card>
  );
}
