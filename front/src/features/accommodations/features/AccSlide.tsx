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

function AccSlide({ hotelList, onHotelClick }: AccSlideProps) {
    // const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AccommodationOut[]>([]);
    const swiperRef = useRef<SwiperCore | null>(null);
    const slideCount = 5;

    const handleMouseEnter = () => swiperRef.current?.autoplay?.stop();
    const handleMouseLeave = () => swiperRef.current?.autoplay?.start();

    useEffect(() => {
        setData(hotelList);
        // setLoading(false); 
    }, [hotelList]);

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
                {showSkeleton // data.length가 0일 때 스켈레톤 표시
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
                                            <WishListButton hotelNo={hotel.id} />
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