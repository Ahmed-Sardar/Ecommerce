import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    
    // Special handling for Page 5 - inject additional Fashion products
    if (page === 5 && !req.query.keyword) {
        const page5FashionProducts = [
            {
                _id: 'page5_fashion_1',
                name: 'Premium Cotton Dress Shirt',
                image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop'],
                description: 'Elegant white dress shirt made from premium cotton.',
                brand: 'Brooks Brothers',
                category: 'Fashion',
                price: 3299,
                countInStock: 45,
                rating: 4.7,
                numReviews: 125,
                reviews: [],
                features: ['Premium cotton fabric', 'Classic fit', 'Machine washable', 'Wrinkle resistant'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: 'page5_fashion_2',
                name: 'Vintage Band T-Shirt',
                image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2064&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2064&auto=format&fit=crop'],
                description: 'Classic vintage band t-shirt with retro graphics.',
                brand: 'Vintage Collection',
                category: 'Fashion',
                price: 1599,
                countInStock: 80,
                rating: 4.4,
                numReviews: 200,
                reviews: [],
                features: ['100% cotton', 'Vintage print design', 'Comfortable fit', 'Pre-shrunk'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: 'page5_fashion_3',
                name: 'Tailored Khaki Pants',
                image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=2080&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=2080&auto=format&fit=crop'],
                description: 'Well-tailored khaki pants for smart casual wear.',
                brand: 'Dockers',
                category: 'Fashion',
                price: 2799,
                countInStock: 65,
                rating: 4.6,
                numReviews: 150,
                reviews: [],
                features: ['Tailored fit', 'Stretch fabric', 'Multiple pockets', 'Stain resistant'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: 'page5_fashion_4',
                name: 'Raw Denim Jeans',
                image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=2086&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=2086&auto=format&fit=crop'],
                description: 'Premium raw denim jeans that age beautifully.',
                brand: 'Nudie Jeans',
                category: 'Fashion',
                price: 4299,
                countInStock: 35,
                rating: 4.8,
                numReviews: 90,
                reviews: [],
                features: ['Raw denim', 'Selvedge construction', 'Organic cotton', 'Unique aging'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: 'page5_fashion_5',
                name: 'Minimalist Steel Watch',
                image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=2088&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=2088&auto=format&fit=crop'],
                description: 'Sleek minimalist watch with stainless steel band.',
                brand: 'Daniel Wellington',
                category: 'Fashion',
                price: 6799,
                countInStock: 30,
                rating: 4.5,
                numReviews: 110,
                reviews: [],
                features: ['Stainless steel case', 'Minimalist design', 'Water resistant', 'Quartz movement'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: 'page5_fashion_6',
                name: 'Linen Button-Up Shirt',
                image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2080&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2080&auto=format&fit=crop'],
                description: 'Breathable linen shirt perfect for summer days.',
                brand: 'Everlane',
                category: 'Fashion',
                price: 2499,
                countInStock: 55,
                rating: 4.3,
                numReviews: 85,
                reviews: [],
                features: ['100% linen', 'Breathable fabric', 'Relaxed fit', 'Natural texture'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: 'page5_fashion_7',
                name: 'Oversized Graphic T-Shirt',
                image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?q=80&w=2080&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1571945153237-4929e783af4a?q=80&w=2080&auto=format&fit=crop'],
                description: 'Trendy oversized t-shirt with modern graphic design.',
                brand: 'Stussy',
                category: 'Fashion',
                price: 1899,
                countInStock: 70,
                rating: 4.2,
                numReviews: 165,
                reviews: [],
                features: ['Oversized fit', 'Graphic print', 'Soft cotton blend', 'Street style'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: 'page5_fashion_8',
                name: 'Cargo Utility Pants',
                image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2080&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2080&auto=format&fit=crop'],
                description: 'Functional cargo pants with multiple pockets.',
                brand: 'Carhartt',
                category: 'Fashion',
                price: 3599,
                countInStock: 40,
                rating: 4.7,
                numReviews: 120,
                reviews: [],
                features: ['Multiple cargo pockets', 'Durable fabric', 'Utility design', 'Reinforced knees'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: 'page5_fashion_9',
                name: 'Distressed Skinny Jeans',
                image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=2080&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=2080&auto=format&fit=crop'],
                description: 'Trendy distressed skinny jeans with ripped details.',
                brand: 'Diesel',
                category: 'Fashion',
                price: 3899,
                countInStock: 50,
                rating: 4.4,
                numReviews: 180,
                reviews: [],
                features: ['Skinny fit', 'Distressed details', 'Stretch denim', 'Modern style'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: 'page5_fashion_10',
                name: 'Smart Fitness Watch',
                image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=2127&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=2127&auto=format&fit=crop'],
                description: 'Advanced fitness watch with heart rate monitoring.',
                brand: 'Garmin',
                category: 'Fashion',
                price: 12999,
                countInStock: 20,
                rating: 4.8,
                numReviews: 75,
                reviews: [],
                features: ['Heart rate monitor', 'GPS tracking', 'Water resistant', 'Long battery life'],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        // Get the original Page 5 products (skip 48, take 12)
        const originalProducts = await Product.find({})
            .sort({ createdAt: -1 })
            .limit(2)
            .skip(48);

        // Combine original products with new Fashion products
        const combinedProducts = [...originalProducts, ...page5FashionProducts];
        
        // Get total count for pagination
        const count = await Product.countDocuments({});
        const totalWithNewProducts = count + 10; // Add 10 new products to total
        
        return res.json({ 
            products: combinedProducts, 
            page, 
            pages: Math.ceil(totalWithNewProducts / pageSize) 
        });
    }
    
    // Original logic for all other pages
    // Intelligent Search Logic
    // Splits "furniture for home" into ["furniture", "for", "home"]
    // Matches ANY of these terms across Name, Brand, Category, Description, or Tags
    let keyword = {};
    if (req.query.keyword) {
        const terms = req.query.keyword.split(/\s+/).filter(t => t.length > 0);
        if (terms.length > 0) {
            keyword = {
                $or: terms.map(term => ({
                    $or: [
                        { name: { $regex: term, $options: 'i' } },
                        { brand: { $regex: term, $options: 'i' } },
                        { category: { $regex: term, $options: 'i' } },
                        { description: { $regex: term, $options: 'i' } },
                        { tags: { $regex: term, $options: 'i' } },
                    ]
                }))
            };
        }
    }

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    // Check if this is a Page 5 custom product ID
    if (productId.startsWith('page5_fashion_')) {
        // Extract the product number from the ID (e.g., 'page5_fashion_7' -> 7)
        const productNumber = parseInt(productId.split('_')[2]);
        
        // Validate product number is within range (1-10)
        if (productNumber >= 1 && productNumber <= 10) {
            // Get Page 5 products (same logic as in getProducts)
            const page5Products = [
                {
                    _id: 'page5_fashion_1',
                    name: 'Premium Cotton Dress Shirt',
                    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop',
                    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop'],
                    description: 'Elegant white dress shirt made from premium cotton.',
                    brand: 'Brooks Brothers',
                    category: 'Fashion',
                    price: 3299,
                    countInStock: 45,
                    rating: 4.7,
                    numReviews: 125,
                    reviews: [],
                    features: ['Premium cotton fabric', 'Classic fit', 'Machine washable', 'Wrinkle resistant'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    _id: 'page5_fashion_2',
                    name: 'Vintage Band T-Shirt',
                    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2064&auto=format&fit=crop',
                    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2064&auto=format&fit=crop'],
                    description: 'Classic vintage band t-shirt with retro graphics.',
                    brand: 'Vintage Collection',
                    category: 'Fashion',
                    price: 1599,
                    countInStock: 80,
                    rating: 4.4,
                    numReviews: 200,
                    reviews: [],
                    features: ['100% cotton', 'Vintage print design', 'Comfortable fit', 'Pre-shrunk'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    _id: 'page5_fashion_3',
                    name: 'Tailored Khaki Pants',
                    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=2080&auto=format&fit=crop',
                    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=2080&auto=format&fit=crop'],
                    description: 'Well-tailored khaki pants for smart casual wear.',
                    brand: 'Dockers',
                    category: 'Fashion',
                    price: 2799,
                    countInStock: 65,
                    rating: 4.6,
                    numReviews: 150,
                    reviews: [],
                    features: ['Tailored fit', 'Stretch fabric', 'Multiple pockets', 'Stain resistant'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    _id: 'page5_fashion_4',
                    name: 'Raw Denim Jeans',
                    image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=2086&auto=format&fit=crop',
                    images: ['https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=2086&auto=format&fit=crop'],
                    description: 'Premium raw denim jeans that age beautifully.',
                    brand: 'Nudie Jeans',
                    category: 'Fashion',
                    price: 4299,
                    countInStock: 35,
                    rating: 4.8,
                    numReviews: 90,
                    reviews: [],
                    features: ['Raw denim', 'Selvedge construction', 'Organic cotton', 'Unique aging'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    _id: 'page5_fashion_5',
                    name: 'Minimalist Steel Watch',
                    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=2088&auto=format&fit=crop',
                    images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=2088&auto=format&fit=crop'],
                    description: 'Sleek minimalist watch with stainless steel band.',
                    brand: 'Daniel Wellington',
                    category: 'Fashion',
                    price: 6799,
                    countInStock: 30,
                    rating: 4.5,
                    numReviews: 110,
                    reviews: [],
                    features: ['Stainless steel case', 'Minimalist design', 'Water resistant', 'Quartz movement'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    _id: 'page5_fashion_6',
                    name: 'Linen Button-Up Shirt',
                    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2080&auto=format&fit=crop',
                    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2080&auto=format&fit=crop'],
                    description: 'Breathable linen shirt perfect for summer days.',
                    brand: 'Everlane',
                    category: 'Fashion',
                    price: 2499,
                    countInStock: 55,
                    rating: 4.3,
                    numReviews: 85,
                    reviews: [],
                    features: ['100% linen', 'Breathable fabric', 'Relaxed fit', 'Natural texture'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    _id: 'page5_fashion_7',
                    name: 'Oversized Graphic T-Shirt',
                    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?q=80&w=2080&auto=format&fit=crop',
                    images: ['https://images.unsplash.com/photo-1571945153237-4929e783af4a?q=80&w=2080&auto=format&fit=crop'],
                    description: 'Trendy oversized t-shirt with modern graphic design.',
                    brand: 'Stussy',
                    category: 'Fashion',
                    price: 1899,
                    countInStock: 70,
                    rating: 4.2,
                    numReviews: 165,
                    reviews: [],
                    features: ['Oversized fit', 'Graphic print', 'Soft cotton blend', 'Street style'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    _id: 'page5_fashion_8',
                    name: 'Cargo Utility Pants',
                    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2080&auto=format&fit=crop',
                    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2080&auto=format&fit=crop'],
                    description: 'Functional cargo pants with multiple pockets.',
                    brand: 'Carhartt',
                    category: 'Fashion',
                    price: 3599,
                    countInStock: 40,
                    rating: 4.7,
                    numReviews: 120,
                    reviews: [],
                    features: ['Multiple cargo pockets', 'Durable fabric', 'Utility design', 'Reinforced knees'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    _id: 'page5_fashion_9',
                    name: 'Distressed Skinny Jeans',
                    image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=2080&auto=format&fit=crop',
                    images: ['https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=2080&auto=format&fit=crop'],
                    description: 'Trendy distressed skinny jeans with ripped details.',
                    brand: 'Diesel',
                    category: 'Fashion',
                    price: 3899,
                    countInStock: 50,
                    rating: 4.4,
                    numReviews: 180,
                    reviews: [],
                    features: ['Skinny fit', 'Distressed details', 'Stretch denim', 'Modern style'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    _id: 'page5_fashion_10',
                    name: 'Classic Leather Jacket',
                    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=2080&auto=format&fit=crop',
                    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=2080&auto=format&fit=crop'],
                    description: 'Timeless black leather jacket with premium finish.',
                    brand: 'Schott NYC',
                    category: 'Fashion',
                    price: 12999,
                    countInStock: 15,
                    rating: 4.9,
                    numReviews: 75,
                    reviews: [],
                    features: ['Genuine leather', 'Classic design', 'Premium finish', 'Durable construction'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            // Find the specific product by ID
            const product = page5Products.find(p => p._id === productId);
            if (product) {
                return res.status(200).json(product);
            }
        }
        
        // If Page 5 product not found (invalid number or not in array), return 404
        return res.status(404).json({ message: 'Product not found' });
    }

    // Check for valid MongoDB ObjectId to prevent CastError
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Query MongoDB for regular products
    const product = await Product.findById(productId);

    if (product) {
        return res.status(200).json(product);
    } else {
        return res.status(404).json({ message: 'Product not found' });
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts,
};
