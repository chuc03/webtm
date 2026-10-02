# 👥 HỆ THỐNG PHÂN QUYỀN NGƯỜI DÙNG - SHOPVN

## 📋 Tổng quan

Hệ thống ShopVN bao gồm 3 loại người dùng với các quyền hạn và chức năng riêng biệt:

### 1. 👤 NGƯỜI MUA HÀNG (Buyer)
**File**: `buyer-dashboard.html` + `buyer-dashboard.js`

**Chức năng**:
- ✅ Quản lý thông tin cá nhân
- ✅ Xem lịch sử đơn hàng
- ✅ Quản lý địa chỉ nhận hàng
- ✅ Danh sách sản phẩm yêu thích
- ✅ Thông báo
- ✅ Voucher của tôi
- ✅ Đánh giá sản phẩm đã mua
- ✅ Thống kê mua hàng (tổng đơn, chi tiêu, điểm tích lũy)

**Đăng nhập demo**:
```
Username/Email: buyer1 hoặc buyer1@gmail.com
Password: buyer123
```

**Truy cập**: `http://localhost:8080/users/buyer-dashboard.html`

---

### 2. 🏪 NGƯỜI BÁN HÀNG (Seller)
**File**: `seller-dashboard.html` + `seller-dashboard.js`

**Chức năng**:
- ✅ Quản lý sản phẩm (thêm, sửa, xóa)
- ✅ Quản lý đơn hàng (xác nhận, hủy, giao hàng)
- ✅ Báo cáo doanh thu (ngày, tháng, tổng)
- ✅ Xem đánh giá từ khách hàng
- ✅ Quản lý thông tin cửa hàng
- ✅ Thống kê (sản phẩm, đơn hàng, khách hàng)

**Đăng nhập demo**:
```
Username/Email: seller1 hoặc seller1@shopvn.com
Password: seller123
```

**Truy cập**: `http://localhost:8080/users/seller-dashboard.html`

---

### 3. 🔐 QUẢN TRỊ VIÊN (Admin)
**File**: `admin-dashboard.html` + `admin-dashboard.js`

**Chức năng**:
- ✅ Quản lý người dùng (xem, khóa, mở khóa)
- ✅ Quản lý người bán (duyệt shop, sản phẩm)
- ✅ Quản lý toàn bộ sản phẩm
- ✅ Quản lý đơn hàng (xem, hủy)
- ✅ Quản lý đánh giá
- ✅ Báo cáo thống kê tổng quan
- ✅ Cài đặt hệ thống (phí, hoa hồng)
- ✅ Xem hoạt động gần đây

**Đăng nhập demo**:
```
Username/Email: admin hoặc admin@shopvn.com
Password: admin123
```

**Truy cập**: `http://localhost:8080/users/admin-dashboard.html`

---

## 🔐 ĐĂNG NHẬP

### Tài khoản Demo

| Loại | Username | Email | Password | Role |
|------|----------|-------|----------|------|
| Admin | `admin` | admin@shopvn.com | `admin123` | admin |
| Seller | `seller1` | seller1@shopvn.com | `seller123` | seller |
| Buyer | `buyer1` | buyer1@gmail.com | `buyer123` | buyer |

### Đăng ký tài khoản mới

1. Truy cập: `http://localhost:8080/frontend/auth.html`
2. Chọn tab "Đăng ký"
3. Điền thông tin
4. Chọn loại tài khoản: **Người mua** hoặc **Người bán**
5. Click "Đăng ký"

---

## 🎯 FLOW HOẠT ĐỘNG

### Người mua hàng (Buyer)
```
1. Đăng nhập → Chuyển tới Buyer Dashboard
2. Xem sản phẩm trên trang chủ
3. Thêm sản phẩm vào giỏ hàng
4. Đặt hàng
5. Theo dõi đơn hàng tại Dashboard
6. Đánh giá sản phẩm đã mua
```

### Người bán hàng (Seller)
```
1. Đăng nhập → Chuyển tới Seller Dashboard
2. Thêm sản phẩm mới
3. Nhận thông báo đơn hàng mới
4. Xác nhận đơn hàng
5. Cập nhật trạng thái giao hàng
6. Xem báo cáo doanh thu
7. Quản lý thông tin shop
```

