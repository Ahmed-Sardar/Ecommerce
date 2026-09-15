# Razorpay Test Integration Guide

## Overview
Razorpay has been successfully integrated into the e-commerce website in **TEST MODE ONLY**. This allows for testing payment flows without any real money transactions.

## Test Credentials Setup

### Backend (.env)
```
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=test_secret_1234567890
```

### Frontend (.env)
```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_1234567890
```

## How to Test Razorpay Payments

### 1. Navigate to Payment Page
- Add items to cart
- Go through checkout: Login → Shipping → Payment
- Select "Razorpay" radio button
- Click "Continue"

### 2. Test Payment Methods

#### Test Credit/Debit Cards
- **Card Number**: `4111 1111 1111 1111`
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits (e.g., 123)
- **OTP**: `123456`

#### Test UPI
- **Success UPI**: `success@razorpay`
- **Failure UPI**: `failure@razorpay`

#### Test Wallets
- Select any wallet option
- Use test credentials provided by Razorpay

### 3. Expected Behavior

#### Successful Payment
1. Razorpay modal opens
2. Enter test payment details
3. Payment succeeds
4. Success alert shows with Payment ID
5. Redirects to Place Order page
6. Payment method saved as "Razorpay"

#### Failed Payment
1. Razorpay modal opens
2. Enter invalid details or use failure UPI
3. Error message displays
4. User remains on payment page

#### Cancelled Payment
1. Razorpay modal opens
2. User closes modal or clicks cancel
3. "Payment cancelled" alert shows
4. User remains on payment page

## Technical Implementation

### Backend Changes
- Added Razorpay SDK dependency
- Created `/api/orders/razorpay` endpoint
- Added `createRazorpayOrder` controller function
- Environment variables for test credentials

### Frontend Changes
- Updated PaymentScreen.jsx with Razorpay integration
- Added Razorpay order creation API call
- Proper error handling and user feedback
- Maintained existing PayPal functionality

## Important Notes

⚠️ **TEST MODE ONLY**: This integration uses Razorpay test credentials only. No real money is processed.

✅ **Free Testing**: All test transactions are free and don't incur any charges.

🔒 **Security**: Test keys are used and should be replaced with live keys only when going to production.

## Troubleshooting

### Common Issues
1. **"Payment Failed" Error**: Ensure backend is running and Razorpay credentials are set
2. **Modal Not Opening**: Check if Razorpay script loaded properly
3. **Order Creation Failed**: Verify backend API endpoint is accessible

### Debug Steps
1. Check browser console for errors
2. Verify environment variables are loaded
3. Test backend endpoint directly: `POST /api/orders/razorpay`
4. Ensure user is authenticated (required for protected routes)