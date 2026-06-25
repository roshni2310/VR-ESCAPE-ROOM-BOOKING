# Database Schema Documentation

## Overview

The VR Escape Room Booking System uses MongoDB as the primary database. This document outlines all collections, their schemas, relationships, and indexes.

## Collections

### 1. Users Collection

Stores user account information and authentication credentials.

```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  username: String (unique),
  firstName: String,
  lastName: String,
  phone: String,
  password: String (hashed with bcrypt),
  role: String (enum: ['user', 'admin', 'moderator']),
  avatar: String (URL),
  bio: String,
  dateOfBirth: Date,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  profileCompletion: Number (0-100),
  emailVerified: Boolean,
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  loginHistory: [{
    timestamp: Date,
    ipAddress: String,
    userAgent: String
  }],
  preferences: {
    notifications: Boolean,
    newsletter: Boolean,
    theme: String
  },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date (soft delete)
}
```

**Indexes**: email (unique), username (unique), role, createdAt

---

### 2. Rooms Collection

Stores information about available escape rooms/experiences.

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  theme: String (enum: ['sci-fi', 'horror', 'mystery', 'adventure']),
  maxCapacity: Number,
  minCapacity: Number,
  duration: Number (minutes),
  difficulty: String (enum: ['easy', 'medium', 'hard', 'expert']),
  price: Number (in cents for Stripe),
  image: String (URL),
  images: [String] (URLs),
  amenities: [String],
  ageRestriction: Number (minimum age),
  location: {
    floor: Number,
    building: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  isActive: Boolean,
  availability: {
    monday: { startTime: String, endTime: String },
    tuesday: { startTime: String, endTime: String },
    // ... days of week
  },
  createdBy: ObjectId (ref: Users),
  ratings: Number (1-5 average),
  reviewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: name, isActive, difficulty, createdAt

---

### 3. TimeSlots Collection

Manages available time slots for each room.

```javascript
{
  _id: ObjectId,
  roomId: ObjectId (ref: Rooms),
  date: Date,
  startTime: String (HH:MM format),
  endTime: String (HH:MM format),
  capacity: Number,
  booked: Number,
  available: Number (capacity - booked),
  bookings: [ObjectId] (ref: Bookings),
  status: String (enum: ['available', 'full', 'maintenance', 'cancelled']),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: roomId, date, status, available (for quick queries)

---

### 4. Bookings Collection

Stores all booking records including group bookings.

```javascript
{
  _id: ObjectId,
  bookingNumber: String (unique, auto-generated),
  userId: ObjectId (ref: Users),
  roomId: ObjectId (ref: Rooms),
  slotId: ObjectId (ref: TimeSlots),
  date: Date,
  startTime: String,
  endTime: String,
  participants: [{
    userId: ObjectId (ref: Users),
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dateOfBirth: Date,
    waiverSigned: Boolean,
    waiverSignedAt: Date,
    status: String (enum: ['invited', 'accepted', 'declined', 'confirmed'])
  }],
  totalParticipants: Number,
  status: String (enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show']),
  totalPrice: Number (in cents),
  costPerPerson: Number,
  splitDetails: [{
    participantId: ObjectId,
    amountOwed: Number,
    paid: Boolean,
    paidAt: Date
  }],
  payment: {
    stripePaymentIntentId: String,
    stripeChargeId: String,
    status: String (enum: ['pending', 'succeeded', 'failed', 'refunded']),
    amount: Number,
    currency: String,
    transactionDate: Date,
    refundAmount: Number,
    refundDate: Date
  },
  waivers: [{
    participantId: ObjectId,
    docusignId: String,
    status: String (enum: ['sent', 'signed', 'declined']),
    signedAt: Date,
    signatureUrl: String
  }],
  specialRequests: String,
  internalNotes: String,
  cancellationReason: String,
  cancellationDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: bookingNumber (unique), userId, roomId, slotId, date, status, payment.status

---

### 5. Payments Collection

Detailed payment transaction log.

```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: Bookings),
  userId: ObjectId (ref: Users),
  amount: Number (in cents),
  currency: String,
  status: String (enum: ['pending', 'succeeded', 'failed', 'refunded']),
  paymentMethod: String (enum: ['card', 'bank_transfer', 'digital_wallet']),
  stripePaymentIntentId: String,
  stripeChargeId: String,
  stripeRefundId: String,
  cardLast4: String,
  cardBrand: String,
  receiptEmail: String,
  receiptUrl: String,
  failureReason: String,
  refundReason: String,
  refundAmount: Number,
  refundDate: Date,
  metadata: {
    ipAddress: String,
    userAgent: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: bookingId, userId, status, stripePaymentIntentId

---

### 6. Waivers Collection

Digital liability waiver tracking.

```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: Bookings),
  participantId: ObjectId (ref: Users),
  waiverVersion: String,
  docusignId: String,
  status: String (enum: ['sent', 'viewed', 'signed', 'declined', 'expired']),
  sentAt: Date,
  viewedAt: Date,
  signedAt: Date,
  declinedAt: Date,
  expiresAt: Date,
  signatureUrl: String,
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: bookingId, participantId, status, docusignId

---

### 7. Reviews Collection

User reviews and ratings for rooms.

```javascript
{
  _id: ObjectId,
  roomId: ObjectId (ref: Rooms),
  userId: ObjectId (ref: Users),
  bookingId: ObjectId (ref: Bookings),
  rating: Number (1-5),
  title: String,
  comment: String,
  images: [String],
  verified: Boolean (purchased review),
  helpful: Number (upvotes),
  unhelpful: Number (downvotes),
  status: String (enum: ['pending', 'approved', 'rejected']),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: roomId, userId, verified, status

---

### 8. Inventory Collection

Tracks room equipment and supplies.

```javascript
{
  _id: ObjectId,
  roomId: ObjectId (ref: Rooms),
  itemName: String,
  quantity: Number,
  minThreshold: Number,
  maxCapacity: Number,
  lastRestocked: Date,
  supplier: String,
  cost: Number,
  condition: String (enum: ['excellent', 'good', 'fair', 'needs_repair']),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: roomId, condition, lastRestocked

---

## Relationships

```
Users (1) ──→ (N) Bookings
      (1) ──→ (N) Reviews
      (1) ──→ (N) Payments
      (1) ──→ (N) Waivers

Rooms (1) ──→ (N) TimeSlots
     (1) ──→ (N) Bookings
     (1) ──→ (N) Reviews
     (1) ──→ (N) Inventory

TimeSlots (1) ──→ (N) Bookings

Bookings (1) ──→ (N) Payments
        (1) ──→ (N) Waivers
```

---

## Migration Scripts

Create migration scripts in `/backend/src/scripts/` to:
1. Initialize collections and indexes
2. Seed test data (rooms, users, timeslots)
3. Handle schema updates and migrations

---

## Performance Optimization

- Add TTL indexes for temporary data (email verification tokens, password reset tokens)
- Use compound indexes for frequently filtered queries
- Implement pagination for list endpoints
- Consider sharding for Bookings collection if data grows large

---

## Data Integrity Rules

- Verify no double-booking: Check TimeSlots.available > 0 before creating booking
- Cascade delete bookings when a room/timeslot is deleted
- Ensure payment status consistency with booking status
- Archive old waivers after 7 years for compliance

