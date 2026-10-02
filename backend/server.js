const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== DATA STORE ====================
let products = [
    // Thời trang
    { id: 1, name: 'Áo thun nam basic cotton', category: 'fashion', price: 129000, originalPrice: 199000, image: 'https://via.placeholder.com/300x300/ffeaa7/2d3436?text=Ao+Nam', discount: 35, rating: 4.8, sold: 1230, flashSale: true },
    { id: 2, name: 'Quần jean nữ skinny cao cấp', category: 'fashion', price: 349000, originalPrice: 599000, image: 'https://via.placeholder.com/300x300/a29bfe/2d3436?text=Quan+Nu', discount: 42, rating: 4.9, sold: 890 },
    { id: 3, name: 'Váy midi hoa nhí xinh xắn', category: 'fashion', price: 259000, originalPrice: 450000, image: 'https://via.placeholder.com/300x300/fd79a8/2d3436?text=Vay+Nu', discount: 42, rating: 4.7, sold: 654, flashSale: true },
    { id: 4, name: 'Áo sơ mi trắng công sở', category: 'fashion', price: 189000, originalPrice: 299000, image: 'https://via.placeholder.com/300x300/74b9ff/2d3436?text=So+Mi', discount: 37, rating: 4.6, sold: 432 },
    { id: 5, name: 'Giày thể thao nam Sneaker', category: 'fashion', price: 459000, originalPrice: 799000, image: 'https://via.placeholder.com/300x300/55efc4/2d3436?text=Giay+Nam', discount: 43, rating: 4.9, sold: 1890, flashSale: true },
    
    // Điện tử
    { id: 6, name: 'Điện thoại Samsung Galaxy S24', category: 'electronics', price: 18990000, originalPrice: 24990000, image: 'https://via.placeholder.com/300x300/74b9ff/2d3436?text=Samsung', discount: 24, rating: 4.9, sold: 543 },
    { id: 7, name: 'iPhone 15 Pro Max 256GB', category: 'electronics', price: 29990000, originalPrice: 34990000, image: 'https://via.placeholder.com/300x300/a29bfe/2d3436?text=iPhone', discount: 14, rating: 5.0, sold: 892, flashSale: true },
    { id: 8, name: 'Laptop Dell Inspiron 15', category: 'electronics', price: 15990000, originalPrice: 19990000, image: 'https://via.placeholder.com/300x300/81ecec/2d3436?text=Laptop', discount: 20, rating: 4.7, sold: 321 },
    { id: 9, name: 'Tai nghe AirPods Pro 2', category: 'electronics', price: 5490000, originalPrice: 6990000, image: 'https://via.placeholder.com/300x300/55efc4/2d3436?text=AirPods', discount: 21, rating: 4.8, sold: 1234, flashSale: true },
    { id: 10, name: 'Apple Watch Series 9', category: 'electronics', price: 10990000, originalPrice: 12990000, image: 'https://via.placeholder.com/300x300/fdcb6e/2d3436?text=Watch', discount: 15, rating: 4.9, sold: 678 },
    
    // Làm đẹp
    { id: 11, name: 'Son Dior Addict Lip Glow', category: 'beauty', price: 890000, originalPrice: 1200000, image: 'https://via.placeholder.com/300x300/fd79a8/2d3436?text=Son+Dior', discount: 26, rating: 4.9, sold: 2341, flashSale: true },
    { id: 12, name: 'Kem chống nắng La Roche Posay', category: 'beauty', price: 379000, originalPrice: 450000, image: 'https://via.placeholder.com/300x300/fab1a0/2d3436?text=Kem+CN', discount: 16, rating: 4.8, sold: 1890 },
    { id: 13, name: 'Set mặt nạ Innisfree 10 miếng', category: 'beauty', price: 189000, originalPrice: 299000, image: 'https://via.placeholder.com/300x300/ff7675/2d3436?text=Mat+Na', discount: 37, rating: 4.7, sold: 3210 },
    { id: 14, name: 'Nước hoa Chanel No.5 50ml', category: 'beauty', price: 2990000, originalPrice: 3500000, image: 'https://via.placeholder.com/300x300/ffeaa7/2d3436?text=Chanel', discount: 15, rating: 5.0, sold: 432, flashSale: true },
    
    // Nhà cửa
    { id: 15, name: 'Nồi chiên không dầu 5L', category: 'home', price: 1290000, originalPrice: 1990000, image: 'https://via.placeholder.com/300x300/dfe6e9/2d3436?text=Noi+Chien', discount: 35, rating: 4.8, sold: 1567 },
    { id: 16, name: 'Máy hút bụi Xiaomi', category: 'home', price: 2890000, originalPrice: 3990000, image: 'https://via.placeholder.com/300x300/b2bec3/2d3436?text=Hut+Bui', discount: 28, rating: 4.9, sold: 789, flashSale: true },
    { id: 17, name: 'Bộ nồi inox 5 món cao cấp', category: 'home', price: 899000, originalPrice: 1500000, image: 'https://via.placeholder.com/300x300/636e72/2d3436?text=Bo+Noi', discount: 40, rating: 4.7, sold: 543 },
    { id: 18, name: 'Đèn LED thông minh', category: 'home', price: 159000, originalPrice: 299000, image: 'https://via.placeholder.com/300x300/ffeaa7/2d3436?text=Den+LED', discount: 47, rating: 4.6, sold: 2341 },
    
    // Thể thao
    { id: 19, name: 'Thảm tập Yoga cao cấp', category: 'sports', price: 299000, originalPrice: 500000, image: 'https://via.placeholder.com/300x300/00b894/2d3436?text=Tham+Yoga', discount: 40, rating: 4.8, sold: 1234, flashSale: true },
    { id: 20, name: 'Bộ tạ tay 10kg', category: 'sports', price: 459000, originalPrice: 699000, image: 'https://via.placeholder.com/300x300/55efc4/2d3436?text=Ta+Tay', discount: 34, rating: 4.7, sold: 678 },
    { id: 21, name: 'Giày chạy bộ Nike Zoom', category: 'sports', price: 1590000, originalPrice: 2390000, image: 'https://via.placeholder.com/300x300/74b9ff/2d3436?text=Nike', discount: 33, rating: 4.9, sold: 890 },
    
    // Sách
    { id: 22, name: 'Sách Đắc Nhân Tâm', category: 'books', price: 69000, originalPrice: 99000, image: 'https://via.placeholder.com/300x300/a29bfe/2d3436?text=Sach', discount: 30, rating: 5.0, sold: 5678 },
    { id: 23, name: 'Combo 10 tiểu thuyết hay', category: 'books', price: 249000, originalPrice: 450000, image: 'https://via.placeholder.com/300x300/fd79a8/2d3436?text=Combo', discount: 45, rating: 4.8, sold: 1234 },
    
    // Thực phẩm
    { id: 24, name: 'Cà phê hạt Arabica 500g', category: 'food', price: 189000, originalPrice: 299000, image: 'https://via.placeholder.com/300x300/fdcb6e/2d3436?text=Ca+Phe', discount: 37, rating: 4.7, sold: 3456, flashSale: true },
    { id: 25, name: 'Hộp quà tết cao cấp', category: 'food', price: 599000, originalPrice: 899000, image: 'https://via.placeholder.com/300x300/fab1a0/2d3436?text=Qua+Tet', discount: 33, rating: 4.9, sold: 2341 },
];

