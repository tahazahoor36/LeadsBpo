# Leads BPO Backend API

A clean, secure, production-ready REST API backend for the **Leads BPO** corporate website.  
Built with **Node.js**, **Express.js**, **Supabase (PostgreSQL)**, **JWT authentication**, and **Nodemailer**.

---

## 📁 Folder Structure

```
backend/
├── server.js                  # Entry point
├── package.json
├── .env.example               # Template for environment variables
├── supabase_schema.sql        # SQL schema for Supabase
├── config/
│   └── supabase.js            # Supabase connection
│   └── email.js               # Nodemailer transporter
├── models/
│   ├── Admin.js               # Admin operations
│   ├── Lead.js                # Consultation form operations
│   └── Application.js         # Career application operations
├── routes/
│   ├── authRoutes.js          # POST /api/auth/login
│   ├── leadRoutes.js          # POST /api/leads
│   ├── applicationRoutes.js   # POST /api/applications
│   └── adminRoutes.js         # Protected admin routes
├── controllers/
│   ├── authController.js
│   ├── leadController.js
│   ├── applicationController.js
│   └── adminController.js
├── middleware/
│   ├── authMiddleware.js      # JWT verification
│   ├── errorMiddleware.js     # Central error handler
│   └── validateMiddleware.js  # express-validator helper
├── utils/
│   └── sendEmail.js           # Email notification helpers
└── scripts/
    └── seedAdmin.js           # One-time admin user seeder
```

---

## ⚙️ Setup & Installation

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Set up Supabase
1. Create a new project on [Supabase](https://supabase.com/).
2. Go to the SQL Editor in your Supabase dashboard.
3. Copy the contents of `supabase_schema.sql` and run it to create the tables.

### 3. Create your `.env` file
```bash
cp .env.example .env
```

Fill in your values in `.env`:
```
PORT=5000
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
JWT_SECRET=your_super_secret_key
ADMIN_EMAIL=admin@leadsbpo.com
ADMIN_PASSWORD=StrongPassword@123
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords. Generate one for "Mail".

### 4. Seed the admin user (run once)
```bash
npm run seed
```

This creates the first admin account using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env`.

### 5. Start the server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

---

## 🌐 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/health` | API health status |
| `POST` | `/api/auth/login` | Admin login (returns JWT) |
| `POST` | `/api/leads` | Submit consultation / contact form |
| `POST` | `/api/applications` | Submit career / job application |

### Protected Admin Endpoints (Require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/me` | Get current admin profile |
| `GET` | `/api/admin/dashboard` | Get dashboard statistics |
| `GET` | `/api/admin/leads` | List all leads (filterable, paginated) |
| `GET` | `/api/admin/leads/:id` | Get single lead |
| `PATCH` | `/api/admin/leads/:id/status` | Update lead status |
| `DELETE` | `/api/admin/leads/:id` | Delete lead |
| `GET` | `/api/admin/applications` | List all applications (filterable, paginated) |
| `GET` | `/api/admin/applications/:id` | Get single application |
| `PATCH` | `/api/admin/applications/:id/status` | Update application status |
| `DELETE` | `/api/admin/applications/:id` | Delete application |

---

## 📦 Request / Response Examples

### POST `/api/leads`
```json
// Request
{
  "fullName": "John Smith",
  "email": "john@acme.com",
  "phone": "+1-555-0100",
  "companyName": "Acme Corp",
  "serviceNeeded": "Customer Support Outsourcing",
  "message": "We need 24/7 support for 500 customers."
}

// Response 201
{
  "success": true,
  "message": "Thank you! Your consultation request has been received.",
  "data": {
    "id": "665abc...",
    "fullName": "John Smith",
    "email": "john@acme.com",
    "status": "new",
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
}
```

### POST `/api/auth/login`
```json
// Request
{
  "email": "admin@leadsbpo.com",
  "password": "StrongPassword@123"
}

// Response 200
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "665abc...",
    "name": "Super Admin",
    "email": "admin@leadsbpo.com",
    "role": "admin"
  }
}
```

### PATCH `/api/admin/leads/:id/status`
```json
// Request (Header: Authorization: Bearer <token>)
{ "status": "contacted" }

// Response 200
{
  "success": true,
  "message": "Lead status updated to \"contacted\".",
  "data": { ...updatedLead }
}
```

### GET `/api/admin/leads?status=new&page=1&limit=10`
Supports optional query params:
- `status` — filter by `new`, `contacted`, or `closed`
- `page` — page number (default: 1)
- `limit` — results per page (default: 20)

---

## 🔒 Security Features

| Feature | Details |
|---------|---------|
| **Helmet** | Sets secure HTTP headers |
| **CORS** | Restricted to `CLIENT_URL` only |
| **Rate Limiting** | General: 100/15min · Forms: 10/hour · Login: 5/15min |
| **JWT** | 7-day expiry, verified on every protected request |
| **bcrypt** | Password hashed with salt rounds = 10 |
| **express-validator** | All inputs validated and sanitized |
| **Body limit** | Request body capped at 10kb |
| **No stack traces** | Stack traces hidden in production |

---

## 🚀 Deployment on Render

1. **Create a new Web Service** on [render.com](https://render.com)
2. Connect your GitHub repository
3. Set the following in Render's **Environment** tab:
   - All variables from `.env.example` (with real values)
   - `NODE_ENV=production`
4. **Build command**: `npm install`
5. **Start command**: `npm start`
6. After first deploy, open Render's **Shell** tab and run: `npm run seed`

---

## 📧 Email Setup (Gmail)

1. Enable **2-Step Verification** on your Gmail account
2. Go to **Google Account → Security → App Passwords**
3. Generate a password for "Mail"
4. Use that 16-character password as `EMAIL_PASS` in `.env`

---

## 🛠️ Tech Stack

- **Runtime**: Node.js ≥ 18
- **Framework**: Express.js 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT + bcryptjs
- **Email**: Nodemailer (Gmail SMTP)
- **Security**: Helmet, CORS, express-rate-limit, express-validator
- **Config**: dotenv
