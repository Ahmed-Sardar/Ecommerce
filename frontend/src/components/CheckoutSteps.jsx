import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <nav className="flex justify-center mb-8">
            <ol className="flex items-center space-x-8">
                <li>
                    {step1 ? (
                        <Link to="/login" className="text-gray-800 font-semibold hover:underline">
                            Sign In
                        </Link>
                    ) : (
                        <span className="text-gray-400 cursor-not-allowed">Sign In</span>
                    )}
                </li>
                <li>
                    {step2 ? (
                        <Link to="/shipping" className="text-gray-800 font-semibold hover:underline">
                            Shipping
                        </Link>
                    ) : (
                        <span className="text-gray-400 cursor-not-allowed">Shipping</span>
                    )}
                </li>
                <li>
                    {step3 ? (
                        <Link to="/payment" className="text-gray-800 font-semibold hover:underline">
                            Payment
                        </Link>
                    ) : (
                        <span className="text-gray-400 cursor-not-allowed">Payment</span>
                    )}
                </li>
                <li>
                    {step4 ? (
                        <Link to="/placeorder" className="text-gray-800 font-semibold hover:underline">
                            Place Order
                        </Link>
                    ) : (
                        <span className="text-gray-400 cursor-not-allowed">Place Order</span>
                    )}
                </li>
            </ol>
        </nav>
    );
};

export default CheckoutSteps;
