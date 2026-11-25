import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaTimes } from 'react-icons/fa';

const OrderListScreen = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Orders</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error}</Message>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">ID</th>
                                <th className="py-2 px-4 border-b text-left">USER</th>
                                <th className="py-2 px-4 border-b text-left">DATE</th>
                                <th className="py-2 px-4 border-b text-left">TOTAL</th>
                                <th className="py-2 px-4 border-b text-left">PAID</th>
                                <th className="py-2 px-4 border-b text-left">DELIVERED</th>
                                <th className="py-2 px-4 border-b"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="py-2 px-4 border-b">{order._id}</td>
                                    <td className="py-2 px-4 border-b">{order.user && order.user.name}</td>
                                    <td className="py-2 px-4 border-b">{order.createdAt.substring(0, 10)}</td>
                                    <td className="py-2 px-4 border-b">₹{Number(order.totalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="py-2 px-4 border-b">
                                        {order.isPaid ? (
                                            <span className="text-green-600">{order.paidAt.substring(0, 10)}</span>
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {order.isDelivered ? (
                                            <span className="text-green-600">{order.deliveredAt.substring(0, 10)}</span>
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <Link to={`/order/${order._id}`} className="bg-gray-100 px-3 py-1 rounded text-sm hover:bg-gray-200">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default OrderListScreen;
