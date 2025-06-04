import "swiper/css"
// @ts-ignore
import "swiper/css/effect-cards"
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import hotels from"../../data/hotels.json"
import "../../styles/hotelTransition.css";
import AccSlide from "./features/AccSlide";

function HotelMap() {

    return (
        <div
            className="flex flex-col gap-5 p-4 overflow-visible">
            <>
                <h2 className="text-xl">東京のおすすめホテル</h2>
                <AccSlide hotelList={hotels} />

                <h2 className="text-xl">大阪のおすすめホテル</h2>
                <AccSlide hotelList={hotels} />
            </>
        </div>
    );
}

export default HotelMap;
