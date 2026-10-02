// ========== ADMIN DASHBOARD LOGIC ==========

// Check if user is logged in and is an admin
function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
        alert('Bạn cần đăng nhập với tài khoản quản trị viên!');
        window.location.href = '../frontend/auth.html';
        return false;
    }
    return true;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdminAuth()) return;
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('adminName').textContent = user.fullName || user.username;
    
    // Display current date
    const today = new Date();
    document.getElementById('currentDate').textContent = today.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    loadDashboardStats();
    loadActivityFeed();
    loadUsers();
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
        case 'overview':
            loadActivityFeed();
            break;
        case 'users':
            loadUsers();
            break;
        case 'sellers':
            loadSellers();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'reviews':
            loadReviews();
            break;
        case 'reports':
            loadReports();
            break;
    }
}

// ========== DASHBOARD STATS ==========
function loadDashboardStats() {
    // Load users count
    fetch(`${API_BASE}/users`)
        .then(res => res.json())
        .then(users => {
            document.getElementById('totalUsers').textContent = users.length;
            const sellers = users.filter(u => u.role === 'seller');
            document.getElementById('totalSellers').textContent = sellers.length;
            
            // Calculate growth (mock data - compare with last month)
            const userGrowth = '+12%';
            const sellerGrowth = '+8%';
            updateStatCard('totalUsers', userGrowth, true);
            updateStatCard('totalSellers', sellerGrowth, true);
        })
        .catch(err => {
            console.error('Error loading users:', err);
            // Fallback to localStorage
            const users = JSON.parse(localStorage.getItem('allUsers')) || [];
            document.getElementById('totalUsers').textContent = users.length;
        });
    
    // Load products count
    fetch(`${API_BASE}/products`)
        .then(res => res.json())
        .then(products => {
            document.getElementById('totalProducts').textContent = products.length;
            updateStatCard('totalProducts', '+15%', true);
        })
        .catch(err => {
            console.error('Error loading products:', err);
        });
    
    // Load orders stats
    fetch(`${API_BASE}/orders`)
        .then(res => res.json())
        .then(orders => {
            document.getElementById('totalOrders').textContent = orders.length;
            
            const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
            document.getElementById('totalRevenue').textContent = formatPrice(totalRevenue);
            
            updateStatCard('totalOrders', '+23%', true);
            updateStatCard('totalRevenue', '+18%', true);
        })
        .catch(err => {
            console.error('Error loading orders:', err);
        });
    
    // Load reviews count (mock)
    const reviewsCount = Math.floor(Math.random() * 100) + 50;
    document.getElementById('totalReviews').textContent = reviewsCount;
    updateStatCard('totalReviews', '+20%', true);
}

function updateStatCard(elementId, growth, isPositive) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const card = element.closest('.stat-card');
    if (!card) return;
    
    // Check if growth indicator already exists
    let growthEl = card.querySelector('.growth-indicator');
    if (!growthEl) {
        growthEl = document.createElement('div');
        growthEl.className = 'growth-indicator';
        growthEl.style.fontSize = '13px';
        growthEl.style.marginTop = '5px';
        growthEl.style.fontWeight = '600';
        card.appendChild(growthEl);
    }
    
    growthEl.textContent = growth;
    growthEl.style.color = isPositive ? '#26aa99' : '#f44336';
}

// ========== ACTIVITY FEED ==========
function loadActivityFeed() {
    const activities = [
        { time: '5 phút trước', text: '👤 Người dùng mới đăng ký: nguyenvana@email.com', type: 'user' },
        { time: '12 phút trước', text: '📦 Sản phẩm mới được thêm: iPhone 15 Pro Max', type: 'product' },
        { time: '25 phút trước', text: '🛒 Đơn hàng mới #12345 - 2,500,000đ', type: 'order' },
        { time: '1 giờ trước', text: '⭐ Đánh giá 5 sao cho sản phẩm #567', type: 'review' },
        { time: '2 giờ trước', text: '🏪 Shop mới đăng ký: TechStore Official', type: 'seller' },
        { time: '3 giờ trước', text: '✅ Đơn hàng #12340 đã hoàn thành', type: 'order' },
        { time: '4 giờ trước', text: '📦 20 sản phẩm mới từ FashionShop', type: 'product' },
        { time: '5 giờ trước', text: '👤 5 người dùng mới đăng ký', type: 'user' }
    ];
    
    const container = document.getElementById('activityFeed');
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div>${activity.text}</div>
            <div class="time">${activity.time}</div>
        </div>
    `).join('');
}

// ========== USERS MANAGEMENT ==========
function loadUsers() {
    fetch(`${API_BASE}/users`)
        .then(res => res.json())
        .then(users => {
            displayUsers(users);
        })
        .catch(err => {
            console.error('Error loading users:', err);
            // Load from localStorage as fallback
            const localUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
            displayUsers(localUsers);
        });
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Chưa có người dùng nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>#${user.id.toString().slice(0, 6)}</td>
            <td>${user.fullName || user.username}</td>
            <td>${user.email || '-'}</td>
            <td><span class="badge ${user.role}">${getRoleName(user.role)}</span></td>
            <td><span class="badge ${user.status || 'active'}">${getStatusName(user.status || 'active')}</span></td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
            <td>
                <button class="btn-action btn-edit" onclick="viewUserDetails('${user.id}')">👁️ Xem</button>
                ${user.status !== 'banned' ? 
                    `<button class="btn-action btn-ban" onclick="banUser('${user.id}')">🚫 Khóa</button>` :
                    `<button class="btn-action btn-approve" onclick="unbanUser('${user.id}')">✅ Mở khóa</button>`
                }
            </td>
        </tr>
    `).join('');
}

