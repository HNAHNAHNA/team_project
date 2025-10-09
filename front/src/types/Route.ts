export interface Step {
  instruction: string;
  distance: number;
  duration: number;
}

export interface Fare {
  currencyCode: string;
  units: string;
  nanos: number;
}

export interface RouteResponse {
  distanceMeters: number;
  duration: number;    // seconds
  polyline: string;    // encoded
  steps: Step[];
  fare?: Fare;
}

const BASE = ""; // 프록시(Nginx) 쓰는 환경이면 공백. 직접 FastAPI 주소라면 http://localhost:8000 등.

export async function getRouteByHotelName(params: {
  hotelName: string;
  region: string;
  destLat: number;
  destLng: number;
  mode: "walking" | "transit" | "driving";
  departure?: string; // ISO8601
}): Promise<RouteResponse> {
  const qs = new URLSearchParams({
    hotelName: params.hotelName,
    region: params.region,
    destLat: String(params.destLat),
    destLng: String(params.destLng),
    mode: params.mode,
    ...(params.departure ? { departure: params.departure } : {}),
  });

  const res = await fetch(`${BASE}/api/fastapi/directions/by-hotel-name?${qs.toString()}`, {
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Route API error: ${res.status} ${text}`);
  }
  return res.json();
}
