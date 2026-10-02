// ========== API CONFIGURATION ==========
const API_BASE = 'http://localhost:3000/api';

// ========== STATE MANAGEMENT ==========
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 12;
let flashSaleTimer = null;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Shared UI state
    updateCartCount();
    updateFavoritesCount();
    updateUserSection();

    // Setup event listeners (safe if elements missing)
    setupEventListeners();

    // Load products on pages that show product grids (home/favorites)
    loadProducts();
    
    // Start flash sale countdown
    startFlashSaleTimer();
    
    // Load recently viewed products
    loadRecentlyViewed();

    // Per-page initialization
    const path = (location.pathname || '').toLowerCase();
    if (path.endsWith('auth.html')) {
        setupAuthPage();
    } else if (path.endsWith('orders.html')) {
        loadOrders();
    } else if (path.endsWith('favorites.html')) {
        loadFavorites();
    } else if (path.endsWith('cart.html')) {
        loadCartPage();
    }
});

// ========== PAGE NAVIGATION ==========
// SPA navigation removed; pages are split into separate HTML files
function goToPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const page = document.getElementById(`page-${pageId}`);
    if (page) {
        page.classList.add('active');

        // Load data based on page
        if (pageId === 'orders') {
            loadOrders();
        } else if (pageId === 'favorites') {
            loadFavorites();
        } else if (pageId === 'cart') {
            loadCartPage();
        }
    }
}

// ========== EVENT LISTENERS SETUP ==========
function setupEventListeners() {
    // Search
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) filterProducts(null, null, query);
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) filterProducts(null, null, query);
            }
        });
    }

    // User menu
    const userBtn = document.getElementById('userBtn');
    if (userBtn) userBtn.addEventListener('click', (e) => e.stopPropagation());

    // Product detail modal
    const productModal = document.getElementById('productModal');
    const cartDrawer = document.getElementById('cartDrawer');
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            productModal?.classList.remove('active');
        });
    });
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });

    // Auth forms (on auth.html page)
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    // Category filters (buttons and cards)
    document.querySelectorAll('.cat-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-cat') || btn.getAttribute('data-category');
            filterByCategory(category);
        });
    });
    document.querySelectorAll('.cat-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-cat');
            filterByCategory(category);
        });
    });

    // Sort & price filter
    const sortSelect = document.getElementById('sortSelect');
    sortSelect?.addEventListener('change', (e) => filterProducts(null, null, e.target.value, null));
    const priceMin = document.querySelector('input[name="priceMin"]');
    const priceMax = document.querySelector('input[name="priceMax"]');
    const priceFilterBtn = document.querySelector('.btn-filter');
    priceFilterBtn?.addEventListener('click', () => {
        const min = priceMin?.value ? parseFloat(priceMin.value) : 0;
        const max = priceMax?.value ? parseFloat(priceMax.value) : Infinity;
        filterProducts(min, max, sortSelect?.value || null, null);
    });

    // Hero slider on home page
    setupHeroSlider();

    // Cart drawer close
    const closeCartBtn = document.querySelector('.drawer .close-btn');
    closeCartBtn?.addEventListener('click', () => cartDrawer?.classList.remove('active'));

    // Voucher apply
    const applyVoucherBtn = document.getElementById('applyVoucherBtn');
    applyVoucherBtn?.addEventListener('click', (e) => applyVoucher(e));
}

// ========== AUTH FUNCTIONS ==========
function setupAuthPage() {
    // Already logged in? Redirect to home
    if (currentUser) {
        window.location.href = 'index.html';
        return;
    }
}