let users = [
    // Default admin account
    {
        id: 'admin-001',
        username: 'admin',
        password: 'admin123',
        email: 'admin@shopvn.com',
        fullName: 'Admin ShopVN',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
    },
    // Sample seller account
    {
        id: 'seller-001',
        username: 'seller1',
        password: 'seller123',
        email: 'seller1@shopvn.com',
        fullName: 'Tech Store Official',
        role: 'seller',
        status: 'active',
        shop: {
            name: 'Tech Store',
            description: 'Chuyên cung cấp điện tử chính hãng',
            logo: '',
            banner: ''
        },
        createdAt: new Date().toISOString()
    },
    // Sample buyer account
    {
        id: 'buyer-001',
        username: 'buyer1',
        password: 'buyer123',
        email: 'buyer1@gmail.com',
        fullName: 'Nguyễn Văn A',
        role: 'buyer',
        status: 'active',
        addresses: [
            {
                name: 'Nguyễn Văn A',
                phone: '0901234567',
                address: '123 Nguyễn Huệ',
                ward: 'Bến Nghé',
                district: 'Quận 1',
                city: 'TP. Hồ Chí Minh',
                isDefault: true
            }
        ],
        createdAt: new Date().toISOString()
    }
];
let orders = [];
let carts = {}; // userId -> cart items
let reviews = []; // { productId, userId, rating, comment, date }
let favorites = {}; // userId -> [productId]
let vouchers = [
    { code: 'WELCOME10', discount: 10, minPrice: 50000, maxUse: 100 },
    { code: 'FLASH20', discount: 20, minPrice: 200000, maxUse: 50 },
    { code: 'VIP50', discount: 50, minPrice: 500000, maxUse: 20 }
];
let voucherUse = {}; // code -> usedCount

