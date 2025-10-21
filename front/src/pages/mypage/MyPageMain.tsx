import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import EditUserInfo from "./EditUserInfo";
import PaymentHistory from "./PaymentHistory";
import UserFavorites from "./UserFavorites";
import ReservationAccommodations from "./ReservationAccommodations";
import starImage from "../../images/star.png"

function MyPageMain() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, validateAccessToken } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get("tab") || "profile";

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const checkAuth = async () => {
      // 로그인 여부 우선 확인
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }

      // 토큰 유효성 검사
      const token = await validateAccessToken();
      if (!token) {
        console.log("AccessToken 만료 → 로그인 필요");
        navigate("/login");
        return;
      }

      // 유효하면 탭 설정
      setActiveTab(defaultTab);
    };

    checkAuth();
  }, [defaultTab]);

  const changeTab = (tab: string) => {
    navigate(`/mypage?tab=${tab}`);
  };

  return (
    <section className="max-w-[1100px] m-auto mt-16">
      <h2 className="text-3xl font-bold mb-8">マイページ</h2>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 p-6 bg-white rounded-lg shadow-md">
        <div className="w-28 h-28 rounded-full border-[1px] overflow-hidden">
          <img
            src={starImage}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 text-start sm:text-left">
          <h3 className="text-xl font-semibold">{user?.userName}</h3>
          <p className="text-gray-600 text-sm">{user?.email}</p>
          <p className="text-gray-600 text-sm">{user?.phoneNumber}</p>
        </div>
      </div>

      <div className="flex border-b mb-4">
        {["profile", "reservations", "favorites", "payments"].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-semibold ${activeTab === tab
              ? "border-b-2 border-gray-500 text-black-600"
              : "text-gray-500"
              }`}
            onClick={() => changeTab(tab)}
          >
            {tab === "profile" && "個人情報"}
            {tab === "reservations" && "予約情報"}
            {tab === "favorites" && "いいね！"}
            {tab === "payments" && "決済情報"}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm min-h-[300px]">
        {activeTab === "profile" && (
          <>
            <h3 className="text-lg font-bold mb-4">個人情報の修正</h3>
            <EditUserInfo />
          </>
        )}
        {activeTab === "reservations" && (
          <>
            <h3 className="text-lg font-bold mb-4">予約情報</h3>
            <ReservationAccommodations />
          </>
        )}
        {activeTab === "favorites" && (
          <>
            <h3 className="text-lg font-bold mb-4">いいね！</h3>
            {user && <UserFavorites userId={user.userId} />}
          </>
        )}
        {activeTab === "payments" && (
          <>
            <h3 className="text-lg font-bold mb-4">決済情報</h3>
            <PaymentHistory />
          </>
        )}
      </div>
    </section>
  );
}

export default MyPageMain;