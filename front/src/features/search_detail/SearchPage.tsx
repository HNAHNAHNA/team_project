import { REGION_MAP } from "../../constants/regionMap"
import hotels from "../../data/hotels.json"

function SearchPage() {
    return (
        <div className="flex h-screen">
            <div className="w-1/3 overflow-y-auto border-r p-4">
                <h2 className="text-xl font-bold mb-4">숙소 리스트</h2>
                {hotels.hotels.map((hotelWrapper, index) => {
                    const basicInfo = hotelWrapper.hotel?.[0]?.hotelBasicInfo;
                    return basicInfo ? (
                        <div key={basicInfo.hotelNo} className="w-full h-40 flex flex-row items-start mb-4">
                            <div className="w-1/2 h-full flex-shrink-0 overflow-hidden rounded">
                                <a href={`/detail/${basicInfo.hotelNo}`}>
                                    <img src={basicInfo.hotelImageUrl} alt="Hotel Image" className="w-full h-full object-cover"/>
                                </a>
                            </div>
                            <div className="ml-3 flex flex-col justify-between">
                                <p className="font-semibold line-clamp-2">{basicInfo.hotelName}</p>
                                <p className="text-sm text-gray-500">{basicInfo.address1}</p>
                                <p className="text-sm">평점: {basicInfo.reviewAverage}</p>
                            </div>
                        </div>
                    ) : null;
                })}
            </div>

            <div className="w-2/3 p-4 overflow-auto">
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">지도 위치</p>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;