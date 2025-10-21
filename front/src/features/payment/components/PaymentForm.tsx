import { useState } from 'react';
import type { PaymentPrepResponse } from '../../../types/payments';

interface PaymentFormProps {
  paymentData: PaymentPrepResponse;
  onPaymentInitiate: (method: string) => void; // Callback for when payment is initiated
  isSubmitting: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentData, onPaymentInitiate, isSubmitting }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('CARD'); // Default to Card

  const handlePayment = () => {
    onPaymentInitiate(selectedMethod);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">注文</h3>

      <div className="space-y-2 mb-6 text-sm">
        <p><strong>ホテル名:</strong> {paymentData.hotel_name}</p>
        <p><strong>住所:</strong> {paymentData.hotel_address}</p>
        <p><strong>チェックイン日:</strong> {paymentData.check_in_date}</p>
        <p><strong>チェックアウト日:</strong> {paymentData.check_out_date}</p>
        <p><strong>ユーザー名:</strong> {paymentData.buyer_name}</p>
        <p><strong>連絡先:</strong> {paymentData.buyer_phone}</p>
        <p className="text-lg font-bold text-right mt-4">
          金額: {new Intl.NumberFormat('ko-KR').format(paymentData.amount)}원
        </p>
      </div>

      <h3 className="text-xl font-bold mb-4">決済手段</h3>
      <div className="space-y-2 mb-6">
        {['CARD', 'BANK_TRANSFER', 'KAKAOPAY', 'NAVERPAY'].map((method) => (
          <label key={method} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={selectedMethod === method}
              onChange={() => setSelectedMethod(method)}
              className="form-radio h-4 w-4 text-blue-600"
              disabled={isSubmitting}
            />
            <span>{method === 'CARD' ? '카드' : method === 'BANK_TRANSFER' ? '계좌이체' : method}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handlePayment}
        disabled={isSubmitting}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? '결제 중...' : '결제하기'}
      </button>
    </div>
  );
};

export default PaymentForm;
