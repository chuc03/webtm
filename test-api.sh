#!/bin/bash

# ShopVN API Test Script

API="http://localhost:3000/api"

echo "🧪 Testing ShopVN API..."
echo ""

# 1. Health Check
echo "1️⃣  Health Check:"
curl -s "$API/health" | jq '.' 
echo ""
echo ""

# 2. Get Products
echo "2️⃣  Get All Products:"
curl -s "$API/products" | jq '.[0:2]'
echo ""
echo ""

# 3. Register User
echo "3️⃣  Register User:"
REGISTER=$(curl -s -X POST "$API/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyen Van A",
    "email": "user123@example.com",
    "phone": "0123456789",
    "password": "123456"
  }')
echo "$REGISTER" | jq '.'
USER_ID=$(echo "$REGISTER" | jq -r '.user.id')
echo "User ID: $USER_ID"
echo ""

# 4. Login
echo "4️⃣  Login:"
curl -s -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user123@example.com",
    "password": "123456"
  }' | jq '.'
echo ""

# 5. Add to Cart
echo "5️⃣  Add to Cart:"
curl -s -X POST "$API/cart/$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 2
  }' | jq '.'
echo ""

# 6. Get Cart
echo "6️⃣  Get Cart:"
curl -s "$API/cart/$USER_ID" | jq '.'
echo ""

# 7. Verify Voucher
echo "7️⃣  Verify Voucher (WELCOME10):"
curl -s -X POST "$API/vouchers/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10",
    "totalPrice": 258000
  }' | jq '.'
echo ""

# 8. Create Order
echo "8️⃣  Create Order:"
curl -s -X POST "$API/orders" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"items\": [
      {\"productId\": 1, \"quantity\": 1}
    ],
    \"customer\": {
      \"name\": \"Nguyen Van A\",
      \"email\": \"user123@example.com\",
      \"phone\": \"0123456789\",
      \"address\": \"123 Nguyen Hue, HCM\"
    }
  }" | jq '.'
echo ""

# 9. Get Orders
echo "9️⃣  Get User Orders:"
curl -s "$API/orders/$USER_ID" | jq '.'
echo ""

# 10. Add Review
echo "🔟  Add Product Review:"
curl -s -X POST "$API/products/1/reviews" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"rating\": 5,
    \"comment\": \"Sản phẩm rất tốt!\"
  }" | jq '.'
echo ""

echo "✅ API Testing Complete!"
