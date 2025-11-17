'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;