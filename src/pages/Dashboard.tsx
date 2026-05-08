import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Target, Award, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, AnimatedCard, Badge } from '../components/ui';
import { useAppStore, GRADE_POINTS } from '../store/useAppStore';
import { useAuth } from '../lib/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

function getDegreeClass(fgpa: number) {
  if (fgpa >= 3.60) return { label: 'First Class', color: 'text-green-500', bg: 'bg-green-500/10' };
  if (fgpa >= 3.00) return { label: 'Second Upper', color: 'text-blue-500', bg: 'bg-blue-500/10' };
  if (fgpa >= 2.00) return { label: 'Second Lower', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
  if (fgpa >= 1.50) return { label: 'Third Class', color: 'text-orange-500', bg: 'bg-orange-500/10' };
  if (fgpa >= 1.00) return { label: 'Pass', color: 'text-red-400', bg: 'bg-red-400/10' };
  return { label: 'Fail', color: 'text-red-600', bg: 'bg-red-600/10' };
}

export default function Dashboard() {
  const { userCourses } = useAppStore();
  const { profile } = useAuth();

  const analytics = useMemo(() => {
    let totalGPT = 0;
    let totalCredits = 0;
    
    // Level specific calculations for FGPA
    const levelStats = {
      100: { gpt: 0, credits: 0, weight: 1/6 },
      200: { gpt: 0, credits: 0, weight: 1/6 },
      300: { gpt: 0, credits: 0, weight: 2/6 },
      400: { gpt: 0, credits: 0, weight: 2/6 },
    };

    const semesterData: Record<string, { gpt: number, credits: number }> = {};

    userCourses.forEach(c => {
      if (!c.grade) return;
      const pts = GRADE_POINTS[c.grade] * c.creditHours;
      
      totalGPT += pts;
      totalCredits += c.creditHours;
      
      levelStats[c.level].gpt += pts;
      levelStats[c.level].credits += c.creditHours;

      const semKey = `L${c.level} S${c.semester}`;
      if (!semesterData[semKey]) semesterData[semKey] = { gpt: 0, credits: 0 };
      semesterData[semKey].gpt += pts;
      semesterData[semKey].credits += c.creditHours;
    });

    const cgpa = totalCredits > 0 ? totalGPT / totalCredits : 0;

    let fGpaSum = 0;
    let totalWeights = 0;
    
    [100, 200, 300, 400].forEach((lvl: any) => {
      const stats = levelStats[lvl as keyof typeof levelStats];
      if (stats.credits > 0) {
        const lvlGpa = stats.gpt / stats.credits;
        fGpaSum += lvlGpa * stats.weight;
        totalWeights += stats.weight;
      }
    });

    // Normalize FGPA if not all levels are complete (e.g. they only did L100 and L200)
    const fgpa = totalWeights > 0 ? fGpaSum / totalWeights : 0;

    const chartData = Object.keys(semesterData).sort().map(key => ({
      name: key,
      GPA: Number((semesterData[key].gpt / semesterData[key].credits).toFixed(2))
    }));

    return { cgpa, fgpa, chartData, totalCredits };
  }, [userCourses]);

  const REQUIRED_DEGREE_CREDITS = 120;
  const targetGpa = profile?.gpaGoal || 3.6;
  const targetClass = profile?.targetClassification || 'First Class';

  const goalCalculation = useMemo(() => {
    if (analytics.totalCredits === 0) return null;
    const remainingCredits = REQUIRED_DEGREE_CREDITS - analytics.totalCredits;
    if (remainingCredits <= 0) return { possible: false, message: "You have completed your degree credits." };

    // Required GPA formula: (Target * Total) - (Current * Taken) / Remaining
    const targetPoints = targetGpa * REQUIRED_DEGREE_CREDITS;
    const currentPoints = analytics.cgpa * analytics.totalCredits;
    const requiredPoints = targetPoints - currentPoints;
    const requiredGpa = requiredPoints / remainingCredits;

    if (requiredGpa > 4.0) {
      return { 
        possible: false, 
        requiredGpa, 
        message: `It is mathematically impossible to reach a ${targetGpa.toFixed(2)} CGPA. You would need a ${requiredGpa.toFixed(2)} average in your remaining ${remainingCredits} credits, which is above the 4.0 maximum.` 
      };
    }

    if (requiredGpa <= 0) {
      return {
        possible: true,
        requiredGpa: 0,
        message: `Your current CGPA is high enough that you've already secured the target if you maintain a minimum passing GPA.`
      };
    }

    return {
      possible: true,
      requiredGpa,
      remainingCredits,
      message: `If your CGPA is ${analytics.cgpa.toFixed(2)}, you need an exact average GPA of ${requiredGpa.toFixed(2)} in your remaining ${remainingCredits} credits to reach a ${targetGpa.toFixed(2)}.`
    };
  }, [analytics.cgpa, analytics.totalCredits, targetGpa]);

  const degreeClass = getDegreeClass(analytics.fgpa);
  
  // Emotional companion insights
  const getInsight = () => {
    if (analytics.totalCredits === 0) return "Add some courses and grades to see your academic health.";
    if (analytics.fgpa >= targetGpa) return `Outstanding! You are cruising past your goal of ${targetGpa.toFixed(2)}. Maintain this excellence.`;
    if (analytics.fgpa >= targetGpa - 0.2) return `Great job! You are very close to your goal of ${targetGpa.toFixed(2)}. First Class is within reach!`;
    return `Keep your head up! A little more dedication will turn these grades around towards your target.`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">Performance Analytics</h1>
        <p className="text-muted-foreground">{getInsight()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <AnimatedCard className="bg-card p-5 rounded-2xl border border-border relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Cumulative GPA</p>
          <h2 className="text-4xl font-light text-foreground">{analytics.cgpa.toFixed(2)}</h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded uppercase font-bold">Overall Average</span>
            <span className="text-xs text-muted-foreground font-mono">/ 4.00</span>
          </div>
        </AnimatedCard>

        <AnimatedCard className="bg-card p-5 rounded-2xl border border-border relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Final GPA (FGPA)</p>
          <h2 className="text-4xl font-light text-foreground">{analytics.fgpa.toFixed(2)}</h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded uppercase font-bold">Weighted (1:1:2:2)</span>
          </div>
        </AnimatedCard>

        <AnimatedCard className="bg-card p-5 rounded-2xl border border-border relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Predicted Degree</p>
          <h2 className={`text-2xl mt-1 font-light tracking-tighter col-span-2 ${degreeClass.color}`}>
            {analytics.totalCredits > 0 ? degreeClass.label : 'N/A'}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground opacity-80">Based on trajectory</span>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-card p-5 rounded-2xl border border-border relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Target Match</p>
          <h2 className={`text-2xl mt-1 font-light tracking-tighter col-span-2 text-foreground`}>
            {targetClass}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground opacity-80">Goal: {targetGpa.toFixed(2)} CGPA</span>
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Academic Progress Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.chartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="currentColor" fontSize={12} tickMargin={10} axisLine={false} />
                    <YAxis domain={[0, 4]} stroke="currentColor" fontSize={12} tickMargin={10} axisLine={false} tickFormatter={(val) => val.toFixed(1)} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="GPA" 
                      stroke="var(--primary)" 
                      fillOpacity={1} 
                      fill="url(#colorGpa)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                Add courses to see your academic progress chart.
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="h-full flex flex-col relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Goal Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              {goalCalculation ? (
                <div className="space-y-6 relative z-10">
                  <div>
                    <h3 className="text-xl font-light text-foreground mb-1">Path to {targetClass}</h3>
                    <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Target: {targetGpa.toFixed(2)} CGPA</p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-xl border border-border">
                    <p className="text-sm leading-relaxed text-foreground">
                      {goalCalculation.message}
                    </p>
                  </div>
                  
                  {goalCalculation.possible && goalCalculation.requiredGpa > 0 && (
                     <div className="flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs text-muted-foreground font-medium">Required Ave. GPA</span>
                        <span className="text-2xl font-bold text-primary">{goalCalculation.requiredGpa.toFixed(2)}</span>
                     </div>
                  )}

                  {!goalCalculation.possible && goalCalculation.requiredGpa && (
                     <div className="flex items-center gap-3 border-t border-destructive/20 pt-4 text-destructive">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Mathematical Maximum Reached</span>
                     </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Add course data to track your path to {targetClass}.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