function showAuthForm(formType) {
    const loginDiv = document.getElementById('loginForm');
    const signupDiv = document.getElementById('signupForm');
    if (!loginDiv || !signupDiv) return;
    if (formType === 'login') {
        loginDiv.classList.add('active');
        signupDiv.classList.remove('active');
    } else {
        signupDiv.classList.add('active');
        loginDiv.classList.remove('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value.trim();
    
    if (!email || !password) {
        showNotification('Vui lòng nhập email và mật khẩu', 'error');
        return;
    }
    
    try {
        showLoading('Đang đăng nhập...');
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        hideLoading();
        
        if (!response.ok) {
            showNotification(data.message || 'Đăng nhập thất bại', 'error');
            return;
        }
        
        // Store user
        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUserSection();
        showNotification('Đăng nhập thành công', 'success');
        
        // Redirect based on role
        setTimeout(() => {
            redirectByRole(currentUser.role);
        }, 1000);
        // Redirect to home after short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        hideLoading();
        console.error('Login error:', error);
        showNotification('Lỗi đăng nhập: ' + error.message, 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPassword')?.value.trim();
    const phone = document.getElementById('signupPhone')?.value.trim();
    const role = document.getElementById('signupRole')?.value || 'buyer'; // Get role from form
    
    if (!name || !email || !password || !phone) {
        showNotification('Vui lòng điền tất cả các trường', 'error');
        return;
    }
    
    try {
        showLoading('Đang đăng ký...');
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone, role }) // Send role to server
        });
        
        const data = await response.json();
        hideLoading();
        
        if (!response.ok) {
            showNotification(data.message || 'Đăng ký thất bại', 'error');
            return;
        }
        
        // Auto login after signup
        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        updateUserSection();
        showNotification('Đăng ký thành công', 'success');
        
        // Redirect based on role
        setTimeout(() => {
            redirectByRole(currentUser.role);
        }, 1000);
        
    } catch (error) {
        hideLoading();
        console.error('Signup error:', error);
        showNotification('Lỗi đăng ký: ' + error.message, 'error');
    }
}

// Role-based redirect function
function redirectByRole(role) {
    switch(role) {
        case 'admin':
            window.location.href = '../users/admin-dashboard.html';
            break;
        case 'seller':
            window.location.href = '../users/seller-dashboard.html';
            break;
        case 'buyer':
        default:
            window.location.href = 'index.html';
            break;
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserSection();
    showNotification('Đã đăng xuất', 'info');
}

function updateUserSection() {
    const userBtn = document.getElementById('userBtn');
    const dropdown = document.querySelector('.user-dropdown');
    
    if (currentUser) {
        // User logged in
        if (userBtn) {
            userBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        }
        if (dropdown) {
            dropdown.innerHTML = `
                <span class="dropdown-item">${currentUser.email}</span>
                <a href="orders.html" class="dropdown-item"><i class="fas fa-box"></i> Đơn hàng</a>
                <a href="favorites.html" class="dropdown-item"><i class="fas fa-heart"></i> Yêu thích</a>
                <button class="dropdown-item logout" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Đăng xuất
                </button>
            `;
        }
    } else {
        // User not logged in
        if (userBtn) {
            userBtn.innerHTML = '<i class="fas fa-user"></i> Tài khoản';
        }
        if (dropdown) {
            dropdown.innerHTML = `
                <a href="auth.html" class="dropdown-item">
                    <i class="fas fa-sign-in-alt"></i> Đăng nhập
                </a>
                <a href="auth.html?tab=signup" class="dropdown-item">
                    <i class="fas fa-user-plus"></i> Đăng ký
                </a>
            `;
        }
    }
}

// ========== PRODUCT FUNCTIONS ==========
async function loadProducts() {
    try {
        const grid = document.querySelector('.products-grid');
        if (grid) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 32px; color: var(--primary);"></i></div>';
        
        const response = await fetch(`${API_BASE}/products?limit=100`);
        const data = await response.json();
        
        if (response.ok) {
            allProducts = data.products || [];
            filteredProducts = [...allProducts];
            displayProducts(filteredProducts);
        } else {
            throw new Error(data.message || 'Không thể tải sản phẩm');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        const grid = document.querySelector('.products-grid');
        if (grid) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--danger);"><i class="fas fa-exclamation-triangle"></i> Lỗi tải sản phẩm</div>';
        showNotification('Lỗi tải sản phẩm', 'error');
    }
}

function filterByCategory(category) {
    // Toggle category button
    document.querySelectorAll('.cat-filter').forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.classList.toggle('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Filter products
    if (category === 'all') {
        filteredProducts = [...allProducts];
    } else {
        const categoryName = getCategoryName(category);
        filteredProducts = allProducts.filter(p => p.category === categoryName);
    }
    
    displayProducts(filteredProducts);
}

function filterProducts(minPrice = 0, maxPrice = Infinity, sortBy = null, search = null) {
    let results = [...allProducts];
    
    // Search filter
    if (search) {
        const query = search.toLowerCase();
        results = results.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query)
        );
    }
    
    // Price range filter
    results = results.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    // Sort
    if (sortBy && sortBy !== 'default') {
        if (sortBy === 'price_asc') {
            results.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
            results.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'sold') {
            results.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        }
    }
    
    filteredProducts = results;
    currentPage = 1; // Reset to first page
    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;
    
    if (products.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light);">Không tìm thấy sản phẩm</div>';
        document.getElementById('pagination').style.display = 'none';
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    grid.innerHTML = paginatedProducts.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.discount > 0 ? `<span class="product-badge">-${product.discount}%</span>` : ''}
                <button class="favorite-btn ${favorites.includes(product.id) ? 'active' : ''}" 
                    onclick="toggleFavorite(event, ${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating || 4))}</span>
                    <span>(${product.sold || 0} bán)</span>
                </div>
                <div class="product-price">
                    <span class="current">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-detail" onclick="event.stopPropagation(); showProductDetail(${product.id})">Chi tiết</button>
                    <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})">Thêm</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update pagination
    updatePagination(totalPages);
}

