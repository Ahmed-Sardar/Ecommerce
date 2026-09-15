import { Link, useLocation } from 'react-router-dom';
import Rating from './Rating';
import { FiEye, FiHeart, FiShoppingCart } from 'react-icons/fi';
import ImageWithFallback from './ImageWithFallback';

const ProductCard = ({ product, className = '', variant = 'vertical', rounded = false, pageType = 'default' }) => {
    const location = useLocation();
    const isHorizontal = variant === 'horizontal';

    // Auto-detect page type from URL query param when not explicitly provided
    const getAutoDetectedPageType = () => {
        if (pageType !== 'default') return pageType;
        const searchParams = new URLSearchParams(location.search);
        const pageNumber = searchParams.get('page') || '1';
        switch (pageNumber) {
            case '1': return 'luxe';
            case '2': return 'glassmorphic';
            case '3': return 'browse-heavy';
            case '4': return 'price-sensitive';
            case '5': return 'fashion';
            default:  return 'luxe';
        }
    };

    const detectedPageType = getAutoDetectedPageType();

    const getPageSpecificClasses = () => {
        switch (detectedPageType) {
            case 'luxe':
                return {
                    card: 'group relative bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-accent/30 hover:shadow-accent/20 h-full flex',
                };
            case 'glassmorphic':
                return {
                    card: 'group relative bg-white/70 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/80 hover:shadow-2xl hover:-translate-y-2 h-full flex',
                    actionButtons: 'absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0',
                };
            case 'browse-heavy':
                return {
                    card: 'group relative bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 h-full flex',
                    actionButtons: 'absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0',
                };
            case 'price-sensitive':
                return {
                    card: 'group relative bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 h-full flex',
                    price: 'transition-all duration-200 group-hover:font-bold',
                };
            case 'fashion':
                return {
                    card: 'group relative bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 h-full flex',
                    image: 'transition-transform duration-300 ease-out group-hover:scale-105',
                };
            default:
                return {
                    card: 'group relative bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 h-full flex',
                };
        }
    };

    const pageClasses = getPageSpecificClasses();

    const imageUrl = product.image?.startsWith('http')
        ? product.image
        : `http://localhost:5000/${product.image.replace(/\\/g, '/')}`;

    return (
        // Plain div — no Framer Motion, no opacity:0 start, no variant dependency.
        // All animation is pure CSS (transition-* classes) so nothing depends on JS timing.
        <div
            className={`${pageClasses.card} ${isHorizontal ? 'flex-row items-center border-none shadow-sm hover:translate-x-1' : 'flex-col hover:-translate-y-1 rounded-xl'} ${className}`}
        >
            {/* Floating Action Buttons — glassmorphic / browse-heavy only */}
            {(detectedPageType === 'glassmorphic' || detectedPageType === 'browse-heavy') && !isHorizontal && (
                <div className={pageClasses.actionButtons}>
                    <button
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-primary hover:bg-white shadow-lg border border-white/20 transition-colors"
                        title="Quick View"
                    >
                        <FiEye size={16} />
                    </button>
                    <button
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-red-500 hover:bg-white shadow-lg border border-white/20 transition-colors"
                        title="Add to Wishlist"
                    >
                        <FiHeart size={16} />
                    </button>
                    <button
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-primary hover:bg-white shadow-lg border border-white/20 transition-colors"
                        title="Add to Cart"
                    >
                        <FiShoppingCart size={16} />
                    </button>
                </div>
            )}

            {/* Image */}
            <Link
                to={`/product/${product._id}`}
                className={`block relative overflow-hidden bg-white p-4 flex items-center justify-center ${isHorizontal ? 'w-1/3 h-full pr-0' : 'w-full aspect-[4/5]'}`}
            >
                <ImageWithFallback
                    src={imageUrl}
                    alt={product.name}
                    className={`object-contain mix-blend-multiply ${pageClasses.image || 'transition-transform duration-500 group-hover:scale-105'} ${isHorizontal ? 'h-32 w-auto' : 'h-full w-full'} ${rounded ? 'rounded-[2rem]' : ''}`}
                />
            </Link>

            {/* Info */}
            <div className={`flex flex-col flex-grow ${isHorizontal ? 'p-4 pl-6 justify-center' : 'p-4'}`}>
                <span className="text-[10px] sm:text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">
                    {product.category}
                </span>

                <Link to={`/product/${product._id}`} className="block mb-1">
                    <h3 className={`font-medium text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 ${isHorizontal ? 'text-lg' : 'text-sm sm:text-base'}`}>
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center mb-2">
                    <Rating value={product.rating} text={`(${product.numReviews})`} color="#faaf00" />
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className={`text-xl font-bold text-gray-900 ${pageClasses.price || ''}`}>
                            ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.price > 1000 && (
                            <span className="text-xs text-gray-500">Free Delivery</span>
                        )}
                    </div>

                    {!isHorizontal && (
                        <button
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors"
                            title="View Details"
                        >
                            <FiEye />
                        </button>
                    )}
                </div>

                {isHorizontal && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
