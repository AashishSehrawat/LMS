# 🎓 Learning Management System (LMS)

A full-stack, modern Learning Management System built with **React 19**, **TypeScript**, **Node.js**, **Express 5**, and **MongoDB**. Features AI-driven course search powered by Google Gemini, educator course management, student enrollments, video lectures, reviews, and Razorpay payment integration.

---

## 🌟 Key Features

### 👨‍🎓 For Students
- **Course Discovery & AI Search**:
  - Direct search by title, category, and keywords.
  - **AI-Powered Natural Language Search**: Understands queries like *"I want to learn web development from scratch"* or *"machine learning for beginners"* using Google Gemini AI.
  - **Voice Search**: Search courses using voice input via browser SpeechRecognition.
- **Course Exploration**: Detailed course overview, instructor profile, curriculum, preview lectures, ratings, and student reviews.
- **Secure Checkout**: Payment gateway integration using Razorpay.
- **Learning Experience**: Interactive video player for lectures, course progress tracking, and review submission.

### 👩‍🏫 For Educators
- **Course Creation & Management**: Publish courses with categories, levels (Beginner/Intermediate/Advanced), pricing, thumbnails, and descriptions.
- **Curriculum Builder**: Upload and organize video lectures and educational materials via Cloudinary.
- **Analytics Dashboard**: Real-time stats on total enrolled students, published courses, and revenue.

### 🔐 Authentication & Security
- Secure user authentication with JWT stored in HTTP-only cookies.
- Role-based authorization (`student` vs `educator`).
- OTP-based email verification via Nodemailer.
- Google OAuth 2.0 social login support.

---

## 🛠️ Technology Stack

### Frontend (`/client`)
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + `redux-persist`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) primitives
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) toast notifications
- **Forms & Validation**: React Hook Form + Zod