// ==================== ROUTES: PRODUCTS ====================
// Get all products with filters and sorting
app.get('/api/products', (req, res) => {
    const { category, sort, minPrice, maxPrice, search } = req.query;
    
    let filtered = [...products];
    
    // Filter by category
    if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // Filter by price range
    if (minPrice) {
        filtered = filtered.filter(p => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
        filtered = filtered.filter(p => p.price <= parseInt(maxPrice));
    }
    
    // Search by name
    if (search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    // Sorting
    if (sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'sold') {
        filtered.sort((a, b) => b.sold - a.sold);
    } else if (sort === 'new') {
        filtered.reverse();
    }
    
    // Add review count for each product
    const productsWithReviews = filtered.map(p => ({
        ...p,
        reviewCount: reviews.filter(r => r.productId === p.id).length
    }));
    
    res.json(productsWithReviews);
});

// Get product by ID with reviews
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }
    
    const productReviews = reviews.filter(r => r.productId === product.id);
    const avgRating = productReviews.length > 0 
        ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
        : product.rating;
    
    res.json({
        ...product,
        reviews: productReviews,
        reviewCount: productReviews.length,
        avgRating
    });
});

// ==================== ROUTES: AUTH ====================
// Register
app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, password, role } = req.body;
    
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email đã tồn tại' });
    }
    
    const userRole = role || 'buyer'; // Default to buyer
    
    const user = {
        id: uuidv4(),
        username: email.split('@')[0],
        fullName: name,
        email,
        phone,
        password, // Note: In production, hash password with bcrypt
        role: userRole,
        status: 'active',
        avatar: name.charAt(0).toUpperCase(),
        createdAt: new Date().toISOString()
    };
    
    // Initialize shop for sellers
    if (userRole === 'seller') {
        user.shop = {
            name: '',
            description: '',
            logo: '',
            banner: ''
        };
    }
    
    // Initialize addresses for buyers
    if (userRole === 'buyer') {
        user.addresses = [];
    }
    
    users.push(user);
    carts[user.id] = [];
    
    res.json({ 
        message: 'Đăng ký thành công',
        user: { 
            id: user.id, 
            username: user.username,
            fullName: user.fullName, 
            email: user.email, 
            phone: user.phone, 
            role: user.role,
            status: user.status,
            avatar: user.avatar 
        }
    });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }
    
    // Support login with email or username
    const user = users.find(u => 
        (u.email === email || u.username === email) && u.password === password
    );
    
    if (!user) {
        return res.status(401).json({ error: 'Email/Username hoặc mật khẩu không đúng' });
    }
    
    // Check if account is banned
    if (user.status === 'banned') {
        return res.status(403).json({ error: 'Tài khoản của bạn đã bị khóa' });
    }
    
    // Don't send password
    const { password: pwd, ...userData } = user;
    
    res.json({ 
        message: 'Đăng nhập thành công',
        user: userData
    });
});

// ==================== ROUTES: CART ====================
// Get cart
app.get('/api/cart/:userId', (req, res) => {
    const { userId } = req.params;
    
    const userCart = carts[userId] || [];
    const cartItems = userCart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
            productId: item.productId,
            name: product?.name || 'Sản phẩm',
            price: product?.price || 0,
            quantity: item.quantity,
            lineTotal: (product?.price || 0) * item.quantity
        };
    });
    
    res.json(cartItems);
});

// Add to cart
app.post('/api/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    
    if (!productId || quantity <= 0) {
        return res.status(400).json({ error: 'ProductId và quantity không hợp lệ' });
    }
    
    if (!carts[userId]) {
        carts[userId] = [];
    }
    
    const existingItem = carts[userId].find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        carts[userId].push({ productId, quantity });
    }
    
    res.json({ message: 'Thêm vào giỏ hàng thành công' });
});

// Remove from cart
app.delete('/api/cart/:userId/:productId', (req, res) => {
    const { userId, productId } = req.params;
    
    if (carts[userId]) {
        carts[userId] = carts[userId].filter(item => item.productId !== parseInt(productId));
    }
    
    res.json({ message: 'Xóa khỏi giỏ hàng thành công' });
});

