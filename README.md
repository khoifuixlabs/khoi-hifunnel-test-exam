# HiFunnel Learning Platform

A modern, full-stack learning platform built with Next.js 15, TypeScript, and Tailwind CSS. This platform enables course creators to manage educational content while providing learners with an intuitive interface to discover and enroll in courses.

## 🚀 Features

### For Learners

- **Course Discovery**: Browse and explore available courses with rich metadata
- **User Authentication**: Secure registration and login system
- **Responsive Design**: Optimized for desktop and mobile devices
- **SEO Optimized**: Server-side rendering for better search engine visibility

### For Course Creators

- **Admin Dashboard**: Comprehensive creator dashboard with analytics
- **Course Management**: Create, edit, and manage course content
- **User Analytics**: Track learner engagement and course performance
- **Role-based Access**: Secure admin panel for authorized creators only

### Technical Features

- **Modern Stack**: Built with Next.js 15, React 19, and TypeScript
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **API Routes**: RESTful API endpoints for all platform functionality
- **Form Handling**: React Hook Form with Yup validation
- **Icons**: Beautiful UI with Heroicons
- **Styling**: Tailwind CSS for modern, responsive design

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: JWT, bcryptjs
- **Forms**: React Hook Form, Yup validation
- **Icons**: Heroicons
- **Development**: ESLint, Turbopack for fast development

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/              # Admin dashboard and course management
│   ├── api/                # API routes
│   │   ├── courses/        # Course-related endpoints
│   │   ├── login/          # Authentication endpoints
│   │   ├── register/       # User registration
│   │   └── profile/        # User profile management
│   ├── courses/            # Course pages
│   │   ├── [id]/          # Individual course pages
│   │   └── page.tsx       # Course listing page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── [seller]/          # Dynamic seller pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── contexts/             # React contexts (User context)
└── utils/               # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hifunnel-khoi-testing
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add necessary environment variables:

   ```env
   NEXTAUTH_SECRET=your-secret-key
   JWT_SECRET=your-jwt-secret
   # Add other environment variables as needed
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

### For New Users

1. Visit the homepage
2. Click "Create Account" to register
3. Fill in your details and choose your role (learner/creator)
4. Log in with your credentials
5. Browse available courses or access the admin dashboard (if you're a creator)

### For Course Creators

1. Log in with creator credentials
2. Access the Admin Dashboard
3. View analytics and manage courses
4. Create new courses and track learner engagement

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🏗️ API Endpoints

The application includes several API routes:

- `/api/login` - User authentication
- `/api/register` - User registration
- `/api/courses` - Course management
- `/api/profile` - User profile management

## 🎨 Design System

The application uses a consistent design system with:

- **Color Palette**: Primary (Indigo), Success (Green), Warning (Yellow), Error (Red)
- **Typography**: Geist font family for optimal readability
- **Components**: Consistent button styles, form elements, and layout patterns
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

## 🔒 Authentication & Authorization

- JWT-based authentication system
- Role-based access control (learner, creator)
- Secure password hashing with bcrypt
- Protected routes for admin functionality

---

Built with ❤️ using Next.js and modern web technologies.
