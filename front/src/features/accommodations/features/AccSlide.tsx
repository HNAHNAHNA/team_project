import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import type { HotelBasicInfo, AccSlideProps } from "../../../types/HotelList";
import type SwiperCore from "swiper";

import ReviewAverage from "./icons/reviewAverage";
import SkeletonCard from "./SkeletonCard";
import WishListButton from "./icons/WishListButton";

type HotelWithPrice = HotelBasicInfo & { totalCharge: number | null };

function AccSlide({ hotelList, onHotelClick }: AccSlideProps) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<HotelWithPrice[]>([]);
    const swiperRef = useRef<SwiperCore | null>(null);
    const slideCount = 5;

    const handleMouseEnter = () => swiperRef.current?.autoplay?.stop();
    const handleMouseLeave = () => swiperRef.current?.autoplay?.start();

    useEffect(() => {
        const timeout = setTimeout(() => {
            const processed = hotelList
                .map((wrapper: any): HotelWithPrice | null => {
                    const basicInfo = wrapper.hotel?.find((h: any) => h.hotelBasicInfo)?.hotelBasicInfo;
                    const total = wrapper.hotel?.find((h: any) => h.roomInfo)?.roomInfo?.[0]?.dailyCharge?.total;
                    return basicInfo ? { ...basicInfo, totalCharge: total ?? null } : null;
                })
                .filter((h): h is HotelWithPrice => !!h);

            setData(processed);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [hotelList]);

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
                {loading
                    ? Array.from({ length: slideCount }).map((_, idx) => (
                          <SwiperSlide key={idx} className="flex justify-center items-center cursor-pointer">
                              <SkeletonCard />
                          </SwiperSlide>
                      ))
                    : data.map((hotel) => (
                          <SwiperSlide
                              key={hotel.hotelNo}
                              className="flex justify-center items-center cursor-pointer"
                              onClick={() => onHotelClick?.(hotel)}
                          >
                              <div className="flex flex-col justify-center max-w-[220px] items-center h-[80%] w-full rounded-xl no-drag hover:shadow-xl">
                                  {hotel.hotelImageUrl ? (
                                      <div className="relative w-full h-60 overflow-hidden rounded-xl">
                                          <img
                                              src={hotel.hotelImageUrl}
                                              alt={hotel.hotelName}
                                              className="w-full h-full object-cover"
                                          />
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
        </div>
    );
}

export default AccSlide;