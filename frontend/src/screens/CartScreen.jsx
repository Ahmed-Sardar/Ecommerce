import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import Message from '../components/Message';
import ImageWithFallback from '../components/ImageWithFallback';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message>
                        Your cart is empty <Link to="/" className="underline text-blue-600">Go Back</Link>
                    </Message>
                ) : (
                    <ul className="space-y-4">
                        {cartItems.map((item) => (
                            <li key={item._id} className="bg-white p-4 rounded shadow flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <ImageWithFallback src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    <Link to={`/product/${item._id}`} className="text-lg font-semibold hover:text-blue-600 text-gray-800">
                                        {item.name}
                                    </Link>
                                </div>
                                <div className="text-gray-700 font-bold">₹{item.price.toLocaleString('en-IN')}</div>
                                <div className="flex items-center">
                                    <select
                                        className="border rounded p-1 mr-4"
                                        value={item.qty}
                                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                    >
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => removeFromCartHandler(item._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">
                        Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                    </h2>
                    <div className="text-2xl font-bold text-gray-800 mb-4">
                        ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString('en-IN')}
                    </div>
                    <button
                        type="button"
                        className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        disabled={cartItems.length === 0}
                        onClick={checkoutHandler}
                    >
                        Proceed To Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartScreen;
