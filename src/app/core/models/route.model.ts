export interface BusRoute {
  id: number;
  routeNumber: string;
  stopA: string;
  stopB: string;
  path: string;
  distanceAB: number;
  distanceBA: number;
  operationStart: string; // LocalTime represented as string "HH:mm:ss"
  operationEnd: string;
  price: number;
}

export interface RouteRequest {
  routeNumber: string;
  stopA: string;
  stopB: string;
  path: string;
  distanceAB: number;
  distanceBA: number;
  operationStart: string;
  operationEnd: string;
  price?: number; // Optional because it can be auto-calculated
}
