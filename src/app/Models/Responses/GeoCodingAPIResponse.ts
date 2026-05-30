import { City } from "../City";

export interface GeoCodingAPIResponse {
    generationtime_ms: number,
    results: City[]
}