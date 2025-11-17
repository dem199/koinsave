# Koinsave Dashboard

A modern fintech dashboard built with Next.js 14, featuring authentication, transaction management, and a clean, responsive UI with dark mode support.

##  Features

-  **Authentication System**
  - Login & Signup with form validation
  - JWT token-based authentication
  - Protected routes
  - Persistent sessions

-  **Dashboard**
  - Real-time balance display with toggle visibility
  - Transaction history with filtering (All, Sent, Received, Bills, Savings)
  - Send money functionality with validation
  - Quick action buttons

-  **User Experience**
  - Fully responsive design (mobile, tablet, desktop)
  - Dark mode with persistent preference in progress
  - Toast notifications for user feedback
  - Loading states and error handling
  - Smooth animations and transitions

-  **Design System**
  - Koinsave brand colors (Green, White, Dark Gray)
  - Consistent component library
  - Tailwind CSS for styling
  - Clean, minimalist fintech aesthetic

##  Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Mock API:** JSON Server

##  Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd koinsave-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_APP_NAME=Koinsave
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Next.js dev server at `http://localhost:3000`
   - JSON Server (mock API) at `http://localhost:5000`

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

##  Demo Credentials

Use these credentials to test the application:

- **Email:** demo@koinsave.com
- **Password:** Demo123!

##  Project Structure

```
koinsave-dashboard/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.js            # Root layout with providers
│   │   ├── page.js              # Home page (redirects)
│   │   ├── login/               # Login page
│   │   ├── signup/              # Signup page
│   │   └── dashboard/           # Dashboard page
│   ├── components/
│   │   ├── auth/                # Authentication components
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx
│   │   ├── dashboard/           # Dashboard components
│   │   │   ├── BalanceCard.jsx
│   │   │   ├── DashboardHeader.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   ├── SendMoneyModal.jsx
│   │   │   ├── TransactionItem.jsx
│   │   │   └── TransactionsList.jsx
│   │   └── shared/              # Reusable components
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── LoadingSpinner.jsx
│   │       ├── ProtectedRoute.jsx
│   │       └── ThemeToggle.jsx
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication state management
│   ├── lib/
│   │   ├── api.js               # API utility functions
│   │   └── validations.js       # Zod validation schemas
│   └── app/globals.css          # Global styles
├── mockData/
│   └── db.json                  # Mock database for JSON Server
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind configuration
└── README.md                    # This file
```

##  Key Features Explained

### Authentication Flow
1. User enters credentials on login/signup page
2. Form validation using Zod schemas
3. API call to mock backend (JSON Server)
4. JWT token stored in localStorage
5. User redirected to dashboard
6. Protected routes check authentication status

### Transaction Management
1. Fetch user transactions from API
2. Display in filterable list
3. Send money through modal with validation
4. Real-time balance updates
5. New transaction added to list

### Dark Mode
1. Theme preference stored in localStorage
2. System preference detected on first visit
3. Toggle between light/dark themes
4. Persists across sessions

## Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Note for Production:**
   - Replace JSON Server with a real backend API
   - Update `NEXT_PUBLIC_API_URL` in environment variables
   - Implement proper authentication with secure tokens

### Alternative: Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder
   - Configure environment variables
   - Deploy!

##  Available Scripts

- `npm run dev` - Start development server with JSON Server
- `npm run dev:next` - Start only Next.js dev server
- `npm run dev:api` - Start only JSON Server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

##  Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Mock API URL | `http://localhost:5000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Koinsave` |
| `NEXT_PUBLIC_APP_VERSION` | App version | `1.0.0` |

##  Known Limitations

- Mock API (JSON Server) - Replace with real backend for production
- No email verification
- No password reset functionality
- No two-factor authentication
- Limited transaction history (mock data)

##  Future Enhancements

- [ ] Real backend API integration
- [ ] Email verification
- [ ] Password reset flow
- [ ] Two-factor authentication
- [ ] Transaction export (CSV/PDF)
- [ ] Savings goals tracking
- [ ] Bill payment reminders
- [ ] Multi-currency support
- [ ] Transaction search
- [ ] Receipt generation

## License

This project is created for demonstration purposes as part of a pre-interview task.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

##  Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide React for beautiful icons
- JSON Server for quick mock API setup

---

**Built with love for Koinsave**