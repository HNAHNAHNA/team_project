import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { BiSearch, BiX } from 'react-icons/bi';
import { REGION_MAP } from '../../../../constants/regionMap';
import { useNavigate } from 'react-router-dom';

interface Props {
    onClose: () => void
}

const AnimeSearchBar: React.FC<Props> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const filteredRegions = Object.entries(REGION_MAP).filter(([_, name]) =>
        name.includes(searchText)
    )

    const handleRegionClick = (name: string) => {
        setSearchText(name);
    };

    const handleSearch = () => {
        if (searchText.trim()) {
            navigate(`/search?search=${encodeURIComponent(searchText.trim())}`);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md"
            >
                <div ref={modalRef} className="bg-white p-6 rounded-xl ">
                    <div
                        className="
                                border-[1px]
                                w-full
                                md:w-auto
                                rounded-full
                                shadow-sm
                                transition
                                overflow-x-auto
                                whitespace-nowrap
                            ">
                        <div
                            className="
                                    flex
                                    flex-row
                                    items-center
                                    justify-center
                                    flex-nowrap
                                    h-full
                                    py-2
                                ">
                            <div
                                className="
                                        h-full
                                        text-sm
                                        font-semibold
                                        px-4
                                        text-center
                                        border-r-[1px]
                                    ">
                                <div className="text-sm font-semibold text-center flex flex-row">
                                    <input
                                        type="text"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className="outline-none border-none bg-transparent focus:ring-0 placeholder-gray-400"
                                        placeholder="どこに行きますか？"
                                    />
                                    {searchText && (
                                        <button
                                            onClick={() => setSearchText("")}
                                            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                                        >
                                            <BiX size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div
                                onClick={handleSearch}
                                className="
                                        text-sm
                                        pl-6
                                        pr-2
                                         text-gray-600
                                        flex
                                        flex-row
                                        items-center
                                        gap-3
                                        transition-all
                                        duration-200
                                        group
                                        cursor-pointer
                                    ">
                                <div className="hidden sm:block group-hover:scale-105 transition-transform duration-200 will-change-transform">Search</div>
                                <div
                                    className="
                                            p-2
                                             bg-rose-500
                                             rounded-full
                                             text-white
                                            transition-transform
                                            duration-200
                                            group-hover:scale-110
                                            ">
                                    <BiSearch size={15} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 max-h-60 overflow-y-auto border rounded-md shadow-inner">
                        {filteredRegions.length > 0 ? (
                            filteredRegions.map(([key, name]) => (
                                <div
                                    key={key}
                                    className="px-5 py-2  hover:bg-gray-200 cursor-pointer text-sm"
                                    onClick={() => {
                                        handleRegionClick(name)
                                    }}
                                >
                                    {name}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-gray-400 text-sm">該当なし</div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AnimeSearchBar;