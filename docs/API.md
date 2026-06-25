# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except login/register) require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. User Registration
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. User Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

## Rooms Endpoints

### 1. Get All Rooms
```
GET /rooms?theme=sci-fi&difficulty=hard&page=1&limit=10

Response: 200 OK
{
  "total": 15,
  "page": 1,
  "limit": 10,
  "rooms": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Space Station",
      "theme": "sci-fi",
      "difficulty": "hard",
      "maxCapacity": 6,
      "minCapacity": 2,
      "duration": 60,
      "price": 4999,
      "image": "https://...",
      "ratings": 4.5,
      "reviewCount": 32
    }
  ]
}
```

### 2. Get Room Details
```
GET /rooms/:roomId

Response: 200 OK
{
  "id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "Space Station",
  "description": "Escape from an alien spaceship...",
  "theme": "sci-fi",
  "difficulty": "hard",
  "maxCapacity": 6,
  "minCapacity": 2,
  "duration": 60,
  "price": 4999,
  "amenities": ["WiFi", "Parking", "Restroom"],
  "images": ["https://..."],
  "reviews": [...]
}
```

---

## Bookings Endpoints

### 1. Get Available Time Slots
```
GET /bookings/availability?roomId=60f7...&date=2024-06-25

Response: 200 OK
{
  "date": "2024-06-25",
  "roomId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "slots": [
    {
      "slotId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "startTime": "10:00",
      "endTime": "11:00",
      "available": 4,
      "capacity": 6
    },
    {
      "slotId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "startTime": "11:30",
      "endTime": "12:30",
      "available": 6,
      "capacity": 6
    }
  ]
}
```

### 2. Create Booking (Single User)
```
POST /bookings
Content-Type: application/json
Authorization: Bearer <token>

{
  "roomId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "slotId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "participants": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "dateOfBirth": "1990-01-15"
    }
  ],
  "specialRequests": "Allergies: none"
}

Response: 201 Created
{
  "bookingId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "bookingNumber": "VR-2024-001234",
  "status": "pending",
  "totalPrice": 4999,
  "paymentUrl": "https://stripe.com/pay/...",
  "waiverUrl": "https://..."
}
```

### 3. Create Group Booking
```
POST /bookings/group
Content-Type: application/json
Authorization: Bearer <token>

{
  "roomId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "slotId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "groupMembers": [
    {
      "email": "friend1@example.com",
      "firstName": "Alice",
      "lastName": "Smith"
    },
    {
      "email": "friend2@example.com",
      "firstName": "Bob",
      "lastName": "Johnson"
    }
  ],
  "totalPrice": 9998,
  "splitEqually": true
}

Response: 201 Created
{
  "bookingId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "bookingNumber": "VR-2024-001235",
  "status": "pending_group_acceptance",
  "participants": [...],
  "costPerPerson": 3332.67,
  "invitations_sent": true
}
```

### 4. Get My Bookings
```
GET /bookings/my-bookings?status=confirmed&page=1

Response: 200 OK
{
  "total": 5,
  "bookings": [
    {
      "bookingId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "bookingNumber": "VR-2024-001234",
      "room": "Space Station",
      "date": "2024-06-25",
      "startTime": "14:00",
      "status": "confirmed",
      "participants": 3,
      "totalPrice": 4999
    }
  ]
}
```

### 5. Cancel Booking
```
DELETE /bookings/:bookingId
Authorization: Bearer <token>

{
  "cancellationReason": "Schedule conflict"
}

Response: 200 OK
{
  "message": "Booking cancelled successfully",
  "refundAmount": 4999,
  "refundStatus": "processing"
}
```

---

## Payment Endpoints

### 1. Process Payment
```
POST /payments/process
Content-Type: application/json
Authorization: Bearer <token>

{
  "bookingId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "paymentMethodId": "pm_1234567890",
  "amount": 4999,
  "currency": "USD"
}

Response: 200 OK
{
  "paymentIntentId": "pi_1234567890",
  "status": "succeeded",
  "amount": 4999,
  "receiptUrl": "https://..."
}
```

### 2. Get Payment History
```
GET /payments/history?limit=20&page=1
Authorization: Bearer <token>

Response: 200 OK
{
  "total": 8,
  "payments": [
    {
      "transactionId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "bookingNumber": "VR-2024-001234",
      "amount": 4999,
      "status": "succeeded",
      "date": "2024-06-20T14:30:00Z",
      "receiptUrl": "https://..."
    }
  ]
}
```

---

## Waiver/E-Signature Endpoints

### 1. Send Waiver
```
POST /waivers/send
Content-Type: application/json
Authorization: Bearer <token>

{
  "bookingId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "participantEmail": "participant@example.com"
}

Response: 202 Accepted
{
  "waiverSentId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "status": "sent",
  "expiresAt": "2024-06-22T14:30:00Z",
  "signUrl": "https://docusign-embed..."
}
```

### 2. Check Waiver Status
```
GET /waivers/:waiverSentId
Authorization: Bearer <token>

Response: 200 OK
{
  "waiverSentId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "status": "signed",
  "signedAt": "2024-06-20T10:15:00Z",
  "participantName": "John Doe",
  "signatureUrl": "https://..."
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "status": 400,
  "message": "Invalid request parameters",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "status": 401,
  "message": "Authentication required"
}
```

### 409 Conflict
```json
{
  "status": 409,
  "message": "Time slot no longer available",
  "availableSlots": [...]
}
```

### 500 Internal Server Error
```json
{
  "status": 500,
  "message": "Internal server error",
  "requestId": "req_123456789"
}
```

---

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per minute per IP
- Payment endpoints: 20 requests per hour per user

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Webhook Events

### booking.created
Triggered when a new booking is created
```json
{
  "event": "booking.created",
  "bookingId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "roomId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "timestamp": "2024-06-20T14:30:00Z"
}
```

### payment.succeeded
Triggered when payment is successful
```json
{
  "event": "payment.succeeded",
  "bookingId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "amount": 4999,
  "timestamp": "2024-06-20T14:35:00Z"
}
```

