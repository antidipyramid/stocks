import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import D3Chart from '../common/D3Chart';

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
      .then((data) => setPriceData(data['Time Series (Daily)']));
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
