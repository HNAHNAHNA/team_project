import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../features/auth/user_account/Login";
import SignUp from "../features/auth/user_account/SignUp";
import DetailPage from "../pages/DetailPage";
import hotels from "../data/hotels.json";
import SearchPage from "../features/search_detail/SearchPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <SignUp />
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
        element: <SearchPage />
    }
])
