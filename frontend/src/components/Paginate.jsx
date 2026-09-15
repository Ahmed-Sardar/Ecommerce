import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
    return (
        pages > 1 && (
            <div className="flex justify-center mt-12 space-x-2">
                {[...Array(pages).keys()].map((x) => (
                    <Link
                        key={x + 1}
                        to={
                            !isAdmin
                                ? keyword
                                    ? `/search/${keyword}/page/${x + 1}`
                                    : `/page/${x + 1}`
                                : `/admin/productlist/${x + 1}`
                        }
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${x + 1 === page
                            ? 'bg-black text-white shadow-lg scale-110'
                            : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-black border border-gray-100'
                            }`}
                    >
                        {x + 1}
                    </Link>
                ))}
            </div>
        )
    );
};

export default Paginate;
