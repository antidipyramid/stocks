import * as d3 from 'd3';

export function mouseover(e, d, tooltip) {
  tooltip.style('opacity', 1).style('visibility', 'visible');
  d3.select(e.target).style('stroke', 'yellow').style('stroke-width', '2px');
}

export function mousemove(e, d, text, tooltip) {
  let xy = d3.pointer(event, e.target);
  tooltip
    .text(text)
    .style('left', xy[0] + 'px')
    .style('top', xy[1] + 'px');
}

export function mouseleave(e, d, tooltip) {
  tooltip.style('opacity', 0).style('visibility', 'hidden');
  d3.select(e.target).style('stroke', 'black').style('stroke-width', '0.5px');
}
