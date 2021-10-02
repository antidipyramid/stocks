import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import Card from 'react-bootstrap/Card';

export default function DashboardCard(props) {
  return (
    <Card style={{ width: props.width }} className="number-card">
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        {props.children}
      </Card.Body>
    </Card>
  );
}

DashboardCard.propTypes = {
  children: PropTypes.children,
  title: PropTypes.string,
  width: PropTypes.string,
};
