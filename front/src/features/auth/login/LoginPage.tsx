import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from './authService';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const user = login(email, password);

        if (user) {
            alert(`${user.name}님 환영합니다!`);
            navigate('/');
        } else {
            alert('이메일 또는 비밀번호가 틀렸습니다.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[rgb(245,242,236)]">
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
                <Link
                    to="/signup"
                    className="text-sm text-blue-600 hover:underline text-center"
                >
                    회원가입이 필요하신가요?
                </Link>
            </form>
        </div>
    );
}

export default LoginPage;