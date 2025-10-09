import type { PlaceInfo } from "../../types/Recommendation";

let GoogleOverlayView: typeof google.maps.OverlayView;

export default function createPlaceMarker(
    place: PlaceInfo,
    map: google.maps.Map,
    onClick: (place: PlaceInfo) => void
) {
    if (!GoogleOverlayView) {
        GoogleOverlayView = class extends window.google.maps.OverlayView { };
    }

    class PlaceMarker extends GoogleOverlayView {
        div: HTMLDivElement | null = null;
        placeName?: string;

        onAdd() {
            this.div = document.createElement("div");
            this.div.className = "price-marker";
            this.div.innerText = place.name;

            this.div.addEventListener("click", () => {
                onClick(place);
                console.log("place 전달 확인!", place)
            });

            const panes = this.getPanes();
            panes?.overlayMouseTarget.appendChild(this.div);
        }

        draw() {
            if (!this.div) return;

            const point = this.getProjection().fromLatLngToDivPixel(
                new window.google.maps.LatLng(place.latitude, place.longitude)
            );

            if (point && this.div.style) {
                this.div.style.left = `${point.x}px`;
                this.div.style.top = `${point.y}px`;
                this.div.style.position = "absolute";
                this.div.style.transform = "translate(-50%, -100%)";
            }
        }

        onRemove() {
            if (this.div?.parentNode) {
                this.div.parentNode.removeChild(this.div);
            }
            this.div = null;
        }
    }

    const marker = new PlaceMarker();
    marker.setMap(map);
    return marker;
}