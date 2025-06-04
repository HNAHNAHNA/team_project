import { useParams } from "react-router-dom";
import hotels from "../data/hotels.json";


function DetailPage() {
  const { hotelNo } = useParams();
  const hotelNoNum = Number(hotelNo);

  if (!hotelNo || isNaN(hotelNoNum)) {
    return <div>間違えたhotelNoです。</div>;
  }

  const matchedHotelWrapper = hotels.hotels.find((wrapper) => {
    const hotelBasic = wrapper.hotel.find((h) => h.hotelBasicInfo?.hotelNo === hotelNoNum);
    return hotelBasic !== undefined;
  });

  if (!matchedHotelWrapper) {
    return <div>ホテルを見つかりません</div>;
  }

  const hotelBasicInfo = matchedHotelWrapper.hotel.find(h => h.hotelBasicInfo)?.hotelBasicInfo;
  const roomInfoArray = matchedHotelWrapper.hotel.find(h => h.roomInfo)?.roomInfo;

  return (
    <div className="p-4">
      <div className="m-4 flex flex-raw items-start">
        <div className="w-1/2">
          <img
            src={hotelBasicInfo?.hotelImageUrl}
            alt={hotelBasicInfo?.hotelName}
            className="w-full h-auto mb-4 rounded"
          />
        </div>
        <div className="ml-10">
          <h1 className="text-xl font-bold mb-4">{hotelBasicInfo?.hotelName}</h1>

          <p className="text-sm text-gray-600 mb-4">
            평점: <strong>{hotelBasicInfo?.reviewAverage}</strong>
          </p>
          {roomInfoArray && roomInfoArray.length > 0 ? (
            roomInfoArray.map((room, idx) => (
              <div key={idx} className="text-sm text-gray-600 mb-4">
                <p>
                  価格:{" "}
                  <strong>{room.dailyCharge?.total.toLocaleString()}円</strong>
                </p>
              </div>
            ))
          ) : (
            <p>部屋情報が見つかりません。</p>
          )}
        </div>
      </div>
      <div className="border p-4 rounded shadow mb-4">
          <p>
            {hotelBasicInfo?.hotelName}
          </p>
          <p>
            {hotelBasicInfo?.hotelNo}
          </p>
      </div>
    </div>
  );
}

export default DetailPage;