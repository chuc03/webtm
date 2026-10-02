// ========== BUYER DASHBOARD LOGIC ==========

// Check if user is logged in and is a buyer
function checkBuyerAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'buyer') {
        alert('Bạn cần đăng nhập với tài khoản người mua hàng!');
        window.location.href = '../frontend/auth.html';
        return false;
    }
    return true;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (!checkBuyerAuth()) return;
    
    loadUserProfile();
    loadUserOrders();
    loadUserAddresses();
    loadUserStats();
    updateCartCount();
    updateFavoritesCount();
});

// ========== SECTION NAVIGATION ==========
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Remove active class from all menu items
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).style.display = 'block';
    
    // Add active class to clicked menu item
    event.target.classList.add('active');
    
    // Load data for specific sections
    switch(sectionName) {
        case 'orders':
            loadUserOrders();
            break;
        case 'addresses':
            loadUserAddresses();
            break;
        case 'stats':
            loadUserStats();
            break;
        case 'favorites':
            loadUserFavorites();
            break;
        case 'notifications':
            loadUserNotifications();
            break;
        case 'vouchers':
            loadUserVouchers();
            break;
        case 'reviews':
            loadUserReviews();
            break;
    }
}

// ========== PROFILE MANAGEMENT ==========
function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    document.getElementById('fullName').value = user.fullName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('gender').value = user.gender || '';
    document.getElementById('birthday').value = user.birthday || '';
    document.getElementById('username').value = user.username || '';
}

function updateProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    user.fullName = document.getElementById('fullName').value;
    user.email = document.getElementById('email').value;
    user.phone = document.getElementById('phone').value;
    user.gender = document.getElementById('gender').value;
    user.birthday = document.getElementById('birthday').value;
    
    // Update in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Call API to update on server
    fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => {
        alert('✅ Cập nhật thông tin thành công!');
        addNotification('Thông tin cá nhân đã được cập nhật', 'info');
    })
    .catch(err => {
        alert('❌ Lỗi khi cập nhật thông tin: ' + err.message);
    });
}

// ========== ORDERS MANAGEMENT ==========
function loadUserOrders() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    fetch(`${API_BASE}/orders/user/${user.id}`)
        .then(res => res.json())
        .then(orders => {
            displayOrders(orders);
        })
        .catch(err => {
            console.error('Error loading orders:', err);
            document.getElementById('ordersList').innerHTML = '<p>Chưa có đơn hàng nào</p>';
        });
}

function displayOrders(orders) {
    const container = document.getElementById('ordersList');
    
    if (!orders || orders.length === 0) {
        container.innerHTML = '<p>Bạn chưa có đơn hàng nào</p>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <div>
                    <span class="order-id">Đơn hàng #${order.id.slice(0, 8)}</span>
                    <br>
                    <small>${new Date(order.date).toLocaleDateString('vi-VN')}</small>
                </div>
                <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-products">
                ${order.items.map(item => `
                    <div class="order-product">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <div>${item.name}</div>
                            <small>x${item.quantity} - ${formatPrice(item.price)}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 15px; text-align: right;">
                <strong>Tổng tiền: ${formatPrice(order.total)}</strong>
            </div>
        </div>
    `).join('');
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

// ========== ADDRESSES MANAGEMENT ==========
function loadUserAddresses() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const addresses = user.addresses || [];
    
    const container = document.getElementById('addressList');
    
    if (addresses.length === 0) {
        container.innerHTML = '<p>Chưa có địa chỉ nào</p>';
        return;
    }
    
    container.innerHTML = addresses.map((addr, index) => `
        <div class="address-item ${addr.isDefault ? 'default' : ''}">
            ${addr.isDefault ? '<span class="default-badge">Mặc định</span>' : ''}
            <div><strong>${addr.name}</strong> - ${addr.phone}</div>
            <div>${addr.address}</div>
            <div>${addr.ward}, ${addr.district}, ${addr.city}</div>
            <div class="address-actions">
                <button class="btn-sm btn-edit" onclick="editAddress(${index})">✏️ Sửa</button>
                ${!addr.isDefault ? `<button class="btn-sm btn-delete" onclick="deleteAddress(${index})">🗑️ Xóa</button>` : ''}
                ${!addr.isDefault ? `<button class="btn-sm" onclick="setDefaultAddress(${index})">⭐ Đặt mặc định</button>` : ''}
            </div>
        </div>
    `).join('');
}

function addNewAddress() {
    const name = prompt('Họ tên người nhận:');
    if (!name) return;
    
    const phone = prompt('Số điện thoại:');
    if (!phone) return;
    
    const address = prompt('Địa chỉ chi tiết:');
    if (!address) return;
    
    const ward = prompt('Phường/Xã:');
    const district = prompt('Quận/Huyện:');
    const city = prompt('Tỉnh/Thành phố:');
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user.addresses) user.addresses = [];
    
    user.addresses.push({
        name, phone, address, ward, district, city,
        isDefault: user.addresses.length === 0
    });
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    loadUserAddresses();
    alert('✅ Đã thêm địa chỉ mới!');
}

function deleteAddress(index) {
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    user.addresses.splice(index, 1);
    localStorage.setItem('currentUser', JSON.stringify(user));
    loadUserAddresses();
}

function setDefaultAddress(index) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    user.addresses.forEach((addr, i) => {
        addr.isDefault = (i === index);
    });
    localStorage.setItem('currentUser', JSON.stringify(user));
    loadUserAddresses();
}

// ========== STATS ==========
function loadUserStats() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    fetch(`${API_BASE}/orders/user/${user.id}`)
        .then(res => res.json())
        .then(orders => {
            const totalOrders = orders.length;
            const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
            const totalProducts = orders.reduce((sum, order) => 
                sum + order.items.reduce((s, item) => s + item.quantity, 0), 0);
            const loyaltyPoints = Math.floor(totalSpent / 10000);
            
            document.getElementById('totalOrders').textContent = totalOrders;
            document.getElementById('totalSpent').textContent = formatPrice(totalSpent);
            document.getElementById('totalProducts').textContent = totalProducts;
            document.getElementById('loyaltyPoints').textContent = loyaltyPoints;
        })
        .catch(err => {
            console.error('Error loading stats:', err);
        });
}

// ========== HELPER FUNCTIONS ==========
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function updateFavoritesCount() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.getElementById('favCount').textContent = favorites.length;
}

function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../frontend/auth.html';
    }
}

// Placeholder functions for other sections
function loadUserFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    // Implementation similar to favorites page
}

function loadUserNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    // Display notifications
}

function loadUserVouchers() {
    // Fetch and display user's vouchers
}

function loadUserReviews() {
    // Fetch and display user's product reviews
}
