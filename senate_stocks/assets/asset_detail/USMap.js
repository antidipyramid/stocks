import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { mouseover, mousemove, mouseleave } from '../common/Tooltip';

export default function USMap({ data, dimensions }) {
  const svgRef = useRef(null),
    figureRef = useRef(null),
    { width, height, margin } = dimensions,
    svgWidth = width + margin,
    svgHeight = height + margin;

  // we need the max and min of the data to
  // make a color gradient for map
  const dataValues = Array.from(data.values()).sort((a, b) => {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else return 0;
  });

  const [minValue, maxValue] = [
    dataValues[0],
    dataValues[dataValues.length - 1],
  ];

  useEffect(() => {
    const figureElement = d3.select(figureRef.current);
    figureElement.selectAll('*').remove();

    const svgElement = figureElement
      .append('svg')
      .attr('height', svgHeight)
      .attr('width', svgWidth);

    const svg = svgElement.append('g');

    const color = d3
      .scaleLinear()
      .domain([minValue, maxValue])
      .range(['#ffebef', 'red']);

    const tooltip = figureElement.append('div').attr('class', 'tooltip');

    d3.json('/static/img/us-states.json').then((geojson) => {
      const projection = d3
          .geoAlbersUsa()
          .fitSize([svgWidth, svgHeight], geojson),
        geoGenerator = d3.geoPath().projection(projection);

      svg
        .selectAll('path')
        .data(geojson.features)
        .join('path')
        .attr('d', geoGenerator)
        .attr('class', 'state')
        .style('fill', (d) => {
          if (data.get(d.properties.NAME) == 0) {
            return '#c0c0c0';
          } else {
            return color(data.get(d.properties.NAME));
          }
        })
        .style('stroke', '#000')
        .style('stroke-width', '0.5px')
        .on('mouseover', (e, d) => mouseover(e, d, tooltip))
        .on('mousemove', (e, d) =>
          mousemove(e, d, data.get(d.properties.NAME) + ' trades', tooltip)
        )
        .on('mouseleave', (e, d) => mouseleave(e, d, tooltip));
    });
  }, [data]);

  return (
    <figure ref={figureRef}>
      <svg ref={svgRef} width={svgWidth} height={svgHeight} />
    </figure>
  );
}

USMap.propTypes = {
  data: PropTypes.any,
  dimensions: PropTypes.object,
};
