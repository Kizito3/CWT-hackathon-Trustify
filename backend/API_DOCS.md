# Accountability Wallet API Documentation

**Base URL:** `https://accountability-tracker-lps3.onrender.com/api`

⚠️ **Important:** Free tier sleeps after 15 minutes of inactivity. First request may take 30 seconds to wake up.

---

## Authentication

All admin endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get token from `/auth/register` or `/auth/login` endpoints.

---

## API Endpoints

### 🔐 Authentication Routes

#### Register New Admin
```http
POST /auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "createdAt": "2025-01-18T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Response:** Same as register

#### Verify Token
```http
GET /auth/verify
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com"
  }
}
```

---

### 💰 Wallet Routes (All require authentication)

#### Get All Wallets
```http
GET /wallets
Authorization: Bearer <token>
```

**Response:**
```json
{
  "wallets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Savings Account",
      "currentBalance": 5000,
      "createdAt": "2025-01-18T..."
    }
  ]
}
```

#### Create New Wallet
```http
POST /wallets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Emergency Fund",
  "initialBalance": 1000
}
```

**Response:**
```json
{
  "message": "Wallet created successfully",
  "wallet": {
    "_id": "507f1f77bcf86cd799439011",
    "adminId": "507f191e810c19729de860ea",
    "name": "Emergency Fund",
    "currentBalance": 1000,
    "createdAt": "2025-01-18T..."
  }
}
```

#### Get Single Wallet
```http
GET /wallets/:id
Authorization: Bearer <token>
```

#### Add Inflow (Deposit Money)
```http
POST /wallets/:id/inflow
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500,
  "description": "Salary payment"
}
```

**Response:**
```json
{
  "message": "Inflow added successfully",
  "transaction": {
    "_id": "...",
    "type": "inflow",
    "amount": 500,
    "balanceAfter": 1500,
    "description": "Salary payment",
    "createdAt": "..."
  },
  "newBalance": 1500
}
```

#### Add Outflow (Withdraw Money)
```http
POST /wallets/:id/outflow
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 200,
  "description": "Groceries"
}
```

**Response:** Same format as inflow

**Error if insufficient balance:**
```json
{
  "error": "Insufficient balance"
}
```

#### Get Transaction History
```http
GET /wallets/:id/transactions
Authorization: Bearer <token>
```

**Response:**
```json
{
  "transactions": [
    {
      "_id": "...",
      "type": "outflow",
      "amount": 200,
      "balanceAfter": 1300,
      "description": "Groceries",
      "createdAt": "2025-01-18T14:30:00.000Z"
    },
    {
      "_id": "...",
      "type": "inflow",
      "amount": 500,
      "balanceAfter": 1500,
      "description": "Salary payment",
      "createdAt": "2025-01-18T14:00:00.000Z"
    }
  ]
}
```

#### Delete Wallet
```http
DELETE /wallets/:id
Authorization: Bearer <token>
```

---

### 👁️ Monitor Routes

#### Generate Monitor Link (Admin Only)
```http
POST /monitor/generate/:walletId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Monitor link created successfully",
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "monitorUrl": "https://accountability-tracker-lps3.onrender.com/api/monitor/550e8400-e29b-41d4-a716-446655440000",
  "wallet": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Emergency Fund"
  }
}
```

Share the `monitorUrl` with people you want to give read-only access to!

#### Get All Monitor Links (Admin Only)
```http
GET /monitor/links
Authorization: Bearer <token>
```

**Response:**
```json
{
  "links": [
    {
      "id": "...",
      "token": "550e8400-e29b-41d4-a716-446655440000",
      "walletId": "507f1f77bcf86cd799439011",
      "walletName": "Emergency Fund",
      "monitorUrl": "https://accountability-tracker-lps3.onrender.com/api/monitor/550e8400-...",
      "createdAt": "2025-01-18T..."
    }
  ]
}
```

#### Delete Monitor Link (Admin Only)
```http
DELETE /monitor/links/:token
Authorization: Bearer <token>
```

Revokes access for monitors using that link.

#### View Wallet (Public - No Auth Required)
```http
GET /monitor/:token
```

**Response:**
```json
{
  "wallet": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Emergency Fund",
    "currentBalance": 1300,
    "createdAt": "2025-01-18T..."
  },
  "linkCreatedAt": "2025-01-18T15:00:00.000Z",
  "accessType": "read-only"
}
```

#### View Transactions (Public - No Auth Required)
```http
GET /monitor/:token/transactions
```

**Response:**
```json
{
  "transactions": [...],
  "accessType": "read-only"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password required"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Wallet not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Frontend Integration Tips

### 1. Store JWT Token
After login/register, store the token in localStorage:
```javascript
localStorage.setItem('token', response.token);
```

### 2. Add Token to Requests
```javascript
const token = localStorage.getItem('token');

fetch('https://accountability-tracker-lps3.onrender.com/api/wallets', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### 3. Handle Free Tier Sleep
Show a loading indicator for the first request:
```javascript
// First request after sleep might take 30 seconds
const response = await fetch(apiUrl);
```

### 4. Monitor Links are Public
Monitor links work WITHOUT authentication - perfect for sharing with accountability partners!

---

## Example Frontend Flow

1. **Admin registers** → Get token
2. **Admin creates wallet** → Get wallet ID
3. **Admin adds inflow/outflow** → Transactions logged
4. **Admin generates monitor link** → Get shareable URL
5. **Admin shares URL** → Monitors can view (no login needed)
6. **Monitors visit URL** → See wallet balance & transaction history (read-only)

---

## Questions?

Contact the backend developer or check the GitHub repo for more details.