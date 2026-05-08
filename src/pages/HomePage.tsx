import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Library, TrendingUp } from 'lucide-react';
import { AnimatedCard, CardContent, CardHeader, CardTitle, Button } from '../components/ui';
import { useAppStore } from '../store/useAppStore';

export default function HomePage() {
  const navigate = useNavigate();
  const { userCourses, program } = useAppStore();

  // Basic stats
  const totalCredits = userCourses.reduce((sum, c) => sum + (c.grade && c.grade !== 'E' && c.grade !== 'F' ? c.creditHours : 0), 0);
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="text-center py-12 md:py-24 space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-light tracking-tight text-foreground"
        >
          Welcome to <span className="font-bold text-primary">UGBS Academic Engine</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
        >
          Your intelligent and lively academic companion for {program}. Track your GPA, predict your degree class, and explore course histories.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <Button size="lg" onClick={() => navigate('/calculator')}>
            Calculate GPA
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/courses')}>
            Explore Courses
          </Button>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard>
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
              <Calculator className="w-6 h-6" />
            </div>
            <CardTitle>Smart GPA Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Instantly calculate your CGPA and FGPA. Our engine understands the 1:1:2:2 weighting rule for UGBS smoothly.
            </p>
            <Button variant="ghost" className="w-full justify-start text-primary" onClick={() => navigate('/calculator')}>
              Start Calculating →
            </Button>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard>
          <CardHeader>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary mb-4">
              <Library className="w-6 h-6" />
            </div>
            <CardTitle>Course Memory Engine</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Search and add from our pre-loaded database of UGBS core and elective courses. Auto-suggestions make it easy.
            </p>
            <Button variant="ghost" className="w-full justify-start text-secondary" onClick={() => navigate('/courses')}>
              View Catalog →
            </Button>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard>
          <CardHeader>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <CardTitle>Predict & Analyze</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Visualize your performance. Check if you are on track for a First Class and get motivational insights.
            </p>
            <Button variant="ghost" className="w-full justify-start text-blue-500" onClick={() => navigate('/dashboard')}>
              See Analytics →
            </Button>
          </CardContent>
        </AnimatedCard>
      </div>

      {totalCredits > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-8 text-foreground text-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <h2 className="text-2xl font-light mb-2 relative">Welcome Back!</h2>
          <p className="opacity-90 text-muted-foreground relative">
            You have recorded <span className="font-bold text-primary">{userCourses.length}</span> courses with <span className="font-bold text-primary">{totalCredits}</span> earned credits. Keep up the good work!
          </p>
          <Button variant="outline" className="mt-6 border-primary/20 hover:bg-primary/10 relative" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </motion.div>
      )}
    </div>
  );
}
