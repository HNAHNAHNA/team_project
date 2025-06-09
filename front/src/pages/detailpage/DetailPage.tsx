import { useLoaderData, useParams } from "react-router-dom";
// import hotels from "../../data/hotels.json";
import type { HotelBasicInfo } from "../../types/HotelList";
import Heading from "./Heading";
import Container from "./Container";

function DetailPage() {
  const hotel = useLoaderData() as HotelBasicInfo;

  return (
    <Container>
      <Heading
        title={hotel.hotelName ?? "호텔 이름 없음"}
        subtitle={
          hotel.address1
        }
      />
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <img
          src={hotel.hotelImageUrl}
          alt={hotel.hotelName}
          className="w-full object-cover"
        />
      </div>
    </Container>
  );
}

export default DetailPage;