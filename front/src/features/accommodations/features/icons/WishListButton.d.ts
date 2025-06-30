interface WishListButtonProps {
    hotelId: number;
    isFavorite: boolean;
    onToggle: (hotelId: number) => void;
}
declare function WishListButton({ hotelId, isFavorite, onToggle }: WishListButtonProps): import("react/jsx-runtime").JSX.Element;
export default WishListButton;
