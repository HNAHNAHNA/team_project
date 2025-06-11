export interface HotelList {
  pagingInfo: {
    recordCount: number;
    pageCount: number;
    page: number;
    first: number;
    last: number;
  };
  hotels: {
    hotel?: {
      hotelBasicInfo: HotelBasicInfo;
      hotelRatingInfo?: any;
    }[];
  }[];
}

export interface HotelBasicInfo {
  hotelNo: number;
  hotelName: string;
  hotelImageUrl?: string;
  // 필요한 경우 아래 필드들 추가 가능
  hotelInformationUrl?: string;
  planListUrl?: string;
  dpPlanListUrl?: string;
  reviewUrl?: string;
  address1?: string;
  address2?: string;
  // ...
}

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

export type AccSlideProps = {
  hotelList: HotelWrapper[];
}