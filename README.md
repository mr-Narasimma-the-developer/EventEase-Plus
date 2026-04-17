# EventEase+ - AI-Assisted Verified Vendor Event Management System

## Project Overview
EventEase+ is a full-stack web application that helps users find, compare, and book event service providers with intelligent filtering and vendor verification.

## Tech Stack
- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt

## Key Features

### Customer Features
- Search services by category, location, and price
- View vendor profiles with ratings and verification status
- Get AI-powered recommendations based on trust scores
- Book services with instant cost estimation
- Track booking status in real-time

### Provider Features
- Create and manage services
- Set pricing and availability
- Receive and manage booking requests
- Accept/reject bookings
- View earnings and booking history

### Admin Features
- Verify service providers
- Manage all users
- View dashboard statistics
- Monitor system activity

### Advanced Logic
1. **Trust Score Algorithm**:
```
   Trust Score = (Rating × 0.5) + (Price Score × 0.3) + (Verification × 0.2)
```

2. **Smart Recommendations**:
   - Sort by location match
   - Filter by budget
   - Rank by trust score

3. **Cost Estimation**:
```
   Estimated Cost = People Count × Service Price
```

## Installation & Setup

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/eventease
# JWT_SECRET=your_secret_key
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Project Structure
```
EventEase-Plus/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Trust score calculator
│   └── server.js        # Entry point
├── frontend/
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # Auth context
│       ├── pages/       # Route pages
│       ├── utils/       # API config
│       └── App.js       # Main app
└── README.md
```

## Testing Workflow

### 1. Register Users
- Register as Provider
- Register as Customer
- Register as Admin

### 2. Provider Actions
- Login as provider
- Create services (catering, photography, etc.)
- Set prices and availability

### 3. Admin Actions
- Login as admin
- Verify providers
- View dashboard statistics

### 4. Customer Actions
- Browse services
- Use smart recommendations
- Book services
- Track bookings

### 5. Provider Response
- Login as provider
- View booking requests
- Accept/reject bookings

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Services
- GET `/api/services` - Get all services
- POST `/api/services` - Create service (Provider)
- GET `/api/services/:id` - Get service details
- PUT `/api/services/:id` - Update service (Provider)
- DELETE `/api/services/:id` - Delete service (Provider)

### Bookings
- POST `/api/bookings` - Create booking (Customer)
- GET `/api/bookings/my-bookings` - Get customer bookings
- GET `/api/bookings/provider-bookings` - Get provider bookings
- PUT `/api/bookings/:id/status` - Update booking status (Provider)

### Recommendations
- GET `/api/recommendations` - Get smart recommendations

### Admin
- GET `/api/admin/stats` - Get dashboard statistics
- GET `/api/admin/users` - Get all users
- PUT `/api/admin/verify-provider/:id` - Verify provider
- DELETE `/api/admin/users/:id` - Delete user

## Demo Credentials
After registration, use these roles for testing:
- Customer: Any user with role="customer"
- Provider: Any user with role="provider"
- Admin: Any user with role="admin"

## Future Enhancements
- Payment gateway integration
- Real-time chat between customers and providers
- Calendar availability management
- Review and rating system
- Email notifications
- Mobile app version

## Author
Developed as a final year B.Tech IT project

## License
MIT License