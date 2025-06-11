import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay } from "swiper/modules";
import type { HotelBasicInfo, AccSlideProps } from "../../../types/HotelList";
import ReviewAverage from "./icons/reviewAverage";
import { useEffect, useRef, useState } from "react";
import SkeletonCard from "./SkeletonCard";
import WishListButton from "./icons/WishListButton";
import type SwiperCore from 'swiper';

function AccSlide({ hotelList }: AccSlideProps) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([])
    const [skeletonCount, setSkeletonCount] = useState(5)
    const slideCount = 5;

    const swiperRef = useRef<SwiperCore | null>(null); // Swiper 인스턴스 담을 ref

    const handleMouseEnter = () => {
        swiperRef.current?.autoplay?.stop();
    };

    const handleMouseLeave = () => {
        swiperRef.current?.autoplay?.start();
    };

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            setSkeletonCount(slideCount)
            setData(hotelList);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [])

    const processedHotels = data
        .map((wrapper) => {
            const hotelArray = wrapper.hotel;

            const basicInfo = hotelArray.find((h) => h.hotelBasicInfo)?.hotelBasicInfo;
            const total = hotelArray.find((h) => h.roomInfo)?.roomInfo?.[0]?.dailyCharge?.total;

            if (!basicInfo) return null;

            return {
                ...basicInfo,
                totalCharge: total ?? null
            };
        })
        .filter((h): h is HotelBasicInfo & { totalCharge: number | null } => !!h);
    return (
        <div 
            className="w-full p-3 bg-rgb(245,242,236) rounded-xl overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            >
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                slidesPerView={5}
                spaceBetween={10}
                loop={true}
                modules={[Autoplay]}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                className="w-full h-full"
            >
                {loading
                    ? Array.from({ length: skeletonCount }).map((_, idx) => (
                        <SwiperSlide key={idx} className="flex justify-center items-center cursor-pointer">
                            <SkeletonCard />
                        </SwiperSlide>
                    ))
                    : processedHotels.map((hotel, idx) => (
                        <SwiperSlide
                            key={hotel?.hotelNo ?? idx}
                            className="flex justify-center items-center cursor-pointer"
                            // onClick={() => navigate(`/detail/${hotel.hotelNo}`)}
                        >
                            <div className="flex flex-col justify-center max-w-[220px] items-center h-[80%] w-full rounded-xl no-drag hover:shadow-xl">
                                {hotel.hotelImageUrl ? (
                                    <div className="relative w-full h-60 overflow-hidden rounded-xl">
                                        <img
                                            src={hotel.hotelImageUrl}
                                            alt={hotel.hotelName}
                                            className="w-full h-full object-cover" />
                                        <div className="absolute top-3 right-3 z-10">
                                            <WishListButton hotelNo={hotel.hotelNo} />
                                        </div>
                                    </div>

                                ) : (
                                    <div className="text-gray-400">イメージがありません</div>
                                )}
                                <div className="flex flex-col items-center gap-1 p-2 text-center">
                                    <span className="genmaru font-bold text-black text-sm">
                                        {hotel.address1}のホテル
                                    </span>
                                    <div className="text-sm text-gray-700">
                                        <ReviewAverage /> {hotel.reviewAverage}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        ¥{hotel.totalCharge?.toLocaleString() ?? "不明"} /1泊の料金
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div >
    );
}

export default AccSlide