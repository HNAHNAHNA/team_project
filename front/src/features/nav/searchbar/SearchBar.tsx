// import ParentComponent from "./ParentCalendarComponent"
// import VisitCountry from "./features/VisitCountry"
// import People from "./features/People"
import { useState } from 'react'
import { BiSearch, BiMap } from 'react-icons/bi'
import AnimeSearchBar from './features/AnimeSearchBar';
import { AnimatePresence } from 'motion/react';


function SearchBar() {
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

    const handleSearchClick = () => {
        setIsSearchBarOpen((prev) => !prev)
    }

    return (
        <>
            <div
                onClick={handleSearchClick}
                className="
                border-[1px]
                w-full
                md:w-auto
                rounded-full
                shadow-sm
                hover:shadow-md
                transition
                cursor-pointer
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
                    hover:bg-gray-200
                ">
                    <div
                        className="
                        h-full
                        text-sm
                        font-semibold
                        px-6
                        text-center
                        border-r-[1px]
                    ">
                        <BiMap size={20} />
                    </div>
                    <div
                        className="
                        text-sm
                        pl-6
                        pr-2
                        text-gray-600
                        flex
                        flex-row
                        items-center
                        gap-3
                    ">
                        <div className="hidden sm:block">Search</div>
                        <div
                            className="
                                p-2
                                bg-rose-500
                                rounded-full
                                text-white
                            ">
                            <BiSearch size={15} />
                        </div>
                    </div>

                </div>
            </div>
            <AnimatePresence>
                {isSearchBarOpen && <AnimeSearchBar onClose={() => setIsSearchBarOpen(false)} />}
            </AnimatePresence>
        </>
    )
}

export default SearchBar