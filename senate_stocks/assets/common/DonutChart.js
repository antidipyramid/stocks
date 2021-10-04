import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { mouseover, mousemove, mouseleave } from './Tooltip';

export default function DonutChart({ data, dimensions }) {
  const svgRef = useRef(null),
    figureRef = useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin;
  const svgHeight = height + margin;
  const angleRange = 0.5 * Math.PI;

  useEffect(() => {
    const radius = Math.min(width, height) / 2 - margin;

    // set the color scale
    const color = d3
      .scaleOrdinal()
      .range(['#1d1d1b', '#be1522', '#3aaa35', '#0e71b8', '#f39200']);

    // Compute the position of each group on the pie:
    const pie = d3
      .pie()
      .value((d) => d[1])
      .startAngle(angleRange * -1)
      .endAngle(angleRange);
    const data_ready = pie(data.entries());

    const figureElement = d3.select(figureRef.current);
    figureElement.selectAll('*').remove();

    const svgElement = figureElement
      .append('svg')
      .attr('height', svgHeight / 2)
      .attr('width', svgWidth);

    const tooltip = figureElement.append('div').attr('class', 'tooltip');

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
      .attr('name', (d) => d.data[0])
      .attr('fill', function (d, i) {
        return color(i);
      })
      // .attr('stroke', 'black')
      // .style('stroke-width', '2px')
      .style('opacity', 0.7)
      .on('mouseover', (e, d) => mouseover(e, d, tooltip))
      .on('mousemove', (e, d) =>
        mousemove(e, d, d.data[0] + ': ' + d.data[1], tooltip)
      )
      .on('mouseleave', (e, d) => mouseleave(e, d, tooltip));
  }, [data]);

  return (
    <figure ref={figureRef}>
      <svg ref={svgRef} width={svgWidth} height={svgHeight / 2} />
    </figure>
  );
}

DonutChart.propTypes = {
  data: PropTypes.map,
  dimensions: PropTypes.object,
};
