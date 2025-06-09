import { useEffect, useState } from "react";
import EditUserInfo from "./EditUserInfo";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import RecommendPlaces from "./RecommendPlaces"
import PaymentHistory from "./PaymentHistory";

function MyPageMain() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();

    const queryParams = new URLSearchParams(location.search);
    const defaultTab = queryParams.get("tab") || "profile";

    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        setActiveTab(defaultTab);
    }, [defaultTab, isLoggedIn, navigate]);

    const changeTab = (tab: string) => {
        navigate(`/mypage?tab=${tab}`);
    };

    return (
        <section className="max-w-[1100px] m-auto mt-16">
            <h2 className="text-3xl font-bold mb-8">마이페이지</h2>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 p-6 bg-white rounded-lg shadow-md">
                <div className="w-28 h-28 rounded-full bg-gray-200" />
                <div className="flex flex-col gap-1 text-start sm:text-left">
                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                    <p className="text-gray-600 text-sm">{user?.email}</p>
                    <p className="text-gray-600 text-sm">010-1234-5678</p>
                </div>
            </div>

            <div className="flex border-b mb-4">
                <button
                    className={`px-4 py-2 text-sm font-semibold ${activeTab === "profile" ? "border-b-2 border-gray-500 text-black-600" : "text-gray-500"}`}
                    onClick={() => changeTab("profile")}
                >
                    정보수정
                </button>
                <button
                    className={`px-4 py-2 text-sm font-semibold ${activeTab === "reservations" ? "border-b-2 border-gray-500 text-black-600" : "text-gray-500"}`}
                    onClick={() => changeTab("reservations")}
                >
                    예약 내역
                </button>
                <button
                    className={`px-4 py-2 text-sm font-semibold ${activeTab === "payments" ? "border-b-2 border-gray-500 text-black-600" : "text-gray-500"}`}
                    onClick={() => changeTab("payments")}
                >
                    결제 내역
                </button>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="bg-white p-6 rounded-lg shadow-sm min-h-[300px]">
                {activeTab === "profile" && (
                    <div>
                        <h3 className="text-lg font-bold mb-4">회원정보 수정</h3>
                        <EditUserInfo />
                    </div>
                )}

                {activeTab === "reservations" && (
                    <div>
                        <h3 className="text-lg font-bold mb-4">예약 내역</h3>
                        <RecommendPlaces />
                    </div>
                )}

                {activeTab === "payments" && (
                    <div>
                        <h3 className="text-lg font-bold mb-4">결제 내역</h3>
                        <PaymentHistory />
                    </div>
                )}
            </div>
        </section>
    );
}

export default MyPageMain;
