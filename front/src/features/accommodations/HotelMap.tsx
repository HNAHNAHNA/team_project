import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccSlide from './features/AccSlide';
import HotelModal from './features/HotelModal';
import { useAuth } from '../../contexts/AuthContext';
import type { AccommodationOut, HotelBasicInfo, LocationData } from '../../types/HotelList';

const locationsData: LocationData[] = [
  { title: "東京のホテル", keyword: "東京" },
  { title: "大阪のホテル", keyword: "大阪" },
  { title: "福岡のホテル", keyword: "福岡" },
  { title: "京都のホテル", keyword: "京都" },
  { title: "札幌のホテル", keyword: "北海" },
];

interface FavoriteOut {
  accommodation: {
    accommodation_id: number;
  };
}

function HotelMap() {
  const navigate = useNavigate();
  const { user, isLoggedIn, validateAccessToken } = useAuth();
  const [selectedData, setSelectedData] = useState<HotelBasicInfo | null>(null);
  const [allAccommodations, setAllAccommodations] = useState<AccommodationOut[]>([]);
  const [favoriteMap, setFavoriteMap] = useState<Record<number, boolean>>({});
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('hotelmap 1번만 렌더링')
    const fetchAllAccommodations = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/accommodations");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: AccommodationOut[] = await response.json();
        setAllAccommodations(data);
      } catch (error) {
        console.error("숙소 데이터 로딩 실패:", error);
        setAllAccommodations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAccommodations();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !isLoggedIn) return;
      const token = await validateAccessToken();
      if (!token) return;

      try {
        const res = await fetch(`http://localhost:8000/api/fastapi/favorites/user/${user.id}`);
        const data = await res.json();
        console.log("📦 받아온 favorites 데이터:", data);
        const map: Record<number, boolean> = {};
        (data as FavoriteOut[]).forEach((fav) => {
          const accId = fav.accommodation?.accommodation_id;
          if (accId !== undefined) {
            map[accId] = true;
          }
        });

        setFavoriteMap(map);
      } catch (err) {
        console.error("찜 목록 불러오기 실패:", err);
      } finally {
        setFavoritesLoaded(true); // ✅ 이게 중요
      }
    };

    fetchFavorites();
  }, [user?.id, isLoggedIn]);

  const toggleFavorite = async (hotelId: number) => {
    if (!user || !isLoggedIn) return;
    const token = await validateAccessToken();
    if (!token) return;

    const isFav = favoriteMap[hotelId] === true;

    try {
      if (isFav) {
        const res = await fetch(
          `http://localhost:8000/api/fastapi/favorites/delete?user_id=${user.id}&accommodation_id=${hotelId}`,
          { method: 'DELETE' }
        );
        if (!res.ok) throw new Error("찜 해제 실패");
        setFavoriteMap((prev) => ({ ...prev, [hotelId]: false }));
      } else {
        const res = await fetch("http://localhost:8000/api/fastapi/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, accommodation_id: hotelId }),
        });
        if (!res.ok) throw new Error("찜 등록 실패");
        setFavoriteMap((prev) => ({ ...prev, [hotelId]: true }));
      }
    } catch (e) {
      console.error("찜 상태 토글 중 오류:", e);
    }
  };

  const handleHotelClick = (hotel: AccommodationOut) => {
    setSelectedData(hotel);
  };

  const getFilteredHotelsByLocation = (keyword: string): AccommodationOut[] => {
    return allAccommodations.filter(hotel =>
      hotel.address && hotel.address.startsWith(keyword)
    );
  };

  return (
    <div className="kiwi bg-slate-100 p-4 sm:p-8">
      <div className="flex flex-col gap-8">
        {loading || !favoritesLoaded
          ? Array.from({ length: locationsData.length }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                {locationsData[index].title}
              </h2>
              <AccSlide hotelList={[]} favoriteMap={{}} onToggleFavorite={toggleFavorite} />
            </div>
          ))
          : locationsData.map((location, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                {location.title}
              </h2>
              <AccSlide
                hotelList={getFilteredHotelsByLocation(location.keyword)}
                favoriteMap={favoriteMap}
                onToggleFavorite={toggleFavorite}
                onHotelClick={handleHotelClick}
              />
            </div>
          ))}
      </div>
      {selectedData && (
        <HotelModal
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          handleDetailButtonClick={() => navigate(`/detail/${selectedData.hotel_no}`)}
        />
      )}
    </div>
  );
}

export default HotelMap;
