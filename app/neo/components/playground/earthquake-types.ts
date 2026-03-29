export interface Earthquake {
  id: string;
  mag: number;
  magtype: string;
  region: string;
  lat: number;
  lon: number;
  depth: number;
  time: string;
  isNew?: boolean;
}
