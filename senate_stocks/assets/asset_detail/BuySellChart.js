import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

function BuySellChart({ data, dimensions }) {
  const svgRef = useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const angleRange = 0.5 * Math.PI;

  useEffect(() => {
    const radius = Math.min(width, height) / 2 - 40;

    // set the color scale
    const color = d3.scaleOrdinal([
      '#98abc5',
      '#8a89a6',
      '#7b6888',
      '#6b486b',
      '#a05d56',
    ]);

    // Compute the position of each group on the pie:
    const pie = d3
      .pie()
      .value((d) => d[1])
      .startAngle(angleRange * -1)
      .endAngle(angleRange);
    const data_ready = pie(data.entries());
    console.log(data_ready);

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll('*').remove();

    const svg = svgElement
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')');

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('whatever')
      .data(data_ready)
      .enter()
      .append('path')
      .attr(
        'd',
        d3
          .arc()
          .innerRadius(radius * 0.5)
          .outerRadius(radius)
      )
      .attr('fill', function (d) {
        return color(d.data.key);
      })
      .attr('stroke', 'black')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);
  }, [data]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
}

BuySellChart.propTypes = {
  data: PropTypes.map,
  dimensions: PropTypes.object,
};

export default BuySellChart;
