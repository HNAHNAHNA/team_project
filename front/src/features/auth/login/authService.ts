import userdummy from "../../../data/userdummy.json"
import { useNavigate } from "react-router-dom";

export function login (email: string, password: string) {

    const user = userdummy.find(
        (u) => u.email === email && u.password === password
    );

    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    }

    return null

}

export function logout(navigate: (path: string) => void) {

    localStorage.removeItem('user');
    navigate('/login')
}

export function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}