# Development Guidelines

## Project Setup

### Prerequisites
- Node.js 16+ and npm 8+
- MongoDB (local or Atlas)
- Git

### Environment Setup

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

The backend API will run on `http://localhost:5000`

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your React app configuration
npm start
```

The frontend will run on `http://localhost:3000`

---

## Project Structure Best Practices

### Backend (`/backend/src/`)

- **controllers/** - Business logic for each route
- **models/** - Mongoose schemas and database models
- **routes/** - API endpoint definitions
- **middleware/** - Authentication, validation, error handling
- **utils/** - Helper functions and utilities
- **config/** - Configuration files (database, passport, etc.)

**Example: Adding a new feature**
1. Create model in `models/Feature.js`
2. Create controller in `controllers/featureController.js`
3. Create routes in `routes/feature.js`
4. Add route to main `server.js`
5. Add middleware for validation if needed

### Frontend (`/frontend/src/`)

- **components/** - Reusable UI components
- **pages/** - Full page components
- **redux/** - Redux store, slices, and thunks
- **services/** - API client functions
- **styles/** - Global and component-specific styles
- **utils/** - Helper functions

**Example: Creating a new page**
1. Create page component in `pages/FeaturePage.js`
2. Create Redux slice in `redux/featureSlice.js`
3. Create API service in `services/featureAPI.js`
4. Add routes in `App.js`

---

## Coding Standards

### JavaScript/Node.js
- Use ES6+ syntax
- Follow Airbnb ESLint config
- Use const/let, not var
- Add JSDoc comments for complex functions
- Use async/await instead of promises

```javascript
/**
 * Fetch room details
 * @param {string} roomId - Room identifier
 * @returns {Promise<Object>} Room data
 */
const getRoomDetails = async (roomId) => {
  try {
    const response = await fetch(`/api/rooms/${roomId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
};
```

### React
- Use functional components with hooks
- Keep components small and focused
- Use Redux for global state
- Use local state only for UI-specific data
- Memoize expensive computations with useMemo
- Use PropTypes for type checking

```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const RoomCard = ({ room, onBook }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="room-card">
      <h3>{room.name}</h3>
      <button onClick={onBook} disabled={isLoading}>
        {isLoading ? 'Booking...' : 'Book Now'}
      </button>
    </div>
  );
};

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string.required,
    name: PropTypes.string.required,
  }).isRequired,
  onBook: PropTypes.func.required,
};

export default RoomCard;
```

---

## API Development

### Creating a New Endpoint

1. **Define Model** (`models/Feature.js`)
   - Define schema with validation
   - Add indexes for performance

2. **Create Controller** (`controllers/featureController.js`)
   ```javascript
   exports.getFeature = async (req, res, next) => {
     try {
       const feature = await Feature.findById(req.params.id);
       if (!feature) {
         return res.status(404).json({ message: 'Not found' });
       }
       res.json(feature);
     } catch (error) {
       next(error);
     }
   };
   ```

3. **Define Routes** (`routes/feature.js`)
   ```javascript
   const router = require('express').Router();
   const { getFeature, createFeature } = require('../controllers/featureController');
   const auth = require('../middleware/auth');

   router.get('/:id', getFeature);
   router.post('/', auth.required, createFeature);

   module.exports = router;
   ```

4. **Register Routes** (`server.js`)
   ```javascript
   app.use('/api/features', require('./routes/feature'));
   ```

### Error Handling

Use consistent error responses:
```javascript
{
  status: 400,
  message: "Error description",
  errors: [{ field: "fieldName", message: "Validation error" }],
  requestId: "req_id_for_tracking"
}
```

---

## Testing

### Backend Tests
```bash
npm test                 # Run all tests
npm test -- --watch    # Watch mode
npm test -- --coverage # Coverage report
```

### Frontend Tests
```bash
npm test                # Jest test runner
npm test -- --coverage # Coverage report
```

---

## Database Migrations

Run migrations after schema updates:
```bash
npm run migrate
```

Seed test data:
```bash
npm run seed
```

---

## Git Workflow

1. Create feature branch: `git checkout -b feature/description`
2. Make commits: `git commit -m "Descriptive message"`
3. Push branch: `git push origin feature/description`
4. Create Pull Request on GitHub
5. Code review and merge to main

**Commit Message Format:**
```
[Type] Short description

Longer description if needed.

Closes #123
```

Types: feat, fix, docs, style, refactor, test, chore

---

## Debugging

### Backend
```bash
# Debug with Node inspector
node --inspect src/server.js

# Or use VS Code debugger
# Set breakpoints and press F5
```

### Frontend
- Use React DevTools browser extension
- Use Redux DevTools for state debugging
- Use Chrome DevTools Network tab for API calls

---

## Performance Optimization

### Backend
- Use indexes on frequently queried fields
- Implement caching for static data
- Use pagination for list endpoints
- Monitor database query performance

### Frontend
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Use Redux selector memoization
- Minimize bundle size with webpack analysis

---

## Security Best Practices

1. **Never commit .env files** - Use .env.example
2. **Validate all inputs** - Use Joi for schema validation
3. **Sanitize database queries** - Use mongoose/parameterized queries
4. **Use HTTPS** - In production only
5. **Hash passwords** - Use bcryptjs
6. **Implement CORS properly** - Whitelist origins
7. **Use CSRF tokens** - For state-changing operations
8. **Keep dependencies updated** - Run npm audit regularly

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

---

## Troubleshooting

### Backend won't start
- Check MongoDB connection: `mongosh localhost:27017`
- Check port availability: `lsof -i :5000`
- Check .env file configuration
- Review server logs

### Frontend won't start
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`
- Check Node version: `node --version`

### API calls failing
- Check CORS configuration in backend
- Verify JWT token in requests
- Check API endpoint URLs in frontend
- Review browser console for errors

