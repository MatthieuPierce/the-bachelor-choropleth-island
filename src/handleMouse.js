import { select, timeFormat } from 'd3';
import { xValue, yValue, colorValue } from './accessors';
import { clamp } from './helperFunctions';
import { tooltip } from './tooltip';
import { margin } from './chartParameters';

// Handle mouseOver/focus on marks
export const handleMouseOver = (event, d) => {

  // Style currently-focused mark
  select(event.currentTarget)
    .attr("stroke-width", "1")
    .attr("stroke", "var(--primary-color)")
    // .attr("opacity", 1)

    if (event.currentTarget.className.baseVal !== `legend-mark`) {
  // Change tooltip message depending on whether d variance is positive
  if (d.variance > 0 ) {
    tooltip
      .html(`
          <p>${d.monthStringShort} ${d.year}</p>
          <p><strong>${d.tempString}</strong></p>
          <p class="hotter">${d.varianceString}</p>
        `)
  } else {
    tooltip
      .html(`
      <p>${d.monthStringShort} ${d.year}</p>
      <p><strong>${d.tempString}</strong></p>
      <p class="cooler">${d.varianceString}</p>
        `)
  }

  // Position and transition tooltip
  let tooltipDimensions = document.querySelector("#tooltip")
    .getBoundingClientRect();
  let chartDimensions = document.querySelector("#chart")
    .getBoundingClientRect(); 
  
  tooltip
    .attr("visibility", "visible")
    .style("top",
      `${clamp(
        0,
        event.offsetY - tooltipDimensions.height,
        chartDimensions.height - tooltipDimensions.height - 2
      )}px`)
    .style("left",
      `${clamp(
        margin.left,
        event.offsetX + 1,
        chartDimensions.width - tooltipDimensions.width - 2
      )}px`)
    .attr("data-year", xValue(d).getFullYear())
    .style("z-index", 20)
    .transition()
    .duration(50)
    .style("opacity", 1)
      }
    // Only act on tooltip if mark class is not "legend-mark";
  // previously encased all tooltip activity above, had to be 
  // depreciated just to affecting opacity due to fcc-test constraints
  // if (event.currentTarget.className.baseVal !== `legend-mark`) {
  //   }
  
}

// Handle mouseOut/leave
export const handleMouseOut = (event, d) => {
  select(event.currentTarget)
    .attr("opacity", 1)
    .attr("stroke", null)
    .attr("stroke-width", null)
    // .attr("transform", null)

    ;

  tooltip
    .attr("data-year", null)
    .transition()
    .duration(300)
    .style("opacity", 0)
    .attr("visibility", "hidden")
    .style("z-index", -1)
}