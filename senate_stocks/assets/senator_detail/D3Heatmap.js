import * as d3 from 'd3';
import { mouseover, mousemove, mouseleave } from '../common/Tooltip';

let d = require('datejs');

class D3Heatmap {
  constructor(ref, data, selectFunction, dimensions) {
    this.ref = ref;
    this.data = data;
    this.dimensions = dimensions;
    this.selectFunction = selectFunction;

    const WIDTH = 1000,
      HEIGHT = 170,
      CELLSIZE = 17,
      CELLMARGIN = 1.5,
      LABELHEIGHT = 40;

    const COLOR = d3
      .scaleLinear()
      .domain([1, d3.max(Array.from(data.values()).map((list) => list.length))])
      .range(['lightblue', 'blue']);

    d3.select(ref).selectAll('*').remove();
    var tooltip = d3.select(ref).append('div').attr('class', 'tooltip');

    var heatSvg = d3
      .select(this.ref)
      .append('svg')
      .attr('width', this.dimensions.width)
      .attr('height', this.dimensions.height)
      .data([2021])
      .join('svg')
      .attr('width', WIDTH)
      .attr('height', HEIGHT);

    // console.log(heatSvg);
    // heatSvg = d3
    //   .select(this.ref)
    //   .selectAll('svg')
    //   .data([2021])
    //   .enter()
    //   .append('rect')
    //   .attr('width', WIDTH)
    //   .attr('height', HEIGHT)
    //   .append('g');
    // .call((enter) =>
    //   enter.attr(
    //     'transform',
    //     'translate(' +
    //       (WIDTH - (CELLSIZE + CELLMARGIN) * 53) / 2 +
    //       ',' +
    //       (HEIGHT - (CELLSIZE + CELLMARGIN) * 7 - 1) +
    //       ')'
    //   )
    // );

    heatSvg
      .append('g')
      .selectAll('rect')
      .data((d) => d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
      .enter()
      .append('rect')
      .attr('width', CELLSIZE - CELLMARGIN)
      .attr('height', CELLSIZE - CELLMARGIN)
      .attr('rx', 1.5)
      .attr('ry', 1.5)
      .style('opacity', 1)
      .attr('x', (d) => {
        return d3.timeWeek.count(d3.timeYear(d), d) * (CELLSIZE + CELLMARGIN);
      })
      .attr('y', (d) => d.getDay() * (CELLSIZE + CELLMARGIN))
      .attr('id', (d) => d)
      .attr('fill', (d) => {
        // grey out future dates
        if (d.compareTo(Date.today()) > 0) {
          return 'var(--heatmap-disabled)';
        }

        // color dates with trades
        let date = d.toString('yyyy-MM-dd');
        if (this.data.has(date)) {
          return COLOR(this.data.get(date).length);
        }

        if (d.getDay() == 1) {
          d3.select('#month-' + d.getMonth()).attr(
            'x',
            d.getDay() * (CELLSIZE + CELLMARGIN)
          );
        }
      })
      .on('mouseover', (e, d) => mouseover(e, d, tooltip))
      .on('mousemove', (e, d) => mousemove(e, d, d, tooltip))
      .on('mouseleave', (e, d) => mouseleave(e, d, tooltip))
      .on('click', (e, d) =>
        this.selectFunction(data.get(d.toString('yyyy-MM-dd')))
      );
  }
}

export default D3Heatmap;
