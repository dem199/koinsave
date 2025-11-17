
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'Koinsave - Your Digital Wallet',
  description: 'Manage your money with ease using Koinsave',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#1F2937',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}