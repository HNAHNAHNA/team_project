import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { PaymentRecord } from "../../types/PaymentRecord";

function PaymentHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    if (user) {
      const dummyPayments: PaymentRecord[] = [
        {
          id: 1,
          hotelName: "도쿄 시티 호텔",
          date: "2025-06-01",
          amount: 12800,
          status: "결제완료",
        },
        {
          id: 2,
          hotelName: "오사카 그랜드 인",
          date: "2025-05-20",
          amount: 17500,
          status: "결제완료",
        },
      ];
      setPayments(dummyPayments);
    }
  }, [user]);

  return (
    <div className="p-4">
      {payments.length === 0 ? (
        <p className="text-gray-500">결제 내역이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {payments.map((payment) => (
            <li key={payment.id} className="border rounded-md p-4 shadow-sm">
              <div className="font-semibold">{payment.hotelName}</div>
              <div className="text-sm text-gray-600">결제일: {payment.date}</div>
              <div className="text-sm text-gray-600">금액: ¥{payment.amount.toLocaleString()}</div>
              <div className="text-sm text-green-600">{payment.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PaymentHistory;