import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
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

    const toggleFavorite = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation(); // ⭐ 이 줄이 핵심
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
            className="relative cursor-pointer transition hover:opacity-60"
        >
            {hasFavorite ?
                <AiFillHeart
                    size={29}
                    className="fill-rose-500 -top-[2px] -right-[2px] absolute transition-all duration-300"
                /> :
                <AiOutlineHeart
                    size={27}
                    className="fill-black-500/70 transition-all duration-300"
                />}

        </div>
    );
}

export default WishListButton;