function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    if (!pagination || totalPages <= 1) {
        if (pagination) pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
    nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
    prevBtn.style.cursor = currentPage === 1 ? 'not-allowed' : 'pointer';
    nextBtn.style.cursor = currentPage === totalPages ? 'not-allowed' : 'pointer';
    
    // Bind pagination events
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts(filteredProducts);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts(filteredProducts);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
}

function showProductDetail(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Add to recently viewed
    addToRecentlyViewed(productId);
    
    const modal = document.getElementById('productModal');
    const content = modal?.querySelector('.modal-content');
    
    if (content) {
        // Get related products (same category, exclude current)
        const relatedProducts = allProducts
            .filter(p => p.category === product.category && p.id !== productId)
            .slice(0, 4);
        
        content.innerHTML = `
            <button class="modal-close" onclick="document.getElementById('productModal').classList.remove('active')">×</button>
            <div class="product-detail">
                <div class="detail-container">
                    <div class="detail-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="detail-info">
                        <h2>${product.name}</h2>
                        <div class="detail-rating">
                            <span class="stars">${'★'.repeat(Math.floor(product.rating || 4))}</span>
                            <span>(${product.sold || 0} bán | ${(product.rating || 4).toFixed(1)} sao)</span>
                        </div>
                        <div class="detail-price">
                            <span class="current">${formatPrice(product.price)}</span>
                            ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
                            ${product.discount > 0 ? `<span style="color: var(--primary); font-weight: bold;">-${product.discount}%</span>` : ''}
                        </div>
                        <p style="color: var(--text-light); margin: 16px 0;">${product.description || 'Sản phẩm chất lượng cao'}</p>
                        
                        <!-- Share Buttons -->
                        <div style="display: flex; gap: 8px; margin: 12px 0;">
                            <button class="btn-share" onclick="shareProduct(${productId}, 'facebook')" style="padding: 8px 12px; background: #1877f2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                <i class="fab fa-facebook"></i> Chia sẻ
                            </button>
                            <button class="btn-share" onclick="shareProduct(${productId}, 'copy')" style="padding: 8px 12px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-link"></i> Sao chép link
                            </button>
                        </div>
                        
                        <div class="detail-quantity">
                            <label>Số lượng:</label>
                            <input type="number" id="detailQty" min="1" max="100" value="1">
                        </div>
                        <div class="detail-actions">
                            <button class="btn-buy" onclick="addToCartWithQty(${productId})">Thêm vào giỏ</button>
                            <button class="btn-favorite" onclick="toggleFavorite(null, ${productId})">
                                <i class="fas fa-heart"></i> ${favorites.includes(productId) ? 'Yêu thích' : 'Thêm yêu thích'}
                            </button>
                        </div>
                    </div>
                </div>
                
                ${relatedProducts.length > 0 ? `
                <div style="margin-top: 24px; border-top: 1px solid #eee; padding-top: 24px;">
                    <h3 style="margin-bottom: 16px;">Sản phẩm tương tự</h3>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                        ${relatedProducts.map(p => `
                            <div class="related-product" onclick="showProductDetail(${p.id})" style="cursor: pointer; border: 1px solid #eee; border-radius: 4px; padding: 8px; transition: all 0.2s;">
                                <img src="${p.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;">
                                <div style="font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.name}</div>
                                <div style="color: var(--primary); font-weight: bold; margin-top: 4px;">${formatPrice(p.price)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    modal?.classList.add('active');
}

// ========== CART FUNCTIONS ==========
function addToCart(productId, quantity = 1) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Đã thêm vào giỏ hàng', 'success');
}

function addToCartWithQty(productId) {
    const qtyInput = document.getElementById('detailQty');
    const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    addToCart(productId, quantity);
    document.getElementById('productModal')?.classList.remove('active');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    loadCartPage();
}

function updateCartQty(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            loadCartPage();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = count;
}

function loadCartPage() {
    const cartItems = document.getElementById('cartItemsList');
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-light);">Giỏ hàng trống</div>';
        updateCartSummary();
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div style="display: flex; gap: 8px; flex-direction: column; align-items: center;">
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.quantity - 1})">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = JSON.parse(localStorage.getItem('appliedDiscount')) || 0;
    const shipping = 29000; // included in total but not shown separately
    const total = subtotal - discount + shipping;

    const subtotalEl = document.getElementById('subtotal');
    const discountEl = document.getElementById('discount');
    const totalEl = document.getElementById('cartTotal');
    if (subtotalEl) subtotalEl.innerHTML = formatPrice(subtotal);
    if (discountEl) discountEl.innerHTML = `-${formatPrice(discount)}`;
    if (totalEl) totalEl.innerHTML = formatPrice(total);
}

async function handleCheckout() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập trước', 'warning');
        setTimeout(() => window.location.href = 'auth.html', 1000);
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Giỏ hàng trống', 'warning');
        return;
    }
    
    // Show checkout modal
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        // Pre-fill with user info
        document.getElementById('recipientName').value = currentUser.name || '';
        document.getElementById('recipientPhone').value = currentUser.phone || '';
        
        // Update totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 29000;
        const discount = JSON.parse(localStorage.getItem('appliedDiscount')) || 0;
        const total = subtotal - discount + shipping;
        
        document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
        document.getElementById('checkoutTotal').textContent = formatPrice(total);
        
        modal.classList.add('active');
    }
}

// Handle checkout form submission
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const recipientName = document.getElementById('recipientName').value.trim();
            const recipientPhone = document.getElementById('recipientPhone').value.trim();
            const recipientAddress = document.getElementById('recipientAddress').value.trim();
            const orderNote = document.getElementById('orderNote')?.value.trim() || '';
            
            if (!recipientName || !recipientPhone || !recipientAddress) {
                showNotification('Vui lòng điền đầy đủ thông tin', 'error');
                return;
            }
            
            try {
                showLoading('Đang xử lý đơn hàng...');
                
                const discount = JSON.parse(localStorage.getItem('appliedDiscount')) || 0;
                const shipping = 29000;
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                const items = cart.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }));
                
                const orderData = {
                    userId: currentUser.id,
                    items: items,
                    customer: {
                        name: recipientName,
                        phone: recipientPhone,
                        address: recipientAddress,
                        email: currentUser.email
                    },
                    note: orderNote,
                    subtotal,
                    discount,
                    shipping,
                    total: subtotal - discount + shipping
                };
                
                const response = await fetch(`${API_BASE}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                
                hideLoading();
                
                if (!response.ok) {
                    const error = await response.json();
                    showNotification(error.message || 'Lỗi thanh toán', 'error');
                    return;
                }
                
                // Clear cart
                cart = [];
                saveCart();
                updateCartCount();
                localStorage.removeItem('appliedDiscount');
                
                // Close modals
                document.getElementById('checkoutModal')?.classList.remove('active');
                
                // Show success
                showNotification('Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.', 'success');
                
                // Redirect to orders page after delay
                setTimeout(() => {
                    window.location.href = 'orders.html';
                }, 2000);
                
            } catch (error) {
                hideLoading();
                console.error('Checkout error:', error);
                showNotification('Lỗi: ' + error.message, 'error');
            }
        });
    }
});

