declare const MapComponent: ({ center, onMapLoad }: {
    center: google.maps.LatLngLiteral;
    onMapLoad: (map: google.maps.Map) => void;
}) => import("react/jsx-runtime").JSX.Element;
export default MapComponent;
