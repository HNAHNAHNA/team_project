import type { PlaceInfo } from "../../types/Recommendation";
export default function createPlaceMarker(place: PlaceInfo, map: google.maps.Map, onClick: (place: PlaceInfo) => void): void;
