import "swiper/css"
// @ts-ignore
import "swiper/css/effect-cards"
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "../../styles/hotelTransition.css";
import AccSlide from "./features/AccSlide";
import { useEffect, useState } from 'react'
import type { AccommodationOut, HotelBasicInfo, LocationData } from "../../types/HotelList";
import { useNavigate } from "react-router-dom";
import HotelModal from "./features/HotelModal";

const locationsData: LocationData[] = [
    { title: "東京のホテル", keyword: "東京" },
    { title: "大阪のホテル", keyword: "大阪" },
    { title: "福岡のホテル", keyword: "福岡" },
    { title: "京都のホテル", keyword: "京都" },
    { title: "札幌のホテル", keyword: "北海" },
];

function HotelMap() {
    const navigate = useNavigate();
    const [selectedData, setSelectedData] = useState<HotelBasicInfo | null>(null);
    const [allAccommodations, setAllAccommodations] = useState<AccommodationOut[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllAccommodations = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:8000/accommodations");

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const fetchedData: AccommodationOut[] = await response.json();
                setAllAccommodations(fetchedData);

            } catch (error) {
                console.error("Failed to fetch all accommodations:", error);
                setAllAccommodations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllAccommodations();
    }, []);

    const handleDetailButtonClick = () => {
        navigate(`/detail/${selectedData?.id}`)
    }
    const handleHotelClick = (hotel: AccommodationOut) => {
        setSelectedData(hotel);
    }
    const handleCloseModal = () => {
        setSelectedData(null);
    }

    const getFilteredHotelsByLocation = (keyword: string): AccommodationOut[] => {
        // address가 null이 아닌 경우에만 startsWith를 호출하고, keyword 포함 여부 확인
        return allAccommodations.filter(hotel =>
            hotel.address && hotel.address.startsWith(keyword)
        );
    };

    return (
        <div className="kiwi bg-slate-100 p-4 sm:p-8">
            <div className="flex flex-col gap-8">
                {loading ? ( // 전체 데이터 로딩 중일 때 스켈레톤 또는 로딩 메시지
                    Array.from({ length: locationsData.length }).map((_, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                {locationsData[index].title}
                            </h2>
                            <AccSlide hotelList={[]} onHotelClick={handleHotelClick} /> {/* 빈 리스트 전달 */}
                        </div>
                    ))
                ) : (
                    locationsData.map((location, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                {location.title}
                            </h2>
                            <AccSlide
                                // 분류된 호텔 데이터를 AccSlide에 전달
                                hotelList={getFilteredHotelsByLocation(location.keyword)}
                                onHotelClick={handleHotelClick}
                            />
                        </div>
                    ))
                )}
            </div>
            {selectedData && (
                <HotelModal
                    selectedData={selectedData}
                    setSelectedData={setSelectedData}
                    handleDetailButtonClick={handleDetailButtonClick}
                />
            )}
        </div>
    );
}

export default HotelMap;