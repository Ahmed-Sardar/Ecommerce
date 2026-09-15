import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';
import { useCreateRazorpayOrderMutation } from '../slices/ordersApiSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;
    
    const { userInfo } = useSelector((state) => state.auth);
    
    const [createRazorpayOrder] = useCreateRazorpayOrderMutation();

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    // Load Razorpay script
    useEffect(() => {
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        loadRazorpayScript();
    }, []);

    const handleRazorpayPayment = async () => {
        try {
            // Create Razorpay order on backend
            const razorpayOrder = await createRazorpayOrder(cart.totalPrice).unwrap();
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Use env variable or fallback
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'E-Commerce Store',
                description: 'Order Payment',
                order_id: razorpayOrder.id,
                handler: function (response) {
                    // Payment successful
                    console.log('Payment successful:', response);
                    alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                    dispatch(savePaymentMethod('Razorpay'));
                    navigate('/placeorder');
                },
                prefill: {
                    name: userInfo?.name || '',
                    email: userInfo?.email || '',
                },
                theme: {
                    color: '#1f2937', // Match your app's theme
                },
                modal: {
                    ondismiss: function() {
                        // Payment cancelled
                        console.log('Payment cancelled by user');
                        alert('Payment cancelled');
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                alert(`Payment failed: ${response.error.description}`);
            });
            
            razorpay.open();
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            alert('Error initiating payment. Please try again.');
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        
        if (paymentMethod === 'Razorpay') {
            handleRazorpayPayment();
        } else {
            dispatch(savePaymentMethod(paymentMethod));
            navigate('/placeorder');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <CheckoutSteps step1 step2 step3 />
            <h1 className="text-2xl font-bold mb-6">Payment Method</h1>
            <form onSubmit={submitHandler}>
                <div className="mb-4">
                    <legend className="text-gray-700 mb-2 font-semibold">Select Method</legend>
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="PayPal"
                            name="paymentMethod"
                            value="PayPal"
                            checked={paymentMethod === 'PayPal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        <label htmlFor="PayPal">PayPal or Credit Card</label>
                    </div>
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="Razorpay"
                            name="paymentMethod"
                            value="Razorpay"
                            checked={paymentMethod === 'Razorpay'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        <label htmlFor="Razorpay">Razorpay</label>
                    </div>
                    {/* Add more methods like Stripe here if implemented via separate radio */}
                    {/* Since we are using Stripe mostly, user can just think 'Credit Card' */}
                </div>
                <button
                    type="submit"
                    className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
                >
                    Continue
                </button>
            </form>
        </div>
    );
};

export default PaymentScreen;
