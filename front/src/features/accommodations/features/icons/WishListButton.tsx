import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface WishListButtonProps {
  hotelId: number;
  isFavorite: boolean;
  onToggle: (hotelId: number) => void;
}

function WishListButton({ hotelId, isFavorite, onToggle }: WishListButtonProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggle(hotelId);
      }}
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
