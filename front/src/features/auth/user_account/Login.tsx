import { useState } from 'react';

type LoginFormProps = {
    onLogin: (email: string, password: string) => void;
};

function Login({ onLogin }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold text-center">로그인</h2>

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
                    로그인
                </button>
                <a href="/signup" className="text-sm text-blue-600 hover:underline text-center">
                    회원가입이 필요하신가요?
                </a>
            </form>

        </div>
    );
}

export default Login