import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

export default function SearchForm({ value, onSubmit, onChange }) {
  const [input, setInput] = useState('');

  useEffect(() => {
    onChange(input);
  }, [input]);

  return (
    <>
      <Col>
        <Form.Control
          type="text"
          value={value}
          onChange={(e) => setInput(e.target.value)}
        />
      </Col>
      <Col sm={1}>
        <Button variant="primary" type="button" onClick={(e) => onSubmit(e)}>
          Search
        </Button>
      </Col>
    </>
  );
}
