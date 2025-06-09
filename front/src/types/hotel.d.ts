export interface HotelBasicInfo {
  hotelNo: number;
  hotelName?: string;
  hotelImageUrl: string;
  address1?: string;
  address2: string;
  telephoneNo?: string;
};

export interface HotelWrapper {
  hotel?: {
    hotelBasicInfo: HotelBasicInfo;
  }[];
};

export interface HotelListJson {
  hotels: HotelWrapper[];
};

export interface HotelName {
  hotelName: HotelName;
}