import React from 'react';

export default function SearchResultsInfo({ start, end, totalResults }) {
  return (
    <div>
      Showing <b>{start}</b>
      {' - '}
      <b>{end}</b> of <b>{totalResults}</b> results
    </div>
  );
}