### Admin
```
1. Đăng nhập → Chuyển tới Admin Dashboard
2. Xem tổng quan hệ thống
3. Quản lý người dùng (duyệt, khóa)
4. Kiểm duyệt sản phẩm
5. Xử lý khiếu nại
6. Cài đặt hệ thống
7. Xem báo cáo thống kê
```

---

## 📊 PHÂN QUYỀN CHI TIẾT

### Quyền truy cập pages

| Page | Buyer | Seller | Admin |
|------|-------|--------|-------|
| index.html (Trang chủ) | ✅ | ✅ | ✅ |
| cart.html (Giỏ hàng) | ✅ | ❌ | ✅ |
| favorites.html (Yêu thích) | ✅ | ❌ | ✅ |
| orders.html (Đơn hàng) | ✅ | ❌ | ✅ |
| buyer-dashboard.html | ✅ | ❌ | ❌ |
| seller-dashboard.html | ❌ | ✅ | ✅ |
| admin-dashboard.html | ❌ | ❌ | ✅ |

### Quyền API

| Endpoint | Buyer | Seller | Admin |
|----------|-------|--------|-------|
| GET /api/products | ✅ | ✅ | ✅ |
| POST /api/products | ❌ | ✅ | ✅ |
| PUT /api/products/:id | ❌ | ✅ (own) | ✅ |
| DELETE /api/products/:id | ❌ | ✅ (own) | ✅ |
| GET /api/orders | ❌ (own) | ✅ (own) | ✅ |
| PUT /api/orders/:id | ❌ | ✅ (own) | ✅ |
| GET /api/users | ❌ | ❌ | ✅ |
| PUT /api/users/:id | ✅ (own) | ✅ (own) | ✅ |
| DELETE /api/users/:id | ❌ | ❌ | ✅ |

---

## 🛠️ BACKEND API MỚI

### User Management

```javascript
// Get all users (admin only)
GET /api/users

// Get user by ID
GET /api/users/:userId

// Update user
PUT /api/users/:userId
Body: { fullName, email, phone, status, ... }

// Delete user (admin only)
DELETE /api/users/:userId
```

### Auth Update

```javascript
// Register with role
POST /api/auth/register
Body: {
  name: "Nguyen Van A",
  email: "user@example.com",
  phone: "0901234567",
  password: "123456",
  role: "buyer" | "seller" | "admin"  // Default: buyer
}

// Login (supports username or email)
POST /api/auth/login
Body: {
  email: "user@example.com" or "username",
  password: "123456"
}
Response: {
  user: {
    id, username, fullName, email, phone, role, status, ...
  }
}
```

---

## 📁 CẤU TRÚC THƯ MỤC

```
webtm/
├── users/                          # Thư mục người dùng
│   ├── buyer-dashboard.html        # Giao diện người mua
│   ├── buyer-dashboard.js          # Logic người mua
│   ├── seller-dashboard.html       # Giao diện người bán
│   ├── seller-dashboard.js         # Logic người bán
│   ├── admin-dashboard.html        # Giao diện admin
│   ├── admin-dashboard.js          # Logic admin
│   └── README.md                   # File này
│
├── frontend/                       # Frontend chính
│   ├── index.html                  # Trang chủ
│   ├── cart.html                   # Giỏ hàng
│   ├── orders.html                 # Đơn hàng
│   ├── favorites.html              # Yêu thích
│   ├── auth.html                   # Đăng nhập/Đăng ký
│   ├── app.js                      # Logic chính
│   └── styles.css                  # CSS
│
└── backend/                        # Backend API
    └── server.js                   # Express server
```

---

## 🚀 KHỞI ĐỘNG HỆ THỐNG

### 1. Khởi động Backend
```bash
cd backend
npm install
node server.js
```
Server chạy tại: `http://localhost:3000`

### 2. Khởi động Frontend
```bash
# Mở terminal mới
cd webtm
python -m http.server 8080
```
hoặc dùng Live Server extension trong VS Code

Frontend chạy tại: `http://localhost:8080`

### 3. Truy cập các Dashboard

