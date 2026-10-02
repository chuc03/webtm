# 🛍️ ShopVN - E-Commerce Platform

Nền tảng thương mại điện tử đa danh mục theo kiểu Shopee/Lazada

---

## 📋 Tính Năng

✅ **Frontend (HTML/CSS/JavaScript):**
- 🏪 Multi-category shop (8 danh mục)
- 🛒 Shopping cart system
- 🔥 Flash sale với countdown timer
- 🔍 Search & filter sản phẩm
- 👤 User authentication (login/signup)
- 📦 Order history & tracking
- 💾 localStorage persistence
- 📱 Responsive design

✅ **Backend (Node.js + Express):**
- 🔐 User registration & login
- 📦 Product management
- 🛒 Cart operations
- 📋 Order management
- ✨ RESTful API

---

## 🚀 Cách Sử Dụng

### Bước 1: Chuẩn bị môi trường
```bash
# Đã cài Node.js? Kiểm tra:
node --version
npm --version
```

### Bước 2: Khởi động Backend
```bash
# Vào thư mục backend
cd c:\Users\Admin\.vscode\webtm\backend

# Backend đã khởi động ở port 3000
```
✅ Server chạy tại: `http://localhost:3000`

### Bước 3: Mở Frontend
```
Mở file index.html trong trình duyệt
hoặc truy cập: file:///c:/Users/Admin/.vscode/webtm/index.html
```

---

## 📂 Cấu Trúc Dự Án

```
webtm/
├── index.html          # Frontend chính
├── styles.css          # CSS styling (Responsive)
├── app.js              # JavaScript logic
└── backend/
    ├── package.json    # Dependencies
    ├── server.js       # Express server
    └── node_modules/   # Dependencies (đã cài)
```

---

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```

### Products
```
GET /api/products              # Lấy tất cả sản phẩm
GET /api/products/:id          # Lấy sản phẩm theo ID
```

### Authentication
```
POST /api/auth/register        # Đăng ký
  Body: { name, email, phone, password }

POST /api/auth/login           # Đăng nhập
  Body: { email, password }
```

### Cart
```
GET /api/cart/:userId          # Lấy giỏ hàng
POST /api/cart/:userId         # Thêm vào giỏ
  Body: { productId, quantity }

DELETE /api/cart/:userId/:productId  # Xóa khỏi giỏ
DELETE /api/cart/:userId        # Xóa toàn bộ giỏ
```

### Orders
```
POST /api/orders               # Tạo đơn hàng
  Body: { userId, items, customer }

GET /api/orders/:userId        # Lấy đơn hàng của user
GET /api/orders/:userId/:orderId  # Lấy chi tiết đơn hàng

PATCH /api/orders/:userId/:orderId  # Cập nhật trạng thái
  Body: { status }

POST /api/orders/:userId/:orderId/cancel  # Hủy đơn hàng
```

---

## 🧪 Test API với Postman/cURL

### Test Health Check
```bash
curl http://localhost:3000/api/health
```

### Đăng ký
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "phone": "0123456789",
    "password": "123456"
  }'
```

### Đăng nhập
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "123456"
  }'
```

---

## 📦 Sản Phẩm Mẫu (25 sản phẩm)

| Danh Mục | Số Lượng |
|----------|---------|
| 👕 Thời trang | 5 |
| 📱 Điện tử | 5 |
| 💄 Làm đẹp | 4 |
| 🏠 Nhà cửa | 4 |
| ⚽ Thể thao | 3 |
| 📚 Sách | 2 |
| 🍜 Thực phẩm | 2 |

---

## 🎨 Giao Diện Chính

- **Header** - Navigation, search, cart, user profile
- **Banner** - Slider quảng cáo
- **Categories** - 8 danh mục sản phẩm
- **Flash Sale** - Sản phẩm giảm giá với đếm ngược
- **Product Grid** - Hiển thị sản phẩm
- **Cart Sidebar** - Giỏ hàng quick view
- **Auth Modal** - Login/Signup
- **Orders Page** - Lịch sử đơn hàng

---

## 💾 Dữ Liệu Lưu Trữ

Frontend dùng **localStorage**:
- `cart` - Giỏ hàng
- `currentUser` - User đăng nhập
- `userOrders_*` - Lịch sử đơn hàng

Backend dùng **Memory** (dữ liệu mất khi restart):
- Users
- Products
- Carts
- Orders

*Lưu ý: Để lưu persistent, cần thêm Database (MongoDB/SQLite)*

---

## 🔄 Luồng Hoạt Động

1. **User vào shop** → Xem danh sách sản phẩm
2. **Add to cart** → Lưu vào giỏ hàng
3. **Checkout** → Tạo đơn hàng (yêu cầu login)
4. **Đăng nhập** → Lưu thông tin user
5. **View orders** → Xem lịch sử đơn hàng

---

## 🛠️ Troubleshooting

### Backend không khởi động
```bash
# Kiểm tra port 3000 có bị dùng không
netstat -an | findstr :3000

# Nếu có, đóng process hoặc đổi port
```

### Frontend không kết nối Backend
```
1. Kiểm tra Backend có chạy ở localhost:3000
2. Kiểm tra app.js có đúng API_BASE URL
3. Mở DevTools (F12) xem console errors
```

### Lỗi CORS
```
Backend đã được cấu hình CORS cho tất cả origins
Nếu vẫn lỗi, kiểm tra headers trong requests
```

---

## 📝 Ghi Chú

- ✅ Tất cả lỗi HTML/CSS đã sửa
- ✅ Backend API hoàn chỉnh
- ✅ Frontend & Backend đã kết nối
- ⏳ Có thể thêm Database để lưu persistent
- ⏳ Có thể thêm Payment gateway (VNPay, Stripe)
- ⏳ Có thể thêm Admin panel

---

## 👨‍💻 Tác Giả

ShopVN - E-Commerce Platform 2026

---

**Happy Shopping! 🛍️🎉**
