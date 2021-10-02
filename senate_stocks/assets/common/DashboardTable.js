import React from 'react';
import PropTypes from 'prop-types';

export function TableHeader({ headings }) {
  return (
    <thead>
      {headings.map((h, i) => (
        <th key={i}>{h}</th>
      ))}
    </thead>
  );
}

TableHeader.propTypes = {
  headings: PropTypes.array,
};

export function TableBody({ data }) {
  return (
    <tbody>
      {data.map((d, i) => (
        <tr key={i}>
          <td>{i + 1 + '.'}</td>
          <td>{d[0]}</td>
          <td className="text-center">{d[1]}</td>
        </tr>
      ))}
    </tbody>
  );
}

TableBody.propTypes = {
  data: PropTypes.array,
};