- **Trang chủ**: http://localhost:8080/frontend/index.html
- **Buyer Dashboard**: http://localhost:8080/users/buyer-dashboard.html
- **Seller Dashboard**: http://localhost:8080/users/seller-dashboard.html
- **Admin Dashboard**: http://localhost:8080/users/admin-dashboard.html

---

## 🔧 TÍCH HỢP PHÂN QUYỀN

### Auto-redirect sau đăng nhập

File: `frontend/app.js` (cần update)

```javascript
function handleLoginSuccess(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirect based on role
    switch(user.role) {
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
```

### Kiểm tra quyền truy cập

Mỗi dashboard có hàm check auth:

```javascript
// buyer-dashboard.js
function checkBuyerAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'buyer') {
        alert('Bạn cần đăng nhập với tài khoản người mua hàng!');
        window.location.href = '../frontend/auth.html';
        return false;
    }
    return true;
}
```

---

## ✨ TÍNH NĂNG NỔI BẬT

### Buyer Dashboard
- 📊 Thống kê chi tiêu (tổng đơn, tổng tiền, điểm thưởng)
- 📦 Theo dõi trạng thái đơn hàng real-time
- 📍 Quản lý nhiều địa chỉ giao hàng
- ⭐ Đánh giá sản phẩm đã mua
- 🔔 Thông báo đơn hàng, khuyến mãi

### Seller Dashboard
- 📦 Thêm sản phẩm với form đầy đủ
- 🛒 Quản lý đơn hàng với nhiều trạng thái
- 💰 Báo cáo doanh thu chi tiết (ngày, tháng, tổng)
- 🏪 Tùy chỉnh thông tin cửa hàng (logo, banner, mô tả)
- 📊 Thống kê 5 chỉ số quan trọng

### Admin Dashboard
- 👥 Quản lý 3 loại user (buyer, seller, admin)
- 🔍 Tìm kiếm và lọc nâng cao
- 🚫 Khóa/Mở khóa tài khoản
- 📈 Dashboard tổng quan với 6 chỉ số
- 📋 Xem hoạt động gần đây
- ⚙️ Cài đặt hệ thống (phí, hoa hồng)

---

## 🎨 UI/UX DESIGN

- **Color Scheme**: 
  - Primary: #ff4757 (Đỏ)
  - Secondary: #667eea, #764ba2 (Gradient tím)
  - Success: #43e97b, #38f9d7 (Xanh)
  - Warning: #fdcb6e (Vàng)
  
- **Typography**: Sans-serif, responsive font sizes
- **Layout**: Grid system, responsive design
- **Components**: Cards, tables, modals, badges, buttons

---

## 📝 TODO - TÍNH NĂNG TIẾP THEO

### High Priority
- [ ] Email verification khi đăng ký
- [ ] Password reset/forgot password
- [ ] Two-factor authentication (2FA)
- [ ] Real-time notifications với WebSocket
- [ ] Upload ảnh sản phẩm lên server
- [ ] Export reports to Excel/PDF

### Medium Priority
- [ ] Chat giữa buyer và seller
- [ ] Hệ thống báo cáo sản phẩm/người dùng
- [ ] Tích hợp payment gateway (VNPay, Momo)
- [ ] Email notification (đơn hàng, khuyến mãi)
- [ ] Push notifications

### Low Priority
- [ ] Dashboard analytics với charts
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app (React Native)

---

## 🐛 TROUBLESHOOTING

### Lỗi không đăng nhập được
- Kiểm tra backend đã chạy chưa (port 3000)
- Clear localStorage và thử lại
- Check console log để xem lỗi chi tiết

### Lỗi không hiển thị dashboard
- Kiểm tra role trong localStorage
- Đảm bảo đã đăng nhập đúng loại tài khoản
- Kiểm tra đường dẫn file HTML

### Lỗi API không hoạt động
- Kiểm tra CORS đã enable chưa
- Kiểm tra backend server logs
- Verify API endpoint URL

---

## 📞 HỖ TRỢ

**Developer**: ShopVN Team
**Email**: support@shopvn.com
**Version**: 2.2.0 (User Roles System)
**Last Updated**: 2026-01-17

---

**🎉 Hệ thống phân quyền hoàn chỉnh - ShopVN v2.2.0!**
