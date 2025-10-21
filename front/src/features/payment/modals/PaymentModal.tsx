import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { usePaymentPrep } from '../hooks/usePaymentPrep';
import PaymentForm from '../components/PaymentForm';
import { useAuth } from '../../../contexts/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: (isSuccess: boolean) => void;
  reservationId: number | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, reservationId }) => {
  const { data, isLoading, error } = usePaymentPrep(reservationId);
  const { validateAccessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaymentInitiate = async (method: string) => {
    if (!reservationId) return;

    setIsSubmitting(true);
    try {
      const token = await validateAccessToken();
      if (!token) {
        throw new Error('인증 토큰을 가져올 수 없습니다.');
      }

      const response = await fetch('/api/fastapi/payments/complete_virtual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservation_id: reservationId,
          method: method,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '결제에 실패했습니다.');
      }

      alert('결제가 완료되었습니다.');
      onClose(true);
    } catch (err) {
      alert(`결제 처리 중 오류가 발생했습니다: ${(err as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => onClose(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-xl p-6 shadow-xl relative w-[90%] max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => onClose(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black z-10">
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4">お支払い</h2>

            {isLoading && <div className="text-center py-8">결제 정보 로딩 중...</div>}
            {error && <div className="text-center py-8 text-red-500">에러: {error}</div>}
            {data && <PaymentForm paymentData={data} onPaymentInitiate={handlePaymentInitiate} isSubmitting={isSubmitting} />}
            {!isLoading && !error && !data && (
              <div className="text-center py-8 text-gray-500">결제 정보를 불러올 수 없습니다.</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
