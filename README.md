<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">NestJS Content Management Backend</h1>

<p align="center">
  <strong>Production-ready RESTful API built with NestJS, TypeScript, and PostgreSQL</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v11.0.1-E0234E?style=flat&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-v5.7.3-3178C6?style=flat&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=flat&logo=jsonwebtokens" alt="JWT" />
  <img src="https://img.shields.io/badge/Cloudinary-Storage-3448C5?style=flat&logo=cloudinary" alt="Cloudinary" />
</p>

---

## 🎯 Project Overview

A **scalable, enterprise-grade Content Management API** demonstrating advanced backend development practices with modern TypeScript and Node.js technologies. This project showcases professional software engineering skills including clean architecture, security best practices, performance optimization, and comprehensive testing.

**🔗 Live Demo:** [Coming Soon]  
**📄 API Documentation:** [Swagger/Postman Collection]

---

## ✨ Key Highlights

### Architecture & Design Patterns

- **Clean Architecture** with modular, domain-driven design
- **Dependency Injection** using NestJS's powerful IoC container
- **Repository Pattern** with TypeORM for data abstraction
- **DTO Pattern** for data validation and transformation
- **Guard & Decorator Patterns** for cross-cutting concerns

### Production-Ready Features

- **🔐 Secure Authentication** - JWT-based auth with refresh tokens and role-based access control
- **⚡ High Performance** - NestJS Cache Manager with intelligent invalidation strategies
- **🛡️ Enterprise Security** - Rate limiting, input validation, SQL injection prevention, password encryption
- **📤 Cloud File Management** - Cloudinary integration for scalable file uploads
- **📊 Advanced Querying** - Pagination, filtering, and search capabilities

---

## 🚀 Technical Stack

| Category           | Technologies                       |
| ------------------ | ---------------------------------- |
| **Framework**      | NestJS 11, Node.js, TypeScript 5.7 |
| **Database**       | PostgreSQL, TypeORM 0.3            |
| **Authentication** | JWT, Passport.js, Bcrypt           |
| **Caching**        | NestJS Cache Manager 7.2           |
| **File Storage**   | Cloudinary, Multer                 |
| **Validation**     | class-validator, class-transformer |
| **Security**       | Throttler (Rate Limiting)          |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    API Gateway (NestJS)                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ Rate Limit │→ │ JWT Guard  │→ │ Role Guard │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐     ┌──────────┐    ┌─────────────┐
   │  Auth   │     │  Posts   │    │ File Upload │
   │ Module  │     │  Module  │    │   Module    │
   └────┬────┘     └────┬─────┘    └──────┬──────┘
        │               │                  │
        └───────┬───────┴──────────────────┘
                │
        ┌───────▼────────┐
        │  Cache Manager │
        └───────┬────────┘
                │
        ┌───────▼────────┐       ┌──────────────┐
        │   PostgreSQL   │       │  Cloudinary  │
        │    Database    │       │ (File Store) │
        └────────────────┘       └──────────────┘
