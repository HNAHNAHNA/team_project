import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { UserReservations } from "../../types/User_Reservation";
import Skeleton from "react-loading-skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import MapComponent from "../../features/map/MapComponent";
import type { PlaceInfo } from "../../types/Recommendation";
import CreatePlaceMarker from "../../features/map/CreatePlaceMarker";

function ReservationAccommodations() {
    const [reservationHotels, setReservationHotels] = useState<UserReservations[]>([]);
    const [loading, setLoading] = useState(false);
    const [skeletonCount, setSkeletonCount] = useState(5);
    const [selectedData, setSelectedData] = useState<UserReservations | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(null);
    const [placeData, setPlaceData] = useState<{ restaurants: PlaceInfo[]; attractions: PlaceInfo[] } | null>(null);
    const { validateAccessToken } = useAuth();
    const navigate = useNavigate();

    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

    const fetchReservations = useCallback(async () => {
        setLoading(true);
        const token = await validateAccessToken();
        if (!token) return;

        try {
            const res = await fetch("/api/fastapi/get-user-reservation-data", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
            const data = await res.json();
            setReservationHotels(data);
            setSkeletonCount(data.length);
        } catch (err) {
            console.error("예약 정보 가져오기 실패:", err);
        } finally {
            setLoading(false);
        }
    }, [validateAccessToken]);

    const getHotelLocation = async (accommodationId: number) => {
        try {
            const res = await fetch("/api/fastapi/get-hotel-location", {
                method: "GET",
                headers: {
                    "accommodation-id": accommodationId.toString(),
                },
            });

            if (!res.ok) throw new Error("위치찾기 실패!!");

            const hotelData = await res.json();
            const hotelName = hotelData.name;
            const hotelAddress = hotelData.address;

            const getRecommandedPlace = await fetch(
                `/api/places/recommendations?hotelName=${encodeURIComponent(hotelName)}&region=${encodeURIComponent(hotelAddress)}`
            );

            if (!getRecommandedPlace.ok) throw new Error("추천 장소 요청 실패");

            const result = await getRecommandedPlace.json();
            console.log("추천 장소 : ", result);

            setPlaceData(result);

            if (result.restaurants?.[0]) {
                setMapCenter({
                    lat: result.restaurants[0].latitude,
                    lng: result.restaurants[0].longitude,
                });
            }
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
        if (mapInstance && placeData) {
            [...placeData.restaurants, ...placeData.attractions].forEach((place) => {
                CreatePlaceMarker(place, mapInstance, (clicked) => {
                    console.log("✅ 마커 클릭됨:", clicked.name);
                });
            });
        }
    }, [mapInstance, placeData]);

    const deleteButtonClick = async () => {
        const confirmDelete = window.confirm("정말로 이 예약을 취소하시겠습니까?");
        if (!confirmDelete) return;

        const accessToken = localStorage.getItem("accessToken");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!accessToken) {
            alert("로그인이 필요합니다");
            return;
        }
        console.log(selectedData?.accommodation.checkin_time)
        const res = await fetch("/api/fastapi/delete-reservation", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user.userId,
                accommodation_id: selectedData?.accommodation.accommodation_id,
                check_in_date: selectedData?.check_in_date,
            }),
        });

        let data;
        const isJson = res.headers.get("content-type")?.includes("application/json");

        if (isJson) {
            data = await res.json();
        } else {
            data = await res.text(); // 내부 서버 에러 메시지
        }

        if (res.ok) {
            alert("✅ 예약이 삭제되었습니다");
            setSelectedData(null);
            setShowDetail(false);
            setMapCenter(null);
            setPlaceData(null);

            // ✅ 호텔 목록 다시 불러오기
            fetchReservations();
        } else {
            console.error("예약 삭제 실패:", data);
            alert("❌ 예약 삭제 실패");
        }

        setShowDetail(false);
    };

    return (
        <div>
            <h2>예약한 숙소 목록</h2>
            {loading ? (
                Array.from({ length: skeletonCount }).map((_, idx) => (
                    <div key={idx} className="w-[95%] mb-4">
                        <Skeleton height={100} baseColor="#e0e0e0" highlightColor="#f5f5f5" className="rounded-xl" />
                    </div>
                ))
            ) : (
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    {reservationHotels.map((hotel) => (
                        <div key={hotel.reservation_id} onClick={() => {
                            setSelectedData(hotel);
                            setShowDetail(false);
                            setMapCenter(null);
                            setPlaceData(null);
                        }}>
                            <div className="flex flex-row bg-gray-300 cursor-pointer m-2 gap-4 hover:bg-neutral-300 rounded-xl border-1 justify-between items-center p-4">
                                <div className="w-[40%] min-w-[120px] rounded-xl p-2 overflow-hidden">
                                    <img
                                        src={hotel.accommodation.image_url ?? undefined}
                                        className="w-full h-[160px] object-cover rounded-xl"
                                    />
                                </div>
                                <div className="text-right mr-5 space-y-2">
                                    <h3>{hotel.accommodation.name}</h3>
                                    <p>{hotel.accommodation.address}</p>
                                    <p><b>チェックイン</b>: {hotel.check_in_date}</p>
                                    <p><b>チェックアウト</b>: {hotel.check_out_date}</p>
                                    <p><b>予約ID</b>: {hotel.u_booking_id}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                        onClick={() => {
                            setSelectedData(null);
                            setShowDetail(false);
                            setMapCenter(null);
                            setPlaceData(null);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className={`bg-white rounded-xl p-6 shadow-xl relative flex flex-row transition-all duration-500 ease-in-out ${showDetail ? "w-[90%] max-w-5xl" : "w-[90%] max-w-md"
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex-1">
                                <button
                                    onClick={() => {
                                        setSelectedData(null);
                                        setShowDetail(false);
                                        setMapCenter(null);
                                        setPlaceData(null);
                                    }}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-black cursor-pointer hover:shadow-md hover:bg-neutral-100"
                                >
                                    ❌
                                </button>

                                {!showDetail ? (
                                    <>
                                        <h2 className="text-2xl font-bold mb-3">{selectedData.accommodation.name}</h2>
                                        <img
                                            src={selectedData.accommodation.image_url ?? undefined}
                                            alt={selectedData.accommodation.name}
                                            className="w-full h-48 object-cover rounded mb-4"
                                        />
                                        <div className="flex flex-row justify-between">
                                            <button onClick={favoriteModalToDetailPage} className="mr-3 bg-blue-500 text-white px-3 py-1 rounded">ホテル情報</button>
                                            <button
                                                onClick={() => {
                                                    setShowDetail(true);
                                                    setMapCenter(null);
                                                    setPlaceData(null);
                                                    getHotelLocation(selectedData.accommodation.accommodation_id);
                                                }}
                                                className="bg-green-500 text-white px-3 py-1 rounded"
                                            >
                                                周り探索
                                            </button>
                                            <button
                                                className="bg-black/70 text-white px-3 py-1 rounded"
                                                onClick={deleteButtonClick}>
                                                予約キャンセル
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setShowDetail(false);
                                                setMapCenter(null);
                                                setPlaceData(null);
                                            }}
                                            className="mb-2 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                                        >
                                            ← 뒤로가기
                                        </button>
                                        <h3 className="text-lg font-semibold mb-2">주변 추천 장소</h3>
                                        <div className="max-h-[300px] overflow-y-auto text-sm space-y-2 pr-2">
                                            {placeData ? (
                                                <>
                                                    <div>
                                                        <h4 className="font-semibold">🍴 음식점</h4>
                                                        {placeData.restaurants.map((r: any, idx: number) => (
                                                            <div key={`r-${idx}`} className="border p-2 rounded mb-2">
                                                                <b>{r.name}</b><br />
                                                                평점: {r.rating} / 리뷰: {r.reviewCount}<br />
                                                                {r.review}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">🏞 관광지</h4>
                                                        {placeData.attractions.map((a: any, idx: number) => (
                                                            <div key={`a-${idx}`} className="border p-2 rounded mb-2">
                                                                <b>{a.name}</b><br />
                                                                평점: {a.rating} / 리뷰: {a.reviewCount}<br />
                                                                {a.review}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <Skeleton count={5} height={80} className="rounded" />
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {showDetail && (
                                <div className="ml-4 w-1/2 h-[400px] transition-opacity duration-500 ease-in-out">
                                    {mapCenter ? (
                                        <MapComponent
                                            center={mapCenter}
                                            onMapLoad={(map) => {
                                                console.log("Map loaded!", map);
                                                setMapInstance(map);
                                            }}
                                        />
                                    ) : (
                                        <Skeleton height="100%" />
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ReservationAccommodations;