import { select } from 'd3';

// Chart parameters
export const padding = 20;

export const margin = {
  top: padding + 10,
  right: padding - 10,
  bottom: padding - 10,
  left: padding + 10
};

let width = 1000;
let height = 650;
export const innerWidth = width - margin.left - margin.right;
export const innerHeight = height - margin.top - margin.bottom;

// Add primary SVG to div, set viewBox parameters and translate for margins
export let chart = select('#chart-container')
  .append('svg')
    .attr("id", "chart")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("svg-content", true)
    .style("background", "var(--secondary-color)")
    .style("color", "var(--primary-color)")
    .attr("font-size", 11)
  //Margin convention
  .append('g')
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("id", "inner-group")
  ;