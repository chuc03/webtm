// ==================== DATA ====================
const API_BASE = 'http://localhost:3000/api';

const products = [
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

let cart = [];
let currentFilter = 'all';
let currentSort = 'default';
let priceRange = { min: 0, max: 50000000 };
let flashSaleTimer;
let currentUser = null;
let userOrders = [];
let favorites = [];
let selectedProductDetail = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadProducts();
    loadFlashSale();
    startFlashSaleTimer();
    attachEventListeners();
    checkAuthStatus();
});

function initializeApp() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
    
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        const savedOrders = localStorage.getItem('userOrders_' + currentUser.id);
        if (savedOrders) {
            userOrders = JSON.parse(savedOrders);
        }
    }
    
    // Load favorites
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
}

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
    // Auth buttons
    const signupBtn = document.getElementById('signupBtn');
    const loginBtn = document.getElementById('loginBtn');
    const authModal = document.getElementById('authModal');
    const authClose = document.getElementById('authClose');
    
    loginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal('login');
    });
    
    signupBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal('signup');
    });
    
    authClose?.addEventListener('click', () => {
        closeAuthModal();
    });
    
    authModal?.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
    });
    
    // Switch between login and signup
    document.getElementById('switchToSignup')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('signup');
    });
    
    document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('login');
    });
    
    // Login form
    document.getElementById('loginFormElement')?.addEventListener('submit', handleLogin);
    
    // Signup form
    document.getElementById('signupFormElement')?.addEventListener('submit', handleSignup);
    
    // User profile dropdown
    const userMenu = document.getElementById('userMenu');
    const userProfileDropdown = document.getElementById('userProfileDropdown');
    
    userMenu?.addEventListener('click', (e) => {
        if (e.target.closest('.user-avatar') || e.target.closest('.user-name') || e.target.closest('.user-email')) {
            userProfileDropdown?.classList.toggle('active');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            userProfileDropdown?.classList.remove('active');
        }
    });
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });
    
    // Orders page
    document.getElementById('ordersLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentUser) {
            openAuthModal('login');
            return;
        }
        showOrdersPage();
    });
    
    document.getElementById('backBtn')?.addEventListener('click', () => {
        hideOrdersPage();
    });
    
    document.querySelectorAll('.order-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadUserOrders(btn.dataset.filter);
        });
    });
    
    // Categories dropdown
    const categoriesBtn = document.querySelector('.categories-btn');
    const categoriesDropdown = document.getElementById('categoriesDropdown');
    
    categoriesBtn?.addEventListener('click', () => {
        categoriesDropdown?.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-categories')) {
            categoriesDropdown?.classList.remove('active');
        }
    });
    
    // Category filters
    document.querySelectorAll('[data-category]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const category = el.dataset.category;
            filterProducts(category);
            categoriesDropdown?.classList.remove('active');
        });
    });
    
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            loadProducts();
        });
    });
    
    // Search
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('input', debounce((e) => {
        searchProducts(e.target.value);
    }, 300));
    
    // Cart
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    
    cartBtn?.addEventListener('click', () => {
        cartSidebar?.classList.add('active');
        cartOverlay?.classList.add('active');
    });
    
    cartClose?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);
    
    // Checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn?.addEventListener('click', handleCheckout);
    
    // Banner slider
    const bannerPrev = document.querySelector('.banner-prev');
    const bannerNext = document.querySelector('.banner-next');
    
    bannerPrev?.addEventListener('click', () => changeBannerSlide(-1));
    bannerNext?.addEventListener('click', () => changeBannerSlide(1));
    
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.dataset.slide);
            goToBannerSlide(slideIndex);
        });
    });
    
    // Auto slide banner
    setInterval(() => changeBannerSlide(1), 5000);
    
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    sortSelect?.addEventListener('change', (e) => {
        currentSort = e.target.value;
        loadProducts();
    });
    
    // Price filter
    const priceMinInput = document.querySelector('input[name="priceMin"]');
    const priceMaxInput = document.querySelector('input[name="priceMax"]');
    const filterApplyBtn = document.querySelector('.btn-filter-apply');
    
    filterApplyBtn?.addEventListener('click', () => {
        const min = parseInt(priceMinInput.value) || 0;
        const max = parseInt(priceMaxInput.value) || 50000000;
        if (min < max) {
            priceRange = { min, max };
            loadProducts();
        } else {
            alert('Giá tối thiểu phải nhỏ hơn giá tối đa');
        }
    });
    
    // Voucher
    const applyVoucherBtn = document.getElementById('applyVoucherBtn');
    applyVoucherBtn?.addEventListener('click', () => {
        const code = document.getElementById('voucherCode').value.trim();
        if (code) {
            applyVoucher(code);
        }
    });
}

