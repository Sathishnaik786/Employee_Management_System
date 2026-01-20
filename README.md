# ELMS - Enterprise Learning Hub

## Project Overview

The ELMS (Enterprise Learning Hub) is a comprehensive, role-based employee management platform designed for enterprise organizations. This modern full-stack application provides secure, scalable management of employees, departments, projects, attendance, leaves, and documents with robust role-based access control (RBAC).

### Key Features

- **Role-Based Access Control**: Four distinct roles (ADMIN, HR Manager, Manager, Employee) with granular permissions
- **Employee Management**: Complete employee lifecycle management with profiles, departments, and organizational hierarchy
- **Attendance Tracking**: Real-time attendance monitoring with check-in/check-out functionality
- **Leave Management**: Comprehensive leave request system with approval workflows
- **Document Management**: Secure document storage and access control
- **Project Management**: Project assignment and tracking capabilities
- **Analytics & Reporting**: Real-time dashboards and performance analytics
- **Security-First Architecture**: JWT authentication, Row-Level Security (RLS), and industry best practices

## High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Frontend      │    │    Backend       │    │   Database       │
│   (React/TS)    │◄──►│  (Node.js/Express) │◄──►│   (Supabase/    │
│                 │    │                  │    │   PostgreSQL)    │
└─────────────────┘    └──────────────────┘    └──────────────────┘
        │                       │                        │
        ▼                       ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Authentication  │    │ Authorization    │    │ RBAC Policies    │
│ (Supabase Auth) │    │ (JWT/Middleware) │    │ (Row-Level Sec)  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```

## Tech Stack

### Frontend
- **React** (v18+) with TypeScript
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **shadcn/ui** (UI Components)
- **React Router** (Navigation)
- **TanStack Query** (Data fetching & caching)

### Backend
- **Node.js** (Runtime environment)
- **Express.js** (Web framework)
- **Supabase** (Backend-as-a-Service, PostgreSQL)
- **JWT** (Authentication)
- **Helmet** (Security headers)
- **CORS** (Cross-origin resource sharing)

### Database & Security
- **PostgreSQL** (Relational database)
- **Row-Level Security (RLS)** (Fine-grained access control)
- **Role-Based Access Control (RBAC)** (Permission system)
- **Supabase Auth** (User authentication)

### Deployment
- **Frontend**: Netlify/Vercel/Cloudflare Pages
- **Backend**: Render/Heroku/AWS
- **Database**: Supabase (PostgreSQL)

## Folder Structure

```
├── backend/                    # Express.js backend application
│   ├── analytics/              # Analytics and reporting modules
│   ├── src/
│   │   ├── config/            # Configuration files (env, supabase)
│   │   ├── controllers/       # API controllers
│   │   ├── middlewares/       # Authentication & authorization middleware
│   │   ├── routes/            # API route definitions
│   │   ├── app.js             # Express application setup
│   │   └── server.js          # Server entry point
│   ├── schema.sql             # Database schema definition
│   ├── rbac_schema.sql        # Role-based access control schema
│   └── package.json
├── frontend/                   # React frontend application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── services/         # API service layer
│   │   ├── contexts/         # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript type definitions
│   │   └── App.tsx           # Main application component
│   └── package.json
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore configuration
├── README.md                  # Project documentation
└── package.json               # Root package file (if monorepo)
```

## Environment Variables

### Backend (.env)
```bash
# Server Configuration
PORT=3003
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure
```

### Frontend (.env)
```bash
# API Configuration
VITE_API_URL=http://localhost:3003/api
```

## Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account
- Git

### Backend Setup
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file from example
cp .env.example .env

# 4. Update .env with your Supabase credentials
# (Get credentials from your Supabase dashboard)

# 5. Start the development server
npm run dev
```

### Frontend Setup
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file from example
cp .env.example .env

# 4. Update .env with your backend API URL
# (Default: http://localhost:3003/api)

# 5. Start the development server
npm run dev
```

### Database Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy the project URL and API keys to your `.env` files
3. Execute the schema files in your Supabase SQL editor:
   - `backend/schema.sql`
   - `backend/rbac_schema.sql`
4. Set up Row-Level Security (RLS) policies as defined in the schema

## Production Deployment Flow

### GitHub → Netlify (Frontend)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist` or `build`
4. Add environment variables in Netlify dashboard

