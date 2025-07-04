import { motion } from "framer-motion";
import { useState } from "react";

function SignUp() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    username: "",
    phoneNumber: "",
    zipcode: "",
    addressMain: "",
    addressDetail: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("/api/v1/users/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      const message = await response.text();
      alert(message);
      window.location.href = "/";
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(245,242,236)] bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-center mb-1">회원가입</h2>

          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
            className="border px-4 py-2 rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
            className="border px-4 py-2 rounded-lg"
          />
          <input
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            value={form.passwordConfirm}
            onChange={handleChange}
            required
            className="border px-4 py-2 rounded-lg"
          />
          <input
            type="text"
            name="username"
            placeholder="사용자 이름"
            value={form.username}
            onChange={handleChange}
            required
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="tel"
            name="phoneNumber"
            placeholder="전화번호 (예: 010-1234-5678)"
            value={form.phoneNumber}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg"
          />
          {/* <input
            type="text"
            name="zipcode"
            placeholder="우편번호"
            value={form.zipcode}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg"
          />
          <input
            type="text"
            name="addressMain"
            placeholder="기본 주소"
            value={form.addressMain}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg"
          />
          <input
            type="text"
            name="addressDetail"
            placeholder="상세 주소"
            value={form.addressDetail}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg"
          /> */}

          <button
            type="submit"
            className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            완료
          </button>
        </form>
        <a
          href="/"
          className="block text-center mt-2 text-sm text-gray-600 hover:underline"
        >
          돌아가기
        </a>
      </div>
    </motion.div>
  );
}

export default SignUp;
