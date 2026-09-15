import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    // usePayOrderMutation,
    useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
import ImageWithFallback from '../components/ImageWithFallback';

const OrderScreen = () => {
    const { id: orderId } = useParams();

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        // Stripe setup logic would go here
    }, [order]);

    const onPayHandler = async () => {
        // Simulating payment for this demo
        try {
            await payOrder({ orderId, details: { id: 'TEST_ID', status: 'COMPLETED', update_time: String(Date.now()), email_address: order.user.email } });
            refetch();
            toast.success('Order is paid');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const deliverHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success('Order delivered');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
    ) : (
        <>
            <h1 className="text-2xl font-bold mb-4">Order {order._id}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="border-b pb-4 mb-4">
                        <h2 className="text-xl font-bold mb-2">Shipping</h2>
                        <p className="mb-2"><strong>Name: </strong> {order.user.name}</p>
                        <p className="mb-2"><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-blue-600 underline">{order.user.email}</a></p>
                        <p className="mb-2">
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <Message variant="success">Delivered on {order.deliveredAt}</Message>
                        ) : (
                            <Message variant="danger">Not Delivered</Message>
                        )}
                    </div>

                    <div className="border-b pb-4 mb-4">
                        <h2 className="text-xl font-bold mb-2">Payment Method</h2>
                        <p class="mb-2"><strong>Method: </strong> {order.paymentMethod}</p>
                        {order.isPaid ? (
                            <Message variant="success">Paid on {order.paidAt}</Message>
                        ) : (
                            <Message variant="danger">Not Paid</Message>
                        )}
                    </div>

                    <div className="border-b pb-4 mb-4">
                        <h2 className="text-xl font-bold mb-2">Order Items</h2>
                        {order.orderItems.length === 0 ? (
                            <Message>Order is empty</Message>
                        ) : (
                            <ul className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <li key={index} className="flex items-center space-x-4">
                                        <ImageWithFallback src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                        <Link to={`/product/${item.product}`} className="text-gray-800 hover:text-blue-600">
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
                            <span>₹{Number(order.itemsPrice).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 mb-2">
                            <span>Shipping</span>
                            <span>₹{Number(order.shippingPrice).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 mb-2">
                            <span>Tax</span>
                            <span>₹{Number(order.taxPrice).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 mb-2 font-bold text-lg">
                            <span>Total</span>
                            <span>₹{Number(order.totalPrice).toLocaleString('en-IN')}</span>
                        </div>

                        {!order.isPaid && (
                            <div className="mt-4">
                                {loadingPay ? <Loader /> : (
                                    <button
                                        onClick={onPayHandler}
                                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                                    >
                                        Test Pay Invoice (Simulate)
                                    </button>
                                )}
                                <p className="text-xs text-gray-500 mt-2 text-center">Using Test Mode - Click to Pay</p>
                            </div>
                        )}

                        {loadingDeliver && <Loader />}

                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <button
                                type="button"
                                className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 mt-4"
                                onClick={deliverHandler}
                            >
                                Mark As Delivered
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderScreen;
