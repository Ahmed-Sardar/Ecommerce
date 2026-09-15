const Skeleton = ({ className = '' }) => {
    return (
        <div className={`animate-pulse bg-gray-200 rounded-2xl ${className}`}></div>
    );
};

export const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-full">
            <div className="aspect-[4/5] bg-gray-200 animate-pulse"></div>
            <div className="p-5 flex flex-col flex-grow space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="mt-auto flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
