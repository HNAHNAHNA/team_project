import type { AccommodationOut } from "./HotelList";

export interface UserReservations {
    reservation_id: number,
    u_booking_id: number,
    hotel_id: number,
    reserved_at: string,
    check_in_date: string,
    check_out_date: string,
    user_id: number,
    accommodation: AccommodationOut;
}