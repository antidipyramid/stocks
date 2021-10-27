import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import D3Heatmap from './D3Heatmap';

export default function Heatmap({
  containerID,
  data,
  selectFunction,
  dimensions,
}) {
  const svgRef = useRef(null),
    figureRef = useRef(null),
    graphRef = useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin;
  const svgHeight = height + margin;

  useEffect(() => {
    if (data) {
      graphRef.current = new D3Heatmap(
        figureRef.current,
        data,
        selectFunction,
        dimensions
      );
    }
  }, [data]);

  // useEffect(() => {
  //   if (graphRef.current) {
  //     graphRef.current.update({ year: year });
  //   }
  // }, [year]);

  return (
    <figure id={containerID} ref={figureRef}>
      <svg ref={svgRef} width={svgWidth} height={svgHeight} />
    </figure>
  );
}

Heatmap.propTypes = {
  containerID: PropTypes.string,
  data: PropTypes.map,
  selectFunction: PropTypes.function,
  dimensions: PropTypes.object,
};