### GitHub → Render (Backend)
1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Set build command: `npm install && npm run build` (if needed)
4. Set start command: `npm start`
5. Add environment variables in Render dashboard

### Supabase Database
1. Use the same Supabase project for production
2. Set up separate database schema for production
3. Configure production RLS policies
4. Set up production-specific authentication settings

## Security Practices

### Authentication & Authorization
- **JWT-based authentication** with secure token handling
- **Role-based access control** with four distinct user roles
- **Row-Level Security (RLS)** for fine-grained data access
- **Secure password handling** via Supabase Auth
- **Session management** with proper token expiration

### Environment Security
- **Environment variables** for all sensitive data
- **No hardcoded credentials** in source code
- **Secure .gitignore** to prevent accidental commits of secrets
- **Production-specific environment configurations**

### API Security
- **Input validation** and sanitization
- **Rate limiting** to prevent abuse
- **CORS configuration** with specific allowed origins
- **Helmet middleware** for security headers
- **SQL injection prevention** via parameterized queries

### Data Protection
- **End-to-end encryption** for sensitive data
- **Secure file uploads** with type and size validation
- **Audit logging** for sensitive operations
- **Data anonymization** for reporting/analytics

## Role-Based Access Explanation

### ADMIN Role
- Full system access
- User management capabilities
- System configuration
- All data access

### HR Manager Role
- Employee data management
- Leave approval/rejection
- Attendance oversight
- Report generation

### Manager Role
- Team member management
- Leave approvals for direct reports
- Project assignment
- Team analytics

### Employee Role
- Personal profile management
- Attendance tracking
- Leave requests
- Document uploads

## API Overview

### Authentication API
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Employee API
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get specific employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Department API
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get specific department
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department

### Attendance API
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance record

### Leave API
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Submit leave request
- `PUT /api/leaves/:id` - Update leave status

### Document API
- `GET /api/documents` - Get documents
- `POST /api/documents` - Upload document
- `DELETE /api/documents/:id` - Delete document

### Project API
- `GET /api/projects` - Get projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Analytics API
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/employees` - Get employee analytics
- `GET /api/analytics/attendance` - Get attendance analytics

## Performance & Scalability Notes

### Frontend Performance
- **Code splitting** for faster initial loads
- **Lazy loading** for components
- **Image optimization** with WebP format
- **Caching strategies** with TanStack Query
- **Bundle optimization** with tree-shaking

### Backend Performance
- **Database indexing** for frequently queried fields
- **Connection pooling** for database operations
- **Caching layer** for frequently accessed data
- **Pagination** for large datasets
- **Rate limiting** to prevent abuse

### Database Scalability
- **Proper indexing** strategy for optimal query performance
- **Partitioning** for large tables (if needed)
- **Read replicas** for high-traffic scenarios
- **Connection pooling** at the application level
- **Efficient query patterns** with proper joins

## Future Improvements

### Short-term Enhancements
- **Real-time notifications** with WebSocket integration
- **Advanced reporting** with export capabilities
- **Mobile-responsive design** improvements
- **Accessibility compliance** (WCAG guidelines)
- **Performance monitoring** and analytics

### Long-term Roadmap
- **Microservices architecture** for better scalability
- **Advanced analytics** with machine learning insights
- **Integration APIs** for third-party tools
- **Advanced workflow automation**
- **Enhanced security features** (MFA, audit trails)

### Planned Features
- **Time tracking** for project billing
- **Performance reviews** and goal tracking
- **Employee engagement** surveys
- **Advanced dashboard** with customizable widgets
- **AI-powered insights** for HR analytics

## Contributing

We welcome contributions to improve the ELMS platform. Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## Security

For security concerns and vulnerability reporting, please see our [SECURITY.md](SECURITY.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support & Contact

For support, questions, or feedback, please contact the development team or create an issue in this repository.

**Enterprise Support**: Available for premium customers with dedicated SLA guarantees.

---

*This system is designed for enterprise use with security, scalability, and maintainability as primary concerns.*