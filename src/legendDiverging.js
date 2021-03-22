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
// One dimensional chart, labeling diverging color scale along x-axis

// Legend's x-axis accessor the main chart's colorValue
// in this case d["variance"]
const legendXValue = colorValue;
const legendColorValue = colorValue; 

// legend parameters, could easily move into function
const legendWidth = 300;
const legendHeight = 100;

export const makeDivergingLegend = (
  dataset, 
  colorScale, 
 ) => {

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

  // legendXScale takes the diverging colorScale from the primary chart,
  // modified to the range of the legend's dimensions
  // for use in the legendXAxis AND x position for band marks
  const legendXScale = colorScale.copy()
    .range( [ 0, ( legendWidth / 2 ), legendWidth ] );
  

  // Main legend group
  let legend = chart.append("g")
    // Translate to X left and Y top of chart
    .attr("transform", 
      `translate(${ (innerWidth / 4) - legendWidth / 2 }, 
      ${-(legendHeight / 5) })`)
    // Translate to X center and Y bottom of chart
    // .attr("transform", 
    //   `translate(${ (innerWidth / 2) - legendWidth / 2 }, 
    //   ${innerHeight + legendHeight - legendHeight / 2})`)
    .attr("id", "legend")
  
  // Background Rect (final bandwidth value may exceed legendWidth )
  // legend
  //   .append("rect")
  //     .attr("fill", "var(--primary-color)")
  //     .attr("opacity", 0.1)
  //     .attr("width", legendWidth + 5)
  //     .attr("height", legendHeight)
  //     .attr("y", -legendHeight/1.5)
  //     .attr("id", "legend-box")
  //     .attr("class", "legend bg")
  //     .attr("stroke", "var(--primary-color)")
  //     .attr("stroke-opacity", 0.5)
  //     .attr("stroke-dasharray", "5 5 5 5")
  //   ;

  // Legend Marks
  // x position set by legendXScale (linear diverging with spatial range)
  // fill set by legendColorScale (diverging with interpolated color space)
  // width set by colorBandsScale.bandwith()thanks to
  //     synthetically-even domain data from divergenceDataToBands made above
  legend.selectAll("rect.legend-mark")
    .data(divergenceDataToBands)
    .enter()
    .append("rect")
      .attr("class", "legend-mark")
      // .attr("shape-rendering", "crispEdges")
      .attr("x", d => legendXScale(d))
      .attr("y", -10)
      .attr("width", colorBandsScale.bandwidth() + 0.2 ) // aliasing tweak
      .attr("height", 10)
      .attr("margin", 0)
      .attr("opacity", 1)
      .attr("fill", d => legendColorScale((d)))
    .append("svg:title")
      .text(t => `${legendColorScale((t))} means about ${format(`+.2~`)(t)}°C`)
    // .on("mouseover pointerover focus", handleMouseOver)
    // .on("mouseout pounterout pointerleave", handleMouseOut)

  // Legend Label
  legend
    .append("text")
      .text("Variance from global base temperature (8.66℃)")
      .attr("font-size", "0.9em")
      .style("font-weight", "bold")
      .attr("x", 30)
      .attr("y", -17)
      // .style("font-family", `Inter,sans-serif`)

  // Legend X-Axis
  const legendXAxis = axisBottom(legendXScale).ticks(8);

  legend.append("g")
    .attr("id", "legend-x-axis")
    .style("color", "var(--primary-color)")
    .call(legendXAxis)
    .call(g => g.selectAll(".tick text")
      .text(t => `${format(`+.3~`)(t)}°C`)
      .attr("y", 5)
      )
    .call(g => g.selectAll(".tick line")
      .attr("stroke-opacity", 1.0)
      .attr("y1", 0)
      .attr("y2", -10)
      .attr("transform", `translate(${0}, ${-0})`)
      .attr("stroke", "var(--primary-color)")
      .attr("stroke-width", 0.5)

      // .attr("stroke-dasharray", "1 1")
      )
    .call(g => g.select(".domain")
      .attr("stroke-opacity", 0.0)
      .attr("stroke-dasharray", "1 1"))
      .attr("y", 0)

}