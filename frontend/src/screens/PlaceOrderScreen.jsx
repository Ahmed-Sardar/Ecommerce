import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import ImageWithFallback from '../components/ImageWithFallback';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems.map((item) => ({
                    ...item,
                    product: item._id, // Backend expects 'product' field as the ID
                })),
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="border-b pb-4 mb-4">
                        <h2 className="text-xl font-bold mb-2">Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    <div className="border-b pb-4 mb-4">
                        <h2 className="text-xl font-bold mb-2">Payment Method</h2>
                        <strong>Method: </strong>
                        {cart.paymentMethod}
                    </div>

                    <div className="border-b pb-4 mb-4">
                        <h2 className="text-xl font-bold mb-2">Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <Message>Your cart is empty</Message>
                        ) : (
                            <ul className="space-y-4">
                                {cart.cartItems.map((item, index) => (
                                    <li key={index} className="flex items-center space-x-4">
                                        <ImageWithFallback src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                        <Link to={`/product/${item._id}`} className="text-gray-800 hover:text-blue-600">
                                            {item.name}
                                        </Link>
                                        <div className="text-gray-600">
                                            {item.qty} x ₹{item.price.toLocaleString('en-IN')} = ₹{(item.qty * item.price).toLocaleString('en-IN')}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded shadow border">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="flex justify-between border-b pb-2 mb-2">
                            <span>Items</span>
                            <span>₹{Number(cart.itemsPrice).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 mb-2">
                            <span>Shipping</span>
                            <span>₹{Number(cart.shippingPrice).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 mb-2">
                            <span>Tax</span>
                            <span>₹{Number(cart.taxPrice).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 mb-2 font-bold text-lg">
                            <span>Total</span>
                            <span>₹{Number(cart.totalPrice).toLocaleString('en-IN')}</span>
                        </div>

                        {error && <Message variant="danger">{error?.data?.message || error.error}</Message>}

                        <button
                            type="button"
                            className="w-full bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded hover:bg-yellow-500 mt-4"
                            disabled={cart.cartItems.length === 0}
                            onClick={placeOrderHandler}
                        >
                            Place Order
                        </button>
                        {isLoading && <Loader />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlaceOrderScreen;
