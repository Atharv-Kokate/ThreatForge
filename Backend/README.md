# OWASP Risk Platform - Backend

A comprehensive Node.js backend for an intelligent risk prediction platform that uses LLM-based analysis to assess security risks in applications and products.

## 🚀 Features

- **User Management**: Individual users and organization-based access
- **Product Management**: CRUD operations for applications/products
- **Risk Analysis**: LLM-powered security risk assessment
- **Organization Management**: Multi-user organization support
- **Authentication**: JWT-based authentication with role-based access control
- **LLM Integration**: FastAPI service integration for risk analysis
- **Memory System**: Vector-based learning and context awareness
- **Comprehensive API**: RESTful endpoints with validation and error handling

## 🏗️ Architecture

```
Node_Backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── user.model.js         # User schema
│   │   ├── organization.model.js # Organization schema
│   │   ├── product.model.js      # Product schema
│   │   ├── riskAssessment.model.js # Risk assessment schema
│   │   └── productMemory.model.js # Memory/context schema
│   ├── controllers/
│   │   ├── auth.controller.js     # Authentication logic
│   │   ├── product.controller.js # Product management
│   │   ├── risk.controller.js    # Risk analysis
│   │   └── organization.controller.js # Organization management
│   ├── routes/
│   │   ├── auth.routes.js        # Auth endpoints
│   │   ├── product.routes.js     # Product endpoints
│   │   ├── risk.routes.js        # Risk analysis endpoints
│   │   └── organization.routes.js # Organization endpoints
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT authentication
│   │   └── error.middleware.js   # Error handling
│   ├── utils/
│   │   └── llmService.js         # FastAPI LLM integration
│   └── app.js                    # Express app configuration
├── package.json
├── server.js                     # Server entry point
└── env.example                   # Environment variables template
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- FastAPI LLM Service (running on port 8000)

### Installation

1. **Clone and navigate to the backend directory:**
   ```bash
   cd Node_Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/owasp-risk-platform
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3000
   LLM_SERVICE_URL=http://localhost:8000
   ```

4. **Start MongoDB:**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user/organization |
| POST | `/auth/login` | User login |
| GET | `/auth/profile` | Get user profile |
| PUT | `/auth/profile` | Update user profile |
| PUT | `/auth/change-password` | Change password |
| POST | `/auth/logout` | Logout user |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create new product |
| GET | `/products` | Get user's products |
| GET | `/products/:id` | Get specific product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| GET | `/products/stats` | Get product statistics |

### Risk Analysis Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/risk/analyze/:productId` | Analyze product for risks |
| GET | `/risk/history/:productId` | Get risk history |
| GET | `/risk/statistics/:productId` | Get risk statistics |
| POST | `/risk/batch-analyze` | Batch analyze products |
| GET | `/risk/service/health` | Check LLM service health |

### Organization Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/organizations` | Create organization |
| GET | `/organizations/:id` | Get organization details |
| PUT | `/organizations/:id` | Update organization |
| POST | `/organizations/:id/users` | Add user to organization |
| DELETE | `/organizations/:id/users/:userId` | Remove user from organization |

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/owasp-risk-platform` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `LLM_SERVICE_URL` | FastAPI LLM service URL | `http://localhost:8000` |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:3000` |

### Database Models

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['individual', 'organizationAdmin'],
  organizationId: ObjectId,
  isActive: Boolean,
  lastLogin: Date
}
```

#### Product Model
```javascript
{
  name: String,
  description: String,
  category: ['web-application', 'mobile-app', 'api', 'desktop-app', 'iot-device', 'other'],
  ownerType: ['user', 'organization'],
  ownerId: ObjectId,
  riskAssessments: [ObjectId],
  metadata: Object
}
```

#### Risk Assessment Model
```javascript
{
  productId: ObjectId,
  userId: ObjectId,
  inputData: Object,
  resultSummary: String,
  vulnerabilities: [String],
  riskScore: Number,
  riskLevel: ['low', 'medium', 'high', 'critical'],
  recommendations: [String],
  status: ['pending', 'processing', 'completed', 'failed']
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents abuse and DoS attacks
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers and protection
- **Input Validation**: Comprehensive request validation
- **Role-based Access**: Granular permission system

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### API Status
```bash
curl http://localhost:3000/api
```

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**: Set all required environment variables
2. **Database**: Ensure MongoDB is properly configured and secured
3. **Security**: Use strong JWT secrets and enable HTTPS
4. **Monitoring**: Set up logging and monitoring
5. **LLM Service**: Ensure FastAPI LLM service is running and accessible

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs for debugging

---

**Built with ❤️ for the OWASP community**
