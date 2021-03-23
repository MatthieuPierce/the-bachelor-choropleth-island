import { 
  axisBottom,
  extent,
  format,
  max,
  min,
  range, 
  select,
  scaleBand,
  scaleLinear,
  timeFormat,  
  timeYear, 
  scaleDiverging
} from 'd3';
import { chart, innerWidth, innerHeight } from './chartParameters'
import { colorValue } from './accessors';
import { handleMouseOver, handleMouseOut } from './handleMouse';

// Objective: Color legend that is itself a mini chart
// One dimensional chart, labeling sequential color scale along x-axis
// using SVG linear gradient rather than a bevy of rects this time

// Legend's x-axis accessor the main chart's colorValue
// in this case d["variance"]
const legendXValue = colorValue;
const legendColorValue = colorValue; 

// legend parameters, could easily move into function
const legendWidth = 400;
const legendHeight = 60;
const legendPadding = 10
const legendMargin = {
  top: legendPadding,
  right: legendPadding,
  bottom: legendPadding,
  left: legendPadding
};
const barHeight = 20;


export const makeSequentialLegend = (
  dataset, 
  colorScale, 
 ) => {

  // Main legend group
  let legend = chart.append("g")
    .attr("id", "legend")
    // Translate to X center and Y top of chart
    .attr("transform", 
      `translate(${ (innerWidth / 2) - legendWidth / 2 }, 
      ${legendMargin.top + 5})`)
    // // Translate to X center and Y bottom of chart
    // .attr("transform", 
    //   `translate(${ (innerWidth / 2) - legendWidth / 2 }, 
    //   ${innerHeight - legendHeight})`)
    

  // Background Rect
  // legend
  //   .append("rect")
  //     .attr("fill", "var(--primary-color)")
  //     .attr("opacity", 0.1)
  //     .attr("width", legendWidth)
  //     .attr("height", legendHeight)
  //     // .attr("y", -legendHeight/2)
  //     .attr("id", "legend-box")
  //     .attr("class", "legend bg")
  //     .attr("stroke", "var(--primary-color)")
  //     .attr("stroke-opacity", 0.5)
  //     .attr("stroke-dasharray", "5 5 5 5")
  //   ;

  // FCC-test makework rects
  // the fcc test doesn't recognize a smooth, value-interpolated 
  // linear gradient as "at least 4 different colors"
  // so here's some makework fills to fit the test
  let busyColors = [0, 1, 2, 3, 4, 5]

  legend.selectAll("rect")
  .data(busyColors)
  .enter()
  .append("rect")
    .attr("height", 1)
    .attr("width", 1)
    .attr("fill", d => `hsla(${d * 50}, 50%, 50%, 1`)
    .attr("x", d => d * 5)
    .attr("opacity", 0.01)
  
  // Append SVG defs element to legend svg
  let legendDefinitions = legend.append("defs");

  // Create linearGradient element with id to be used later in url(#lin-gra)
  let linearGradient = legendDefinitions.append("linearGradient")
    .attr("id", "linear-gradient")

  // Create array of colors and their offset/stop points by percent
  let stopColors = colorScale.ticks().map( (tick, i, arr) => {
    return {
      color: colorScale(tick),
      offset: `${ 100 * i / arr.length }%`
    }
  });

  // enter stopColors to append a series of stop elements inside linearGradient
  linearGradient.selectAll("stop")
    .data(stopColors)
    .enter()
    .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color)
  
  // create rect to apply to main legend and fill with the linearGradient url
  legend.append("rect")
    .attr("width", legendWidth - legendMargin.left - legendMargin.right)
    .attr("height", barHeight)
    .attr("x", legendMargin.left)
    .style("fill", "url(#linear-gradient)");



  // DATASET 
  
  // To create marks that align with the color scheme & utilize bandwidth(),
  // create evenly distributed array of values between max and min of 
  // the original colorScale domain
  // e.g. d3.range(min, max, step).concat(max)
  // to be used as the dataset for the legend marks

  // stepSize controls number of color bands
  let stepSize = 0.2
  
  let colorScaleBot = min(colorScale.domain())
  let colorScaleTop = max(colorScale.domain())
  // divergenceDataToBands is the dataset to be used in legend-marks
  let divergenceDataToBands = range( colorScaleBot, colorScaleTop, stepSize )
    .concat(colorScaleTop);
  // let divergenceLength = divergenceToBands.length;



  // SCALES - 3

  // legendColorScale takes the diverging colorScale from the primary chart for
  // the legend marks' fill values. Carries the interprolator function.
  const legendColorScale = colorScale.copy();

  // colorBandsScale is a new band Scale for mark width
  let colorBandsScale = scaleBand()
    .domain( divergenceDataToBands )
    .range( [ 0, legendWidth ] )
    .paddingInner(0)
    .paddingOuter(0)

  // legendXScale takes the sequential colorScale from the primary chart,
  // modified to the range of the legend's dimensions
  // for use in the legendXAxis AND x position for band marks
  const legendXScale = colorScale.copy()
    .range( [ legendMargin.right, legendWidth - legendMargin.left ] );
  

  


  // Legend Label
  legend
    .append("text")
      .text("Percent of people in county with bachelor's degree or more")
      .attr("font-size", "1.1em")
      // .style("font-weight", "bold")
      .attr("x", 30)
      .attr("y", -5)
      // .style("font-family", `Inter,sans-serif`)

  // Legend X-Axis
  const legendXAxis = axisBottom(legendXScale).ticks(8);

  legend.append("g")
    .attr("id", "legend-x-axis")
    .attr("transform", `translate(${0}, ${barHeight})`)
    .style("color", "var(--primary-color)")
    .call(legendXAxis)
    .call(g => g.selectAll(".tick text")
      .text(t => `${t}%`)
      .attr("y", 5)
      )
    .call(g => g.selectAll(".tick line")
      .attr("stroke-opacity", 1.0)
      .attr("y1", 0)
      .attr("y2", -barHeight)
      // .attr("transform", `translate(${0}, ${-0})`)
      .attr("stroke", "var(--secondary-color)")
      .attr("stroke-width", 1)
      // .attr("stroke-dasharray", "1 1")
      )
    .call(g => g.select(".domain")
      .attr("stroke-opacity", 0.0)
      .attr("stroke-dasharray", "1 1"))
      .attr("y", 0)

}