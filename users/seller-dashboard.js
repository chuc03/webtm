// ========== SELLER DASHBOARD LOGIC ==========

// Check if user is logged in and is a seller
function checkSellerAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'seller') {
        alert('Bạn cần đăng nhập với tài khoản người bán hàng!');
        window.location.href = '../frontend/auth.html';
        return false;
    }
    return true;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (!checkSellerAuth()) return;
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('sellerName').textContent = user.fullName || user.username;
    
    loadSellerProducts();
    loadSellerOrders();
    loadSellerStats();
    loadShopInfo();
});

// ========== TAB NAVIGATION ==========
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active from all tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    // Load data for specific tabs
    switch(tabName) {
        case 'products':
            loadSellerProducts();
            break;
        case 'orders':
            loadSellerOrders();
            break;
        case 'revenue':
            loadRevenueReport();
            break;
        case 'reviews':
            loadSellerReviews();
            break;
        case 'shop':
            loadShopInfo();
            break;
    }
}

// ========== PRODUCTS MANAGEMENT ==========
function loadSellerProducts() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    fetch(`${API_BASE}/products`)
        .then(res => res.json())
        .then(products => {
            // Filter products by seller
            const sellerProducts = products.filter(p => p.sellerId === user.id);
            displaySellerProducts(sellerProducts);
            updateProductsCount(sellerProducts.length);
        })
        .catch(err => {
            console.error('Error loading products:', err);
        });
}

