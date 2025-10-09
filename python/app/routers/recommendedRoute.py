from fastapi import APIRouter,Depends,HTTPException,Query
import httpx
from app.schemas.routeResponse import RouteResponse
from app.config import SPRING_URL, GOOGLE_API_KEY

router = APIRouter(prefix="/api/fastapi")

SPRING_URL = SPRING_URL
GOOGLE_API_KEY = GOOGLE_API_KEY

def _travel_mode(mode: str) -> str:
    m = (mode or "transit").lower()
    if m == "walking": return "WALK"
    if m == "driving": return "DRIVE"
    if m == "bicycling": return "BICYCLE"
    return "TRANSIT"

def _parse_duration(s: str | None) -> int:
    if not s: return 0
    if s.endswith("s"):
        try: return int(s[:-1])
        except: return 0
    return 0

@router.get("/directions/by-hotel-name", response_model=RouteResponse)
async def directions_by_hotel_name(
    hotelName: str = Query(...),
    region: str = Query(...),
    destLat: float = Query(...),
    destLng: float = Query(...),
    mode: str = Query("transit"),
    departure: str | None = Query(None)  # ISO8601
):
    # 1) 스프링에서 호텔 좌표 가져오기
    hotel_url = f"{SPRING_URL}/api/places/hotel-location"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(hotel_url, params={"hotelName": hotelName, "region": region})
            r.raise_for_status()
            hotel = r.json()
            oLat = hotel.get("latitude")
            oLng = hotel.get("longitude")
            if oLat is None or oLng is None:
                raise HTTPException(status_code=502, detail="Hotel location missing from Spring response")
    except httpx.HTTPStatusError as e:
        print("Error response from Spring backend:", e.response.text)
        raise HTTPException(
            status_code=502,
            detail=f"Error from Spring backend: {e.response.text}"
        )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Timeout calling Spring backend.")
    # 2) Google Routes 호출
    body = {
        "origin": {"location": {"latLng": {"latitude": oLat, "longitude": oLng}}},
        "destination": {"location": {"latLng": {"latitude": destLat, "longitude": destLng}}},
        "travelMode": _travel_mode(mode),
        "computeAlternativeRoutes": False,
        "polylineEncoding": "ENCODED_POLYLINE",
        "languageCode": "ja",
        "regionCode": "JP",
    }

    if mode.lower() == 'transit':
        body["transitPreferences"] = {
            "allowedTravelModes": ["BUS", "RAIL", "SUBWAY", "TRAIN", "TRAM", "FERRY"]
        }

    routes_url = "https://routes.googleapis.com/directions/v2:computeRoutes"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "*"
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.post(routes_url, headers=headers, json=body)
        r.raise_for_status()
        data = r.json()

    route = (data.get("routes") or [{}])[0]
    legs = route.get("legs") or []
    steps = []
    for leg in legs:
        for st in (leg.get("steps") or []):
            steps.append({
                "instruction": (st.get("navigationInstruction") or {}).get("instructions"),
                "distance": st.get("distanceMeters"),
                "duration": _parse_duration(st.get("duration")),
            })

    return {
        "distanceMeters": route.get("distanceMeters") or 0,
        "duration": _parse_duration(route.get("duration")),
        "polyline": route.get("polyline", {}).get("encodedPolyline", ""),
        "steps": steps,
        "fare": route.get("travelAdvisory", {}).get("transitFare"),
    }