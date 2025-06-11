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
                    const hotel = hotels.hotels
                        .map(h => h.hotel?.[0]?.hotelBasicInfo)
                        .find(h => h?.hotelNo === hotelNo);

                    if (!hotel) throw new Response("Not Found", { status: 404 });

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
