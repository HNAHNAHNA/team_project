import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { UserReservations } from "../../types/Reservation";
import Skeleton from "react-loading-skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";

function ReservationAccommodations() {
    const [reservationHotels, setReservationHotels] = useState<UserReservations[]>([]);
    const [loading, setLoading] = useState(false);
    const [skeletonCount, setSkeletonCount] = useState(5);
    const [selectedData, setSelectedData] = useState(null);
    const { validateAccessToken } = useAuth();
    const navigate = useNavigate();

    const favoriteModalToDetailPage = async () => {
        console.log("👉 selectedData:", selectedData);
        console.log("👉 accommodation_id:", selectedData?.accommodation?.accommodation_id);
        const res = await fetch(`http://localhost:8000/api/v1/favorites/hotel-no?accommodation_id=${selectedData.accommodation.accommodation_id}`);
        const data = await res.json();
        navigate(`/detail/${data.hotel_no}`);
    }

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true)
            const token = await validateAccessToken(); // ✅ 만료되었으면 재발급도 자동
            if (!token) {
                console.warn("로그인 정보 없음 또는 토큰 만료");
                return;
            }

            try {
                const res = await fetch("http://localhost:8000/get-user-reservation-data", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // ✅ 핵심
                    },
                });

                if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
                const data = await res.json();
                setReservationHotels(data);
                setSkeletonCount(data.length)
                setLoading(false)
                console.log("우왕 불러오기 완룡!!")
            } catch (err) {
                console.error("예약 정보 가져오기 실패:", err);
            }
        };

        fetchReservations();
    }, [validateAccessToken]);

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
                    {reservationHotels.map(hotel => {
                        return (
                            <div key={hotel.reservation_id} onClick={() => setSelectedData(hotel)}>
                                <div className="">
                                    <div className="flex flex-row bg-gray-300 cursor-pointer m-2 gap-4 hover:bg-neutral-300 rounded-xl border-1 justify-between items-center p-4 ">
                                        <div className="w-[40%] min-w-[120px] rounded-xl p-2 overflow-hidden">
                                            <img src={hotel.accommodation.image_url}
                                                className="w-full h-[160px] object-cover rounded-xl" />
                                        </div>
                                        <div className="text-right mr-5 space-y-2">
                                            <h3>{hotel.accommodation.name}</h3>
                                            <p>{hotel.accommodation.address}</p>
                                            <p><b>チェックイン</b> : {hotel.check_in_date}</p>
                                            <p><b>チェックアウト</b> : {hotel.check_out_date}</p>
                                            <p><b>予約ID</b> : {hotel.u_booking_id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            <div>
                <AnimatePresence>
                    {selectedData && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                            onClick={() => setSelectedData(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedData(null)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-black cursor-pointer hover:shadow-md hover:bg-neutral-100"
                                >
                                    ❌
                                </button>

                                <h2 className="text-2xl font-bold mb-3">{selectedData.accommodation.name}</h2>
                                <img
                                    src={selectedData.accommodation.image_url}
                                    alt={selectedData.accommodation.name}
                                    className="w-full h-48 object-cover rounded mb-4"
                                />
                                <div
                                    className=""
                                    onClick={() => {
                                        if (selectedData) favoriteModalToDetailPage();
                                    }}
                                >
                                    ホテル情報
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
}

export default ReservationAccommodations;