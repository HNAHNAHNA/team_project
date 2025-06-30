function DebugButton() {

    const handleClick = async () => {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:8000/api/fastapi/reservations/debug", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        console.log("🧪 백엔드에서 받아온 user_id:", data.user_id);
    };
    return (
        <button onClick={handleClick} className="bg-blue-500 text-white px-4 py-2 rounded">
            유저 ID 확인
        </button>
    )
}

export default DebugButton
