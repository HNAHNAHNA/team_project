import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../features/auth/login/LoginPage";
import SignUp from "../features/auth/SignUp";
import DetailPage from "../pages/DetailPage";
import hotels from "../data/hotels.json";
import SearchPage from "../features/search_detail/SearchPage";
import Layout from "../Layout";

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
                element: <LoginPage />
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
        ]
    },
    {
        path: "/signup",
        element: <SignUp />
    }
])
