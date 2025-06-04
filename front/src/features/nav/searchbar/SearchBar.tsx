import ParentComponent from "./ParentCalendarComponent"
import VisitCountry from "./features/VisitCountry"
import People from "./features/People"

function SearchBar () {
    return (
        <div className="h-[64px] flex flex-row items-center justify-between border border-gray-100 rounded-full  ">
            <VisitCountry />
            <ParentComponent />
            <People />
        </div>
    )
}

export default SearchBar