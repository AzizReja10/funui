// Default major hub coordinates connected by optical data arcs
export const DEFAULT_HUBS = [
  { name: 'New York', lat: 40.7, lon: -74.0 },
  { name: 'London', lat: 51.5, lon: -0.1 },
  { name: 'Tokyo', lat: 35.7, lon: 139.7 },
  { name: 'Sydney', lat: -33.9, lon: 151.2 },
  { name: 'São Paulo', lat: -23.5, lon: -46.6 },
  { name: 'Cairo', lat: 30.0, lon: 31.2 },
];

export const DEFAULT_ARC_PAIRS = [
  [0, 1], // New York <-> London
  [1, 2], // London <-> Tokyo
  [2, 3], // Tokyo <-> Sydney
  [3, 4], // Sydney <-> São Paulo
  [4, 5], // São Paulo <-> Cairo
  [5, 0], // Cairo <-> New York
];