// Clear cart
app.delete('/api/cart/:userId', (req, res) => {
    const { userId } = req.params;
    carts[userId] = [];
    res.json({ message: 'Giỏ hàng đã được xóa' });
});

// ==================== ROUTES: ORDERS ====================
// Create order
app.post('/api/orders', (req, res) => {
    const { userId, items, customer } = req.body;
    
    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ error: 'Thông tin đơn hàng không hợp lệ' });
    }
    
    // Calculate total
    let total = 0;
    const orderItems = items.map(item => {
        const product = products.find(p => p.id === item.productId);
        const lineTotal = (product?.price || 0) * item.quantity;
        total += lineTotal;
        
        return {
            productId: item.productId,
            name: product?.name || 'Sản phẩm',
            price: product?.price || 0,
            quantity: item.quantity,
            lineTotal
        };
    });
    
    const order = {
        id: 'ORD-' + Date.now(),
        userId,
        items: orderItems,
        customer: {
            name: customer?.name || 'Guest',
            email: customer?.email || '',
            phone: customer?.phone || '',
            address: customer?.address || ''
        },
        total,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    orders.push(order);
    
    // Clear cart
    carts[userId] = [];
    
    res.json({ 
        message: 'Đặt hàng thành công',
        order 
    });
});

// Get user orders
app.get('/api/orders/:userId', (req, res) => {
    const { userId } = req.params;
    const userOrders = orders.filter(o => o.userId === userId);
    res.json(userOrders);
});

// Get order by ID
app.get('/api/orders/:userId/:orderId', (req, res) => {
    const { userId, orderId } = req.params;
    const order = orders.find(o => o.userId === userId && o.id === orderId);
    
    if (!order) {
        return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    }
    
    res.json(order);
});

// Update order status
app.patch('/api/orders/:userId/:orderId', (req, res) => {
    const { userId, orderId } = req.params;
    const { status } = req.body;
    
    const order = orders.find(o => o.userId === userId && o.id === orderId);
    
    if (!order) {
        return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    }
    
    if (!['pending', 'processing', 'shipped', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }
    
    order.status = status;
    order.updatedAt = new Date();
    
    res.json({ message: 'Cập nhật trạng thái thành công', order });
});

// Cancel order
app.post('/api/orders/:userId/:orderId/cancel', (req, res) => {
    const { userId, orderId } = req.params;
    const order = orders.find(o => o.userId === userId && o.id === orderId);
    
    if (!order) {
        return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    }
    
    if (order.status !== 'pending') {
        return res.status(400).json({ error: 'Chỉ có thể hủy đơn hàng đang chờ xử lý' });
    }
    
    order.status = 'cancelled';
    order.updatedAt = new Date();
    
    res.json({ message: 'Hủy đơn hàng thành công', order });
});

// Helper function
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// ==================== ROUTES: HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'ShopVN API is running' });
});

// ==================== ROUTES: REVIEWS ====================
// Get reviews for product
app.get('/api/products/:productId/reviews', (req, res) => {
    const { productId } = req.params;
    const productReviews = reviews.filter(r => r.productId === parseInt(productId));
    res.json(productReviews);
});

// Add review
app.post('/api/products/:productId/reviews', (req, res) => {
    const { productId } = req.params;
    const { userId, rating, comment } = req.body;
    
    if (!userId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating phải từ 1-5 sao' });
    }
    
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }
    
    const review = {
        id: uuidv4(),
        productId: parseInt(productId),
        userId,
        rating: parseInt(rating),
        comment: comment || '',
        date: new Date(),
        helpful: 0
    };
    
    reviews.push(review);
    res.json({ message: 'Đánh giá thành công', review });
});

// ==================== ROUTES: FAVORITES ====================
// Get user favorites
app.get('/api/favorites/:userId', (req, res) => {
    const { userId } = req.params;
    const userFavorites = favorites[userId] || [];
    const favoriteProducts = products.filter(p => userFavorites.includes(p.id));
    res.json(favoriteProducts);
});

// Add to favorites
app.post('/api/favorites/:userId', (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;
    
    if (!favorites[userId]) {
        favorites[userId] = [];
    }
    
    if (!favorites[userId].includes(productId)) {
        favorites[userId].push(productId);
    }
    
    res.json({ message: 'Thêm vào yêu thích thành công' });
});