function displaySellerProducts(products) {
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">Chưa có sản phẩm nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${formatPrice(product.price)}</td>
            <td>${product.sold || 0}</td>
            <td>⭐ ${product.rating || 0}</td>
            <td>${product.stock > 0 ? '<span style="color: green;">Còn hàng</span>' : '<span style="color: red;">Hết hàng</span>'}</td>
            <td class="action-btns">
                <button class="btn-edit" onclick="editProduct(${product.id})">✏️ Sửa</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">🗑️ Xóa</button>
            </td>
        </tr>
    `).join('');
}

function showAddProductForm() {
    document.getElementById('addProductForm').style.display = 'block';
}

function hideAddProductForm() {
    document.getElementById('addProductForm').style.display = 'none';
    document.querySelector('.product-form').reset();
}

function addProduct(event) {
    event.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    const newProduct = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        originalPrice: parseInt(document.getElementById('productOriginalPrice').value) || 0,
        stock: parseInt(document.getElementById('productStock').value),
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value,
        flashSale: document.getElementById('productFlashSale').checked,
        sellerId: user.id,
        sellerName: user.fullName || user.username,
        rating: 0,
        sold: 0,
        discount: 0
    };
    
    // Calculate discount if original price exists
    if (newProduct.originalPrice > 0) {
        newProduct.discount = Math.round((1 - newProduct.price / newProduct.originalPrice) * 100);
    }
    
    fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
    })
    .then(res => res.json())
    .then(data => {
        alert('✅ Đã thêm sản phẩm thành công!');
        hideAddProductForm();
        loadSellerProducts();
    })
    .catch(err => {
        alert('❌ Lỗi khi thêm sản phẩm: ' + err.message);
    });
}

function editProduct(productId) {
    alert('Chức năng sửa sản phẩm đang phát triển. Product ID: ' + productId);
    // TODO: Implement edit product modal
}

function deleteProduct(productId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        alert('✅ Đã xóa sản phẩm!');
        loadSellerProducts();
    })
    .catch(err => {
        alert('❌ Lỗi khi xóa sản phẩm: ' + err.message);
    });
}

// ========== ORDERS MANAGEMENT ==========
function loadSellerOrders() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    fetch(`${API_BASE}/orders`)
        .then(res => res.json())
        .then(orders => {
            // Filter orders that contain seller's products
            const sellerOrders = orders.filter(order => 
                order.items.some(item => item.sellerId === user.id)
            );
            displaySellerOrders(sellerOrders);
        })
        .catch(err => {
            console.error('Error loading orders:', err);
        });
}

function displaySellerOrders(orders) {
    const container = document.getElementById('ordersContainer');
    
    if (orders.length === 0) {
        container.innerHTML = '<p>Chưa có đơn hàng nào</p>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <strong>Đơn hàng #${order.id.slice(0, 8)}</strong>
                    <br>
                    <small>${new Date(order.date).toLocaleString('vi-VN')}</small>
                </div>
                <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div>
                <strong>Khách hàng:</strong> ${order.customerName}<br>
                <strong>Địa chỉ:</strong> ${order.address}<br>
                <strong>Điện thoại:</strong> ${order.phone}
            </div>
            <div style="margin-top: 15px;">
                ${order.items.map(item => `
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <img src="${item.image}" style="width: 50px; height: 50px; border-radius: 6px;">
                        <div>
                            <div>${item.name}</div>
                            <small>x${item.quantity} - ${formatPrice(item.price)}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: right; margin-top: 15px;">
                <strong>Tổng: ${formatPrice(order.total)}</strong>
            </div>
            <div class="order-actions">
                ${order.status === 'pending' ? `
                    <button class="btn-primary" onclick="updateOrderStatus('${order.id}', 'confirmed')">✅ Xác nhận</button>
                    <button class="btn-delete" onclick="updateOrderStatus('${order.id}', 'cancelled')">❌ Hủy</button>
                ` : ''}
                ${order.status === 'confirmed' ? `
                    <button class="btn-primary" onclick="updateOrderStatus('${order.id}', 'shipping')">🚚 Giao hàng</button>
                ` : ''}
                ${order.status === 'shipping' ? `
                    <button class="btn-primary" onclick="updateOrderStatus('${order.id}', 'completed')">✅ Hoàn thành</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function updateOrderStatus(orderId, newStatus) {
    fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    })
    .then(res => res.json())
    .then(data => {
        alert('✅ Đã cập nhật trạng thái đơn hàng!');
        loadSellerOrders();
    })
    .catch(err => {
        alert('❌ Lỗi: ' + err.message);
    });
}

// ========== STATS & REVENUE ==========
function loadSellerStats() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    // Load products count
    fetch(`${API_BASE}/products`)
        .then(res => res.json())
        .then(products => {
            const sellerProducts = products.filter(p => p.sellerId === user.id);
            document.getElementById('totalProducts').textContent = sellerProducts.length;
            
            // Calculate average rating
            const avgRating = sellerProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / sellerProducts.length || 0;
            document.getElementById('avgRating').textContent = avgRating.toFixed(1);
        });
    
    // Load orders stats
    fetch(`${API_BASE}/orders`)
        .then(res => res.json())
        .then(orders => {
            const sellerOrders = orders.filter(order => 
                order.items.some(item => item.sellerId === user.id)
            );
            
            document.getElementById('totalOrders').textContent = sellerOrders.length;
            
            const totalRevenue = sellerOrders.reduce((sum, order) => sum + order.total, 0);
            document.getElementById('totalRevenue').textContent = formatPrice(totalRevenue);
            
            // Unique customers
            const customers = new Set(sellerOrders.map(o => o.userId));
            document.getElementById('totalCustomers').textContent = customers.size;
        });
}

function loadRevenueReport() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    fetch(`${API_BASE}/orders`)
        .then(res => res.json())
        .then(orders => {
            const sellerOrders = orders.filter(order => 
                order.items.some(item => item.sellerId === user.id)
            );
            
            // Today's revenue
            const today = new Date().toDateString();
            const todayOrders = sellerOrders.filter(o => new Date(o.date).toDateString() === today);
            const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
            document.getElementById('todayRevenue').textContent = formatPrice(todayRevenue);
            
            // This month's revenue
            const currentMonth = new Date().getMonth();
            const monthOrders = sellerOrders.filter(o => new Date(o.date).getMonth() === currentMonth);
            const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
            document.getElementById('monthRevenue').textContent = formatPrice(monthRevenue);
            
            // Total revenue
            const totalRevenue = sellerOrders.reduce((sum, o) => sum + o.total, 0);
            document.getElementById('totalRevenueDetail').textContent = formatPrice(totalRevenue);
        });
}

function loadSellerReviews() {
    const container = document.getElementById('reviewsContainer');
    container.innerHTML = '<p>Chức năng đánh giá đang được phát triển</p>';
    // TODO: Implement reviews loading
}

// ========== SHOP INFO ==========
function loadShopInfo() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const shop = user.shop || {};
    
    document.getElementById('shopName').value = shop.name || '';
    document.getElementById('shopPhone').value = shop.phone || '';
    document.getElementById('shopAddress').value = shop.address || '';
    document.getElementById('shopDescription').value = shop.description || '';
    document.getElementById('shopLogo').value = shop.logo || '';
    document.getElementById('shopBanner').value = shop.banner || '';
}

function updateShopInfo() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user.shop) user.shop = {};
    
    user.shop.name = document.getElementById('shopName').value;
    user.shop.phone = document.getElementById('shopPhone').value;
    user.shop.address = document.getElementById('shopAddress').value;
    user.shop.description = document.getElementById('shopDescription').value;
    user.shop.logo = document.getElementById('shopLogo').value;
    user.shop.banner = document.getElementById('shopBanner').value;
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update on server
    fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => {
        alert('✅ Đã cập nhật thông tin cửa hàng!');
    })
    .catch(err => {
        alert('❌ Lỗi: ' + err.message);
    });
}

// ========== HELPER FUNCTIONS ==========
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function getCategoryName(category) {
    const categories = {
        'fashion': 'Thời trang',
        'electronics': 'Điện tử',
        'beauty': 'Làm đẹp',
        'home': 'Nhà cửa',
        'sports': 'Thể thao',
        'books': 'Sách',
        'food': 'Thực phẩm'
    };
    return categories[category] || category;
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'shipping': 'Đang giao',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}

function updateProductsCount(count) {
    document.getElementById('totalProducts').textContent = count;
}

function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../frontend/auth.html';
    }
}
