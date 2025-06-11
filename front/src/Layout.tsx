import { useEffect, useState } from "react";
import Navigation from "./features/nav/Navigation";
import Footer from "./features/footer/Footer";
import { Outlet } from "react-router";

function Layout() {
    const [navHeight, setNavHeight] = useState(0);

    useEffect(() => {
        const navEl = document.getElementById("nav-root");
        if (!navEl) return;

        const updateHeight = () => setNavHeight(navEl.offsetHeight);
        updateHeight(); // 초기값

        const resizeObserver = new ResizeObserver(() => {
            updateHeight();
        });
        resizeObserver.observe(navEl);

        return () => resizeObserver.disconnect();
    }, []);
    return (
        <div>
            <div>
                <Navigation />
            </div>
            <main style={{ paddingTop: `${navHeight}px` }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout