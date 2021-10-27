import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import senateVideo from './videos/senate.mp4';

export default function Hero() {
  return (
    <div className="hero">
      <video id="video-bg" autoPlay muted loop>
        <source src={senateVideo} type="video/mp4" />
      </video>
      <h1 className="mt-5 text-center bold" id="homepage-heading">
        Hold senators accountable. <br />
        Monitor their stock trades.
      </h1>
      <Row className="mt-5 justify-content-center">
        <Col xs={2}>
          <Button variant="primary" as="a" href="/senators">
            Explore Senators
          </Button>
        </Col>
        <Col xs={2}>
          <Button variant="primary" as="a" href="/assets">
            Explore Assets
          </Button>
        </Col>
      </Row>
    </div>
  );
}
