import { axisBottom, select, timeFormat,  timeYear } from 'd3';
import { chart, innerWidth, innerHeight } from './chartParameters'

export const buildXAxis = (xScale) => {
  const xAxis = axisBottom(xScale).ticks(timeYear.every(15));

  chart.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .style("color", "var(--primary-color)")
    .call(xAxis)
    .call(g => g.selectAll("#x-axis .tick text")
      .text(t => timeFormat("%Y")(t))
      )
    .call(g => g.selectAll("#x-axis .tick line")
      .attr("y1", 0)
      .attr("y2", 5)
      .attr("transform", `translate(${0}, ${-0})`)
      .attr("stroke-opacity", 1)
      .attr("stroke-width", 0.5)
      // .attr("stroke-dasharray", "1 1")
      )
    .call(g => g.select(".domain")
      .attr("stroke-opacity", 0.0)
      // .attr("stroke-dasharray", "10 5 5 5")
      )
    // .append("text")
    //   .text("Year")
    //   .attr("transform", `translate(${innerWidth / 20 }, ${45})`)
    //   .attr("fill", "var(--primary-color)")
    //   .style("font-size", "1.7em")
      ;

  // Snarky highlight note group
  let oldestLivingPersonBorn = new Date(1903, 0, 2);
  
  let snarkyGroup = chart.append("g")
    .attr("id", "snarky-group")
    .attr("class", "snarky")
    .attr("transform", `translate(${xScale(oldestLivingPersonBorn)}, 0)`)

  snarkyGroup
    .append("line")
      .attr("id", "snarky-line")
      .attr("x1", 0 )
      .attr("x2", 0 )
      .attr("y1", `${-21}`)
      .attr("y2", innerHeight)
      .attr("stroke", "var(--primary-color)")
      .attr("stroke-opacity", 1)
      .attr("stroke-width", 0.5)  
      .attr("stroke-dasharray", "9 4 1 5")

    snarkyGroup.append("text")
      // .text(`Oldest living person born`)
      .text(`Oldest living person born ${timeFormat("%b %e, %Y")
        (oldestLivingPersonBorn)}`)
        .attr("id", "snarky-text")
        .attr("fill", "var(--primary-color)")
        .style("font-size", `0.9em`)
        .style("font-weight", "bold")
        .attr("x", 5)
        .attr("y", -19 )
      
    snarkyGroup.append("circle")
        .attr("cx", 0)
        .attr("cy", -22 )
        .attr("r", 1.5)
        .attr("opacity", 1)
        .attr("fill", "var(--primary-color)")
        .attr("id", "snarky-circle")
        



    
    }