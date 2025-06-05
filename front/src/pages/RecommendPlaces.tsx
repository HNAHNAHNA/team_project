import { useState, useEffect } from "react";
import recommandeddata from "../data/recommandeddata.json"

function MyPage() {
    // const [places, setPlaces] = useState<any[]>([]);
    // const [error, setError] = useState<string | null>(null);


    // const hotel = {
    //     name: "京急ＥＸイン　秋葉原",
    //     address: "東京都"
    // }
    // useEffect(() => {
    //     fetch(`http://localhost:8080/api/places/search?q=${hotel.address} ${hotel.name}`)
    //         .then(res => {
    //             if (!res.ok) throw new Error("API 요청 실패");
    //             return res.json();
    //         })
    //         .then(data => setPlaces(data))
    //         .catch(err => {
    //             console.error("에러:", err);
    //             setError(err.message);
    //         });
    // }, []);
    return (
        <div className="flex flex-row w-full h-screen">
            <div className="w-1/3 flex flex-wrap overflow-y-scroll">
                {recommandeddata
                    .map((data, idx) => (
                        <div
                            key={idx}
                            className="
                            flex
                            flex-row
                            items-start
                            border-[1px]
                            rounded-xl
                            w-[95%]
                            gap-4
                            m-2
                        ">
                            <img
                                src={data.photoUrl}
                                className="
                                rounded-xl
                                m-4
                                object-cover
                                w-24
                                h-24
                            ">
                            </img>
                            <div
                                className="
                                flex
                                flex-col
                                m-2
                            ">
                                <div
                                    className="
                                        text-xl
                                        font-bold
                                    ">
                                    {data.name}
                                </div>
                                <div
                                    className="

                                    ">
                                    {data.rating}
                                </div>
                                <div>
                                    {data.category}
                                </div>
                                <div>
                                    {data.review}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="w-2/3 bg-gray-500">
                <div className="w-full h-full text-white flex items-center justify-center">
                    지도 표시 영역
                </div>
            </div>
        </div>
    )
}

export default MyPage

{/* <div>
    <h2>장소 검색 결과</h2>
    {error && <p>에러: {error}</p>}
    {places.length === 0 ? (
        <p>결과가 없습니다.</p>
    ) : (
        <ul>
            {places.map((place, idx) => (
                <li key={idx}>
                    <strong>{place.name}</strong> — {place.address}
                </li>
            ))}
        </ul>
    )}
</div> */}