import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import type { AccommodationOut, AccSlideProps } from "../../../types/HotelList";
import type SwiperCore from "swiper";

import ReviewAverage from "./icons/reviewAverage";
import SkeletonCard from "./SkeletonCard";
import WishListButton from "./icons/WishListButton";
import { useAuth } from "../../../contexts/AuthContext";

function AccSlide({ hotelList, onHotelClick }: AccSlideProps) {
    const [data, setData] = useState<AccommodationOut[]>([]);
    const swiperRef = useRef<SwiperCore | null>(null);
    const slideCount = 5;

    const handleMouseEnter = () => swiperRef.current?.autoplay?.stop();
    const handleMouseLeave = () => swiperRef.current?.autoplay?.start();

    const { validateAccessToken, isLoggedIn, user } = useAuth();
    const [favoriteMap, setFavoriteMap] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (!isLoggedIn || !user) return;
        if (!hotelList || hotelList.length === 0) return;

        const checkFavorites = async () => {
            await validateAccessToken();

            const results: Record<number, boolean> = {};
            for (const hotel of hotelList) {
                if (!hotel.id) continue;
                try {
                    const res = await fetch(
                        `http://localhost:8000/api/v1/favorites/check/${hotel.id}?user_id=${user.id}`
                    );
                    results[hotel.id] = res.ok && (await res.json()) === true;
                } catch (err) {
                    console.error("찜 상태 확인 실패:", err);
                }
            }

            setFavoriteMap(results);
        };

        checkFavorites();
    }, [hotelList, isLoggedIn, user, validateAccessToken]);

    useEffect(() => {
        setData(hotelList);
    }, [hotelList]);

    const toggleFavorite = async (hotelId: number) => {
        if (!isLoggedIn || !user) return;

        try {
            await validateAccessToken();

            const isCurrentlyFavorite = favoriteMap[hotelId] === true;

            if (isCurrentlyFavorite) {
                // 찜 해제
                const res = await fetch(
                    `http://localhost:8000/api/v1/favorites/delete?user_id=${user.id}&accommodation_id=${hotelId}`,
                    { method: "DELETE" }
                );
                if (!res.ok) throw new Error("찜 해제 실패");

                setFavoriteMap((prev) => ({
                    ...prev,
                    [hotelId]: false,
                }));
            } else {
                // 찜 등록
                const res = await fetch("http://localhost:8000/api/v1/favorites", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        accommodation_id: hotelId,
                    }),
                });
                if (!res.ok) throw new Error("찜 등록 실패");

                setFavoriteMap((prev) => ({
                    ...prev,
                    [hotelId]: true,
                }));
            }
        } catch (err) {
            console.error("찜 처리 중 오류:", err);
        }
    };

    useEffect(() => {
        const fetchFavoriteMap = async () => {
            if (!user || !isLoggedIn) return;

            try {
                await validateAccessToken();
                const res = await fetch(`http://localhost:8000/api/v1/favorites/user/${user.id}`);
                const data = await res.json();

                const map: Record<number, boolean> = {};
                data.forEach((fav: { accommodation_id: number }) => {
                    map[fav.accommodation_id] = true;
                });
                setFavoriteMap(map);
            } catch (e) {
                console.error("찜 여부 로딩 실패:", e);
            }
        };

        fetchFavoriteMap();
    }, [user, isLoggedIn, validateAccessToken]);

    const showSkeleton = data.length === 0;

    return (
        <div
            className="w-full p-3 rounded-xl overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                slidesPerView={slideCount}
                spaceBetween={10}
                loop={true}
                modules={[Autoplay]}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                className="w-full h-full"
            >
                {showSkeleton
                    ? Array.from({ length: slideCount }).map((_, idx) => (
                        <SwiperSlide key={idx} className="flex justify-center items-center cursor-pointer">
                            <SkeletonCard />
                        </SwiperSlide>
                    ))
                    : data.map((hotel) => (
                        <SwiperSlide
                            key={hotel.id}
                            className="flex justify-center items-center cursor-pointer"
                            onClick={() => onHotelClick?.(hotel)}
                        >
                            <div className="flex flex-col justify-center max-w-[220px] items-center h-[80%] w-full rounded-xl no-drag hover:shadow-xl">
                                {hotel.image_url ? (
                                    <div className="relative w-full h-60 overflow-hidden rounded-xl">
                                        <img
                                            src={hotel.image_url}
                                            alt={hotel.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3 z-10">
                                            <WishListButton
                                                hotelId={hotel.accommodation_id}
                                                isFavorite={favoriteMap[hotel.accommodation_id]}
                                                onToggle={(id) => {
                                                    console.log("호텔 ID:", id);
                                                    toggleFavorite(id);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-60 overflow-hidden rounded-xl bg-gray-200 flex items-center justify-center">
                                        <div className="text-gray-400">イメージがありません</div>
                                    </div>
                                )}
                                <div className="flex flex-col items-center gap-1 p-2 text-center">
                                    <span className="genmaru font-bold text-black text-sm">
                                        {hotel.address}のホテル
                                    </span>
                                    <div className="text-sm text-gray-700">
                                        <ReviewAverage /> {hotel.review_average?.toFixed(2) ?? 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        ¥{hotel.charge.toLocaleString()} /1泊の料金
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
}

export default AccSlide;
