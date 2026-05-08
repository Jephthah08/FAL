import React from 'react';
import { motion } from 'motion/react';
import { LogIn, GraduationCap, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent } from '../components/ui';
import { useAuth } from '../lib/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const { user, signInWithGoogle } = useAuth();
  const location = useLocation();

  if (user) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 max-w-lg mx-auto text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-gradient-to-br from-primary to-[#A16207] rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20 mb-8"
      >
        <GraduationCap className="w-12 h-12 text-primary-foreground" />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-light tracking-tight text-foreground mb-4"
      >
        Sign in to <span className="font-bold text-primary">Unlock</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground mb-10 max-w-md"
      >
        Get access to advanced analytics, personalized course memory, degree planners, and cloud backup.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full"
      >
        <Card className="w-full bg-card/50 backdrop-blur-sm border-border p-8">
          <CardContent className="p-0 flex flex-col gap-4">
            <Button 
              onClick={signInWithGoogle} 
              size="lg" 
              className="w-full gap-3 text-base h-14 bg-foreground text-background hover:bg-foreground/90"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              Continue with Google
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase text-muted-foreground tracking-widest">
                <span className="bg-card/50 px-4">Or</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-14 border-primary/20 hover:bg-primary/5 gap-2"
              onClick={() => window.history.back()}
            >
              Continue as Guest <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
