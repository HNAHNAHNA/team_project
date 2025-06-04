import React from "react";
import Navigation from "./features/nav/Navigation";
import Footer from "./footer/Footer";
import { Outlet } from "react-router";

function Layout () {   
    return (
        <div>
            <Navigation />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout