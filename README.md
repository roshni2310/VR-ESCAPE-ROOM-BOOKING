# VR Escape Room Booking System

A comprehensive booking and inventory management engine for interactive entertainment venues with real-time slot availability, digital liability e-signatures, group cost-splitting, and integrated payment processing.

## 🎯 Features

- **Booking Management**: Prevent double-booking of time slots with real-time inventory tracking
- **Multi-Room Support**: Manage multiple escape rooms with individual capacity constraints
- **User Authentication**: Secure login with Passport.js and JWT tokens
- **Payment Integration**: Stripe integration for secure payment processing
- **Digital E-Signatures**: DocuSign/Adobe Sign integration for liability waivers
- **Group Bookings**: Enable friends to split reservation costs
- **Admin Dashboard**: Manage bookings, rooms, and inventory
- **Role-Based Access Control**: Different permission levels for users and admins

## 📋 Project Structure

```
virtual-room/
├── backend/              # Node.js Express API
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Authentication, validation
│   │   ├── utils/        # Helper functions
│   │   └── config/       # Configuration files
│   ├── tests/            # Unit & integration tests
│   └── package.json
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # State management
│   │   ├── services/     # API client
│   │   ├── styles/       # CSS/SCSS
│   │   └── utils/        # Helper functions
│   ├── public/           # Static assets
│   └── package.json
├── docs/                 # Documentation
│   ├── API.md            # API reference
│   ├── DATABASE.md       # Database schema
│   └── DEPLOYMENT.md     # Deployment guide
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas cluster)
- Stripe account
- DocuSign/Adobe Sign account (optional for MVP)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The application will be available at `http://localhost:3000`

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Development Guidelines](docs/DEVELOPMENT.md)

## 🔧 Configuration

Create a `.env` file in the backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/vr-escape-room
# OR MongoDB Atlas
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your_jwt_secret_key
PASSPORT_SECRET=your_passport_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# DocuSign (optional)
DOCUSIGN_ACCOUNT_ID=your_account_id
DOCUSIGN_CLIENT_ID=your_client_id
DOCUSIGN_CLIENT_SECRET=your_client_secret
DOCUSIGN_AUTH_SERVER=https://account-d.docusign.com
```

## 📖 Learning Path

1. **Backend Setup** - Express.js API with MongoDB
2. **Database Design** - Users, Bookings, Rooms, Slots schemas
3. **Authentication** - JWT & Passport.js implementation
4. **API Endpoints** - CRUD operations for bookings
5. **Frontend Setup** - React with Redux state management
6. **Payment Integration** - Stripe implementation
7. **E-Signatures** - DocuSign workflow
8. **Testing** - Unit and integration tests
9. **Deployment** - AWS/Heroku deployment

## 🛠 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm start` - Start production server

### Frontend
- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (irreversible)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Status**: 🔨 In Development (MVP)