```

---

## 📁 Project Structure

```
src/
├── auth/                      # Authentication & Authorization
│   ├── decorators/           # Custom decorators (@CurrentUser, @Roles)
│   ├── dto/                  # Login, Register DTOs
│   ├── entities/             # User entity
│   ├── guards/               # JWT, Roles, Throttle guards
│   ├── strategies/           # Passport JWT strategy
│   └── auth.service.ts       # Authentication business logic
│
├── posts/                     # Post Management Domain
│   ├── dto/                  # Create, Update, Query DTOs
│   ├── entities/             # Post entity
│   ├── interfaces/           # TypeScript interfaces
│   ├── pipes/                # Custom validation pipes
│   └── posts.service.ts      # Post business logic with caching
│
├── file-upload/              # File Upload & Cloud Storage
│   ├── cloudinary/           # Cloudinary provider & service
│   ├── dto/                  # Upload DTOs
│   ├── entities/             # File metadata entity
│   └── file-upload.service.ts
│
├── common/                    # Shared Resources
│   ├── dto/                  # Pagination, base DTOs
│   └── interfaces/           # Shared interfaces
│
├── app.module.ts             # Root application module
└── main.ts                   # Application entry point
```

---

## 💡 Core Features

### 1. Authentication & Security

```typescript
// JWT-based authentication with role-based access control
@Post('login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}

// Protected routes with custom decorators
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin/users')
async getUsers(@CurrentUser() user: User) {
  // Only admin users can access
}
```

**Security Features:**

- Bcrypt password hashing (10 salt rounds)
- JWT access & refresh tokens
- Role-based authorization (Admin/User)
- Login rate limiting (brute force protection)
- Input validation & sanitization
- SQL injection prevention

### 2. Intelligent Caching Strategy

```typescript
// NestJS Cache Manager with automatic invalidation
@UseInterceptors(CacheInterceptor)
@CacheTTL(30)
async findAll(query: FindPostsQueryDto) {
  const cacheKey = `posts_list_page${query.page}_limit${query.limit}`;
  return this.postsService.findAllWithCache(query);
}
```

**Performance Optimizations:**

- NestJS Cache Manager for in-memory caching
- Smart cache invalidation on mutations
- Configurable TTL (Time To Live)
- Cache key strategies based on query params

### 3. Advanced Post Management

```typescript
// Pagination, filtering, and search
@Get()
async findAll(
  @Query() query: FindPostsQueryDto,
  @CurrentUser() user: User
) {
  return this.postsService.findAll({
    page: query.page || 1,
    limit: query.limit || 10,
    title: query.title,
  });
}
```

**Features:**

- CRUD operations with ownership validation
- Advanced filtering and search
- Cursor-based pagination
- Soft delete support
- Audit trails (createdAt, updatedAt)

### 4. Cloud File Upload

```typescript
// Cloudinary integration for scalable file storage
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadFile(
  @UploadedFile() file: Express.Multer.File,
  @Body() uploadDto: FileUploadDto,
  @CurrentUser() user: User
) {
  return this.fileUploadService.uploadFile(file, user.id, uploadDto.description);
}
```

**Capabilities:**

- Multi-format file support
- Cloud storage via Cloudinary
- File metadata tracking
- Secure URL generation
- User file association

---

## 🔧 Quick Start

### Prerequisites

- **Node.js** 16+
- **PostgreSQL** 12+
- **Cloudinary Account**

### Installation

```bash
# Clone repository
git clone https://github.com/sabbirhosen44/NestJs-Content-Management-Backend.git
cd NestJs-Content-Management-Backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

### Environment Configuration

```env
# ===============================
# Application
# ===============================
NODE_ENV=development

# ===============================
# Database
# ===============================

DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# ===============================
# JWT Authentication
# ===============================

JWT_ACCESS_SECRET=your-access-secret
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# ===============================
# Cloudinary (File Uploads)
# ===============================

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint         | Description                  | Auth Required |
| ------ | ---------------- | ---------------------------- | ------------- |
| POST   | `/auth/register` | Create new user account      | No            |
| POST   | `/auth/login`    | Login and receive JWT tokens | No            |
| POST   | `/auth/refresh`  | Refresh access token         | Yes           |
| GET    | `/auth/profile`  | Get current user profile     | Yes           |

### Posts Endpoints

| Method | Endpoint     | Description                | Auth Required |
| ------ | ------------ | -------------------------- | ------------- |
| GET    | `/posts`     | List all posts (paginated) | Yes           |
| GET    | `/posts/:id` | Get single post by ID      | Yes           |
| POST   | `/posts`     | Create new post            | Yes           |
| PATCH  | `/posts/:id` | Update post (owner only)   | Yes           |
| DELETE | `/posts/:id` | Delete post (owner only)   | Yes           |

### File Upload Endpoints

| Method | Endpoint        | Description                  | Auth Required |
| ------ | --------------- | ---------------------------- | ------------- |
| POST   | `/files/upload` | Upload file to cloud storage | Yes           |
| GET    | `/files`        | List user's uploaded files   | Yes           |
| DELETE | `/files/:id`    | Delete uploaded file         | Yes           |

### Example Request

```bash
# Register new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@example.com",
    "password": "SecurePass123!",
    "name": "John Developer"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@example.com",
    "password": "SecurePass123!"
  }'

# Create post (authenticated)
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my post"
  }'
```

---

## 🔒 Security Best Practices

- ✅ **Password Security:** Bcrypt hashing with salt rounds
- ✅ **Token Security:** Secure JWT implementation with expiration
- ✅ **Rate Limiting:** Prevent brute force and DoS attacks
- ✅ **Input Validation:** Class-validator DTOs for all inputs
- ✅ **SQL Injection Prevention:** TypeORM parameterized queries
- ✅ **Environment Secrets:** Sensitive data in environment variables
- ✅ **Role-Based Access:** Granular permission control

---

## 🛠️ Development Workflow

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

---

## 👨‍💻 Author

**Sabbir Hosen**  
Full Stack Developer | Backend Specialist | TypeScript Enthusiast

- GitHub: [@sabbirhosen44](https://github.com/sabbirhosen44)
- LinkedIn: [linkedin.com/in/sabbirhosen44](https://www.linkedin.com/in/sabbirhosen44)
- Email: mdsabbirhosen926@gmail.com
- Portfolio: [sabbirhosen.vercel.app](https://sabbirhosen.vercel.app)

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeORM](https://typeorm.io/) - Amazing ORM for TypeScript
- [Cloudinary](https://cloudinary.com/) - Cloud media management
- [JWT.io](https://jwt.io/) - JSON Web Token resources

---

<p align="center">
  <strong>⭐ Star this repository if you find it helpful!</strong>
</p>

<p align="center">
  Built with ❤️ using NestJS, TypeScript, and PostgreSQL
</p>
