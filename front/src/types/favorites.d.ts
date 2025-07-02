import type { AccommodationOut } from "./HotelList";

export interface Accommodation {
  accommodation_id: number;
  name: string;
  image_url: string;
  address: string;
}

export interface Favorite {
  favorite_id: number;
  accommodation: AccommodationOut;
  created_at: string;
}