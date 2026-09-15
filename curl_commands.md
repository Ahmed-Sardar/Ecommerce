# Test API Endpoints

## Auth

**Register**
```bash
curl -X POST http://localhost:5000/api/users \
-H "Content-Type: application/json" \
-d '{"name":"Test User", "email":"test@example.com", "password":"password123"}'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/users/login \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com", "password":"password123"}'
```

## Products

**Get All Products**
```bash
curl http://localhost:5000/api/products
```

**Get Product By ID**
```bash
curl http://localhost:5000/api/products/<PRODUCT_ID>
```

**Create Product (Admin, requires Bearer Token)**
```bash
curl -X POST http://localhost:5000/api/products \
-H "Authorization: Bearer <YOUR_ADMIN_TOKEN>"
```

## Orders

**Create Order (Requires Token)**
```bash
curl -X POST http://localhost:5000/api/orders \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <YOUR_TOKEN>" \
-d '{
    "orderItems": [
        {
            "name": "Product 1",
            "qty": 1,
            "image": "/images/sample.jpg",
            "price": 100,
            "product": "<PRODUCT_ID>"
        }
    ],
    "shippingAddress": {
        "address": "123 Main St",
        "city": "New York",
        "postalCode": "10001",
        "country": "USA"
    },
    "paymentMethod": "PayPal",
    "itemsPrice": 100,
    "shippingPrice": 10,
    "taxPrice": 15,
    "totalPrice": 125
}'
```
