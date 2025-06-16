import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import users from "../../../../data/userdummy.json"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface WishListButtonProps {
    hotelNo: number;
}

function WishListButton({ hotelNo }: WishListButtonProps) {
    const user = users.find((u) => u.id === 1); // 더미 유저
    const navigate = useNavigate();
    const initialFavorite =
        Array.isArray(user?.favorite) && user.favorite.includes(hotelNo);

    const [hasFavorite, setHasFavorite] = useState(initialFavorite);

    const validateToken = async (token: string): Promise<boolean> => {
        try {
            const res = await fetch(`http://localhost:8000/validate?token=${token}`);
            const data = await res.json();
            return data.valid === true;
        } catch (err) {
            console.error("JWT 유효성 검사 실패:", err);
            return false;
        }
    };

    const toggleFavorite = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate('/login')
            return;
        }

        const isValid = await validateToken(token);
        if (!isValid) {
            alert("로그인 토큰이 유효하지 않습니다. 다시 로그인해주세요.");
            return;
        }

        // 유효하면 찜 추가/삭제 로직 수행
        setHasFavorite((prev) => !prev);

        if (hasFavorite) {
            console.log(`❌ 호텔 ${hotelNo} 찜 해제`);
            console.log('인증 완료!')
            // await fetch(...찜 해제 API 호출)
        } else {
            console.log(`✅ 호텔 ${hotelNo} 찜 추가`);
            console.log('인증 완료!')
            // await fetch(...찜 추가 API 호출)
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