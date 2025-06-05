import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'
import { motion } from 'motion/react';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const user = login(email, password);

        if (user) {
            alert(`${user.name}さん！こんいちは！`);
            navigate('/');
        } else {
            alert('e-mailとpasswordを確認してください！');
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
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-center">ログイン</h2>
                    <input
                        type="email"
                        placeholder="e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border px-4 py-2 rounded-lg"
                        required
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border px-4 py-2 rounded-lg"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        完了！
                    </button>
                    
                    <Link
                        to="/signup"
                        className="text-sm text-blue-600 hover:underline text-center"
                    >
                        アカウントを作ろう！
                    </Link>
                </form>
                <a href="/" className="block text-center mt-2 text-sm text-gray-600 hover:underline">帰る</a>
            </div>
        </motion.div>
    );
}

export default LoginPage;