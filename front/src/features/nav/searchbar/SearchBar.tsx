// import ParentComponent from "./ParentCalendarComponent"
// import VisitCountry from "./features/VisitCountry"
// import People from "./features/People"
import { BiSearch, BiMap } from 'react-icons/bi'

function SearchBar() {
    return (
        <div
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
                ">
                <div
                    className="
                        h-full
                        text-sm
                        font-semibold
                        px-6
                        rounded-full
                        hover:bg-gray-200
                        text-center
                    ">
                    <BiMap size={20} />
                    <p
                        className="
                            text-sm
                            text-gray-500    
                        ">Location</p>
                </div>
                <div className="hidden sm:block px-0 border-l-[1px]">
                    <div
                        className="
                        text-sm
                        font-semibold
                        px-6
                        flex-1
                        text-center
                        hover:bg-gray-200
                        rounded-full
                    ">
                        チェックイン
                        <p
                            className="
                            text-sm
                            text-gray-500    
                        ">Check In</p>
                    </div>
                </div>
                <div className="hidden sm:block border-x-[1px]">
                    <div
                        className="
                        text-sm
                        font-semibold
                        px-6
                        flex-1
                        text-center
                        rounded-full
                        hover:bg-gray-200
                    ">
                        チェックアウト
                        <p
                            className="
                            text-sm
                            text-gray-500    
                        ">Check Out</p>
                    </div>
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
    )
}

export default SearchBar