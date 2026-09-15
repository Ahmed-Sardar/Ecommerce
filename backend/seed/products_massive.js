
const generateDescription = (category, name) => {
  const intros = [
    `Experience the ultimate in ${category.toLowerCase()} with the ${name}. Designed for modern living, this product combines style, usage, and durability.`,
    `Elevate your daily routine with the ${name}. A perfect blend of form and functionality, tailored for ${category} enthusiasts.`,
    `Discover the premium quality of ${name}. Meticulously crafted to meet the highest standards of the ${category} industry.`
  ];

  const middles = {
    'Fashion': 'Made from breathable, high-quality fabrics that ensure comfort all day long. The versatile design makes it suitable for both casual and semi-formal occasions.',
    'Electronics': 'Featuring state-of-the-art technology, this device delivers exceptional performance and reliability. Stay connected and efficient with its advanced features.',
    'Furniture': 'Built with a sturdy frame and premium upholstery, it offers both support and elegance. Transforms any room into a cozy and stylish space.',
    'Beauty': 'Formulated with natural ingredients to nourish and rejuvenate. Dermatologically tested and safe for all skin types, giving you a radiant glow.',
    'Sports': 'Engineered for peak performance, this gear helps you push your limits. Durable materials ensure it withstands your toughest workouts.',
    'Food': 'Sourced from the finest organic farms, offering a burst of natural flavors. Free from artificial preservatives and packed with nutrition.',
    'Kids': 'Designed with safety first, this product allows for hours of creative fun. Durable, non-toxic materials ensure peace of mind for parents.',
    'Media': 'Immerse yourself in rich content and entertainment. Perfect for relaxing weekends or expanding your collection.',
    'Appliances': 'Efficiency meets power. This appliance simplifies household chores with its smart automation and energy-saving modes.',
    'Home': 'Add a touch of elegance to your home decor. Functional yet beautiful, it complements any interior design style.',
    'Health': 'Prioritize your well-being with this essential health product. Clinically tested and recommended by professionals for optimal results.',
    'Arts': 'Unleash your creativity with premium art supplies. High-pigment colors and durable bristles ensure your masterpiece stands the test of time.'
  };

  const outros = [
    'Order now and upgrade your lifestyle today.',
    'A must-have addition to your collection.',
    'Quality you can trust, backed by our satisfaction guarantee.'
  ];

  const intro = intros[Math.floor(Math.random() * intros.length)];
  const middle = middles[category] || middles['Home'];
  const outro = outros[Math.floor(Math.random() * outros.length)];

  return `${intro}\n\n${middle}\n\n${outro}`;
};

const generateFeatures = (category) => {
   const featureSets = {
    'Electronics': ['Wireless Connectivity', 'Long Battery Life', 'Fast Charging Support', 'High Resolution Display', 'Smart Assistant Compatible'],
    'Fashion': ['Premium Cotton Blend', 'Breathable Fabric', 'Machine Washable', 'Regular Fit', 'Color Retention Technology'],
    'Furniture': ['Solid Wood Frame', 'Ergonomic Design', 'Easy Assembly', 'Stain Resistant Fabric', '1 Year Warranty'],
    'Beauty': ['Paraben Free', 'Cruelty Free', 'Dermatologically Tested', 'Natural Ingredients', '24h Hydration'],
    'Sports': ['Sweat Resistant', 'Anti-Slip Grip', 'Lightweight Design', 'Professional Grade', 'Impact Protection'],
    'Appliances': ['Energy Star Rated', 'Low Noise Operation', 'Smart App Control', 'Easy to Clean', 'Turbo Mode'],
    'Health': ['FDA Approved', 'Clinically Tested', 'Hypoallergenic', 'Fast Acting', 'Doctor Recommended'],
    'Arts': ['Non-Toxic', 'Vibrant Colors', 'Acid-Free', 'Professional Grade', 'Eco-Friendly'],
    'Food': ['Organic', 'Non-GMO', 'Gluten Free', 'No Added Sugar', 'Freshly Sourced'],
    'Media': ['High Definition', 'Bonus Content', 'Collector Edition', 'Exclusive Artwork', 'Multi-Language Support'],
    'General': ['High Quality Materials', 'Durable Construction', 'Modern Design', 'Eco-Friendly Packaging', 'Best in Class Performance']
  };

  const set = featureSets[category] || featureSets['General'];
  return set.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);
};

