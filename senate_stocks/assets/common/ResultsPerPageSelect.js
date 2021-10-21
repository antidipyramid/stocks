import React from 'react';
import Form from 'react-bootstrap/Form';
import { v4 as uuidv4 } from 'uuid';

export default function ResultsPerPageSelect({ value, options, onChange }) {
  return (
    <Form.Select
      size="sm"
      value={value}
      aria-label="Results per page"
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((number) => (
        <option key={uuidv4()} value={number}>
          {number}
        </option>
      ))}
    </Form.Select>
  );
}
