import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { UserReservations } from "../../types/User_Reservation";
import Skeleton from "react-loading-skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import MapComponent from "../../features/map/MapComponent";
import CreatePlaceMarker from "../../features/map/CreatePlaceMarker";
import type { PlaceInfo } from "../../types/Recommendation";
import { getRouteByHotelName, type RouteResponse } from "../../types/Route";
import { drawEncodedPolylineOnMap } from "../../features/map/drawRoute";
import { ArrowLeft, X } from "lucide-react";
import PaymentModal from '../../features/payment/modals/PaymentModal'; // ADDED THIS IMPORT

function ReservationAccommodations() {
    const [reservationHotels, setReservationHotels] = useState<UserReservations[]>([]);
    const [loading, setLoading] = useState(false);
    const [skeletonCount, setSkeletonCount] = useState(5);
    const [selectedData, setSelectedData] = useState<UserReservations | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<PlaceInfo | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    const [placeData, setPlaceData] = useState<{ restaurants: PlaceInfo[]; attractions: PlaceInfo[] } | null>(null);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const { validateAccessToken } = useAuth();
    const navigate = useNavigate();

    const fetchReservations = useCallback(async () => {
        setLoading(true);
        const token = await validateAccessToken();
        if (!token) return;
        try {
            const res = await fetch("/api/fastapi/get-user-reservation-data", {
                method: "GET",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
            const data = await res.json();
            console.log("API 응답 데이터:", data);
            setReservationHotels(data);
            setSkeletonCount(data.length > 0 ? data.length : 5);
        } catch (err) {
            console.error("예약 정보 가져오기 실패:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getHotelLocation = async (accommodationId: number) => {
        try {
            const res = await fetch(`/api/fastapi/get-hotel-location`, {
                method: "GET",
                headers: { "accommodation-id": accommodationId.toString() },
            });
            if (!res.ok) throw new Error("위치찾기 실패!");
            const hotelData = await res.json();
            const getRecommandedPlace = await fetch(
                `/api/places/recommendations?hotelName=${encodeURIComponent(hotelData.name)}&region=${encodeURIComponent(hotelData.address)}`
            );
            if (!getRecommandedPlace.ok) throw new Error("추천 장소 요청 실패");
            const result = await getRecommandedPlace.json();
            setPlaceData(result);
        } catch (err) {
            console.log(err);
        }
    };

    const favoriteModalToDetailPage = async () => {
        if (!selectedData) return;
        navigate(`/detail/${selectedData.accommodation.hotel_no}`);
    };

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    useEffect(() => {
        // Clean up old markers before creating new ones
        markers.forEach(marker => marker.setMap(null));

        if (!mapInstance || !placeData) {
            setMarkers([]);
            return;
        }

        const createdMarkers: any[] = [];
        const newBounds = new window.google.maps.LatLngBounds();

        const addMarker = (place: PlaceInfo) => {
            const marker = CreatePlaceMarker(place, mapInstance, () => setSelectedPlace(place));
            if (marker) {
                marker.placeName = place.name;
                createdMarkers.push(marker);
                newBounds.extend(new window.google.maps.LatLng(place.latitude, place.longitude));
            }
        };

        if (selectedPlace) {
            // If a place is selected, only show that marker
            addMarker(selectedPlace);
        } else {
            // Otherwise, show all markers
            placeData.restaurants.forEach(addMarker);
            placeData.attractions.forEach(addMarker);
        }

        setMarkers(createdMarkers);

        if (!newBounds.isEmpty()) {
            mapInstance.fitBounds(newBounds);
        }

        if (selectedPlace) {
            mapInstance.setCenter({ lat: selectedPlace.latitude, lng: selectedPlace.longitude });
            mapInstance.setZoom(15);
        }

        return () => {
            createdMarkers.forEach(marker => marker.setMap(null));
        };
    }, [mapInstance, placeData, selectedPlace]);

    const formatDuration = (seconds: number) => {
        if (seconds < 60) {
            return `${seconds}초`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}분 ${remainingSeconds}초`;
    };

    const [routeInfo, setRouteInfo] = useState<RouteResponse | null>(null);
    const routePolylineRef = useRef<google.maps.Polyline | null>(null);

    const requestRoute = useCallback(async () => {
        if (!selectedData || !selectedPlace || !mapInstance) {
            alert("먼저 호텔과 장소를 선택하세요.");
            return;
        }
        try {
            const result = await getRouteByHotelName({
                hotelName: selectedData.accommodation.name,
                region: selectedData.accommodation.region || selectedData.accommodation.address || '',
                destLat: selectedPlace.latitude,
                destLng: selectedPlace.longitude,
                mode: 'walking',
            });
            if (routePolylineRef.current) {
                routePolylineRef.current.setMap(null);
            }
            if (result.polyline) {
                routePolylineRef.current = drawEncodedPolylineOnMap(mapInstance, result.polyline);
                const bounds = new window.google.maps.LatLngBounds();
                google.maps.geometry.encoding.decodePath(result.polyline).forEach((latLng) => bounds.extend(latLng));
                mapInstance.fitBounds(bounds);
            }
            setRouteInfo(result);
        } catch (err) {
            console.error(err);
            alert("경로 계산 실패");
        }
    }, [selectedData, selectedPlace, mapInstance]);

    useEffect(() => {
        if (isMapExpanded && selectedPlace) {
            requestRoute();
        }
    }, [isMapExpanded, selectedPlace]);

    const deleteButtonClick = async () => {
        if (!selectedData) return;
        const confirmDelete = window.confirm("정말로 이 예약을 취소하시겠습니까?");
        if (!confirmDelete) return;

        try {
            const token = await validateAccessToken();
            if (!token) {
                alert("로그인이 필요합니다");
                return;
            }
    
            const res = await fetch("/api/fastapi/delete-reservation", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ u_booking_id: selectedData.u_booking_id }),
            });
    
            if (res.ok) {
                alert(" 예약이 삭제되었습니다!");
                resetAndClose();
                fetchReservations();
            } else {
                const errorData = await res.json().catch(() => null);
                console.error("예약 삭제 실패:", errorData);
                alert(` 예약 삭제 실패: ${errorData?.detail || '서버 오류'}`);
            }
        } catch (error) {
            console.error("예약 삭제 중 오류 발생:", error);
            alert("예약 삭제 중 오류가 발생했습니다.");
        }
    };
    
    const handlePaymentModalClose = (isSuccess: boolean) => {
        setIsPaymentModalOpen(false);
        if (isSuccess) {
            fetchReservations();
        }
    };

    const resetAndClose = () => {
        setSelectedData(null);
        setShowDetail(false);
        setPlaceData(null);
        setSelectedPlace(null);
        setIsMapExpanded(false);
        setRouteInfo(null);
        setIsPaymentModalOpen(false);
    };

    const PlaceItem = ({ place }: { place: PlaceInfo }) => (
        <div
            className={`border p-3 rounded-lg mb-2 cursor-pointer transition-all ${selectedPlace?.name === place.name ? 'bg-blue-50 border-blue-400 shadow-md' : 'hover:bg-gray-50'}`}
            onClick={() => setSelectedPlace(place)}
        >
            <b className="text-base">{place.name}</b>
            <br />
            <span className="text-sm text-gray-600">평점: {place.rating} / 리뷰: {place.reviewCount}</span>
            {selectedPlace?.name === place.name && (
                <div className="mt-3 text-center">
                    {place.website && (
                        <a
                            href={place.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm mr-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            웹사이트 방문
                        </a>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMapExpanded(true);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm shadow hover:bg-green-600"
                    >
                        경로 및 지도 보기
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div>
            {/* <h2 className="text-2xl font-bold mb-4">예약한 숙소 목록</h2> */}
            {loading ? (
                Array.from({ length: skeletonCount }).map((_, idx) => (
                    <div key={idx} className="w-[95%] mb-4"><Skeleton height={100} baseColor="#e0e0e0" highlightColor="#f5f5f5" className="rounded-xl" /></div>
                ))
            ) : (
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    {reservationHotels.map((hotel) => (
                        <div key={hotel.reservation_id} onClick={() => { setSelectedData(hotel); }}>
                            <div className="flex flex-row bg-gray-100 cursor-pointer m-2 gap-4 hover:bg-neutral-200 rounded-xl border p-4 justify-between items-center">
                                <div className="w-[40%] min-w-[120px] rounded-xl overflow-hidden">
                                    <img src={hotel.accommodation.image_url ?? undefined} className="w-full h-[160px] object-cover rounded-xl" />
                                </div>
                                <div className="text-right mr-5 space-y-2">
                                    <h3 className="font-semibold">{hotel.accommodation.name}</h3>
                                    <p className="text-sm">{hotel.accommodation.address}</p>
                                    <p className="text-xs"><b>チェックイン日</b>: {hotel.check_in_date}</p>
                                    <p className="text-xs"><b>チェックアウト日</b>: {hotel.check_out_date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedData && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                        onClick={resetAndClose}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className={`bg-white rounded-xl p-6 shadow-xl relative flex flex-col transition-all duration-500 ease-in-out ${!showDetail ? "w-[90%] max-w-md" : isMapExpanded ? "w-[90%] max-w-5xl" : "w-[90%] max-w-lg"}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={resetAndClose} className="absolute top-3 right-3 text-gray-500 hover:text-black z-10"><X size={20}/></button>
                            
                            {!showDetail ? (
                                <>
                                    <h2 className="text-2xl font-bold mb-3">{selectedData.accommodation.name}</h2>
                                    <img src={selectedData.accommodation.image_url ?? undefined} alt={selectedData.accommodation.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                                    <div className="flex justify-between gap-2">
                                        <button onClick={favoriteModalToDetailPage} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">ホテル情報</button>
                                        <button onClick={() => { setShowDetail(true); getHotelLocation(selectedData.accommodation.accommodation_id); }} className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600">おすすめスポット</button>
                                        <button onClick={deleteButtonClick} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">キャンセル</button>
                                        {selectedData.status === 'PENDING_PAYMENT' ? (
                                            <button onClick={() => setIsPaymentModalOpen(true)} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">お支払い</button>
                                        ) : selectedData.status === 'COMPLETED' ? (
                                            <button className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed" disabled>支払い完了</button>
                                        ) : null}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { setShowDetail(false); setPlaceData(null); setSelectedPlace(null); setIsMapExpanded(false); }} className="mb-3 flex items-center gap-1 text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md"><ArrowLeft size={16}/> 뒤로가기</button>
                                    <div className={`flex gap-4 ${isMapExpanded ? 'flex-row' : 'flex-col'}`}>
                                        <div className={`${isMapExpanded ? 'w-1/2' : 'w-full'}`}>
                                            <h3 className="text-xl font-semibold mb-3">おすすめスポット</h3>
                                            <div className={`overflow-y-auto text-sm space-y-2 pr-2 ${isMapExpanded ? 'max-h-[65vh]' : 'max-h-[40vh]'}`}>
                                                {placeData ? (
                                                    <>
                                                        <div>
                                                            <h4 className="font-bold text-base mb-2">🍴 飲食店</h4>
                                                            {placeData.restaurants.map((r) => <PlaceItem key={r.name} place={r} />)}
                                                        </div>
                                                        <div className="mt-4">
                                                            <h4 className="font-bold text-base mb-2">🏞 観光地</h4>
                                                            {placeData.attractions.map((a) => <PlaceItem key={a.name} place={a} />)}
                                                        </div>
                                                    </>
                                                ) : <Skeleton count={8} height={60} className="rounded-lg" />}
                                            </div>
                                        </div>

                                        {isMapExpanded && (
                                            <div className="w-1/2 h-[70vh]">
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="h-full flex flex-col rounded-lg overflow-hidden border">
                                                    <div className="w-full h-1/2 grow">
                                                        {selectedPlace ? (
                                                            <MapComponent center={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }} onMapLoad={setMapInstance} />
                                                        ) : <Skeleton height="100%" />}
                                                    </div>
                                                    <div className="p-4 bg-gray-50">
                                                        <h4 className="font-semibold text-sm">経路探索: {selectedPlace?.name}</h4>
                                                        {routeInfo && (
                                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs p-2 bg-gray-200 rounded space-y-2">
                                                                <p><b>예상 시간</b>: {formatDuration(routeInfo.duration)}</p>
                                                                <details className="text-xs">
                                                                    <summary className="cursor-pointer">データ</summary>
                                                                    <pre className="mt-2 p-2 bg-gray-800 text-white rounded-md text-[10px] max-h-40 overflow-auto">
                                                                        {JSON.stringify(routeInfo, null, 2)}
                                                                    </pre>
                                                                </details>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isPaymentModalOpen && selectedData && (
              <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={handlePaymentModalClose}
                reservationId={selectedData.reservation_id}
              />
            )}
        </div>
    );
}

export default ReservationAccommodations;
