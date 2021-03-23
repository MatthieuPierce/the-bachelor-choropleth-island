import { json } from 'd3'

// Map data URL
// here U.S. County Data
  let mapDataUrl = 
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';


export const getMapData = async () => {

  let response = await fetch(mapDataUrl);

  return response;
}