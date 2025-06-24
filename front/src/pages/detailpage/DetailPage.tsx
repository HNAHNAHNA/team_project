import { useLoaderData } from "react-router-dom";
import type { AccommodationOut } from "../../types/HotelList";
import Container from "./Container";
import StayButton from "../../components/StayButton";

function DetailPage() {
  const hotel = useLoaderData() as AccommodationOut;
  console.log("🔥 hotel data from backend:", hotel); // 꼭 찍어봐!

  return (
    <Container>
      <div className="w-full h-auto overflow-hidden rounded-xl relative">
        <div className="flex flex-row mt-5 p-6 bg-neutral-50 rounded-2xl gap-10 shadow-md">
          <img
            src={hotel.image_url}
            alt={hotel.name}
            className="w-1/2 object-cover rounded-2xl"
          />
          <div className="flex flex-col justify-between mr-10 w-1/2">
            <p><strong>{hotel.name}</strong></p>
            <p>{hotel.address}</p>
            <div className="flex flex-row justify-center gap-5 mt-auto">
              <StayButton buttonName="予約する" colorClass="bg-neutral-100 hover:bg-gray-300/50" />
              <StayButton buttonName="相談したい" colorClass="bg-slate-400/70 hover:bg-gray-300/50" />
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