// Remove from favorites
app.delete('/api/favorites/:userId/:productId', (req, res) => {
    const { userId, productId } = req.params;
    
    if (favorites[userId]) {
        favorites[userId] = favorites[userId].filter(id => id !== parseInt(productId));
    }
    
    res.json({ message: 'Xóa khỏi yêu thích thành công' });
});

// ==================== ROUTES: VOUCHERS ====================
// Get available vouchers
app.get('/api/vouchers', (req, res) => {
    res.json(vouchers);
});

// Verify voucher
app.post('/api/vouchers/verify', (req, res) => {
    const { code, totalPrice } = req.body;
    
    if (!code || !totalPrice) {
        return res.status(400).json({ error: 'Code và totalPrice là bắt buộc' });
    }
    
    const voucher = vouchers.find(v => v.code === code);
    
    if (!voucher) {
        return res.status(404).json({ error: 'Mã voucher không tồn tại' });
    }
    
    if (totalPrice < voucher.minPrice) {
        return res.status(400).json({ 
            error: `Giỏ hàng phải từ ${formatPrice(voucher.minPrice)} trở lên` 
        });
    }
    
    const usedCount = voucherUse[code] || 0;
    if (usedCount >= voucher.maxUse) {
        return res.status(400).json({ error: 'Mã voucher đã hết lượt sử dụng' });
    }
    
    res.json({ 
        valid: true, 
        discount: voucher.discount,
        discountAmount: Math.floor(totalPrice * voucher.discount / 100)
    });
});

// Use voucher
app.post('/api/vouchers/use', (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Code là bắt buộc' });
    }
    
    const voucher = vouchers.find(v => v.code === code);
    if (!voucher) {
        return res.status(404).json({ error: 'Mã voucher không tồn tại' });
    }
    
    voucherUse[code] = (voucherUse[code] || 0) + 1;
    res.json({ message: 'Sử dụng voucher thành công' });
});

// ==================== ROUTES: USERS MANAGEMENT ====================
// Get all users (admin only)
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Get user by ID
app.get('/api/users/:userId', (req, res) => {
    const { userId } = req.params;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User không tồn tại' });
    }
    
    // Don't send password
    const { password, ...userData } = user;
    res.json(userData);
});

// Update user
app.put('/api/users/:userId', (req, res) => {
    const { userId } = req.params;
    const updates = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User không tồn tại' });
    }
    
    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
    
    // Don't send password
    const { password, ...userData } = users[userIndex];
    res.json(userData);
});

// Delete user (admin only)
app.delete('/api/users/:userId', (req, res) => {
    const { userId } = req.params;
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User không tồn tại' });
    }
    
    users.splice(userIndex, 1);
    res.json({ message: 'Xóa user thành công' });
});

// ==================== ROUTES: HEALTH CHECK ====================

// ==================== ERROR HANDLING ====================
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint không tồn tại' });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`🚀 ShopVN API Server chạy tại http://localhost:${PORT}`)
    console.log(`✅ Backend sẵn sàng kết nối với frontend`);
    console.log(`📚 API Documentation:`);
    console.log(`   - GET    /api/health            - Kiểm tra server`);
    console.log(`   - GET    /api/products          - Lấy sản phẩm (filter, sort)`);
    console.log(`   - GET    /api/products/:id      - Chi tiết sản phẩm`);
    console.log(`   - POST   /api/auth/register     - Đăng ký`);
    console.log(`   - POST   /api/auth/login        - Đăng nhập`);
    console.log(`   - GET    /api/cart/:userId      - Lấy giỏ hàng`);
    console.log(`   - POST   /api/cart/:userId      - Thêm vào giỏ`);
    console.log(`   - DELETE /api/cart/:userId/:productId - Xóa khỏi giỏ`);
    console.log(`   - POST   /api/orders            - Tạo đơn hàng`);
    console.log(`   - GET    /api/orders/:userId    - Lấy đơn hàng của user`);
    console.log(`   - POST   /api/products/:id/reviews - Thêm đánh giá`);
    console.log(`   - GET    /api/favorites/:userId - Lấy danh sách yêu thích`);
    console.log(`   - POST   /api/favorites/:userId - Thêm vào yêu thích`);
    console.log(`   - GET    /api/vouchers          - Lấy danh sách voucher`);
    console.log(`   - POST   /api/vouchers/verify   - Kiểm tra voucher`);
});
