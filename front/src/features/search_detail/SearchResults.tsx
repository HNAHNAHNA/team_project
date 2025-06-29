import { useNavigate, useSearchParams } from 'react-router-dom';
import { REGION_MAP } from '../../constants/regionMap';
import Container from './Container';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { AnimatePresence, motion } from 'motion/react';
import type { AccommodationOut, SelectedHotel } from '../../types/HotelList';
import MapComponent from '../../features/map/MapComponent';
import createPriceMarker from "../map/PriceMarker";

const SearchResults = () => {
  const [allAccommodations, setAllAccommodations] = useState<AccommodationOut[]>([]);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [skeletonCount] = useState(5);
  const [markers, setMarkers] = useState<google.maps.OverlayView[]>([]);
  const [selectedData, setSelectedData] = useState<SelectedHotel | null>(null);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const navigate = useNavigate();

  const regionKeywords = Object.entries(REGION_MAP)
    .filter(([_, name]) => name.includes(search))
    .map(([_, name]) => name);

  const filteredHotels = allAccommodations.filter(hotel =>
    hotel.address && regionKeywords.some(regionName => hotel.address?.includes(regionName))
  );

  const firstHotel = filteredHotels[0];
  const defaultCenter = firstHotel
    ? { lat: firstHotel.latitude, lng: firstHotel.longitude }
    : { lat: 35.6812, lng: 139.7671 }; // fallback: 도쿄역

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/accommodations");
      if (!res.ok) throw new Error("숙소 데이터를 불러오지 못했습니다.");

      const accommodations = await res.json();
      setAllAccommodations(accommodations);
    } catch (err) {
      console.error("숙소 로딩 실패:", err);
      setAllAccommodations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (hotel: SelectedHotel) => {
    setSelectedData(hotel);
  };

  const handleDetailButtonClick = (hotelNo: number) => {
    navigate(`/detail/${hotelNo}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!mapInstance) return;

    markers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.OverlayView[] = [];

    allAccommodations.forEach(hotel => {
      if (!hotel.latitude || !hotel.longitude) return;

      const marker = createPriceMarker(hotel, mapInstance, () => {
        handleCardClick({
          hotelNo: hotel.hotel_no,
          name: hotel.name,
          photoUrl: hotel.image_url || "",
          rating: hotel.review_average || 0,
          charge: hotel.charge,
          review: "^0^",
        });
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [mapInstance, allAccommodations]);

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
      {filteredHotels.length === 0 ? (
        <div className="text-gray-500 text-sm">該当するホテルがありません。</div>
      ) : (
        filteredHotels.map((hotel, index) => (
          <div
            key={index}
            onClick={() =>
              handleCardClick({
                hotelNo: hotel.hotel_no,
                name: hotel.name,
                photoUrl: hotel.image_url || "",
                rating: hotel.review_average || 0,
                charge: hotel.charge,
                review: "^0^",
              })
            }
            className="flex flex-row items-start border rounded-xl bg-white w-[95%] gap-4 m-2 cursor-pointer hover:bg-neutral-100 hover:shadow-md"
          >
            <img
              src={hotel.image_url || "/no-image.png"}
              className="rounded-xl m-4 object-cover w-24 h-24"
              alt={hotel.name}
            />
            <div className="flex flex-col m-2">
              <div className="text-xl font-bold">{hotel.name}</div>
              <div>{hotel.review_average ?? "N/A"}</div>
              <div>{hotel.charge.toLocaleString()}￥</div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div>
      <Container
        hotelList={sidebarContent}
        mapArea={<MapComponent center={defaultCenter} onMapLoad={(map) => setMapInstance(map)} />}
      />

      <AnimatePresence>
        {selectedData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
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
                src={selectedData.photoUrl ?? undefined}
                alt={selectedData.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <p><strong>Rating:</strong> {selectedData.rating}</p>
              <p><strong>charge:</strong> {selectedData.charge}￥</p>
              <button onClick={() => handleDetailButtonClick(selectedData.hotelNo)}>
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