// ==================== PRODUCTS ====================
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    // Build query string
    let url = `${API_BASE}/products`;
    const params = [];
    
    if (currentFilter && currentFilter !== 'all') {
        params.push(`category=${currentFilter}`);
    }
    if (currentSort && currentSort !== 'default') {
        params.push(`sort=${currentSort}`);
    }
    if (priceRange.min > 0) {
        params.push(`minPrice=${priceRange.min}`);
    }
    if (priceRange.max < 50000000) {
        params.push(`maxPrice=${priceRange.max}`);
    }
    
    if (params.length > 0) {
        url += '?' + params.join('&');
    }
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #757575;">Không có sản phẩm nào phù hợp</div>';
                return;
            }
            
            grid.innerHTML = data.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${product.discount ? `<span class="product-badge">-${product.discount}%</span>` : ''}
                        ${product.flashSale ? `<span class="flash-badge">🔥</span>` : ''}
                        <button class="favorite-btn" title="Yêu thích"><i class="fas fa-heart"></i></button>
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-rating">
                            <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
                            <span class="rating-score">${product.rating}</span>
                            <span class="reviews">(${product.reviewCount || 0})</span>
                        </div>
                        <div class="product-price">
                            <span class="current">${formatPrice(product.price)}</span>
                            ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
                        </div>
                        <div class="product-meta">
                            <span>Đã bán ${formatNumber(product.sold)}</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-detail" data-id="${product.id}">Xem chi tiết</button>
                        <button class="btn-add-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                        </button>
                    </div>
                </div>
            `).join('');
            
            // Attach event listeners
            attachProductEventListeners();
            updateFavoriteButtons();
        })
        .catch(err => {
            console.error('Lỗi khi tải sản phẩm:', err);
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #f44336;">Lỗi khi tải sản phẩm. Kiểm tra kết nối!</div>';
        });
}

function attachProductEventListeners() {
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            showProductDetail(productId);
        });
    });
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.closest('.product-card').dataset.productId);
            toggleFavorite(productId, this);
        });
    });
}

function loadFlashSale() {
    const grid = document.getElementById('flashSaleGrid');
    if (!grid) return;
    
    fetch(`${API_BASE}/products?flashSale=true`)
        .then(res => res.json())
        .then(data => {
            const flashProducts = data.filter(p => p.flashSale);
            
            if (flashProducts.length === 0) return;
            
            grid.innerHTML = flashProducts.map(product => {
                const soldPercent = Math.min(Math.floor((product.sold / (product.sold + 100)) * 100), 95);
                return `
                    <div class="flash-item" data-id="${product.id}">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="flash-info">
                            <div class="flash-name">${product.name}</div>
                            <div class="flash-price">
                                <span class="current">${formatPrice(product.price)}</span>
                                <span class="flash-discount">-${product.discount}%</span>
                            </div>
                            <div class="flash-progress">
                                <div class="flash-progress-bar" style="width: ${soldPercent}%"></div>
                                <span>Đã bán ${soldPercent}%</span>
                            </div>
                            <button class="btn-flash-buy" onclick="addToCart(${product.id})">Mua ngay</button>
                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(err => console.error('Lỗi flash sale:', err));
}

function filterProducts(category) {
    currentFilter = category;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === category);
    });
    
    loadProducts();
    
    // Scroll to products section
    document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
}

