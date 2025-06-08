import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay } from "swiper/modules";
import type { HotelList, HotelBasicInfo, HotelWrapper } from "../../../types/HotelList";
import ReviewAverage from "./icons/reviewAverage";
import { useNavigate } from "react-router-dom";

function AccSlide({ hotelList }: AccSlideProps) {
    const navigate = useNavigate();

    const processedHotels  = hotelList
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
        <div className="w-full h-[35rem] bg-rgb(245,242,236) rounded-xl overflow-hidden">
            <Swiper
                slidesPerView={5}
                spaceBetween={10}
                loop={true}
                modules={[Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className="w-full h-full"
            >
                {processedHotels.map((hotel, idx) => (
                    <SwiperSlide
                        key={hotel?.hotelNo ?? idx}
                        className="flex justify-center items-center cursor-pointer"
                        onClick={() => navigate(`/detail/${hotel.hotelNo}`)}
                    >
                        <div className="flex flex-col justify-center items-center h-[80%] w-full rounded-xl no-drag hover:shadow-xl">
                            {hotel.hotelImageUrl ? (
                                <img
                                    src={hotel.hotelImageUrl}
                                    alt={hotel.hotelName}
                                    className="h-[80%] w-full object-cover rounded-xl"/>
                            ) : (
                                <div className="text-gray-400">イメージがありません</div>
                            )}
                            <span className="genmaru font-bold text-black">
                                {hotel.hotelName}
                            </span>
                            <div>
                                <ReviewAverage />
                                {hotel.reviewAverage}
                            </div>
                            <div>
                                ¥{hotel.totalCharge.toLocaleString() ?? "不明"} /1泊の料金
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default AccSlide