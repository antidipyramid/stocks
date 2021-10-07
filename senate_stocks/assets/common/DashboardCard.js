import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import Card from 'react-bootstrap/Card';

export default function DashboardCard(props) {
  return (
    <Card style={{ width: props.width }} className="dashboard-card shadow-sm">
      <Card.Body>
        <div className="card-title d-flex align-items-center card-options">
          <div className="flex-grow-1">
            <b>{props.title}</b>
          </div>
          <div>{props.options}</div>
        </div>
        <div className="card-content">{props.children}</div>
      </Card.Body>
    </Card>
  );
}

DashboardCard.propTypes = {
  children: PropTypes.children,
  title: PropTypes.string,
  width: PropTypes.string,
  options: PropTypes.element,
};