### Backend (`/server`)
- **Runtime & Framework**: [Node.js](https://nodejs.org/) (ES Modules) + [Express 5](https://expressjs.com/)
- **Language**: TypeScript (`tsc`)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 8](https://mongoosejs.com/)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` + `cookie-parser`
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini API)
- **Media Storage**: [Cloudinary](https://cloudinary.com/) + [Multer](https://github.com/expressjs/multer)
- **Payments**: [Razorpay](https://razorpay.com/) Node SDK
- **Mailing**: [Nodemailer](https://nodemailer.com/)

---

## 📁 Project Structure

```text
lms/
├── client/                     # Frontend Vite + React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images and design assets
│   │   ├── components/         # Reusable UI & layout components
│   │   │   ├── educator/       # Educator specific UI components
│   │   │   ├── student/        # Student specific UI components
│   │   │   └── ui/             # Radix & Tailwind design components
│   │   ├── context/            # React context providers
│   │   ├── hooks/              # Custom React hooks (courses, auth, etc.)
│   │   ├── pages/              # Route pages (Home, Courses, Dashboard, etc.)
│   │   ├── store/              # Redux slices & store configuration
│   │   ├── App.tsx             # Main routing component
│   │   └── main.tsx            # React application entry point
│   ├── .env.example            # Client environment variables template
│   └── package.json
│
├── server/                     # Backend Express + TypeScript application
│   ├── src/
│   │   ├── config/             # Third-party configurations (Cloudinary, Razorpay, etc.)
│   │   ├── controllers/        # Route controllers (auth, course, search, order, etc.)
│   │   ├── db/                 # Database connection logic
│   │   ├── middleware/         # Auth & upload middleware (JWT verification, Multer)
│   │   ├── models/             # Mongoose schemas (User, Course, Lecture, Review, Order)
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Helper utilities (Gemini AI prompt, mailer, tokens)
│   │   ├── app.ts              # Express application setup
│   │   └── index.ts            # Server entry point
│   ├── .env.example            # Server environment variables template
│   ├── nodemon.json            # Nodemon configuration (watches dist/)
│   ├── tsconfig.json           # Server TypeScript configuration
│   └── package.json
│
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+ or v20+ recommended)
- [npm](https://www.npmjs.com/) (v9+)
- A [MongoDB](https://www.mongodb.com/atlas/database) database cluster (or local MongoDB instance)
- API Keys / Accounts for:
  - [Google Gemini API Key](https://aistudio.google.com/) (for AI search)
  - [Cloudinary](https://cloudinary.com/) (for media storage)
  - [Razorpay Test Account](https://razorpay.com/) (for payment testing)

---

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd lms
```

---

### Step 2: Configure Environment Variables

#### 1. Server Configuration
Navigate to the `server/` directory and copy the template:
```bash
cd server
cp .env.example .env
```
Open `server/.env` and fill in your values:

```env
PORT=3000
NODE_ENV=development
CLIENT_URI=http://localhost:5173
SERVER_URI=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/LMS?retryWrites=true&w=majority&family=4
DB_NAME=LMS

# Security
SESSION_SECRET=your_random_session_secret
ACCESS_TOKEN_SECRET=your_jwt_access_token_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Nodemailer
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

#### 2. Client Configuration
Navigate to the `client/` directory and copy the template:
```bash
cd ../client
cp .env.example .env
```
Open `client/.env` and update the values:

```env
VITE_SERVER_URI=http://localhost:3000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

### Step 3: Install Dependencies

#### Install Server Dependencies
```bash
cd server
npm install
```

#### Install Client Dependencies
```bash
cd ../client
npm install
```

---

### Step 4: Run the Application

You need two terminal windows running simultaneously (one for backend, one for frontend).

#### Terminal 1 — Start the Backend Server:
```bash
cd server

# 1. Compile TypeScript
npm run build

# 2. Start the development server (auto-reloads on dist/ updates)
npm run dev
```
> **Tip for continuous development**: You can run `npm run watch` in another terminal to continuously compile TypeScript changes into `dist/`.

#### Terminal 2 — Start the Frontend Client:
```bash
cd client
npm run dev
```

The frontend will start at:
👉 **`http://localhost:5173`**

The backend API will run at:
👉 **`http://localhost:3000`**

---

## 📡 API Endpoints Overview

| Route Group | Endpoint | Method | Description | Auth Required |
|:---|:---|:---:|:---|:---:|
| **Auth** | `/api/auth/register` | `POST` | Register a new user | No |
| | `/api/auth/login` | `POST` | Log in and receive JWT cookie | No |
| | `/api/auth/logout` | `POST` | Clear auth cookies | Yes |
| | `/api/auth/check-auth` | `GET` | Verify current logged-in user session | Yes |
| **Courses** | `/api/course/public` | `GET` | Get all published courses | No |
| | `/api/course/search` | `POST` | Search courses (Direct + Gemini AI query) | No |
| | `/api/course/:id` | `GET` | Get detailed course information | No |
| | `/api/course/create` | `POST` | Create a new course draft | Yes (Educator) |
| | `/api/course/educator` | `GET` | Get courses created by logged-in educator | Yes (Educator) |
| | `/api/course/publish/:id` | `PATCH`| Publish or unpublish a course | Yes (Educator) |
| **Orders** | `/api/order/create` | `POST` | Initiate Razorpay checkout order | Yes |
| | `/api/order/verify` | `POST` | Verify Razorpay payment signature | Yes |
| **Reviews** | `/api/review/create` | `POST` | Post a review for an enrolled course | Yes |

---

## 🧪 NPM Scripts Reference

### Server (`/server`)
- `npm run build`: Compiles TypeScript files (`src/` → `dist/`).
- `npm run watch`: Watches for TypeScript source changes and automatically recompiles.
- `npm run dev`: Runs the server with `nodemon` watching `dist/`.
- `npm start`: Runs the production compiled file `node dist/index.js`.

### Client (`/client`)
- `npm run dev`: Launches Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Type-checks with `tsc -b` and bundles for production via Vite.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint checks across the codebase.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.
