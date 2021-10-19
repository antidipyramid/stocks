import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Pagination from 'react-bootstrap/Pagination';

export default function SearchPagination({ current, totalPages, onChange }) {
  return (
    <Pagination>
      <Pagination.First onClick={() => onChange(1)} disabled={current === 1} />
      <Pagination.Prev
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      />
      {[...Array(totalPages + 1).keys()].slice(1).map((number) => (
        <Pagination.Item
          key={uuidv4()}
          active={number === current}
          onClick={() => onChange(number)}
        >
          {number}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
      />
      <Pagination.Last
        onClick={() => onChange(totalPages)}
        disabled={current === totalPages}
      />
    </Pagination>
  );
}
