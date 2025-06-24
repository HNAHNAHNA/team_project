import type { AccommodationOut } from "../../types/HotelList";

let GoogleOverlayView: typeof google.maps.OverlayView;

export default function createPriceMarker(
    hotel: AccommodationOut,
    map: google.maps.Map,
    onClick: (hotel: AccommodationOut) => void
) {
    if (!GoogleOverlayView) {
        GoogleOverlayView = class extends window.google.maps.OverlayView { };
    }

    class PriceMarker extends GoogleOverlayView {
        div: HTMLDivElement | null = null;

        onAdd() {
            this.div = document.createElement("div");
            this.div.className = "price-marker";
            this.div.innerText = `${hotel.charge.toLocaleString()}￥`;

            this.div.addEventListener("click", () => {
                onClick(hotel);
            });

            const panes = this.getPanes();
            panes?.overlayMouseTarget.appendChild(this.div);
        }

        draw() {
            if (!this.div) return;

            const point = this.getProjection().fromLatLngToDivPixel(
                new window.google.maps.LatLng(hotel.latitude, hotel.longitude)
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

    const marker = new PriceMarker();
    marker.setMap(map);
}