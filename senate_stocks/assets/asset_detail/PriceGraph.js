import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import D3Chart from '../common/D3Chart';
require('datejs');

export default function PriceGraph({ data, dimensions, selectFunction, year }) {
  const [priceData, setPriceData] = useState(null);
  const svgRef = useRef(null),
    figureRef = useRef(null),
    graphRef = useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin;
  const svgHeight = height + margin;

  useEffect(() => {
    fetch(
      'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=AAPL&outputsize=full&apikey=VGQHIZC6NX77S7W9'
    )
      .then((response) => response.json())
      .then((data) => {
        // we only want 2020/2021 data for now
        const prices = {},
          beginDate = new Date(2020, 1, 1);

        for (let date in data['Time Series (Daily)']) {
          let dateObj = new Date(...date.split('-'));
          if (dateObj.compareTo(beginDate) >= 0) {
            prices[date] =
              data['Time Series (Daily)'][date]['5. adjusted close'];
          }
        }
        setPriceData(prices);
      });
  }, []);

  useEffect(() => {
    if (priceData && data) {
      graphRef.current = new D3Chart(
        figureRef.current,
        priceData,
        data,

        dimensions,
        selectFunction
      );
    }
  }, [priceData, data]);

  // useEffect(() => {
  //   if (graphRef.current) {
  //     graphRef.current.update({ year: year });
  //   }
  // }, [year]);

  return (
    <figure ref={figureRef}>
      <svg ref={svgRef} width={svgWidth} height={svgHeight} />
    </figure>
  );
}
