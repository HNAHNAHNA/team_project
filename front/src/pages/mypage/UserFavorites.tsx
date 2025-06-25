import { useEffect, useState } from "react"
import type { Favorite } from "../../types/favorites";


const UserFavorites = ({ userId }: { userId: number }) => {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const fetchFavorites = async () => {
            const userId = user.id;
            try {
                const res = await fetch(`http://localhost:8000/favorites/${userId}`);
                if (!res.ok) throw new Error("찜 목록 불러오기 실패");

                const data: Favorite[] = await res.json();
                setFavorites(data);
            } catch (err) {
                console.error("❌ 에러:", err);
            }
        };
        fetchFavorites();
    }, [userId]);

    return (
        <div>
            <h2>내 찜한 숙소</h2>
            {favorites.map(fav => (
                <div key={fav.favorite_id}>
                    <div className="w-[50%]">
                        <img src={fav.accommodation.image_url} />
                    </div>
                    <h3>{fav.accommodation.name}</h3>
                    <p>{fav.accommodation.address}</p>
                </div>
            ))}
        </div>
    );
}

export default UserFavorites;
