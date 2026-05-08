import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, GraduationCap, RefreshCcw } from 'lucide-react';
import { Input, Button, Card, CardHeader, CardTitle, CardContent, Badge, AnimatedCard } from '../components/ui';
import { useAppStore, GRADE_POINTS, UserCourse } from '../store/useAppStore';
import { UGBS_COURSES } from '../data/courses';

export default function GPACalculator() {
  const { userCourses, addCourse, updateCourse, removeCourse } = useAppStore();
  
  const [level, setLevel] = useState<100 | 200 | 300 | 400>(100);
  const [semester, setSemester] = useState<1 | 2>(1);
  
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCredits, setNewCredits] = useState<number>(3);
  const [newGrade, setNewGrade] = useState<string>('');

  const currentCourses = userCourses.filter(c => c.level === level && c.semester === semester);
  
  // Calculate GPA for current view
  const totalCredits = currentCourses.reduce((sum, c) => sum + (c.grade && c.grade !== 'E' && c.grade !== 'F' ? c.creditHours : 0), 0);
  const attemptedCredits = currentCourses.reduce((sum, c) => sum + (c.grade ? c.creditHours : 0), 0);
  const totalPoints = currentCourses.reduce((sum, c) => sum + (c.grade ? c.creditHours * GRADE_POINTS[c.grade] : 0), 0);
  const gpa = attemptedCredits > 0 ? (totalPoints / attemptedCredits).toFixed(2) : '0.00';

  // Smart suggestions
  const suggestedCourses = UGBS_COURSES.filter(c => 
    c.level === level && 
    c.semester === semester &&
    !currentCourses.some(uc => uc.courseCode === c.code)
  );

  const handleAddSuggested = (course: any) => {
    addCourse({
      id: Math.random().toString(36).substring(7),
      courseCode: course.code,
      courseTitle: course.title,
      creditHours: course.creditHours,
      grade: '',
      level,
      semester,
    });
  };

  const handleAddCustom = () => {
    if (!newCode || !newTitle) return;
    addCourse({
      id: Math.random().toString(36).substring(7),
      courseCode: newCode,
      courseTitle: newTitle,
      creditHours: newCredits,
      grade: newGrade as any,
      level,
      semester,
    });
    setNewCode('');
    setNewTitle('');
    setNewGrade('');
    setNewCredits(3);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ug-navy dark:text-gray-100 flex items-center gap-3">
            <RefreshCcw className="w-8 h-8 text-primary" />
            Live GPA Engine
          </h1>
          <p className="text-muted-foreground mt-1">Instant calculations and validations.</p>
        </div>
        
        <Card className="bg-card border border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
          <CardContent className="p-4 flex items-center gap-6 relative">
            <div>
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">Semester GPA</p>
              <p className="text-4xl font-light text-foreground">{gpa}</p>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div>
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">Credits Earned</p>
              <p className="text-2xl font-light text-foreground">{totalCredits}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4 flex flex-wrap gap-4 items-center bg-muted/30">
        <span className="font-medium text-sm">Select Level:</span>
        <div className="flex gap-2">
          {[100, 200, 300, 400].map(l => (
            <Button 
              key={l} 
              variant={level === l ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setLevel(l as any)}
            >
              L{l}
            </Button>
          ))}
        </div>
        <div className="w-px h-6 bg-border mx-2"></div>
        <span className="font-medium text-sm">Select Semester:</span>
        <div className="flex gap-2">
          {[1, 2].map(s => (
            <Button 
              key={s} 
              variant={semester === s ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSemester(s as any)}
            >
              Sem {s}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
            Your Courses
            <Badge variant="secondary">{currentCourses.length}</Badge>
          </h2>
          
          <div className="space-y-3">
            <AnimatePresence>
              {currentCourses.map(course => (
                <motion.div 
                  key={course.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border shadow-sm group hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-mono text-xs text-primary mb-1">{course.courseCode}</p>
                    <p className="text-sm text-foreground truncate font-medium">{course.courseTitle}</p>
                  </div>
                  
                  <div className="w-24">
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={course.creditHours}
                      onChange={e => updateCourse(course.id, { creditHours: Number(e.target.value) })}
                    >
                      {[1,2,3,4,6].map(cr => <option key={cr} value={cr}>{cr} Credits</option>)}
                    </select>
                  </div>

                  <div className="w-20">
                    <select 
                      className={`flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-bold
                        ${course.grade ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-card'}
                      `}
                      value={course.grade}
                      onChange={e => updateCourse(course.id, { grade: e.target.value as any })}
                    >
                      <option value="">Grade</option>
                      {Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>

                  <button 
                    onClick={() => removeCourse(course.id)}
                    className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {currentCourses.length === 0 && (
              <div className="py-8 text-center border-2 border-dashed border-border rounded-xl text-muted-foreground">
                <p>No courses added for this semester yet.</p>
                <p className="text-sm mt-1">Add a custom course below or pick from suggestions.</p>
              </div>
            )}
          </div>

          <Card className="mt-8">
            <CardHeader className="pb-3 text-sm font-semibold tracking-wider uppercase text-muted-foreground">
              Add Custom Course
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center gap-3">
              <Input 
                placeholder="Code (e.g. UGRC 150)" 
                className="w-full sm:w-32" 
                value={newCode} 
                onChange={e => setNewCode(e.target.value.toUpperCase())} 
                aria-label="New Course Code"
              />
              <Input 
                placeholder="Course Title..." 
                className="w-full flex-1" 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)} 
                aria-label="New Course Title"
              />
              <Button 
                onClick={handleAddCustom} 
                disabled={!newCode || !newTitle} 
                className="w-full sm:w-auto"
                aria-label="Add new custom course"
              >
                <Plus className="w-4 h-4 mr-1" aria-hidden="true" /> Add
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-heading font-semibold">Suggested Core Courses</h2>
          <div className="space-y-3 max-h-[600px] overflow-auto pr-2 scrollbar-thin">
            <AnimatePresence>
              {suggestedCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">All core courses added!</p>
              ) : (
                suggestedCourses.map(course => (
                  <AnimatedCard key={course.id} className="p-4 cursor-pointer hover:border-primary" onClick={() => handleAddSuggested(course)}>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">{course.code}</Badge>
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium leading-tight">{course.title}</p>
                    <p className="text-xs text-muted-foreground mt-2">{course.creditHours} Credits</p>
                  </AnimatedCard>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