function searchProducts(query) {
    if (!query.trim()) {
        loadProducts();
        return;
    }
    
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    fetch(`${API_BASE}/products?search=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #757575;">Không tìm thấy sản phẩm phù hợp</div>';
                return;
            }
            
            grid.innerHTML = data.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${product.discount ? `<span class="product-badge">-${product.discount}%</span>` : ''}
                        <button class="favorite-btn" title="Yêu thích"><i class="fas fa-heart"></i></button>
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-rating">
                            <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
                            <span class="rating-score">${product.rating}</span>
                        </div>
                        <div class="product-price">
                            <span class="current">${formatPrice(product.price)}</span>
                            ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
                        </div>
                        <div class="product-meta">
                            <span>Đã bán ${formatNumber(product.sold)}</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-detail" data-id="${product.id}">Xem chi tiết</button>
                        <button class="btn-add-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                        </button>
                    </div>
                </div>
            `).join('');
            
            attachProductEventListeners();
            updateFavoriteButtons();
        })
        .catch(err => console.error('Lỗi tìm kiếm:', err));
}
            </div>
            <div class="product-actions">
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== CART ====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('Đã thêm vào giỏ hàng');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const cartBody = document.getElementById('cartBody');
    const cartBadge = document.getElementById('cartBadge');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartBody) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartBadge.textContent = totalItems;
    cartTotal.textContent = formatPrice(totalPrice);
    
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Giỏ hàng trống</p>
            </div>
        `;
        return;
    }
    
    cartBody.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function closeCart() {
    document.getElementById('cartSidebar')?.classList.remove('active');
    document.getElementById('cartOverlay')?.classList.remove('active');
}

async function handleCheckout() {
    if (cart.length === 0) {
        showNotification('❌ Giỏ hàng trống', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('❌ Vui lòng đăng nhập để thanh toán', 'error');
        openAuthModal('login');
        return;
    }
    
    // Calculate total with voucher
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const appliedVoucher = JSON.parse(localStorage.getItem('appliedVoucher'));
    let discount = 0;
    
    if (appliedVoucher) {
        discount = appliedVoucher.amount;
        total -= discount;
    }
    
    const confirmed = confirm(`Xác nhận thanh toán ${formatPrice(total)}?${appliedVoucher ? '\n(Đã áp dụng voucher: -' + formatPrice(discount) + ')' : ''}`);
    
    if (!confirmed) return;
    
    try {
        // Create order via API
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                customer: {
                    name: currentUser.name,
                    email: currentUser.email,
                    phone: currentUser.phone,
                    address: 'Địa chỉ mặc định'
                }
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showNotification('❌ ' + (data.error || 'Lỗi khi tạo đơn hàng'), 'error');
            return;
        }
        
        // Mark voucher as used
        if (appliedVoucher) {
            await fetch(`${API_BASE}/vouchers/use`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: appliedVoucher.code })
            }).catch(() => {});
            localStorage.removeItem('appliedVoucher');
        }
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
        
        // Save order locally
        userOrders.push(data.order);
        localStorage.setItem('userOrders_' + currentUser.id, JSON.stringify(userOrders));
        
        showNotification(`✅ Đơn hàng ${data.order.id} đã được tạo thành công!`);
        closeCart();
        
    } catch (err) {
        console.error('Lỗi checkout:', err);
        showNotification('❌ Lỗi khi xử lý thanh toán', 'error');
    }
}

// ==================== BANNER ====================
let currentBannerSlide = 0;

function changeBannerSlide(direction) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentBannerSlide].classList.remove('active');
    dots[currentBannerSlide].classList.remove('active');
    
    currentBannerSlide = (currentBannerSlide + direction + slides.length) % slides.length;
    
    slides[currentBannerSlide].classList.add('active');
    dots[currentBannerSlide].classList.add('active');
}

function goToBannerSlide(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentBannerSlide].classList.remove('active');
    dots[currentBannerSlide].classList.remove('active');
    
    currentBannerSlide = index;
    
    slides[currentBannerSlide].classList.add('active');
    dots[currentBannerSlide].classList.add('active');
}

// ==================== FLASH SALE TIMER ====================
function startFlashSaleTimer() {
    let hours = 2;
    let minutes = 45;
    let seconds = 30;
    
    flashSaleTimer = setInterval(() => {
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        
        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
        
        if (hours < 0) {
            hours = 2;
            minutes = 45;
            seconds = 30;
        }
        
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }, 1000);
}

// ==================== UTILITIES ====================
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#26aa99' : type === 'error' ? '#f44336' : '#2196F3';
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span style="margin-left: 8px;">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ==================== AUTH FUNCTIONS ====================
function openAuthModal(form) {
    const authModal = document.getElementById('authModal');
    authModal?.classList.add('active');
    switchAuthForm(form);
}

function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    authModal?.classList.remove('active');
}

function switchAuthForm(form) {
    document.getElementById('loginForm')?.classList.remove('active');
    document.getElementById('signupForm')?.classList.remove('active');
    document.getElementById(form + 'Form')?.classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('❌ Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }
    
    // Call API login
    fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            showNotification('❌ ' + data.error, 'error');
            return;
        }
        
        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        closeAuthModal();
        checkAuthStatus();
        showNotification('✅ Đăng nhập thành công');
        
        document.getElementById('loginFormElement').reset();
    })
    .catch(err => {
        console.error('Lỗi login:', err);
        showNotification('❌ Lỗi kết nối server', 'error');
    });
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
        showNotification('❌ Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('❌ Mật khẩu không khớp', 'error');
        return;
    }
    
    // Call API register
    fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            showNotification('❌ ' + data.error, 'error');
            return;
        }
        
        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('userOrders_' + currentUser.id, JSON.stringify([]));
        
        closeAuthModal();
        checkAuthStatus();
        showNotification('✅ Đăng ký thành công');
        
        document.getElementById('signupFormElement').reset();
    })
    .catch(err => {
        console.error('Lỗi signup:', err);
        showNotification('❌ Lỗi kết nối server', 'error');
    });
}

function handleLogout() {
    if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        checkAuthStatus();
        showNotification('Đã đăng xuất');
    }
}

function checkAuthStatus() {
    const userMenu = document.getElementById('userMenu');
    const signupBtn = document.getElementById('signupBtn');
    const loginBtn = document.getElementById('loginBtn');
    const userProfileDropdown = document.getElementById('userProfileDropdown');
    
    if (currentUser) {
        // Show profile dropdown
        signupBtn?.style.setProperty('display', 'none', 'important');
        loginBtn?.parentElement.querySelector('.divider').style.display = 'none';
        loginBtn?.style.setProperty('display', 'none', 'important');
        
        // Update user info
        document.getElementById('userAvatar').textContent = currentUser.avatar;
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
        
        userProfileDropdown?.style.display = 'block';
    } else {
        // Show login/signup
        signupBtn?.style.display = 'inline';
        loginBtn?.parentElement.querySelector('.divider').style.display = 'inline';
        loginBtn?.style.display = 'inline';
        
        userProfileDropdown?.style.display = 'none';
    }
}

function showOrdersPage() {
    document.querySelector('.banner').style.display = 'none';
    document.querySelector('.quick-categories').style.display = 'none';
    document.querySelector('.flash-sale').style.display = 'none';
    document.querySelector('.categories-section').style.display = 'none';
    document.querySelector('.products-section').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    
    const ordersPage = document.getElementById('ordersPage');
    ordersPage?.classList.add('active');
    
    loadUserOrders('all');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideOrdersPage() {
    document.querySelector('.banner').style.display = 'block';
    document.querySelector('.quick-categories').style.display = 'block';
    document.querySelector('.flash-sale').style.display = 'block';
    document.querySelector('.categories-section').style.display = 'block';
    document.querySelector('.products-section').style.display = 'block';
    document.querySelector('.footer').style.display = 'block';
    
    document.getElementById('ordersPage')?.classList.remove('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadUserOrders(status) {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList || !currentUser) return;
    
    ordersList.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin"></i> Đang tải...</div>';
    
    // Fetch from API
    fetch(`${API_BASE}/orders/${currentUser.id}`)
        .then(res => res.json())
        .then(orders => {
            let filteredOrders = orders;
            if (status !== 'all') {
                filteredOrders = orders.filter(o => o.status === status);
            }
            
            if (filteredOrders.length === 0) {
                ordersList.innerHTML = `
                    <div class="orders-empty">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Bạn chưa có đơn hàng nào</p>
                    </div>
                `;
                return;
            }
            
            ordersList.innerHTML = filteredOrders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-id">Mã đơn: ${order.id}</span>
                        <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
                    </div>
                    <div class="order-info">
                        <div class="order-info-item">
                            <div class="order-info-label">Ngày đặt</div>
                            <div>${new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                        </div>
                        <div class="order-info-item">
                            <div class="order-info-label">Người nhận</div>
                            <div>${order.customer.name}</div>
                        </div>
                        <div class="order-info-item">
                            <div class="order-info-label">SĐT</div>
                            <div>${order.customer.phone}</div>
                        </div>
                        <div class="order-info-item">
                            <div class="order-info-label">Địa chỉ</div>
                            <div>${order.customer.address}</div>
                        </div>
                    </div>
                    <div class="order-items">
                        <div class="order-items-title">Sản phẩm:</div>
                        <div class="order-item-list">
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <span class="order-item-name">${item.name} x${item.quantity}</span>
                                    <span class="order-item-price">${formatPrice(item.lineTotal)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="order-footer">
                        <div class="order-total">
                            <span class="order-total-label">Tổng cộng:</span>
                            <div class="order-total-amount">${formatPrice(order.total)}</div>
                        </div>
                        <div class="order-actions">
                            <button class="btn-order-action">Chi tiết</button>
                            ${order.status === 'pending' ? `<button class="btn-order-action" onclick="cancelOrder('${order.id}')">Hủy đơn</button>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(err => {
            console.error('Lỗi tải đơn hàng:', err);
            ordersList.innerHTML = '<div style="text-align: center; padding: 40px; color: #f44336;">Lỗi khi tải đơn hàng</div>';
        });
}

