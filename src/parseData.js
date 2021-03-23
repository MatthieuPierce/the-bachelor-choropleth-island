import { format, timeFormat } from 'd3'

// Parse data from source into chart-useable components
// Standard application: Array of objects

export const parseData = (data) => {

  // Console dataset to examine (comment out afterwards)
  // console.log(data);

  // Array of Objects
  // fips: num// aligns with topoJSON county ids e.g 1003
  // state: string // two-letter state name e.g. "AL"
  // area_name: string // county name e.g. "Clay County"
  // bachelorsOrHigher: num 
      // 100-scale percent with bachelor's degree or higher, eg 14.1
      // looks like 3 significant numbers
  

  return data.map( d => {
      return {
        ...d
      }
    }
  );
  
}