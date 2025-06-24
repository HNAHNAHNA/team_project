import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"
import Home from "../pages/Home";
import LoginPage from "../features/auth/login/LoginPage";
import SignUp from "../features/auth/SignUp";
import DetailPage from "../pages/detailpage/DetailPage";
import hotels from "../data/hotels.json";
import Layout from "../Layout";
import MyPageMain from '../pages/mypage/MyPageMain';
import PublicOnlyRoute from "./PublicOnlyRoute";
import RecommendPlaces from "../pages/mypage/RecommendPlaces";
import SearchResults from "../features/search_detail/SearchResults";
import type { AccommodationOut } from "../types/HotelList";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: (
                    <PublicOnlyRoute>
                        <LoginPage />
                    </PublicOnlyRoute>
                )
            },
            {
                path: "/detail/:hotelNo",
                element: <DetailPage />,
                loader: ({ params }) => {
                    const hotelNo = Number(params.hotelNo);
                    const hotelList = hotels.hotels;

                    const rawHotel = hotelList
                        .map(h => h.hotel?.[0]?.hotelBasicInfo)
                        .find(h => h?.hotelNo === hotelNo);

                    if (!rawHotel) throw new Response("Not Found", { status: 404 });

                    // AccommodationOut 형태로 변환
                    const hotel: AccommodationOut = {
                        accommodation_id: rawHotel.hotelNo,
                        name: rawHotel.hotelName,
                        address: rawHotel.address1,
                        image_url: rawHotel.hotelImageUrl,
                        charge: 0, // 더미 데이터니까 기본값 지정
                        latitude: rawHotel.latitude,
                        longitude: rawHotel.longitude,
                        review_count: 0,
                        review_average: rawHotel.reviewAverage ?? 0,
                        created_at: "",
                        host_user_id: null,
                        checkin_time: "15:00",
                        checkout_time: "11:00",
                        telephone: null,
                        hotel_no: rawHotel.hotelNo,
                    };

                    return hotel;
                }
            },
            {
                path: "/search",
                element: <SearchResults />
            },
            {
                path: "/mypage",
                element: <MyPageMain />
            },
            {
                path: "/mypage/recommend",
                element: <RecommendPlaces />
            }
        ]
    },
    {
        path: "/signup",
        element: <SignUp />
    }
])
