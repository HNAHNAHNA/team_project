// 각 방의 기본 정보
export interface RoomBasicInfo {
  roomClass: string;
  roomName: string;
  planId: number;
  planName: string;
  pointRate: number;
  withDinnerFlag: number;
  dinnerSelectFlag: number;
  withBreakfastFlag: number;
  breakfastSelectFlag: number;
  payment: string;
  reserveUrl: string;
  salesformFlag: number;
  planContents: string;
}

// 각 방의 요금 정보
export interface DailyCharge {
  stayDate: string;
  rakutenCharge: number;
  total: number;
  chargeFlag: number;
}

// roomInfo는 roomBasicInfo 또는 dailyCharge 중 하나를 포함할 수 있음
export interface RoomInfo {
  roomBasicInfo?: RoomBasicInfo;
  dailyCharge?: DailyCharge;
}

// 각 호텔 객체는 roomInfo 배열을 가짐
export interface Hotel {
  roomInfo: RoomInfo[];
}

// 호텔 리스트는 hotel 배열을 포함함
export interface HotelWrapper {
  hotel: Hotel[];
}

// 최상위 JSON 구조: hotels 배열
export interface HotelList {
  hotels: HotelWrapper[];
}