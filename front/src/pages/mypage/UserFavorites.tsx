import { useEffect, useState } from "react"
import type { Favorite } from "../../types/favorites";
import Skeleton from "react-loading-skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const UserFavorites = ({ userId }: { userId: number }) => {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(false);
    const [skeletonCount, setSkeletonCount] = useState(5);
    const [selectedData, setSelectedData] = useState<Favorite | null>(null);
    const navigate = useNavigate();

    const favoriteModalToDetailPage = async () => {
        console.log("👉 selectedData:", selectedData);
        console.log("👉 accommodation_id:", selectedData?.accommodation?.accommodation_id);

        if (!selectedData) return;
        
        const res = await fetch(`http://15.164.129.209/api/fastapi/favorites/hotel-no?accommodation_id=${selectedData.accommodation.accommodation_id}`);
        const data = await res.json();
        navigate(`/detail/${data.hotel_no}`);
    }

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://15.164.129.209/api/fastapi/favorites/${userId}`);
                if (!res.ok) throw new Error("찜 목록 불러오기 실패");

                const data: Favorite[] = await res.json();
                setFavorites(data);
                setSkeletonCount(data.length);
            } catch (err) {
                console.error("❌ 에러:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [userId]);

    const deleteFavoriteButtonClickHandler = async (userId: number, selectedData: Favorite) => {
        try {
            const res = await fetch(`http://15.164.129.209/api/fastapi/favorites/delete?user_id=${userId}&accommodation_id=${selectedData.accommodation.accommodation_id}`,
                { method: "DELETE" }
            );
            if (!res.ok) throw new Error("削除失敗！")

            alert("削除完了！")
            setFavorites(prev =>
                prev.filter(fav => fav.accommodation.accommodation_id !== selectedData.accommodation.accommodation_id)
            );
            setSelectedData(null);

        } catch (err) {
            console.error("에러발생!!!!", err)
        }
    }

    return (
        <div>
            <h2>내 찜한 숙소</h2>
            {loading ? (
                Array.from({ length: skeletonCount }).map((_, idx) => (
                    <div key={idx} className="w-[95%] mb-4">
                        <Skeleton height={100} baseColor="#e0e0e0" highlightColor="#f5f5f5" className="rounded-xl" />
                    </div>
                ))
            ) : (
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    {favorites.map(fav => (
                        <div key={fav.favorite_id} onClick={() => setSelectedData(fav)}>
                            <div className="flex flex-row bg-gray-300 cursor-pointer m-2 gap-4 hover:bg-neutral-300 rounded-xl border-1 justify-between items-center p-4 ">
                                <div className="w-[40%] min-w-[120px] rounded-xl p-2 overflow-hidden">
                                    <img src={fav.accommodation.image_url}
                                        className="w-full h-[160px] object-cover rounded-xl" />
                                </div>
                                <div className="text-right mr-5">
                                    <h3>{fav.accommodation.name}</h3>
                                    <p>{fav.accommodation.address}</p>
                                    <p>いいね！押した日 : {new Date(fav.created_at).toLocaleDateString("ja-JP")}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div>
                <AnimatePresence>
                    {selectedData && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                            onClick={() => setSelectedData(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedData(null)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-black cursor-pointer hover:shadow-md hover:bg-neutral-100"
                                >
                                    ❌
                                </button>

                                <h2 className="text-2xl font-bold mb-3">{selectedData.accommodation.name}</h2>
                                <img
                                    src={selectedData.accommodation.image_url}
                                    alt={selectedData.accommodation.name}
                                    className="w-full h-48 object-cover rounded mb-4"
                                />
                                <div
                                    className=""
                                    onClick={() => {
                                        if (selectedData) favoriteModalToDetailPage();
                                    }}
                                >
                                    자세히보기
                                </div>
                                <div
                                    onClick={() => deleteFavoriteButtonClickHandler(userId, selectedData)}
                                >
                                    削除
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default UserFavorites;
