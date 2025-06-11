import { useNavigate, useSearchParams } from 'react-router-dom';
import { REGION_MAP } from '../../constants/regionMap';
import Container from './Container';
import hotelList from '../../data/hotels.json';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { AnimatePresence, motion } from 'motion/react';

interface SelectedHotel {
    hotelNo: number;
    name: string;
    photoUrl: string;
    rating: number;
    charge: string | number;
    review: string;
}


const SearchResults = () => {
    const [loading, setLoading] = useState(true);
    const [skeletonCount, setSkeletonCount] = useState(5);
    const [selectedData, setSelectedData] = useState<SelectedHotel | null>(null);
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search");
    const navigator = useNavigate();

    const region = Object.entries(REGION_MAP).filter(([_, name]) =>
        name.includes(search || "")
    );

    const allHotelList = hotelList.hotels;

    const locationHotelLists = allHotelList.filter(wrapper => {
        const basicInfo = wrapper.hotel.find(item => item.hotelBasicInfo);
        if (!basicInfo) return false;

        return region.some(([_, regionName]) =>
            basicInfo.hotelBasicInfo?.address1.includes(regionName)
        );
    });

    useEffect(() => {
        setSkeletonCount(locationHotelLists.length || 5);
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleCardClick = (hotel: SelectedHotel) => {
        setSelectedData(hotel);
    };

    const handleDetailButtonClick = (hotelNo: number) => {
        navigator(`/detail/${hotelNo}`)
    }

    const sidebarContent = loading ? (
        <div className="p-4">
            {Array.from({ length: skeletonCount }).map((_, idx) => (
                <div key={idx} className="w-full mb-4">
                    <Skeleton height={100} className="rounded-xl" />
                </div>
            ))}
        </div>
    ) : (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">「{search}」の検索結果</h2>
            {locationHotelLists.map((hotelWrapper, index) => {
                const basicInfo = hotelWrapper.hotel.find(h => h.hotelBasicInfo)?.hotelBasicInfo;
                const roomsInfo = hotelWrapper.hotel.find(h => h.roomInfo)?.roomInfo?.[0];
                if (!basicInfo) return null;

                const hotel: SelectedHotel = {
                    hotelNo: basicInfo.hotelNo,
                    name: basicInfo.hotelName,
                    photoUrl: basicInfo.hotelImageUrl,
                    rating: basicInfo.reviewAverage,
                    charge: roomsInfo?.dailyCharge?.total || '카테고리 없음',
                };

                return (
                    <div
                        key={index}
                        onClick={() => handleCardClick(hotel)}
                        className="flex flex-row items-start border rounded-xl w-[95%] gap-4 m-2 cursor-pointer hover:bg-neutral-100 hover:shadow-md"
                    >
                        <img
                            src={hotel.photoUrl}
                            className="rounded-xl m-4 object-cover w-24 h-24"
                            alt={hotel.name}
                        />
                        <div className="flex flex-col m-2">
                            <div className="text-xl font-bold">{hotel.name}</div>
                            <div>{hotel.rating}</div>
                            <div>{roomsInfo?.dailyCharge?.total?.toLocaleString()}￥</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
    const mapContent = (
        <div className="text-white text-center">지도 표시 영역</div>
    );

    return (
        <div>
            <Container
                hotelList={sidebarContent}
                mapArea={mapContent}
            />
            <AnimatePresence>
                {selectedData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
                        onClick={() => setSelectedData(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedData(null)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-black cursor-pointer hover:shadow-md hover:bg-neutral-100"
                            >
                                ❌
                            </button>

                            <h2 className="text-2xl font-bold mb-3">{selectedData.name}</h2>
                            <img
                                src={selectedData.photoUrl}
                                alt={selectedData.name}
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                            <p><strong>Rating:</strong> {selectedData.rating}</p>
                            <p><strong>charge:</strong> {selectedData.charge}￥</p>
                            <p className="mt-2">{selectedData.review}</p>
                            <button
                                onClick={() => handleDetailButtonClick(selectedData.hotelNo)}>
                                    자세히 보려면 클릭!
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchResults;