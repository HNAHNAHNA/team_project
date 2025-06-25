import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

function PaymentHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);



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