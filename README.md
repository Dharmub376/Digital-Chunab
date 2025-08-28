# Digital Chunab - Online Voting System

A secure, modern online voting system built with the MERN stack for student elections.

## Features

### 🔐 Security & Authentication
- JWT-based authentication with role-based access (Admin/Student)
- bcrypt password hashing
- Rate limiting to prevent brute force attacks
- Input validation and sanitization
- Session management with automatic logout

### 👨‍💼 Admin Features
- Comprehensive dashboard with statistics
- Student management (CRUD operations)
- CSV bulk import/export for students
- Position management with time windows
- Candidate management
- Real-time voting results
- Activity logs and audit trails
- Vote reset functionality

### 👨‍🎓 Student Features
- Secure login with student credentials
- Voting dashboard with status tracking
- One vote per position restriction
- Real-time countdown timers
- Profile management
- Voting history tracking

### 🗳️ Voting System
- Position-based voting with time restrictions
- Real-time vote counting
- Duplicate vote prevention
- Audit trail for all voting activities
- Results export (CSV/PDF)

## Tech Stack

- **Frontend**: React, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-deps
   ```

3. Set up environment variables:
   ```bash
   cp server/.env.example server/.env
   ```

4. Configure your environment variables in `server/.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/digital-chunab
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   JWT_EXPIRES_IN=24h
   ADMIN_EMAIL=admin@digitalchunab.com
   ADMIN_PASSWORD=admin123
   ```

5. Start the application:
   ```bash
   npm run dev
   ```

## Default Credentials

### Admin Login
- Email: admin@digitalchunab.com
- Password: admin123

### Student Registration
Students can be registered through the admin panel or by importing a CSV file.

## Project Structure

```
digital-chunab/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── ...
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── utils/             # Utility functions
│   └── ...
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register-student` - Register student

### Admin Routes
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/students` - List students
- `POST /api/admin/students` - Create student
- `GET /api/admin/positions` - List positions
- `POST /api/admin/positions` - Create position
- `GET /api/admin/candidates` - List candidates
- `POST /api/admin/candidates` - Create candidate
- `GET /api/admin/results` - Get voting results

### Student Routes
- `GET /api/student/dashboard` - Student dashboard
- `GET /api/student/profile` - Student profile
- `GET /api/student/positions` - Available positions

### Voting Routes
- `POST /api/voting/vote` - Cast vote
- `GET /api/voting/status/:positionId` - Get voting status

## Database Schema

### Models
- **Admin**: Admin user accounts
- **Student**: Student user accounts with voting history
- **Position**: Voting positions with time windows
- **Candidate**: Candidates for each position
- **Vote**: Individual vote records
- **ActivityLog**: System activity audit trail

## Security Features

1. **Authentication**: JWT tokens with expiration
2. **Rate Limiting**: Prevents brute force attacks
3. **Input Validation**: Sanitizes all user inputs
4. **CORS**: Configured for cross-origin requests
5. **Helmet**: Security headers
6. **Password Hashing**: bcrypt with salt rounds
7. **Role-based Access**: Admin/Student permissions

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

## CSV Import Format

For bulk student import, use CSV with the following columns:
- studentId
- name
- email
- password

Example:
```csv
studentId,name,email,password
ST001,John Doe,john@example.com,password123
ST002,Jane Smith,jane@example.com,password456
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.