function filterUsers() {
    const search = document.getElementById('userSearch').value.toLowerCase();
    const roleFilter = document.getElementById('userRoleFilter').value;
    const statusFilter = document.getElementById('userStatusFilter').value;
    
    fetch(`${API_BASE}/users`)
        .then(res => res.json())
        .then(users => {
            let filtered = users;
            
            if (search) {
                filtered = filtered.filter(u => 
                    (u.username && u.username.toLowerCase().includes(search)) ||
                    (u.email && u.email.toLowerCase().includes(search)) ||
                    (u.fullName && u.fullName.toLowerCase().includes(search))
                );
            }
            
            if (roleFilter) {
                filtered = filtered.filter(u => u.role === roleFilter);
            }
            
            if (statusFilter) {
                filtered = filtered.filter(u => (u.status || 'active') === statusFilter);
            }
            
            displayUsers(filtered);
        });
}

function banUser(userId) {
    if (!confirm('Bạn có chắc muốn khóa tài khoản này?')) return;
    
    fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'banned' })
    })
    .then(res => res.json())
    .then(data => {
        alert('✅ Đã khóa tài khoản!');
        loadUsers();
    })
    .catch(err => {
        alert('❌ Lỗi: ' + err.message);
    });
}

function unbanUser(userId) {
    fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
    })
    .then(res => res.json())
    .then(data => {
        alert('✅ Đã mở khóa tài khoản!');
        loadUsers();
    })
    .catch(err => {
        alert('❌ Lỗi: ' + err.message);
    });
}

function viewUserDetails(userId) {
    fetch(`${API_BASE}/users/${userId}`)
        .then(res => res.json())
        .then(user => {
            showUserDetailsModal(user);
        })
        .catch(err => {
            alert('❌ Lỗi: ' + err.message);
        });
}

function showUserDetailsModal(user) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Chi tiết người dùng</h2>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div class="user-details">
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>Tên đăng nhập:</strong> ${user.username}</p>
                    <p><strong>Họ tên:</strong> ${user.fullName || '-'}</p>
                    <p><strong>Email:</strong> ${user.email || '-'}</p>
                    <p><strong>Số điện thoại:</strong> ${user.phone || '-'}</p>
                    <p><strong>Vai trò:</strong> <span class="badge ${user.role}">${getRoleName(user.role)}</span></p>
                    <p><strong>Trạng thái:</strong> <span class="badge ${user.status || 'active'}">${getStatusName(user.status || 'active')}</span></p>
                    <p><strong>Ngày tạo:</strong> ${user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : '-'}</p>
                    ${user.address ? `<p><strong>Địa chỉ:</strong> ${user.address}</p>` : ''}
                    ${user.shop ? `
                        <hr>
                        <h3>Thông tin Shop</h3>
                        <p><strong>Tên shop:</strong> ${user.shop.name}</p>
                        <p><strong>Mô tả:</strong> ${user.shop.description || '-'}</p>
                    ` : ''}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="closeModal(this)">Đóng</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeModal(btn) {
    const modal = btn.closest('.modal-overlay');
    if (modal) modal.remove();
}

