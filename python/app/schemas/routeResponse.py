from pydantic import BaseModel

class RouteResponse(BaseModel):
    distanceMeters: int
    duration: int
    polyline: str
    steps: list[dict] = []
    fare: dict | None = None