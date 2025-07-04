import { AnimatePresence, motion } from 'motion/react'
import type { HotelBasicInfo } from '../../../types/HotelList';

type HotelInfo = HotelBasicInfo & {
    totalCharge?: number;
}

interface HotelModalProps {
    selectedData: HotelInfo | null;
    setSelectedData: (hotel: HotelInfo | null) => void;
    handleDetailButtonClick: (hotelNo: number) => void;
}

function HotelModal({ selectedData, setSelectedData, handleDetailButtonClick }: HotelModalProps) {
    console.log(selectedData?.totalCharge)
    return (
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
                            className="flex flex-col bg-white rounded-xl p-6 w-[90%] max-w-3xl h-auto max-h-[90vh] shadow-xl overflow-auto relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedData(null)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-black cursor-pointer hover:shadow-md hover:bg-neutral-100"
                            >
                                ❌
                            </button>
                            <div className='flex flex-row gap-4'>
                                <img
                                    src={selectedData.image_url ?? undefined}
                                    alt={selectedData.name}
                                    className="w-1/2 h-1/2 max-h object-cover rounded mb-4"
                                />
                                <div className='flex flex-col gap-4'>
                                    <h2 className="text-2xl font-bold mb-3">{selectedData.name}</h2>
                                    <p><strong>Rating:</strong> {selectedData.review_average}</p>
                                    <p><strong>charge:</strong> {selectedData.totalCharge}￥</p>
                                    <button
                                        className=''
                                        onClick={() => handleDetailButtonClick(selectedData.accommodation_id)}>
                                        자세히 보려면 클릭!
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}

export default HotelModal
