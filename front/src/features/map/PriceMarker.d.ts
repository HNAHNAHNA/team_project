import type { AccommodationOut } from "../../types/HotelList";
export default function createPriceMarker(hotel: AccommodationOut, map: google.maps.Map, onClick: (hotel: AccommodationOut) => void): {
    div: HTMLDivElement | null;
    onAdd(): void;
    draw(): void;
    onRemove(): void;
    getMap(): google.maps.Map | null | google.maps.StreetViewPanorama;
    getPanes(): google.maps.MapPanes | null;
    getProjection(): google.maps.MapCanvasProjection;
    setMap(map: google.maps.Map | null | google.maps.StreetViewPanorama): void;
    addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
    bindTo(key: string, target: google.maps.MVCObject, targetKey?: string | null, noNotify?: boolean): void;
    get(key: string): any;
    notify(key: string): void;
    set(key: string, value: unknown): void;
    setValues(values?: object | null): void;
    unbind(key: string): void;
    unbindAll(): void;
};
