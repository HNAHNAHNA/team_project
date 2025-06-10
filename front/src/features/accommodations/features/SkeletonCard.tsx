import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SkeletonCard() {
    return (
        <div className="flex flex-col justify-center items-center h-[80%] w-full rounded-xl bg-white p-2">
            <div className="w-full h-50">
                <Skeleton height="100%" width="100%" className="rounded-xl" />
            </div>

            <div className="mt-3 w-3/4">
                <Skeleton height={20} />
            </div>

            <div className="mt-2 w-1/2">
                <Skeleton height={16} />
            </div>
            
            <div className="mt-1 w-2/3">
                <Skeleton height={16} />
            </div>
        </div>
    );
}

export default SkeletonCard;