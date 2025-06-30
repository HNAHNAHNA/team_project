import type { HotelBasicInfo } from '../../../types/HotelList';
type HotelInfo = HotelBasicInfo & {
    totalCharge?: number;
};
interface HotelModalProps {
    selectedData: HotelInfo | null;
    setSelectedData: (hotel: HotelInfo | null) => void;
    handleDetailButtonClick: (hotelNo: number) => void;
}
declare function HotelModal({ selectedData, setSelectedData, handleDetailButtonClick }: HotelModalProps): import("react/jsx-runtime").JSX.Element;
export default HotelModal;
