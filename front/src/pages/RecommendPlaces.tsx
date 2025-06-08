import { useState, useEffect } from "react";
// import recommandeddata from "../data/recommandeddata.json"
import { AnimatePresence, motion } from "motion/react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';

function MyPage() {
    const [selectedData, setSelectedData] = useState(null);
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [skeletonCount, setSkeletonCount] = useState(10);

    const hotel = {
        name: "京王プレッソイン東京駅八重洲",
        address: "東京都"
    }

    useEffect(() => {
        setLoading(true)
        fetch(`http://localhost:8080/api/places/search?q=${hotel.address} ${hotel.name}`)
            .then(res => {
                if (!res.ok) throw new Error('요청 실패!')
                return res.json()
            })
            .then(data => {
                console.log(data)
                setData(data)
                setSkeletonCount(data.length)
                setLoading(false)
            })
            .catch(err => {
                console.error(err);
                setLoading(false)
            })
    }, [])

    const mockData = [
        {
            name: "테스트 호텔 1",
            photoUrl: "https://via.placeholder.com/150",
            rating: "4.5",
            category: "비즈니스 호텔",
            review: "좋은 위치에 있어요!"
        },
        {
            name: "테스트 호텔 2",
            photoUrl: "https://via.placeholder.com/150",
            rating: "4.0",
            category: "캡슐 호텔",
            review: "깔끔하고 조용함"
        }
    ];
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setData(mockData);
            setLoading(false);
        }, 1500); // 로딩 효과를 보기 위해 일부러 지연
    }, []);


    return (
        <div className="flex flex-row w-full h-screen">
            <div className="w-1/3 flex flex-wrap overflow-y-scroll">
                {loading ? (
                    Array.from({ length: skeletonCount }).map((_, idx) => (
                        <div key={idx} className="w-[95%] m-x">
                            <Skeleton height={100} className="rounded-xl" />
                        </div>
                    ))
                ) : (

                    data.map((da, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedData(da)}
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
                                src={da.photoUrl}
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
                                    {da.name}
                                </div>
                                <div
                                    className="

                                    ">
                                    {da.rating}
                                </div>
                                <div>
                                    {da.category}
                                </div>
                                <div>
                                    {da.review}
                                </div>
                            </div>
                        </div>
                    )))}
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