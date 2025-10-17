import { useState, useEffect } from 'react';
import type { PaymentPrepResponse } from '../../../types/payments';
import { useAuth } from '../../../contexts/AuthContext';

export const usePaymentPrep = (reservationId: number | null) => {
  const [data, setData] = useState<PaymentPrepResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { validateAccessToken } = useAuth();

  useEffect(() => {
    if (!reservationId) {
      return;
    }

    const fetchPaymentPrepData = async () => {
      setIsLoading(true);
      setError(null);
      const token = await validateAccessToken();
      if (!token) {
        setError("인증이 필요합니다.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/fastapi/payments/prepare/${reservationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('결제 정보를 불러오는 데 실패했습니다.');
        }
        const prepData = await response.json();
        setData(prepData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentPrepData();
  }, [reservationId, validateAccessToken]);

  return { data, isLoading, error };
};
