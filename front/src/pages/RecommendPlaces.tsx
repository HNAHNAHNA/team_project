import { useState } from "react";
import recommandeddata from "../data/recommandeddata.json"
import { AnimatePresence, motion } from "motion/react";

function MyPage() {
    const [selectedData, setSelectedData] = useState(null);

    return (
        <div className="flex flex-row w-full h-screen">
            <div className="w-1/3 flex flex-wrap overflow-y-scroll">
                {recommandeddata
                    .map((data, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedData(data)}
                            className="
                            flex
                            flex-row
                            items-start
                            border-[1px]
                            rounded-xl
                            w-[95%]
                            gap-4
                            m-2
                            cursor-pointer
                            hover:bg-neutral-100
                            hover:shadow-md
                        ">
                            <img
                                src={data.photoUrl}
                                className="
                                rounded-xl
                                m-4
                                object-cover
                                w-24
                                h-24
                            ">
                            </img>
                            <div
                                className="
                                flex
                                flex-col
                                m-2
                            ">
                                <div
                                    className="
                                        text-xl
                                        font-bold
                                    ">
                                    {data.name}
                                </div>
                                <div
                                    className="

                                    ">
                                    {data.rating}
                                </div>
                                <div>
                                    {data.category}
                                </div>
                                <div>
                                    {data.review}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="w-2/3 bg-gray-500">
                <div className="w-full h-full text-white flex items-center justify-center">
                    지도 표시 영역
                </div>
            </div>
            <AnimatePresence>
                {selectedData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
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

                            <h2 className="text-2xl font-bold mb-3">{selectedData.name}</h2>
                            <img
                                src={selectedData.photoUrl}
                                alt={selectedData.name}
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                            <p><strong>Rating:</strong> {selectedData.rating}</p>
                            <p><strong>Category:</strong> {selectedData.category}</p>
                            <p className="mt-2">{selectedData.review}</p>
                            <div 
                                className="
                                
                                ">

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default MyPage


// <motion.div
//     initial={{ opacity: 0, scale: 0.8 }}
//     animate={{ opacity: 1, scale: 1 }}
//     exit={{ opacity: 0, scale: 0.8 }}
//     transition={{ duration: 0.3 }}
//     className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(245,242,236)] bg-opacity-50"
// >




// const [places, setPlaces] = useState<any[]>([]);
// const [error, setError] = useState<string | null>(null);


// const hotel = {
//     name: "京急ＥＸイン　秋葉原",
//     address: "東京都"
// }
// useEffect(() => {
//     fetch(`http://localhost:8080/api/places/search?q=${hotel.address} ${hotel.name}`)
//         .then(res => {
//             if (!res.ok) throw new Error("API 요청 실패");
//             return res.json();
//         })
//         .then(data => setPlaces(data))
//         .catch(err => {
//             console.error("에러:", err);
//             setError(err.message);
//         });
// }, []);

{/* <div>
    <h2>장소 검색 결과</h2>
    {error && <p>에러: {error}</p>}
    {places.length === 0 ? (
        <p>결과가 없습니다.</p>
    ) : (
        <ul>
            {places.map((place, idx) => (
                <li key={idx}>
                    <strong>{place.name}</strong> — {place.address}
                </li>
            ))}
        </ul>
    )}
</div> */}