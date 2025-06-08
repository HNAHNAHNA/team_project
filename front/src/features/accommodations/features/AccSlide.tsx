import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay } from "swiper/modules";
import type { HotelList, HotelBasicInfo } from "../../../types/hotel";
import ReviewAverage from "./icons/reviewAverage";
import { useNavigate } from "react-router-dom";

type hotelListProps = {
    hotelList: HotelList;
}

function AccSlide({ hotelList }: hotelListProps) {
    const navigate = useNavigate();

    if (!hotelList?.hotels || !Array.isArray(hotelList.hotels)) {
        return <div>호텔 정보가 없습니다.</div>;
    }

    const hotels = hotelList.hotels
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
                slidesPerView={4}
                spaceBetween={10}
                loop={true}
                modules={[Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className="w-full h-full"
            >
                {hotels.map((hotel, idx) => (
                    <SwiperSlide
                        key={hotel?.hotelNo ?? idx}
                        className="flex justify-center items-center cursor-pointer"
                        onClick={() => navigate(`/detail/${hotel.hotelNo}`)}
                    >
                        <div className="flex flex-col justify-center items-center h-full w-full no-drag">
                            {hotel.hotelImageUrl ? (
                                <img
                                    src={hotel.hotelImageUrl}
                                    alt={hotel.hotelName}
                                    className="h-[50%] w-full object-cover rounded-xl"/>
                            ) : (
                                <div className="text-gray-400">イメージがありません</div>
                            )}
                            <span className="text-lg text-black">
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