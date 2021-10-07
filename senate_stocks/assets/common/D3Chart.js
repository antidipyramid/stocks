import * as d3 from 'd3';
import { mouseover, mousemove, mouseleave } from './Tooltip';

function getVolume(amount) {
  let bounds = amount.split('-');
  bounds.forEach((x, i, a) => {
    a[i] = Number(x.replace(/[ ,$]/g, ''));
  });
  return bounds.reduce((a, b) => a + b) / 2;
}

class D3Chart {
  constructor(ref, priceMap, allTrades, dimensions, selectFunction) {
    this.priceMap = priceMap;
    this.allTrades = allTrades;
    this.dimensions = dimensions;
    this.selectFunction = selectFunction;

    var prices = Object.entries(this.priceMap),
      trades = this.allTrades;

    d3.select(ref).selectAll('*').remove();

    var svg = d3
      .select(ref)
      .append('svg')
      .attr('width', this.dimensions.width + this.dimensions.margin)
      .attr('height', this.dimensions.height + this.dimensions.margin)
      .append('g')
      .attr(
        'transform',
        'translate(' +
          this.dimensions.margin / 2 +
          ',' +
          this.dimensions.margin / 2 +
          ')'
      );

    var tooltip = d3.select(ref).append('div').attr('class', 'tooltip');

    var clip = svg
      .append('defs')
      .append('svg:clipPath')
      .attr('id', 'price-clip')
      .append('svg:rect')
      .attr('width', this.dimensions.width + this.dimensions.margin)
      .attr('height', this.dimensions.height + this.dimensions.margin)
      .attr('x', 0)
      .attr('y', 0);

    var x = d3
      .scaleTime()
      .domain(d3.extent(prices, (d) => d3.timeParse('%Y-%m-%d')(d[0])))
      .range([0, this.dimensions.width]);
    var y = d3
      .scaleLinear()
      .domain([0, 200])
      .range([this.dimensions.height, 0]);

    var z = d3
      .scaleLinear()
      .domain([5000, 10000, 50000, 100000, 500000, 1000000])
      .range([6, 9, 12, 15, 18, 21, 23]);

    var xAxis = svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + this.dimensions.height + ')')
      .call(d3.axisBottom(x).tickSize(0).tickPadding(25))
      .attr('color', 'black')
      .select('.domain')
      .remove();

    var yAxis = svg
      .append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickPadding(10)
          .tickSize(-1 * (this.dimensions.width + this.dimensions.margin))
      )
      .attr('class', 'axis')
      .select('.domain')
      .remove();

    var filter = svg
      .append('filter')
      .attr('id', 'constantOpacity')
      .append('feComponentTransfer')
      .append('feFuncA')
      .attr('type', 'table')
      .attr('tableValues', '0 0.7 0.7');

    var line = svg
      .append('path')
      .attr('clip-path', 'url(#price-clip)')
      .datum(prices.reverse())
      .attr('fill', 'none')
      .attr('id', 'price-line')
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveBundle)
          .x((d) => x(d3.timeParse('%Y-%m-%d')(d[0])))
          .y((d) => y(d[1]['5. adjusted close']))
      );

    var bubbles = svg
      .append('g')
      .attr('filter', 'url(#constantOpacity)')
      .selectAll('dot')
      .data(trades)
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', function (d) {
        return x(d3.timeParse('%Y-%m-%d')(d.transaction_date));
      })
      .attr('cy', function (d) {
        return y(priceMap[d.transaction_date]['5. adjusted close']);
      })
      .attr('r', function (d) {
        return 10;
      })
      .on('mousedown', (e, d) => this.selectFunction(d))
      .on('mouseover', (e, d) => mouseover(e, d, tooltip))
      .on('mousemove', (e, d) =>
        mousemove(
          e,
          d,
          d.transaction_date +
            ': ' +
            priceMap[d.transaction_date]['5. adjusted close'],
          tooltip
        )
      )
      .on('mouseleave', (e, d) => mouseleave(e, d, tooltip));
  }

  update(options) {
    x.domain(
      d3.extent(prices, (d) => [
        d3.timeParse('%Y-%m-%d')(options.year + '-01-01'),
        d3.timeParse('%Y-%m-%d')(options.year + '-12-31'),
      ])
    );

    xAxis.call(d3.axisBottom(x).tickSize(0).tickPadding(25));
  }
}

export default D3Chart;