// ========== ORDERS FUNCTIONS ==========
let currentOrderFilter = 'all';

async function loadOrders(statusFilter = 'all') {
    currentOrderFilter = statusFilter;
    
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (!currentUser) {
        ordersList.innerHTML = 
            '<div style="text-align: center; padding: 40px; color: var(--text-light);">Vui lòng đăng nhập để xem đơn hàng</div>';
        return;
    }
    
    try {
        ordersList.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 32px; color: var(--primary);"></i></div>';
        
        const response = await fetch(`${API_BASE}/orders/${currentUser.id}`);
        const data = await response.json();
        
        let orders = data.orders || [];
        
        // Apply status filter
        if (statusFilter !== 'all') {
            orders = orders.filter(order => order.status === statusFilter);
        }
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-status') === statusFilter);
        });
        
        if (orders.length === 0) {
            ordersList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-light);">Không có đơn hàng nào</div>';
            return;
        }
        
        ordersList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">Đơn #${order.id}</span>
                    <span class="order-status ${order.status}">${getStatusLabel(order.status)}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x${item.quantity}</span>
                            <span>${formatPrice(item.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    Tổng: ${formatPrice(order.total || order.subtotal)}
                </div>
                <div style="margin-top: 12px; font-size: 12px; color: var(--text-light);">
                    ${new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </div>
                ${order.status === 'pending' ? `
                    <button class="btn-primary" style="margin-top: 12px; width: 100%; background: var(--danger);" onclick="cancelOrder('${order.id}')">
                        Hủy đơn hàng
                    </button>
                ` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--danger);"><i class="fas fa-exclamation-triangle"></i> Lỗi tải đơn hàng</div>';
    }
}

// Setup order filter buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.getAttribute('data-status');
            loadOrders(status);
        });
    });
});

