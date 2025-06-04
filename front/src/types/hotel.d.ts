export type HotelBasicInfo = {
  hotelNo: number;
  hotelName?: string;
  hotelImageUrl: string;
  address1?: string;
  address2: string;
  telephoneNo?: string;
};

export type HotelWrapper = {
  hotel?: {
    hotelBasicInfo: HotelBasicInfo;
    // 다른 메타 정보가 있다면 여기에 추가
  }[];
};

export type HotelListJson = {
  hotels: HotelWrapper[];
};