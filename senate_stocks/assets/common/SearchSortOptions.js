import React from 'react';
import Form from 'react-bootstrap/Form';
import { v4 as uuidv4 } from 'uuid';

export default function SearchSortOptions({ value, options, onChange }) {
  return (
    <Form.Select
      size="sm"
      value={value}
      aria-label="Sort options"
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map(({ value, label }) => (
        <option key={uuidv4()} value={value}>
          {label}
        </option>
      ))}
    </Form.Select>
  );
}
