export type HotelBasicInfo = AccommodationOut;

export interface FlatRoom {
  roomBasicInfo: {
    hotelNo: number;
    roomName: string;
    planName?: string;
    reserveUrl?: string;
    // 기타 필요한 필드 추가
  };
  dailyCharge?: {
    total: number;
    stayDate: string;
    rakutenCharge: number;
    chargeFlag: number;
  };
}

export interface FlatRoomList {
  rooms: FlatRoom[];
}


export type HotelWrapper = {
  hotel: Array<{
    hotelBasicInfo?: HotelBasicInfo;
    roomInfo?: Array<{ dailyCharge: { total: number } }>;
  }>;
};

export interface AccSlideProps {
  hotelList: AccommodationOut[];
  onHotelClick?: (hotel: AccommodationOut) => void;
  favoriteMap: Record<number, boolean>;
  onToggleFavorite: (hotelId: number) => void;
}

export interface AccommodationOut {
  id: number;
  accommodation_id: number;
  name: string;
  address: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
  host_user_id: number | null;
  charge: number;
  latitude: number;
  longitude: number;
  review_count: number | null;
  review_average: number | null;
  checkin_time: string;
  checkout_time: string;
  telephone: string | null;
  hotel_no: number;
  charge: number;
};

interface SelectedHotel {
  hotelNo: number;
  name: string;
  photoUrl: string | null;
  rating: number | null;
  charge: string | number;
}

export interface LocationData {
  title: string;
  keyword: string;
}