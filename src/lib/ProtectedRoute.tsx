import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { PageLoader } from '../components/ui/Skeleton';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, LogIn } from 'lucide-react';
import { Button } from '../components/ui';

export function ProtectedRoute({ children, fallback = 'redirect' }: { children: React.ReactNode, fallback?: 'redirect' | 'component' }) {
  const { user, loading, signInWithGoogle } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    if (fallback === 'component') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-light mb-3">Premium Feature Locked</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Access advanced analytics, detailed course memories, and smart academic insights by signing in.
          </p>
          <Button onClick={signInWithGoogle} className="gap-2">
            <LogIn className="w-4 h-4" />
            Sign in with Google
          </Button>
        </div>
      );
    }
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