function cancelOrder(orderId) {
    if (!currentUser || !confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) return;
    
    fetch(`${API_BASE}/orders/${currentUser.id}/${orderId}/cancel`, {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            showNotification('❌ ' + data.error, 'error');
        } else {
            showNotification('✅ Đơn hàng đã hủy');
            loadUserOrders('all');
        }
    })
    .catch(err => {
        console.error('Lỗi hủy đơn:', err);
        showNotification('❌ Lỗi khi hủy đơn hàng', 'error');
    });
}

function getStatusText(status) {
    const statusMap = {
        pending: 'Đang xử lý',
        completed: 'Hoàn thành',
        cancelled: 'Hủy'
    };
    return statusMap[status] || status;
}

// ==================== NEW FEATURES ====================

// Product Detail Modal
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'product-detail-modal';
    modal.innerHTML = `
        <div class="product-detail-content">
            <button class="detail-close"><i class="fas fa-times"></i></button>
            <div class="detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="detail-info">
                <h2>${product.name}</h2>
                <div class="detail-rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
                    <span class="rating-score">${product.rating}</span>
                    <span class="reviews">(0 đánh giá)</span>
                </div>
                <div class="detail-price">
                    <span class="current">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <div class="detail-sold">Đã bán: ${formatNumber(product.sold)}</div>
                <div class="detail-quantity">
                    <label>Số lượng:</label>
                    <input type="number" id="detailQuantity" value="1" min="1" max="100">
                </div>
                <button class="btn-primary" id="detailAddCart">Thêm vào giỏ hàng</button>
                <button class="btn-secondary" id="detailFavorite"><i class="fas fa-heart"></i> Yêu thích</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.detail-close').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('#detailAddCart').addEventListener('click', () => {
        const quantity = parseInt(modal.querySelector('#detailQuantity').value);
        addToCart(productId, quantity);
        modal.remove();
    });
    
    modal.querySelector('#detailFavorite').addEventListener('click', function() {
        toggleFavorite(productId, this);
    });
}

// Toggle Favorites
function toggleFavorite(productId, button) {
    if (!currentUser) {
        openAuthModal('login');
        return;
    }
    
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        if (button) button.classList.remove('active');
    } else {
        favorites.push(productId);
        if (button) button.classList.add('active');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const productId = parseInt(btn.closest('.product-card').dataset.productId);
        if (favorites.includes(productId)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Sorting and Filtering
function setupSortingFilters() {
    const sortSelect = document.querySelector('select[name="sort"]');
    const priceMin = document.querySelector('input[name="priceMin"]');
    const priceMax = document.querySelector('input[name="priceMax"]');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            loadProducts();
        });
    }
    
    if (priceMin) {
        priceMin.addEventListener('change', (e) => {
            priceRange.min = parseInt(e.target.value) || 0;
            loadProducts();
        });
    }
    
    if (priceMax) {
        priceMax.addEventListener('change', (e) => {
            priceRange.max = parseInt(e.target.value) || 50000000;
            loadProducts();
        });
    }
}

// Apply Voucher
function applyVoucher(code) {
    const totalPrice = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product?.price || 0) * item.quantity;
    }, 0);
    
    fetch(`${API_BASE}/vouchers/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, totalPrice })
    })
    .then(res => res.json())
    .then(data => {
        if (data.valid) {
            localStorage.setItem('appliedVoucher', JSON.stringify({ code, discount: data.discount, amount: data.discountAmount }));
            showNotification(`✅ Áp dụng voucher ${code} thành công - Tiết kiệm: ${formatPrice(data.discountAmount)}`);
            updateCartUI();
        } else {
            showNotification('❌ ' + data.error, 'error');
        }
    })
    .catch(err => console.error('Lỗi:', err));
}
