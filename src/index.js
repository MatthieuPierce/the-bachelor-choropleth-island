import './index.css';
import { 
  extent,
  geoAlbersUsa,
  geoPath,
  interpolateBuGn,
  json, 
  scaleSequential,
 } from 'd3';
 import { feature, mesh } from 'topojson-client';

import { colorValue } from './accessors';
import { chart } from './chartParameters';
import { makeSequentialLegend } from './legendSequential'
import { getMapData } from './getMapData'
import { parseData } from './parseData';
import { handleMouseOver, handleMouseOut } from './handleMouse';

// NON-CODE PLANNING: CHART OBJECTIVES
// United States map (states only), subdivided into counties (s-axis)
// color scale to indicate % of educational attaiment (bachelor's deg) (c-axis)
// tooltip with data-education property
// nation and state paths for clarity

// Chart basic construction & layout parameters in chartParameters.js

let dataset;
// Datset source
const dataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

// Async wrapper
let asyncWrapper = async () => {

  // Get topology data (expect TopoJSON) for map
  let mapData = await getMapData().then(resp => resp.json());
  console.log("mapData")
  console.log(mapData);

  // // Map projection for lower 48 by county
  // let projection = geoAlbersUsa();
  
  // Map path
  let path = geoPath();

  // topojson feature conversion (topojson.feature(topology, object))
  // Returns the GeoJSON Feature or FeatureCollection for the specified object
  // in the given topology. 
  let features = feature(mapData, mapData.objects.counties).features;

  // state path, simplified with topojson.mesh, which takes
  // (topology, object, filter)
  let states = mesh(
    mapData, 
    mapData.objects.states, 
    (a, b) => a !== b)

  // nation path
  let nation = feature(
    mapData, 
    mapData.objects.nation);

  // Fetch Dataset & Render Marks
  json(dataUrl).then(data => {

    // Parse dataset function in parseData.js
    dataset = parseData(data);
    // Console out parsed dataset for examination
    // console.log("dataset")
    // console.log(dataset);

    // create map between mapData features and dataset values
    let wholeMap = new Map()
    features.forEach(e => {
      wholeMap.set(e.id, {
        feature: e,
        data: dataset.filter(d => d.fips === e.id)[0],
      })
    });

    // colorScale
    const colorScale = scaleSequential(interpolateBuGn)
      .domain(extent(dataset, colorValue))
      // .range([0, 1])
   
    // colorMapValue accessor
    let colorMapValue = d => {
      let identity = d.id;
      return wholeMap.get(identity).data.bachelorsOrHigher
    };

    // Map marks with choropleth effect -- county
    chart.selectAll("path .county")
    .data(features)
    .enter()
    .append("path")
      .attr("class", "county")
      .attr("d", d => path(d))
      .attr("fill", d => colorScale(colorMapValue(d)))
      .attr("data-fips", d => wholeMap.get(d.id).data.fips)
      .attr("data-education", d => colorMapValue(d))
      .attr("stroke", "transparent")
      .attr("stroke", "var(--secondary-color)")
      .attr("stroke-width", 0.2)
      .attr("stroke-linejoin", "round")
      .on("mouseover pointerover focus", (e, d, map, val) => handleMouseOver(e, d, wholeMap, colorMapValue(d)))
      .on("mouseout pounterout pointerleave", handleMouseOut)
    ;

    // state path mesh version
    chart.append("path")
      .datum(states)
      .attr("id", "states-path")
      .attr("d", path)
      .attr("class", "state")
      .attr("d", d => path(d))
      .attr("stroke", "var(--primary-color)")
      .attr("fill", "none")
      .attr("stroke-width", 0.3)
      .attr("stroke-linejoin", "round")
    
    // nation path (single feature so datum used)
    chart.append("path")
    .datum(nation)
    .attr("id", "nation-path")
    .attr("d", path)
    .attr("class", "state")
    .attr("d", d => path(d))
    .attr("stroke", "var(--primary-color)")
    .attr("fill", "none")
    .attr("stroke-width", 0.1)
    .attr("stroke-linejoin", "round")

    // Add style SVG filter for use in tooltip hover
    chart.append("filter")
      .attr("id", "svgFilter")
      .append("feMorphology")
        .attr("operator", "erode")
        .attr("radius", 1)

    // Tooltip -- from tooltip.js)

    // Sequential legend -- from legendSequential
    makeSequentialLegend(dataset, colorScale);

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




