import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../features/auth/login/LoginPage";
import SignUp from "../features/auth/SignUp";
import DetailPage from "../pages/detailpage/DetailPage";
import Layout from "../Layout";
import MyPageMain from '../pages/mypage/MyPageMain';
import PublicOnlyRoute from "./PublicOnlyRoute";
import RecommendPlaces from "../pages/mypage/RecommendPlaces";
import SearchResults from "../features/search_detail/SearchResults";
import { detailLoader } from "./accommodationLoder";

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
                loader: detailLoader,
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