function exportUsers() {
    fetch(`${API_BASE}/users`)
        .then(res => res.json())
        .then(users => {
            exportToCSV(users, 'danh-sach-nguoi-dung.csv', [
                { key: 'id', label: 'ID' },
                { key: 'username', label: 'Tên đăng nhập' },
                { key: 'fullName', label: 'Họ tên' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Số điện thoại' },
                { key: 'role', label: 'Vai trò' },
                { key: 'status', label: 'Trạng thái' },
                { key: 'createdAt', label: 'Ngày tạo' }
            ]);
        })
        .catch(err => {
            alert('❌ Lỗi: ' + err.message);
        });
}

function exportToCSV(data, filename, columns) {
    // Create CSV header
    const header = columns.map(col => col.label).join(',');
    
    // Create CSV rows
    const rows = data.map(item => {
        return columns.map(col => {
            let value = item[col.key] || '';
            if (typeof value === 'object') value = JSON.stringify(value);
            // Escape commas and quotes
            value = value.toString().replace(/"/g, '""');
            return `"${value}"`;
        }).join(',');
    });
    
    // Combine header and rows
    const csv = [header, ...rows].join('\n');
    
    // Add BOM for Excel UTF-8 support
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    alert('✅ Đã xuất file thành công!');
}

// ========== SELLERS MANAGEMENT ==========
function loadSellers() {
    fetch(`${API_BASE}/users`)
        .then(res => res.json())
        .then(users => {
            const sellers = users.filter(u => u.role === 'seller');
            displaySellers(sellers);
        });
}

function displaySellers(sellers) {
    const tbody = document.getElementById('sellersTableBody');
    
    if (sellers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Chưa có người bán nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = sellers.map(seller => `
        <tr>
            <td>${seller.shop?.name || 'Chưa đặt tên'}</td>
            <td>${seller.fullName || seller.username}</td>
            <td>0</td>
            <td>0</td>
            <td>0đ</td>
            <td>⭐ 0.0</td>
            <td><span class="badge ${seller.status || 'active'}">${getStatusName(seller.status || 'active')}</span></td>
            <td>
                <button class="btn-action btn-edit" onclick="viewSellerDetails('${seller.id}')">👁️ Xem</button>
                <button class="btn-action btn-approve" onclick="approveSellerProducts('${seller.id}')">✅ Duyệt</button>
            </td>
        </tr>
    `).join('');
}

function viewSellerDetails(sellerId) {
    fetch(`${API_BASE}/users/${sellerId}`)
        .then(res => res.json())
        .then(seller => {
            fetch(`${API_BASE}/products?sellerId=${sellerId}`)
                .then(res => res.json())
                .then(products => {
                    showSellerDetailsModal(seller, products);
                })
                .catch(() => {
                    showSellerDetailsModal(seller, []);
                });
        })
        .catch(err => {
            alert('❌ Lỗi: ' + err.message);
        });
}

function showSellerDetailsModal(seller, products) {
    const totalRevenue = products.reduce((sum, p) => sum + (p.price * (p.sold || 0)), 0);
    const avgRating = products.length > 0 
        ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
        : 0;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h2>Chi tiết người bán</h2>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div class="seller-info-grid">
                    <div>
                        <h3>Thông tin cơ bản</h3>
                        <p><strong>Tên shop:</strong> ${seller.shop?.name || 'Chưa đặt tên'}</p>
                        <p><strong>Chủ shop:</strong> ${seller.fullName || seller.username}</p>
                        <p><strong>Email:</strong> ${seller.email || '-'}</p>
                        <p><strong>Số điện thoại:</strong> ${seller.phone || '-'}</p>
                        <p><strong>Mô tả:</strong> ${seller.shop?.description || '-'}</p>
                    </div>
                    <div>
                        <h3>Thống kê</h3>
                        <p><strong>Tổng sản phẩm:</strong> ${products.length}</p>
                        <p><strong>Đã bán:</strong> ${products.reduce((sum, p) => sum + (p.sold || 0), 0)}</p>
                        <p><strong>Doanh thu:</strong> ${formatPrice(totalRevenue)}</p>
                        <p><strong>Đánh giá TB:</strong> ⭐ ${avgRating}</p>
                        <p><strong>Ngày đăng ký:</strong> ${seller.createdAt ? new Date(seller.createdAt).toLocaleDateString('vi-VN') : '-'}</p>
                    </div>
                </div>
                <hr>
                <h3>Sản phẩm (${products.length})</h3>
                <div class="products-list" style="max-height: 300px; overflow-y: auto;">
                    ${products.length > 0 ? products.map(p => `
                        <div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; gap: 15px; align-items: center;">
                            <img src="${p.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                            <div style="flex: 1;">
                                <strong>${p.name}</strong>
                                <div style="color: #666; font-size: 14px;">${formatPrice(p.price)} • Đã bán: ${p.sold || 0}</div>
                            </div>
                        </div>
                    `).join('') : '<p style="text-align: center; color: #999;">Chưa có sản phẩm</p>'}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="closeModal(this)">Đóng</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function approveSellerProducts(sellerId) {
    if (!confirm('Duyệt tất cả sản phẩm của shop này?')) return;
    
    fetch(`${API_BASE}/products?sellerId=${sellerId}`)
        .then(res => res.json())
        .then(products => {
            // Update all products status to approved
            const promises = products.map(p => 
                fetch(`${API_BASE}/products/${p.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'approved' })
                })
            );
            
            return Promise.all(promises);
        })
        .then(() => {
            alert('✅ Đã duyệt tất cả sản phẩm!');
            loadSellers();
        })
        .catch(err => {
            alert('❌ Lỗi: ' + err.message);
        });
}

// ========== PRODUCTS MANAGEMENT ==========
function loadProducts() {
    fetch(`${API_BASE}/products`)
        .then(res => res.json())
        .then(products => {
            displayProducts(products);
        });
}

function displayProducts(products) {
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Chưa có sản phẩm nào</td></tr>';
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
            <td>${product.sellerName || 'ShopVN'}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editProductAdmin(${product.id})">✏️ Sửa</button>
                <button class="btn-action btn-delete" onclick="deleteProductAdmin(${product.id})">🗑️ Xóa</button>
            </td>
        </tr>
    `).join('');
}

function filterProducts() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('productCategoryFilter').value;
    
    fetch(`${API_BASE}/products`)
        .then(res => res.json())
        .then(products => {
            let filtered = products;
            
            if (search) {
                filtered = filtered.filter(p => 
                    p.name.toLowerCase().includes(search) ||
                    (p.description && p.description.toLowerCase().includes(search))
                );
            }
            
            if (categoryFilter) {
                filtered = filtered.filter(p => p.category === categoryFilter);
            }
            
            displayProducts(filtered);
        });
}

function exportProducts() {
    fetch(`${API_BASE}/products`)
        .then(res => res.json())
        .then(products => {
            exportToCSV(products, 'danh-sach-san-pham.csv', [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Tên sản phẩm' },
                { key: 'category', label: 'Danh mục' },
                { key: 'price', label: 'Giá' },
                { key: 'stock', label: 'Kho' },
                { key: 'sold', label: 'Đã bán' },
                { key: 'rating', label: 'Đánh giá' },
                { key: 'sellerName', label: 'Người bán' }
            ]);
        })
        .catch(err => {
            alert('❌ Lỗi: ' + err.message);
        });
}

function editProductAdmin(productId) {
    fetch(`${API_BASE}/products/${productId}`)
        .then(res => res.json())
        .then(product => {
            showEditProductModal(product);
        })
        .catch(err => {
            alert('❌ Lỗi: ' + err.message);
        });
}

function showEditProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Chỉnh sửa sản phẩm</h2>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editProductForm">
                    <div class="form-group">
                        <label>Tên sản phẩm:</label>
                        <input type="text" id="editProductName" value="${product.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Giá:</label>
                        <input type="number" id="editProductPrice" value="${product.price}" required>
                    </div>
                    <div class="form-group">
                        <label>Danh mục:</label>
                        <select id="editProductCategory" required>
                            <option value="fashion" ${product.category === 'fashion' ? 'selected' : ''}>Thời trang</option>
                            <option value="electronics" ${product.category === 'electronics' ? 'selected' : ''}>Điện tử</option>
                            <option value="beauty" ${product.category === 'beauty' ? 'selected' : ''}>Làm đẹp</option>
                            <option value="home" ${product.category === 'home' ? 'selected' : ''}>Nhà cửa</option>
                            <option value="sports" ${product.category === 'sports' ? 'selected' : ''}>Thể thao</option>
                            <option value="books" ${product.category === 'books' ? 'selected' : ''}>Sách</option>
                            <option value="food" ${product.category === 'food' ? 'selected' : ''}>Thực phẩm</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Mô tả:</label>
                        <textarea id="editProductDesc" rows="4">${product.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Hình ảnh URL:</label>
                        <input type="text" id="editProductImage" value="${product.image}">
                    </div>
                    <div class="form-group">
                        <label>Kho hàng:</label>
                        <input type="number" id="editProductStock" value="${product.stock || 0}">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal(this)">Hủy</button>
                <button class="btn-primary" onclick="saveProductEdit('${product.id}')">Lưu thay đổi</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveProductEdit(productId) {
    const updatedProduct = {
        name: document.getElementById('editProductName').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        category: document.getElementById('editProductCategory').value,
        description: document.getElementById('editProductDesc').value,
        image: document.getElementById('editProductImage').value,
        stock: parseInt(document.getElementById('editProductStock').value)
    };
    
    fetch(`${API_BASE}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
    })
    .then(res => res.json())
    .then(data => {
        alert('✅ Đã cập nhật sản phẩm!');
        closeModal(document.querySelector('.modal-overlay .close-btn'));
        loadProducts();
    })
    .catch(err => {
        alert('❌ Lỗi: ' + err.message);
    });
}

function deleteProductAdmin(productId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        alert('✅ Đã xóa sản phẩm!');
        loadProducts();
    })
    .catch(err => {
        alert('❌ Lỗi: ' + err.message);
    });
}

// ========== ORDERS MANAGEMENT ==========
function loadOrders() {
    fetch(`${API_BASE}/orders`)
        .then(res => res.json())
        .then(orders => {
            displayOrders(orders);
        });
}

function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Chưa có đơn hàng nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id.slice(0, 8)}</td>
            <td>${order.customerName}</td>
            <td>${order.items.length} sản phẩm</td>
            <td>${formatPrice(order.total)}</td>
            <td><span class="badge">${getStatusText(order.status)}</span></td>
            <td>${new Date(order.date).toLocaleDateString('vi-VN')}</td>
            <td>
                <button class="btn-action btn-edit" onclick="viewOrderDetails('${order.id}')">👁️ Xem</button>
                ${order.status === 'pending' ? 
                    `<button class="btn-action btn-delete" onclick="cancelOrderAdmin('${order.id}')">❌ Hủy</button>` : ''
                }
            </td>
        </tr>
    `).join('');
}

function filterOrders() {
    const search = document.getElementById('orderSearch').value.toLowerCase();
    const statusFilter = document.getElementById('orderStatusFilter').value;
    
    fetch(`${API_BASE}/orders`)
        .then(res => res.json())
        .then(orders => {
            let filtered = orders;
            
            if (search) {
                filtered = filtered.filter(o => 
                    o.id.toLowerCase().includes(search) ||
                    o.customerName.toLowerCase().includes(search)
                );
            }
            
            if (statusFilter) {
                filtered = filtered.filter(o => o.status === statusFilter);
            }
            
            displayOrders(filtered);
        });
}

function viewOrderDetails(orderId) {
    fetch(`${API_BASE}/orders/${orderId}`)
        .then(res => res.json())
        .then(order => {
            showOrderDetailsModal(order);
        })
        .catch(err => {
            alert('❌ Lỗi: ' + err.message);
        });
}

function showOrderDetailsModal(order) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>Chi tiết đơn hàng #${order.id.slice(0, 8)}</h2>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div class="order-info">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <h3>Thông tin khách hàng</h3>
                            <p><strong>Tên:</strong> ${order.customerName}</p>
                            <p><strong>SĐT:</strong> ${order.phone || '-'}</p>
                            <p><strong>Email:</strong> ${order.email || '-'}</p>
                            <p><strong>Địa chỉ:</strong> ${order.address || '-'}</p>
                        </div>
                        <div>
                            <h3>Thông tin đơn hàng</h3>
                            <p><strong>Mã đơn:</strong> #${order.id.slice(0, 8)}</p>
                            <p><strong>Ngày đặt:</strong> ${new Date(order.date).toLocaleString('vi-VN')}</p>
                            <p><strong>Trạng thái:</strong> <span class="badge">${getStatusText(order.status)}</span></p>
                            <p><strong>Thanh toán:</strong> ${order.paymentMethod || 'COD'}</p>
                        </div>
                    </div>
                    <hr>
                    <h3>Sản phẩm (${order.items.length})</h3>
                    <table style="width: 100%; margin-top: 15px;">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>SL</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>
                                        <div style="display: flex; gap: 10px; align-items: center;">
                                            <img src="${item.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                                            <span>${item.name}</span>
                                        </div>
                                    </td>
                                    <td>${formatPrice(item.price)}</td>
                                    <td>${item.quantity}</td>
                                    <td><strong>${formatPrice(item.price * item.quantity)}</strong></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div style="margin-top: 20px; text-align: right;">
                        <p><strong>Tạm tính:</strong> ${formatPrice(order.subtotal || order.total)}</p>
                        <p><strong>Phí vận chuyển:</strong> ${formatPrice(order.shippingFee || 0)}</p>
                        <h3 style="color: #ff4757; margin-top: 10px;">Tổng cộng: ${formatPrice(order.total)}</h3>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                ${order.status === 'pending' ? `
                    <button class="btn-success" onclick="updateOrderStatus('${order.id}', 'confirmed')">✅ Xác nhận</button>
                    <button class="btn-danger" onclick="updateOrderStatus('${order.id}', 'cancelled')">❌ Hủy đơn</button>
                ` : ''}
                ${order.status === 'confirmed' ? `
                    <button class="btn-primary" onclick="updateOrderStatus('${order.id}', 'shipping')">🚚 Bắt đầu giao hàng</button>
                ` : ''}
                ${order.status === 'shipping' ? `
                    <button class="btn-success" onclick="updateOrderStatus('${order.id}', 'completed')">✅ Hoàn thành</button>
                ` : ''}
                <button class="btn-secondary" onclick="closeModal(this)">Đóng</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
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
        closeModal(document.querySelector('.modal-overlay .close-btn'));
        loadOrders();
        loadDashboardStats();
    })
    .catch(err => {
        alert('❌ Lỗi: ' + err.message);
    });
}

function cancelOrderAdmin(orderId) {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    
    fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
    })
    .then(res => res.json())
    .then(data => {
        alert('✅ Đã hủy đơn hàng!');
        loadOrders();
    })
    .catch(err => {
        alert('❌ Lỗi: ' + err.message);
    });
}

function exportOrders() {
    fetch(`${API_BASE}/orders`)
        .then(res => res.json())
        .then(orders => {
            const ordersForExport = orders.map(order => ({
                id: order.id,
                customerName: order.customerName,
                phone: order.phone || '',
                email: order.email || '',
                address: order.address || '',
                itemCount: order.items.length,
                total: order.total,
                status: getStatusText(order.status),
                date: new Date(order.date).toLocaleString('vi-VN'),
                paymentMethod: order.paymentMethod || 'COD'
            }));
            
            exportToCSV(ordersForExport, 'danh-sach-don-hang.csv', [
                { key: 'id', label: 'Mã đơn' },
                { key: 'customerName', label: 'Khách hàng' },
                { key: 'phone', label: 'Số điện thoại' },
                { key: 'email', label: 'Email' },
                { key: 'address', label: 'Địa chỉ' },
                { key: 'itemCount', label: 'Số sản phẩm' },
                { key: 'total', label: 'Tổng tiền' },
                { key: 'status', label: 'Trạng thái' },
                { key: 'date', label: 'Ngày đặt' },
                { key: 'paymentMethod', label: 'Thanh toán' }
            ]);
        })
        .catch(err => {
            alert('❌ Lỗi: ' + err.message);
        });
}

// ========== REVIEWS & REPORTS ==========
function loadReviews() {
    // Mock reviews data - In real app, fetch from API
    const reviews = [
        {
            id: 1,
            productName: 'iPhone 15 Pro Max',
            userName: 'Nguyễn Văn A',
            rating: 5,
            comment: 'Sản phẩm rất tốt, giao hàng nhanh',
            date: new Date().toISOString(),
            status: 'approved'
        },
        {
            id: 2,
            productName: 'Áo thun nam',
            userName: 'Trần Thị B',
            rating: 4,
            comment: 'Chất lượng ok, đúng mô tả',
            date: new Date().toISOString(),
            status: 'pending'
        },
        {
            id: 3,
            productName: 'Laptop Dell',
            userName: 'Lê Văn C',
            rating: 1,
            comment: 'Sản phẩm kém chất lượng, không đúng mô tả',
            date: new Date().toISOString(),
            status: 'pending'
        }
    ];
    
    displayReviews(reviews);
}

function displayReviews(reviews) {
    const container = document.getElementById('reviewsContainer');
    
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Chưa có đánh giá nào</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="reviews-filters" style="margin-bottom: 20px; display: flex; gap: 15px;">
            <select id="reviewRatingFilter" onchange="filterReviews()">
                <option value="">Tất cả đánh giá</option>
                <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                <option value="4">⭐⭐⭐⭐ (4 sao)</option>
                <option value="3">⭐⭐⭐ (3 sao)</option>
                <option value="2">⭐⭐ (2 sao)</option>
                <option value="1">⭐ (1 sao)</option>
            </select>
            <select id="reviewStatusFilter" onchange="filterReviews()">
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Đã ẩn</option>
            </select>
        </div>
        <div id="reviewsList">
            ${reviews.map(review => `
                <div class="review-card" style="background: #f9f9f9; padding: 20px; margin-bottom: 15px; border-radius: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <div>
                            <strong>${review.userName}</strong>
                            <div style="color: #ff4757; margin: 5px 0;">${'⭐'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                            <div style="color: #666; font-size: 14px;">Sản phẩm: ${review.productName}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 13px; color: #999;">${new Date(review.date).toLocaleDateString('vi-VN')}</div>
                            <span class="badge ${review.status}">${review.status === 'approved' ? 'Đã duyệt' : review.status === 'pending' ? 'Chờ duyệt' : 'Đã ẩn'}</span>
                        </div>
                    </div>
                    <p style="margin: 15px 0;">${review.comment}</p>
                    <div style="display: flex; gap: 10px;">
                        ${review.status === 'pending' ? `
                            <button class="btn-action btn-approve" onclick="approveReview(${review.id})">✅ Duyệt</button>
                            <button class="btn-action btn-delete" onclick="rejectReview(${review.id})">❌ Ẩn</button>
                        ` : ''}
                        ${review.status === 'approved' ? `
                            <button class="btn-action btn-delete" onclick="rejectReview(${review.id})">❌ Ẩn</button>
                        ` : ''}
                        ${review.status === 'rejected' ? `
                            <button class="btn-action btn-approve" onclick="approveReview(${review.id})">✅ Hiện lại</button>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function filterReviews() {
    // In real app, fetch filtered data from API
    alert('Lọc đánh giá - sẽ kết nối API');
}

function approveReview(reviewId) {
    if (confirm('Duyệt đánh giá này?')) {
        // Update review status
        alert('✅ Đã duyệt đánh giá!');
        loadReviews();
    }
}

function rejectReview(reviewId) {
    if (confirm('Ẩn đánh giá này?')) {
        // Update review status
        alert('✅ Đã ẩn đánh giá!');
        loadReviews();
    }
}

function loadReports() {
    loadSalesChart();
    loadUsersGrowthChart();
    loadTopProductsChart();
    loadCategoryDistribution();
}

function loadSalesChart() {
    // Mock data - In real app, fetch from API
    const salesData = {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        values: [15000000, 18000000, 22000000, 25000000, 30000000, 35000000, 32000000, 38000000, 42000000, 45000000, 50000000, 55000000]
    };
    
    const container = document.getElementById('salesChart');
    if (!container) return;
    
    container.innerHTML = `
        <canvas id="salesChartCanvas" width="400" height="200"></canvas>
    `;
    
    // Simple bar chart without external library
    drawBarChart('salesChartCanvas', salesData, 'Doanh thu theo tháng');
}

function loadUsersGrowthChart() {
    const userData = {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        values: [120, 150, 180, 220, 280, 350, 420, 480, 560, 650, 720, 800]
    };
    
    const container = document.getElementById('newUsersChart');
    if (!container) return;
    
    container.innerHTML = `
        <canvas id="usersChartCanvas" width="400" height="200"></canvas>
    `;
    
    drawLineChart('usersChartCanvas', userData, 'Người dùng mới theo tháng');
}

function loadTopProductsChart() {
    const topProducts = [
        { name: 'iPhone 15', value: 45 },
        { name: 'Samsung Galaxy', value: 35 },
        { name: 'Laptop Dell', value: 28 },
        { name: 'Áo thun', value: 22 },
        { name: 'Giày Nike', value: 18 }
    ];
    
    const container = document.getElementById('topProductsChart');
    if (!container) return;
    
    container.innerHTML = `
        <h3>Top 5 sản phẩm bán chạy</h3>
        <div style="margin-top: 20px;">
            ${topProducts.map(product => `
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>${product.name}</span>
                        <strong>${product.value} đơn</strong>
                    </div>
                    <div style="background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${product.value}%; transition: width 0.5s;"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function loadCategoryDistribution() {
    const categories = [
        { name: 'Điện tử', value: 35, color: '#667eea' },
        { name: 'Thời trang', value: 25, color: '#764ba2' },
        { name: 'Làm đẹp', value: 20, color: '#ff4757' },
        { name: 'Nhà cửa', value: 12, color: '#ffa502' },
        { name: 'Khác', value: 8, color: '#2ed573' }
    ];
    
    const container = document.getElementById('categoryChart');
    if (!container) return;
    
    const total = categories.reduce((sum, cat) => sum + cat.value, 0);
    
    container.innerHTML = `
        <h3>Phân bố danh mục</h3>
        <div style="display: flex; gap: 30px; margin-top: 20px; align-items: center;">
            <div style="position: relative; width: 200px; height: 200px;">
                <svg viewBox="0 0 200 200" style="transform: rotate(-90deg);">
                    ${(() => {
                        let currentAngle = 0;
                        return categories.map(cat => {
                            const percentage = (cat.value / total) * 100;
                            const angle = (percentage / 100) * 360;
                            const x1 = 100 + 90 * Math.cos((currentAngle * Math.PI) / 180);
                            const y1 = 100 + 90 * Math.sin((currentAngle * Math.PI) / 180);
                            currentAngle += angle;
                            const x2 = 100 + 90 * Math.cos((currentAngle * Math.PI) / 180);
                            const y2 = 100 + 90 * Math.sin((currentAngle * Math.PI) / 180);
                            const largeArc = angle > 180 ? 1 : 0;
                            return `<path d="M100,100 L${x1},${y1} A90,90 0 ${largeArc},1 ${x2},${y2} Z" fill="${cat.color}" />`;
                        }).join('');
                    })()}
                    <circle cx="100" cy="100" r="50" fill="white" />
                </svg>
            </div>
            <div>
                ${categories.map(cat => `
                    <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                        <div style="width: 16px; height: 16px; background: ${cat.color}; border-radius: 3px;"></div>
                        <span>${cat.name}: <strong>${cat.value}%</strong></span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function drawBarChart(canvasId, data, title) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const barWidth = (width - padding * 2) / data.labels.length;
    const maxValue = Math.max(...data.values);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw bars
    data.values.forEach((value, i) => {
        const barHeight = (value / maxValue) * (height - padding * 2);
        const x = padding + i * barWidth + barWidth * 0.1;
        const y = height - padding - barHeight;
        
        // Gradient
        const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
        
        // Label
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(data.labels[i], x + barWidth * 0.4, height - padding + 20);
    });
}

function drawLineChart(canvasId, data, title) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const stepX = (width - padding * 2) / (data.labels.length - 1);
    const maxValue = Math.max(...data.values);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    
    data.values.forEach((value, i) => {
        const x = padding + i * stepX;
        const y = height - padding - (value / maxValue) * (height - padding * 2);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // Draw points
        ctx.fillStyle = '#667eea';
        ctx.fillRect(x - 3, y - 3, 6, 6);
        
        // Labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(data.labels[i], x, height - padding + 20);
    });
    
    ctx.stroke();
}

// ========== SETTINGS ==========
function updateSiteSettings() {
    const settings = {
        name: document.getElementById('siteName').value,
        email: document.getElementById('siteEmail').value,
        hotline: document.getElementById('siteHotline').value
    };
    
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    alert('✅ Đã lưu cài đặt hệ thống!');
}

function updateFeeSettings() {
    const fees = {
        sellerFee: document.getElementById('sellerFee').value,
        transactionFee: document.getElementById('transactionFee').value
    };
    
    localStorage.setItem('feeSettings', JSON.stringify(fees));
    alert('✅ Đã lưu cài đặt phí!');
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

function getRoleName(role) {
    const roles = {
        'buyer': 'Người mua',
        'seller': 'Người bán',
        'admin': 'Quản trị'
    };
    return roles[role] || role;
}

function getStatusName(status) {
    const statuses = {
        'active': 'Hoạt động',
        'banned': 'Đã khóa',
        'pending': 'Chờ duyệt'
    };
    return statuses[status] || status;
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

function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../frontend/auth.html';
    }
}

// ========== UTILITY FUNCTIONS ==========

// Refresh dashboard data
function refreshDashboard() {
    loadDashboardStats();
    loadActivityFeed();
    alert('✅ Đã làm mới dữ liệu!');
}

// Search globally across all data
function globalSearch(query) {
    if (!query) return;
    
    query = query.toLowerCase();
    const results = {
        users: [],
        products: [],
        orders: []
    };
    
    // Search in users
    fetch(`${API_BASE}/users`)
        .then(res => res.json())
        .then(users => {
            results.users = users.filter(u => 
                (u.username && u.username.toLowerCase().includes(query)) ||
                (u.email && u.email.toLowerCase().includes(query)) ||
                (u.fullName && u.fullName.toLowerCase().includes(query))
            );
            
            // Search in products
            return fetch(`${API_BASE}/products`);
        })
        .then(res => res.json())
        .then(products => {
            results.products = products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                (p.description && p.description.toLowerCase().includes(query))
            );
            
            // Search in orders
            return fetch(`${API_BASE}/orders`);
        })
        .then(res => res.json())
        .then(orders => {
            results.orders = orders.filter(o =>
                o.id.toLowerCase().includes(query) ||
                o.customerName.toLowerCase().includes(query)
            );
            
            // Display results
            showGlobalSearchResults(results, query);
        })
        .catch(err => {
            alert('❌ Lỗi tìm kiếm: ' + err.message);
        });
}

function showGlobalSearchResults(results, query) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div class="modal-header">
                <h2>Kết quả tìm kiếm: "${query}"</h2>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                    <div>
                        <h3>👥 Người dùng (${results.users.length})</h3>
                        ${results.users.length > 0 ? results.users.map(u => `
                            <div style="padding: 10px; margin: 5px 0; background: #f9f9f9; border-radius: 8px; cursor: pointer;" 
                                 onclick="showTab('users'); closeModal(this); viewUserDetails('${u.id}')">
                                <strong>${u.fullName || u.username}</strong><br>
                                <small>${u.email || '-'}</small>
                            </div>
                        `).join('') : '<p style="color: #999;">Không có kết quả</p>'}
                    </div>
                    <div>
                        <h3>📦 Sản phẩm (${results.products.length})</h3>
                        ${results.products.length > 0 ? results.products.map(p => `
                            <div style="padding: 10px; margin: 5px 0; background: #f9f9f9; border-radius: 8px; cursor: pointer;"
                                 onclick="showTab('products'); closeModal(this)">
                                <strong>${p.name}</strong><br>
                                <small>${formatPrice(p.price)}</small>
                            </div>
                        `).join('') : '<p style="color: #999;">Không có kết quả</p>'}
                    </div>
                    <div>
                        <h3>🛒 Đơn hàng (${results.orders.length})</h3>
                        ${results.orders.length > 0 ? results.orders.map(o => `
                            <div style="padding: 10px; margin: 5px 0; background: #f9f9f9; border-radius: 8px; cursor: pointer;"
                                 onclick="showTab('orders'); closeModal(this); viewOrderDetails('${o.id}')">
                                <strong>#${o.id.slice(0, 8)}</strong><br>
                                <small>${o.customerName} - ${formatPrice(o.total)}</small>
                            </div>
                        `).join('') : '<p style="color: #999;">Không có kết quả</p>'}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="closeModal(this)">Đóng</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Bulk actions
function bulkDeleteUsers(userIds) {
    if (!confirm(`Bạn có chắc muốn xóa ${userIds.length} người dùng?`)) return;
    
    const promises = userIds.map(id => 
        fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' })
    );
    
    Promise.all(promises)
        .then(() => {
            alert('✅ Đã xóa người dùng thành công!');
            loadUsers();
        })
        .catch(err => {
            alert('❌ Lỗi: ' + err.message);
        });
}

function bulkUpdateOrderStatus(orderIds, newStatus) {
    if (!confirm(`Cập nhật trạng thái cho ${orderIds.length} đơn hàng?`)) return;
    
    const promises = orderIds.map(id =>
        fetch(`${API_BASE}/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
    );
    
    Promise.all(promises)
        .then(() => {
            alert('✅ Đã cập nhật trạng thái!');
            loadOrders();
        })
        .catch(err => {
            alert('❌ Lỗi: ' + err.message);
        });
}

// Date range filter
function filterByDateRange(startDate, endDate, dataType) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (dataType === 'orders') {
        fetch(`${API_BASE}/orders`)
            .then(res => res.json())
            .then(orders => {
                const filtered = orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= start && orderDate <= end;
                });
                displayOrders(filtered);
            });
    }
}

// Print report
function printReport() {
    window.print();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for global search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const query = prompt('Tìm kiếm nhanh:');
        if (query) globalSearch(query);
    }
    
    // Ctrl/Cmd + R for refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshDashboard();
    }
});