// Curated list of reliable Unsplash Image IDs to prevent 404s
const UNSPLASH_IDS = {
  Fashion: ['1483985988355-763728e1935b', '1515886657613-9f3515b0c78f', '1529139574466-a302d27f60d0', '1503341455253-b2e72333dbdb', '1485968579580-c6d095143762', '1505022610485-0249ba5b3675'],
  Electronics: ['1498049860654-af715416929a', '1505740420923-958bef6d0816', '1526738549149-8e07eca6c147', '1523275335684-37898b6baf30', '1588872657578-839e5b5e9856', '1546868871-7041f2a55e12'],
  Furniture: ['1556228453-efd6c1ff04f6', '1524758631624-e2822e304c36', '1586023492125-27b2c045efd7', '1501045660598-c43914e671bd', '1493663284031-b7e3aefcae8e', '1540932296729-2700d3d46a89'],
  Beauty: ['1596462502278-27bfdd403cc2', '1612817288538-4e525417109b', '1571781348669-bc8a40d58c6c', '1522336577468-22da9627685a', '1596462502278-27bfdd403cc2'],
  Health: ['1583083527458-385c6974eb17', '1576091160399-112ba8d25d1d', '1505576399279-565b52d4ac71'],
  Food: ['1504674900247-0877df9cc836', '1467003909585-63c429904144', '1493770348161-369560ae357d', '1482049016688-2d3e1b311543', '1484723091739-30a097e8f929'],
  Kids: ['1515488042310-fa9ddbcc0843', '1503454537195-1dcabb73ffb9', '1587654780291-39c9404d746b', '1596464743869-80b1a041c3c9'],
  Sports: ['1517836357463-c25dfe12930f', '1534438327276-14e5300c3a48', '1552674605-619463ed8667', '1571019614242-c5c58843c6f4'],
  Media: ['1511512578047-923aa872b207', '1485846234645-a62644f84728', '1524368535928-5b5b1c0b3b88', '1495446815901-a7297e633e8d'],
  Arts: ['1513364776144-60967b0f800f', '1460661611742-978553f3e53d', '1547826039-bfc35e0f1ea8', '1501084817091-a4f3d1d19e07']
};

const CATEGORIES = [
  'Fashion', 'Electronics', 'Furniture', 'Beauty', 'Health', 
  'Food', 'Kids', 'Sports', 'Media', 'Arts'
];

const generateProducts = () => {
  const products = [];

  CATEGORIES.forEach(catName => {
    // Generate 100 products per category
    for (let i = 1; i <= 100; i++) {
        const uniqueId = Math.floor(Math.random() * 100000);
        // Pick a reliable base image ID
        const validIds = UNSPLASH_IDS[catName] || UNSPLASH_IDS['Furniture'];
        const baseImage = validIds[Math.floor(Math.random() * validIds.length)];
        
        // Add random sig to url to allow browser caching diffs if we wanted, 
        // but here we want VALID images. 
        // Unsplash allows sig param to same base ID to show slightly different crops/versions matches or just ignore.
        // Actually, to simulate different items with SAME reliable images, we'll reuse the reliable images.
        // To make them look slightly unique we can use crop/fit params or just accept repetition of high quality images.
        
      const name = `Premium ${catName} Item ${i}`;
      
      products.push({
        name: name,
        // Using specific valid IDs ensure no 404s. Adding 'q=80' for quality.
        image: `https://images.unsplash.com/photo-${baseImage}?auto=format&fit=crop&w=600&q=80`,
        description: generateDescription(catName, name),
        brand: 'LuxeBrand',
        category: catName,
        subCategory: 'General',
        price: (Math.floor(Math.random() * 50) + 10) * 100, // 1000 - 6000 INR roughly
        countInStock: Math.floor(Math.random() * 100),
        rating: 4 + (Math.random() * 1),
        numReviews: Math.floor(Math.random() * 500),
        tags: [catName.toLowerCase(), 'premium', 'best-seller'],
        features: generateFeatures(catName)
      });
    }
  });

  return products;
};

const products = generateProducts();

export default products;
