import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, LayoutDashboard, Calculator, Library, Settings, PieChart, Menu, X, Moon, Sun, GraduationCap, LogOut, LogIn } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { PageLoader } from '../ui/Skeleton';
import { useAuth } from '../../lib/AuthContext';
import { ProtectedRoute } from '../../lib/ProtectedRoute';

// Lazy load pages for production code splitting
const HomePage = React.lazy(() => import('../../pages/HomePage'));
const SettingsPage = React.lazy(() => import('../../pages/Settings'));
const Dashboard = React.lazy(() => import('../../pages/Dashboard'));
const GPACalculator = React.lazy(() => import('../../pages/GPACalculator'));
const CourseMemory = React.lazy(() => import('../../pages/CourseMemory'));
const LoginPage = React.lazy(() => import('../../pages/LoginPage'));

const navItems = [
  { path: '/', label: 'Home', icon: Home, reqAuth: false },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, reqAuth: false },
  { path: '/calculator', label: 'GPA Calculator', icon: Calculator, reqAuth: false },
  { path: '/courses', label: 'Course Memory', icon: Library, reqAuth: true },
  { path: '/analytics', label: 'Analytics', icon: PieChart, reqAuth: true },
  { path: '/settings', label: 'Settings', icon: Settings, reqAuth: true },
];

function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const location = useLocation();
  const { user, profile, logOut } = useAuth();
  const navigate = useNavigate();

  return (
    <aside 
      className={`h-full w-64 bg-[#080808] border-r border-border flex flex-col z-40 fixed md:relative transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      aria-label="Main Navigation"
    >
      <div className="p-6 flex items-center justify-between text-foreground">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-[#A16207] text-primary-foreground p-2 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-900/20" aria-hidden="true">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg leading-tight text-primary">UG Academic</h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Master Engine</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="md:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4" aria-label="Sidebar Links">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          if (item.reqAuth && !user) {
            return (
              <Link
                key={item.path}
                to="/login"
                state={{ from: { pathname: item.path } }}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground border border-transparent opacity-70 hover:opacity-100`}
                title="Sign in required"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                <Icon className="w-4 h-4" />
                <span className="text-sm flex-1">{item.label}</span>
                <div className="w-4 h-4 rounded border border-muted-foreground/30 flex items-center justify-center">
                  <span className="text-[8px] font-bold">🔒</span>
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-card border border-border text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary' : 'bg-transparent'}`}></div>
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-border">
        {user ? (
          <div className="bg-card p-4 rounded-xl border border-border flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="User avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {profile?.fullName.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{profile?.fullName || user.email}</p>
                <p className="text-[10px] text-primary font-mono mt-0.5 truncate">{profile?.program || 'Student'}</p>
              </div>
            </div>
            <button 
              onClick={() => { logOut(); navigate('/'); }}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors w-full p-2 rounded-md hover:bg-destructive/10"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        ) : (
          <div className="bg-card p-4 rounded-xl border border-border flex justify-between items-center">
             <div>
                <p className="text-[10px] uppercase tracking-tighter text-muted-foreground mb-1">Guest Mode</p>
                <p className="text-xs font-semibold text-foreground">Not Signed In</p>
             </div>
             <Link to="/login" className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
               <LogIn className="w-4 h-4" />
             </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

function Navbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { theme, setTheme } = useAppStore();
  const { user, profile } = useAuth();
  
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 md:px-8 bg-[#080808]/50 sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground md:hidden" 
          onClick={onOpenSidebar}
          aria-label="Open Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center gap-2 text-xs font-medium" aria-label="Breadcrumb">
          <span className="text-muted-foreground uppercase tracking-widest">UGBS</span>
          <span className="text-muted-foreground/30" aria-hidden="true">/</span>
          <span className="text-muted-foreground uppercase tracking-widest">{profile?.program || 'BSc Administration'}</span>
          <span className="text-muted-foreground/30" aria-hidden="true">/</span>
          <span className="text-foreground">{user ? 'Premium' : 'Guest'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-48 md:w-64 hidden sm:block">
          <input 
            type="search" 
            placeholder="Search Course Memory..." 
            className="w-full bg-card border border-border rounded-full px-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            aria-label="Search Courses"
          />
        </div>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs font-bold bg-card hover:border-primary transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-muted-foreground" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>
    </header>
  );
}

export function AppLayout() {
  const location = useLocation();
  const { theme } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply theme to document
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-6 md:p-8" role="main" id="main-content">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full focus:outline-none"
                  tabIndex={-1}
                >
                  <Routes location={location}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/calculator" element={<GPACalculator />} />
                    <Route path="/courses" element={<ProtectedRoute fallback="component"><CourseMemory /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute fallback="component"><Dashboard /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute fallback="component"><SettingsPage /></ProtectedRoute>} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
