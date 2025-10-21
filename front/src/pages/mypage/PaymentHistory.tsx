import { usePaymentHistory } from '../../features/payment/hooks/usePayment';
import { useAuth } from '../../contexts/AuthContext';

const PaymentHistory = () => {
  const { history, isLoading, error, refetch } = usePaymentHistory();
  const { validateAccessToken } = useAuth();

  const handleCancel = async (paymentId: number) => {
    if (!window.confirm('정말로 결제를 취소하시겠습니까?')) {
      return;
    }

    try {
      const token = await validateAccessToken();
      if (!token) {
        throw new Error('인증이 필요합니다.');
      }

      const response = await fetch(`/api/fastapi/payments/cancel/${paymentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '결제 취소에 실패했습니다.');
      }

      alert('결제가 성공적으로 취소되었습니다.');
      refetch(); // Refetch the history
    } catch (err) {
      alert(`오류: ${(err as Error).message}`);
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  if (history.length === 0) {
    return <div>결제 내역이 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div key={item.payment_id} className="p-4 border rounded-lg shadow-sm bg-white">
          <h4 className="font-bold text-lg">{item.hotel_name}</h4>
          <p className="text-sm text-gray-600">
            {item.check_in_date} ~ {item.check_out_date}
          </p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-lg font-semibold">
              {new Intl.NumberFormat('ja-JP').format(item.amount)}円
            </span>
            <div className="flex items-center space-x-4">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-800'
                    : item.status === 'CANCELLED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                {item.status}
              </span>
              {item.status === 'COMPLETED' && (
                <button
                  onClick={() => handleCancel(item.payment_id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  キャンセル
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            支払い日: {item.paid_at ? new Date(item.paid_at).toLocaleString('ja-JP') : '-'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PaymentHistory;