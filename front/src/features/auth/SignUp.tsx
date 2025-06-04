import { motion } from "framer-motion";
import { useState } from "react";

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
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
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-center">회원가입</h2>
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border px-4 py-2 rounded-lg"
                        required
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border px-4 py-2 rounded-lg"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        완료
                    </button>
                </form>
                <a href="/" className="block text-center mt-2 text-sm text-gray-600 hover:underline">돌아가기</a>
            </div>
        </motion.div>
    )
}

export default SignUp

// function onLogin(email: string, password: string) {
//     throw new Error("Function not implemented.");
// }
