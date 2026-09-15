import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    useGetProductDetailsQuery,
    useCreateReviewMutation,
} from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ImageWithFallback from '../components/ImageWithFallback';
import heroImage from '../hero.png';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const {
        data: product,
        isLoading,
        error,
        refetch,
    } = useGetProductDetailsQuery(productId);

    

    const { userInfo } = useSelector((state) => state.auth);

    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createReview({
                productId,
                rating,
                comment,
            }).unwrap();
            refetch();
            toast.success('Review created successfully');
            setRating(0);
            setComment('');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const increaseQty = () => {
        if (product && qty < product.countInStock) setQty(qty + 1);
    }

    const decreaseQty = () => {
        if (qty > 1) setQty(qty - 1);
    }

//     const imageUrl =
//   product.image?.startsWith("http")
//     ? product.image
//     : `http://localhost:5000/${product.image.replace(/\\/g, "/")}`;

        const imageUrl = product?.image
  ? product.image.startsWith("http")
    ? product.image
    : `http://localhost:5000/${product.image.replace(/\\/g, "/")}`
  : "/images/placeholder.svg";
    return (
        <div className="min-h-screen pt-24 pb-24">
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="container mx-auto px-6">
                    <Link className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-10 transition-colors" to="/">
                        <FiArrowLeft className="mr-2" /> Back to Collection
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Product Image Section - Sticky on Desktop */}
                        <div className="lg:sticky lg:top-32 h-fit">
                            <div className="lg:sticky lg:top-32 h-fit">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-[#F5F5F7] rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8"
                                >
                                    {/* <ImageWithFallback
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-105 duration-500"
                                    /> */}
                                    {/* <ImageWithFallback
                                    src={`http://localhost:5000/${product.image.replace(/\\/g, "/")}`}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                    /> */}
                                    {/* <ImageWithFallback
                                        src={
                                        product.image
                                          ? `http://localhost:5000/${product.image.replace(/\\/g, "/")}`
                                       : "/images/placeholder.jpg"
                                         }
                                        alt={product.name}
                                        /> */}

                                        {/* <ImageWithFallback
                                         src={
                                        product.image?.startsWith("http")
                                        ? product.image
                                        : `http://localhost:5000/${product.image.replace(/\\/g, "/")}`
                                        }
                                        alt={product.name}
                                       /> */}
                                        
                                         {/* <ImageWithFallback 
                                        
      src={imageUrl}
    alt={product.name}
    className={`object-contain mix-blend-multiply ${
        pageClasses.image || "transition-transform duration-500 group-hover:scale-105"
    } ${isHorizontal ? "h-32 w-auto" : "h-full w-full"} ${
        rounded ? "rounded-[2rem]" : ""
    }`}
                                         /> */}
                                         <ImageWithFallback
    src={imageUrl}
    alt={product.name}
    className="w-full h-full object-contain"
/>
                                </motion.div>
                            </div>
                        </div>

                        {/* Product Info Section */}
                        <div className="flex flex-col">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="mb-2">
                                    <span className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase">{product.category}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4 leading-tight">
                                    {product.name}
                                </h1>
                                <div className="flex items-center space-x-4 mb-8">
                                    <h2 className="text-3xl font-medium text-black">₹{product.price.toLocaleString('en-IN')}</h2>
                                    <div className="h-6 w-px bg-gray-300"></div>
                                    <div className="flex items-center">
                                        <Rating value={product.rating} text={`(${product.numReviews} Reviews)`} />
                                    </div>
                                </div>

                                <p className="text-gray-600 text-lg leading-relaxed mb-10 font-light">
                                    {product.description}
                                </p>

                                {product.features && product.features.length > 0 && (
                                    <div className="mb-10">
                                        <h3 className="text-lg font-bold mb-4">Key Features</h3>
                                        <ul className="space-y-2">
                                            {product.features.map((feature, index) => (
                                                <li key={index} className="flex items-start text-gray-700">
                                                    <span className="mr-2 text-primary">•</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Add to Cart Box */}
                                <div className="p-8 rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-100/50 mb-12">
                                    <div className="flex flex-col space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Availability</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>

                                        {product.countInStock > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Quantity</span>
                                                <div className="flex items-center space-x-4 bg-gray-50 rounded-full px-4 py-2">
                                                    <button onClick={decreaseQty} disabled={qty <= 1} className="p-1 hover:text-black text-gray-400 transition-colors disabled:opacity-30"><FiMinus /></button>
                                                    <span className="font-bold w-4 text-center">{qty}</span>
                                                    <button onClick={increaseQty} disabled={qty >= product.countInStock} className="p-1 hover:text-black text-gray-400 transition-colors disabled:opacity-30"><FiPlus /></button>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            className={`w-full py-4 rounded-full text-white font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-all duration-300 transform active:scale-95 ${product.countInStock === 0
                                                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                                : 'bg-black hover:bg-gray-800 hover:shadow-xl'
                                                }`}
                                            type="button"
                                            disabled={product.countInStock === 0}
                                            onClick={addToCartHandler}
                                        >
                                            <FiShoppingCart />
                                            <span>{product.countInStock === 0 ? 'Sold Out' : 'Add to Cart'}</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Mid-Page Hero Banner */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="my-16 -mx-6 lg:-mx-16"
                            >
                                <div className="relative h-[60vh] w-full overflow-hidden bg-black text-white flex items-center justify-center rounded-3xl">
                                    {/* Background Image */}
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={heroImage}
                                            alt="Hero Banner"
                                            className="w-full h-full object-cover opacity-70"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="relative z-10 text-center px-6">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.3 }}
                                            viewport={{ once: true }}
                                        >
                                            <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-4 leading-tight">
                                                Discover More
                                            </h2>
                                            <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light">
                                                Explore our complete collection of premium products designed for excellence.
                                            </p>
                                            <Link 
                                                to="/" 
                                                className="inline-block px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                                            >
                                                Shop Collection
                                            </Link>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Reviews Section */}
                            <div className="mt-10 pt-10 border-t border-gray-100">
                                <h3 className="text-2xl font-heading font-bold mb-8">Customer Reviews</h3>
                                {product.reviews.length === 0 && <Message variant="info">No reviews yet. Be the first!</Message>}

                                <div className="space-y-8">
                                    {product.reviews.map((review) => (
                                        <div key={review._id} className="bg-gray-50 p-6 rounded-2xl">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm">{review.name}</h4>
                                                        <span className="text-xs text-gray-500">{review.createdAt.substring(0, 10)}</span>
                                                    </div>
                                                </div>
                                                <Rating value={review.rating} />
                                            </div>
                                            <p className="text-gray-600 italic">"{review.comment}"</p>
                                        </div>
                                    ))}

                                    <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                                        <h3 className="text-xl font-bold mb-6">Write a Review</h3>
                                        {loadingProductReview && <Loader />}
                                        {userInfo ? (
                                            <form onSubmit={submitHandler}>
                                                <div className="mb-6">
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                                                    <select
                                                        className="w-full bg-[#F5F5F7] border-transparent focus:bg-white focus:border-black rounded-lg p-3 transition-colors outline-none border-2"
                                                        value={rating}
                                                        onChange={(e) => setRating(Number(e.target.value))}
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value="1">1 - Poor</option>
                                                        <option value="2">2 - Fair</option>
                                                        <option value="3">3 - Good</option>
                                                        <option value="4">4 - Very Good</option>
                                                        <option value="5">5 - Excellent</option>
                                                    </select>
                                                </div>
                                                <div className="mb-6">
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                                                    <textarea
                                                        className="w-full bg-[#F5F5F7] border-transparent focus:bg-white focus:border-black rounded-lg p-3 transition-colors outline-none border-2"
                                                        rows="3"
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                        placeholder="Share your thoughts..."
                                                    ></textarea>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="btn-primary w-full md:w-auto"
                                                    disabled={loadingProductReview}
                                                >
                                                    Submit Review
                                                </button>
                                            </form>
                                        ) : (
                                            <Message>
                                                Please <Link to="/login" className="underline font-bold">sign in</Link> to write a review
                                            </Message>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductScreen;
