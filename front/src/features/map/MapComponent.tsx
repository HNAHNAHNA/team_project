import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const LIBRARIES: ("places")[] = ["places"];

const MapComponent = ({
    center,
    onMapLoad
}: {
    center: google.maps.LatLngLiteral;
    onMapLoad: (map: google.maps.Map) => void;
}) => {
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_API_KEY,
       libraries: LIBRARIES,
    });

    if (loadError) return <div>지도를 불러오는데 실패했습니다.</div>;
    if (!isLoaded) return <div>지도 로딩 중...</div>;

    return (
        <GoogleMap
            center={center}
            zoom={14}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            onLoad={onMapLoad}
            options={{ gestureHandling: "greedy" }}
        >
        </GoogleMap>
    );
};
export default MapComponent
