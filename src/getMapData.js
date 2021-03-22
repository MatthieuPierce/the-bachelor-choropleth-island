import { json } from 'd3'

export const getMapData = () => {

  // Map data URL
  // here U.S. County Data
  let mapDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

  let getData = async (mapDataUrl) => {
    let response = await json(mapDataUrl);
    return response;
  }

  let data = getData().then(resp => resp);

  return data;
}