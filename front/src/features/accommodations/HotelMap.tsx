import "swiper/css"
// @ts-ignore
import "swiper/css/effect-cards"
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import hotelsData from "../../data/hotels.json"
import "../../styles/hotelTransition.css";
import AccSlide from "./features/AccSlide";

function HotelMap() {
    const locationNames = ['東京都', '大阪', '京都', '福岡', '札幌'];
    const allHotels = hotelsData.hotels;

    const locations = locationNames.map(name => {
        return {
            title: `${name}のおすすめホテル`,
            hotels: allHotels.filter(wrapper => {
                const basicInfo = wrapper.hotel.find(item => item.hotelBasicInfo);
                return basicInfo && basicInfo.hotelBasicInfo?.address1 === name;
            })
        };
    });

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
        </div>
    );
}

export default HotelMap;
