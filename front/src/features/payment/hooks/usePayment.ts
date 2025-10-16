import { useState, useEffect, useCallback } from 'react';
import type { PaymentHistoryItem } from '../../../types/payments';
import { useAuth } from '../../../contexts/AuthContext';

export const usePaymentHistory = () => {
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { validateAccessToken } = useAuth();

  const fetchPaymentHistory = useCallback(async () => {
    setIsLoading(true);
    const token = await validateAccessToken();
    if (!token) {
      setError("인증이 필요합니다. 다시 로그인해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/fastapi/payments/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('결제 내역을 불러오는 데 실패했습니다.');
      }
      const data = await response.json();
      setHistory(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [validateAccessToken]);

  useEffect(() => {
    fetchPaymentHistory();
  }, [fetchPaymentHistory]);

  return { history, isLoading, error, refetch: fetchPaymentHistory };
};