async function cancelOrder(orderId) {
    if (!confirm('Bạn chắc chắn muốn hủy đơn hàng?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'cancelled' })
        });
        
        if (response.ok) {
            showNotification('Đã hủy đơn hàng', 'success');
            loadOrders();
        }
    } catch (error) {
        showNotification('Lỗi hủy đơn hàng', 'error');
    }
}

// ========== FAVORITES FUNCTIONS ==========
function toggleFavorite(event, productId) {
    if (event) {
        event.stopPropagation();
    }
    
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(productId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    
    // Update UI if modal is open
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const pid = parseInt(btn.closest('[onclick*="toggleFavorite"]')?.getAttribute('onclick')?.match(/\d+/)?.[0]);
        if (pid === productId) {
            btn.classList.toggle('active');
        }
    });
}

function updateFavoritesCount() {
    const badge = document.getElementById('favBadge');
    if (badge) badge.textContent = favorites.length;
}

function loadFavorites() {
    const favProducts = allProducts.filter(p => favorites.includes(p.id));
    const container = document.getElementById('favoritesList');
    
    if (!container) return;
    
    if (favProducts.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-light);">Chưa có sản phẩm yêu thích</div>';
        return;
    }
    
    container.innerHTML = `<div class="products-grid">${favProducts.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.discount > 0 ? `<span class="product-badge">-${product.discount}%</span>` : ''}
                <button class="favorite-btn active" onclick="toggleFavorite(event, ${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating || 4))}</span>
                    <span>(${product.sold || 0})</span>
                </div>
                <div class="product-price">
                    <span class="current">${formatPrice(product.price)}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-detail" onclick="event.stopPropagation(); showProductDetail(${product.id})">Chi tiết</button>
                    <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})">Thêm</button>
                </div>
            </div>
        </div>
    `).join('')}</div>`;
}

// ========== VOUCHER FUNCTIONS ==========
async function applyVoucher(e) {
    e.preventDefault();
    const code = document.getElementById('voucherCode')?.value.trim();
    
    if (!code) {
        showNotification('Vui lòng nhập mã voucher', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/vouchers/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showNotification(data.message || 'Mã voucher không hợp lệ', 'error');
            return;
        }
        
        const discount = data.discount;
        localStorage.setItem('appliedDiscount', JSON.stringify(discount));
        document.getElementById('voucherCode').value = '';
        
        updateCartSummary();
        showNotification(`Áp dụng thành công! Giảm ${formatPrice(discount)}`, 'success');
        
    } catch (error) {
        showNotification('Lỗi: ' + error.message, 'error');
    }
}

// ========== FLASH SALE SLIDER ==========
function setupHeroSlider() {
    const slides = document.querySelectorAll('.hero-banner .slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentSlide = 0;

    const showSlide = (n) => {
        slides.forEach(slide => slide.classList.remove('active'));
        if (slides[n]) {
            slides[n].classList.add('active');
        }
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
    }

    // Auto rotate
    if (slides.length > 0) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
        showSlide(0);
    }
}

// ========== MODALS (Auth modal removed - now using auth.html) ==========

// ========== UTILITIES ==========
function showLoading(message = 'Đang tải...') {
    const loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    loader.innerHTML = `
        <div style="background: white; padding: 24px 32px; border-radius: 8px; text-align: center;">
            <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 12px;"></div>
            <div style="color: var(--text);">${message}</div>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.remove();
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function getCategoryName(categoryId) {
    const categories = {
        'electronics': 'Điện tử',
        'fashion': 'Thời trang',
        'home': 'Nhà cửa',
        'sports': 'Thể thao',
        'beauty': 'Sắc đẹp',
        'books': 'Sách',
        'toys': 'Đồ chơi',
        'food': 'Thực phẩm'
    };
    return categories[categoryId] || categoryId;
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'Chờ xác nhận',
        'processing': 'Đang xử lý',
        'shipped': 'Đang giao',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return labels[status] || status;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#26aa99' : '#0070cc'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100px);
            opacity: 0;
        }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ========== FLASH SALE TIMER ==========
