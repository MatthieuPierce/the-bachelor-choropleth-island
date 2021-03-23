import './index.css';
import { 
  extent,
  geoAlbersUsa,
  geoPath,
  interpolateRdBu,
  interpolateBuGn,
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
  scaleSequential,
 } from 'd3';
 import { feature, mesh } from 'topojson-client';

import { xValue, yValue, colorValue } from './accessors';
import { innerWidth, innerHeight, margin, chart } from './chartParameters';
// import { makeCategoricalLegend } from './legendCategorical';
import { makeDivergingLegend} from './legendDiverging'
import { marks } from './marks';
import { getMapData } from './getMapData'
import { parseData } from './parseData';
// import { tooltip } from './tooltip';
import { buildXAxis } from './xAxis';
import { buildYAxis } from './yAxis';
import { handleMouseOver, handleMouseOut } from './handleMouse';

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
const dataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

// Async wrapper
let asyncWrapper = async () => {

  // Get topology data (expect TopoJSON) for map
  let mapData = await getMapData().then(resp => resp.json());
  // console.log("mapData")
  // console.log(mapData);

  // // Map projection for lower 48 by county
  // let projection = geoAlbersUsa();
  
  // Map path
  let path = geoPath();

  // topojson feature conversion (topojson.feature(topology, object))
  // Returns the GeoJSON Feature or FeatureCollection for the specified object
  // in the given topology. 
  let features = feature(mapData, mapData.objects.counties).features;
  console.log("features:")
  console.log(features);

  // Fetch Dataset & Render Marks
  json(dataUrl).then(data => {

    // Parse dataset function in parseData.js
    dataset = parseData(data);
    // Console out parsed dataset for examination
    console.log("dataset")
    console.log(dataset);

    // create map between mapData features and dataset values

    let wholeMap = new Map()

    features.forEach(e => {
      wholeMap.set(e.id, {
        feature: e,
        data: dataset.filter(d => d.fips === e.id)[0],
      })
    });
    console.log("wholeMap")
    console.log(wholeMap);

    // create new map-based iterator for calculation
    let mapValues = wholeMap.values()
  
    // Calc xMin xMax yMin yMax (or extent)
    const xMin = min(dataset, xValue);
    const xMax = max(dataset, xValue);
    const yMin = min(dataset, yValue);
    const yMax = max(dataset, yValue);
    const cMin = min(dataset, colorValue);
    const cMax = max(dataset, colorValue)

    // xScale
    // const xScale = scaleTime()
    // .domain([xMin, xMax])
    // .range([0, innerWidth]);
    
    // // xBand (for calculating mark width if xScale nonordinal, linear, time, etc)
    // const xBand = scaleBand()
    //   .domain(dataset.map(xValue))
    //   .range([0, innerWidth])
    //   .paddingInner(0)
    //   .paddingOuter(0);

    // // yScale
    // const yScale = scaleBand()
    //   .domain(dataset.map(yValue))
    //   .range([0, innerHeight])
    //   // .nice();

    // colorScale
    const colorScale = scaleSequential(interpolateBuGn)
      .domain(extent(dataset, colorValue))
      // .range([0, 1])
   
    // colorMapValue accessor
    let colorMapValue = d => {
      let identity = d.id;
      return wholeMap.get(identity).data.bachelorsOrHigher
    };

    // Map marks
    chart.selectAll("path")
    .data(features)
    .enter()
    .append("path")
      .attr("class", "county")
      .attr("d", d => path(d))
      .attr("fill", d => colorScale(colorMapValue(d)))
      .attr("data-fips", d => wholeMap.get(d.id).data.fips)
      .attr("data-education", colorMapValue)
      .attr("stroke", "var(--secondary-color)")
      .attr("stroke-width", 0.2)
      .attr("stroke-linejoin", "round")
      .on("mouseover pointerover focus", (e, d, map) => handleMouseOver(e, d, wholeMap))
      .on("mouseout pounterout pointerleave", handleMouseOut)
    ;

    // Add style SVG filter for use in tooltip hover
    chart.append("filter")
      .attr("id", "svgFilter")
      .append("feMorphology")
        .attr("operator", "erode")
        .attr("radius", 1)

    // Tooltip -- from tooltip.js)

    // Categorical Color Legend -- from legendCategorical.js
    // makeCategoricalLegend( 
    //   colorKeys, 
    //   colorScale, 
    //   );

    // Diverging Color Legend (mini-chart) from legendDiverging.js
    // makeDivergingLegend(
    //   dataset,
    //   colorScale
    // );

    // Marks (circles) -- from marks.js
    // marks(
    //   dataset, 
    //   xScale, 
    //   yScale,
    //   colorScale,
    //   xBand
    //   );

    // xAxis -- buildXAxis function in xAxis.js
    // buildXAxis(xScale);

    // yAxis -- buildYAxis function in yAxis.js
    // buildYAxis(yScale);


    }
  )
  // Gotta catch those errors
  .catch(err => {
    alert(err);
    console.log(err);
  });



};
asyncWrapper();




