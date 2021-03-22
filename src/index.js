import './index.css';
import { 
  extent,
  interpolateRdBu,
  invert,
  select, 
  scaleTime,
  scaleOrdinal,
  scaleBand, 
  json, 
  min, 
  max,
  scaleLinear,
  scaleDiverging,

 } from 'd3';
import { xValue, yValue, colorValue } from './accessors';
import { innerWidth, innerHeight, margin } from './chartParameters';
// import { makeCategoricalLegend } from './legendCategorical';
import { makeDivergingLegend} from './legendDiverging'

import { marks } from './marks';
import { parseData } from './parseData';
// import { tooltip } from './tooltip';
import { buildXAxis } from './xAxis';
import { buildYAxis } from './yAxis';

// NON-CODE PLANNING: CHART OBJECTIVES
// Global temperatures over month (y-axis)
// vs over years; (x-axis)
// color scale to indicate temperature (c-axis)
// tooltip with data-year property (optional: temperature etc)
//
//  

// Chart basic construction & layout parameters in chartParameters.js

let dataset;
// Datset source
const dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

// Fetch Dataset & Render Marks
json(dataUrl).then(data => {

  // Parse dataset function in parseData.js
  dataset = parseData(data);
  // Console out parsed dataset for examination
  console.log(dataset);

  //Console out something interesting
  // console.log(innerHeight);

  // Calc xMin xMax yMin yMax (or extent)
  const xMin = min(dataset, xValue);
  const xMax = max(dataset, xValue);
  const yMin = min(dataset, yValue);
  const yMax = max(dataset, yValue);
  const cMin = min(dataset, colorValue);
  const cMax = max(dataset, colorValue)

  // xScale
  const xScale = scaleTime()
  .domain([xMin, xMax])
  .range([0, innerWidth]);
  
  // xBand (for calculating mark width if xScale nonordinal, linear, time, etc)
  const xBand = scaleBand()
    .domain(dataset.map(xValue))
    .range([0, innerWidth])
    .paddingInner(0)
    .paddingOuter(0);

  // yScale
  const yScale = scaleBand()
    .domain(dataset.map(yValue))
    .range([0, innerHeight])
    // .nice();

  // colorScale - linear variant
  // const colorScale = scaleLinear()
  //   .domain(extent(dataset, colorValue))
  //   .range([0, 1])

  // colorScale - diverging variant for precise/opinionated temp variance
  // optional: cAbsolute for both sides of domain to properly scale variance
  const cAbsolute = max([Math.abs(cMin), Math.abs(cMax)])
  const colorScale = scaleDiverging(
    // 3 element array domain for diverging scale 
    [(-cAbsolute), 0, cAbsolute],
    // interprolator function for diverging scale; could be 3-el array instead
    // using t => funct(t - 1) to reverse the red to blue color scheme
    (t) => interpolateRdBu(1 - t))
    ;



  // Tooltip -- from tooltip.js)

  // Categorical Color Legend -- from legendCategorical.js
  // makeCategoricalLegend( 
  //   colorKeys, 
  //   colorScale, 
  //   );

  // Diverging Color Legend (mini-chart) from legendDiverging.js
  makeDivergingLegend(
    dataset,
    colorScale
  );

  // Marks (circles) -- from marks.js
  marks(
    dataset, 
    xScale, 
    yScale,
    colorScale,
    xBand
    );

  // xAxis -- buildXAxis function in xAxis.js
  buildXAxis(xScale);

  // yAxis -- buildYAxis function in yAxis.js
  buildYAxis(yScale);


  }
)
// Gotta catch those errors
.catch(err => {
  alert(err);
  console.log(err);
});



