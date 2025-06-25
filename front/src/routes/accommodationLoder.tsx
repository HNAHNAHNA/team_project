import type { AccommodationOut } from "../types/HotelList";

export const detailLoader = async ({ params }) => {
  const hotelNo = Number(params.hotelNo);

  const res = await fetch("http://localhost:8000/hotels/all");
  const hotels: AccommodationOut[] = await res.json();

  const hotel = hotels.find(h => h.hotel_no === hotelNo);

  if (!hotel) {
    throw new Response("Not Found", { status: 404 });
  }

  return hotel;
};