function startFlashSaleTimer() {
    let hours = 2;
    let minutes = 45;
    let seconds = 30;
    
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!hoursEl || !minutesEl || !secondsEl) return;
    
    if (flashSaleTimer) clearInterval(flashSaleTimer);
    
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
            // Reset timer
            hours = 2;
            minutes = 45;
            seconds = 30;
        }
        
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }, 1000);
}

// ========== RECENTLY VIEWED ==========
function addToRecentlyViewed(productId) {
    // Remove if exists
    const index = recentlyViewed.indexOf(productId);
    if (index > -1) {
        recentlyViewed.splice(index, 1);
    }
    
    // Add to beginning
    recentlyViewed.unshift(productId);
    
    // Keep only last 10
    if (recentlyViewed.length > 10) {
        recentlyViewed = recentlyViewed.slice(0, 10);
    }
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    loadRecentlyViewed();
}

function loadRecentlyViewed() {
    const container = document.getElementById('recentlyViewedGrid');
    if (!container) return;
    
    const recentProducts = allProducts.filter(p => recentlyViewed.includes(p.id))
        .sort((a, b) => recentlyViewed.indexOf(a.id) - recentlyViewed.indexOf(b.id))
        .slice(0, 6);
    
    if (recentProducts.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--text-light);">Chưa xem sản phẩm nào</div>';
        return;
    }
    
    container.innerHTML = recentProducts.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})" style="cursor: pointer;">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.discount > 0 ? `<span class="product-badge">-${product.discount}%</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="current">${formatPrice(product.price)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== PRODUCT SHARE ==========
function shareProduct(productId, platform) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const url = `${window.location.origin}${window.location.pathname}?product=${productId}`;
    const text = `${product.name} - Chỉ ${formatPrice(product.price)}`;
    
    if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        showNotification('Đang mở Facebook...', 'info');
    } else if (platform === 'copy') {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Đã sao chép link sản phẩm', 'success');
        }).catch(() => {
            showNotification('Không thể sao chép link', 'error');
        });
    }
}

// ========== NOTIFICATIONS SYSTEM ==========
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

function addNotification(message, type = 'info') {
    const notification = {
        id: Date.now(),
        message,
        type,
        read: false,
        timestamp: new Date().toISOString()
    };
    
    notifications.unshift(notification);
    if (notifications.length > 20) notifications = notifications.slice(0, 20);
    
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const badge = document.getElementById('notifBadge');
    if (badge) {
        const unreadCount = notifications.filter(n => !n.read).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

function showNotifications() {
    const modal = document.getElementById('notificationsModal');
    if (!modal) return;
    
    const list = modal.querySelector('.notifications-list');
    if (notifications.length === 0) {
        list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-light);">Không có thông báo nào</div>';
    } else {
        list.innerHTML = notifications.map(n => `
            <div class="notification-item ${n.read ? 'read' : ''}" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; ${n.read ? 'opacity: 0.6;' : ''}" onclick="markNotificationRead(${n.id})">
                <div style="display: flex; align-items: start; gap: 12px;">
                    <i class="fas fa-${n.type === 'order' ? 'box' : n.type === 'promo' ? 'tag' : 'bell'}" style="color: var(--primary); margin-top: 4px;"></i>
                    <div style="flex: 1;">
                        <div style="font-size: 14px; margin-bottom: 4px;">${n.message}</div>
                        <div style="font-size: 12px; color: var(--text-light);">${new Date(n.timestamp).toLocaleString('vi-VN')}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    modal.classList.add('active');
}

function markNotificationRead(notifId) {
    const notif = notifications.find(n => n.id === notifId);
    if (notif) {
        notif.read = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
        updateNotificationBadge();
        showNotifications(); // Refresh
    }
}
