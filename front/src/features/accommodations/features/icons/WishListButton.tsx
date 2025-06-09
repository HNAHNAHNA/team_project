import { AiOutlineHeart } from "react-icons/ai"
import users from "../../../../data/userdummy.json"
import { useState } from "react";

interface WishListButtonProps {
    hotelNo: number;
}

function WishListButton({ hotelNo }: WishListButtonProps) {
    const user = users.find((u) => u.id === 1); // 더미 유저
    const initialFavorite =
        Array.isArray(user?.favorite) && user.favorite.includes(hotelNo);

    const [hasFavorite, setHasFavorite] = useState(initialFavorite);

    const toggleFavorite = () => {
        setHasFavorite((prev) => !prev);

        if (hasFavorite) {
            console.log(`❌ 호텔 ${hotelNo} 찜 해제`);
        } else {
            console.log(`✅ 호텔 ${hotelNo} 찜 추가`);
        }
    };

    return (
        <div
            onClick={toggleFavorite}
            className="relative cursor-pointer hover:opacity-80"
        >
            {/* 바깥 흰색 테두리 */}
            <AiOutlineHeart
                size={28}
                className="fill-white absolute top-0 right-0 z-0"
            />
            {/* 실제 상태에 따라 색상 변하는 하트 */}
            <AiOutlineHeart
                size={24}
                className={`absolute top-[2px] right-[2px] z-10 ${hasFavorite ? "fill-rose-500" : "fill-neutral-500/20"
                    }`}
            />
        </div>
    );
}

export default WishListButton;