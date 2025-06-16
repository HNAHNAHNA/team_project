import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

interface WishListButtonProps {
    hotelId: number;
    isFavorite: boolean;
    onToggle: (hotelId: number) => void;
}

function WishListButton({ hotelId, isFavorite, onToggle }: WishListButtonProps) {
    const { user, isLoggedIn, validateAccessToken } = useAuth();
    const navigate = useNavigate();

    const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        const token = await validateAccessToken();
        if (!token || !user) {
            console.log("AccessToken 만료 또는 사용자 정보 없음 → 로그인 필요");
            navigate("/login");
            return;
        }

        onToggle(hotelId);
    };

    return (
        <div
            onClick={handleClick}
            className="relative cursor-pointer transition hover:opacity-60"
        >
            {isFavorite ? (
                <AiFillHeart
                    size={29}
                    className="fill-rose-500 -top-[2px] -right-[2px] absolute transition-all duration-300"
                />
            ) : (
                <AiOutlineHeart
                    size={27}
                    className="fill-black-500/70 transition-all duration-300"
                />
            )}
        </div>
    );
}

export default WishListButton;
