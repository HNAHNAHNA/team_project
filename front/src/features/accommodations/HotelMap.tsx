import "swiper/css"
// @ts-ignore
import "swiper/css/effect-cards"
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "../../styles/hotelTransition.css";
import AccSlide from "./features/AccSlide";
import { locations } from './locations'
import { useState } from 'react'
import type { HotelBasicInfo } from "../../types/HotelList";
import { useNavigate } from "react-router-dom";
import HotelModal from "./features/HotelModal";

function HotelMap() {
    const navigate = useNavigate();
    const [selectedData, setSelectedData] = useState<HotelBasicInfo | null>(null);

    const handleDetailButtonClick = () => {
        navigate(`/detail/${selectedData?.hotelNo}`)
    }
    const handleHotelClick = (hotel: HotelBasicInfo) => {
        setSelectedData(hotel);
    }
    const handleCloseModal = () => {
        setSelectedData(null);
    }
    return (
        <div className="kiwi bg-slate-100 p-4 sm:p-8">
            <div className="flex flex-col gap-8">
                {locations.map((location, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            {location.title}
                        </h2>
                        <AccSlide hotelList={location.hotels} />
                    </div>
                ))}
            </div>
            {selectedData && (
                <HotelModal 
                    selectedData={selectedData} 
                    setSelectedData={setSelectedData} 
                    handleDetailButtonClick={handleDetailButtonClick}/>
            )}
        </div>
    );
}

export default HotelMap;
