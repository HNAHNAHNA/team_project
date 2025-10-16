export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface PaymentPrepResponse {
  reservation_id: number;
  hotel_name: string;
  hotel_address: string;
  check_in_date: string;
  check_out_date: string;
  amount: number;
  buyer_name: string;
  buyer_phone: string;
}

export interface PaymentHistoryItem {
  reservation_id: number;
  hotel_name: string;
  check_in_date: string;
  check_out_date: string;
  amount: number;
  status: PaymentStatus;
  paid_at?: string; // ISO date string
}