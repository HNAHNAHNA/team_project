import { useState, useEffect } from "react";


function MyPage() {
    const [places, setPlaces] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);


    const hotel = {
        name: "京急ＥＸイン　秋葉原",
        address: "東京都"
    }
    useEffect(() => {
        fetch(`http://localhost:8080/api/places/search?q=${hotel.address} ${hotel.name}`)
            .then(res => {
                if (!res.ok) throw new Error("API 요청 실패");
                return res.json();
            })
            .then(data => setPlaces(data))
            .catch(err => {
                console.error("에러:", err);
                setError(err.message);
            });
    }, []);
    return (
        <div>
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
        </div>
    )
}

export default MyPage