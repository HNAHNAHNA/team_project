export declare const locationNames: string[];
export declare const locations: {
    title: string;
    hotels: {
        hotel: ({
            hotelBasicInfo: {
                hotelNo: number;
                hotelName: string;
                latitude: number;
                longitude: number;
                address1: string;
                hotelImageUrl: string;
                reviewAverage: number;
            };
            roomInfo?: undefined;
        } | {
            roomInfo: {
                dailyCharge: {
                    total: number;
                };
            }[];
            hotelBasicInfo?: undefined;
        })[];
    }[];
}[];
