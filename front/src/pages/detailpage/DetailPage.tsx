import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import type { AccommodationOut } from "../../types/HotelList";
import Container from "./Container";
import StayButton from "../../components/StayButton";
import DebugButton from "../../components/DebugButton";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

function DetailPage() {
  const { validateAccessToken } = useAuth();
  const { hotelNo } = useParams();
  const hotel = useLoaderData() as AccommodationOut;
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [hotelId, setHotelId] = useState<number | null>(null);

  useEffect(() => {
    if (!hotelNo) return;

    const fetchHotelId = async () => {
      try {
        const res = await fetch(`/api/fastapi/get-hotel-id?hotelNo=${hotelNo}`);
        const data = await res.json();

        if (res.ok) {
          setHotelId(data.hotel_id);
        } else {
          console.error("❌ hotel_id 조회 실패:", data.detail);
        }
      } catch (err) {
        console.error("❌ 호텔 ID 요청 실패", err);
      }
    };

    fetchHotelId();
  }, [hotelNo]);

  const reservationButtonHandler = async () => {
    const token = await validateAccessToken(); // ✅ 만료 시 자동 재발급
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token) {
      alert("로그인이 필요합니다.")
      return navigate("/login")
    }
    console.log("입력정보 >>>>>> ", hotelId, checkInDate, checkOutDate)
    if (!hotelId || !checkInDate || !checkOutDate) {
      alert("입력값이 부족합니다.");
      return;
    }

    const res = await fetch("/api/fastapi/reservations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hotel_id: hotelId,
        user_id: user.userId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ 예약 완료");
    } else {
      console.error("예약 실패:", data);
      alert("❌ 예약 실패");
    }
  };

  return (
    <Container>
      <div className="w-full h-auto overflow-hidden rounded-xl relative">
        <div className="flex flex-row mt-5 p-6 bg-neutral-50 rounded-2xl gap-10 shadow-md">
          <img
            src={hotel.image_url ?? undefined}
            alt={hotel.name}
            className="w-1/2 object-cover rounded-2xl"
          />
          <div className="flex flex-col justify-between mr-10 w-1/2">
            <p><strong>{hotel.name}</strong></p>
            <p>{hotel.address}</p>
            <div className="my-4 flex flex-col gap-2">
              <label>チェックイン日</label>
              <input type="date" className="border p-2 rounded" onChange={(e) => setCheckInDate(e.target.value)} />

              <label>チェックアウト日</label>
              <input type="date" className="border p-2 rounded" onChange={(e) => setCheckOutDate(e.target.value)} />
            </div>
            <div className="flex flex-row justify-center gap-5 mt-auto">
              <StayButton
                buttonName="予約する"
                colorClass="bg-neutral-100 hover:bg-gray-300/50"
                onClick={reservationButtonHandler}
              />
              <StayButton buttonName="相談したい" colorClass="bg-slate-400/70 hover:bg-gray-300/50" />
              <DebugButton />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white mt-5 shadow-lg">
          <p className="text-[50px]">詳しい情報はこちら！！</p>
        </div>
        <div className="mt-5 p-6 bg-white rounded-2xl ">
          <p>詳しい情報うううううううううう</p>
          <p>詳しい情報うううううううううう</p>
          <p>詳しい情報うううううううううう</p>
          <p>詳しい情報うううううううううう</p>
          <p>詳しい情報うううううううううう</p>
          <p>詳しい情報うううううううううう</p>
          <p>詳しい情報うううううううううう</p>
          <p>詳しい情報うううううううううう</p>
          <p>詳しい情報うううううううううう</p>
          <p>詳しい情報うううううううううう</p>
          <p>詳しい情報うううううううううう</p>
          <p>詳しい情報うううううううううう</p>
          <p>詳しい情報うううううううううう</p>
        </div>
      </div>
    </Container>
  );
}

export default DetailPage;