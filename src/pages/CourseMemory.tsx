import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, BookOpen, CheckCircle2, ChevronRight, AlertCircle, Plus, Edit2 } from 'lucide-react';
import { Input, Button, Card, CardHeader, CardTitle, CardContent, Badge, AnimatedCard } from '../components/ui';
import { UGBS_COURSES, Course } from '../data/courses';
import { useAppStore } from '../store/useAppStore';

export default function CourseMemory() {
  const { userCourses, addCourse, removeCourse } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 100 | 200 | 300 | 400>('ALL');
  const [semesterFilter, setSemesterFilter] = useState<'ALL' | 1 | 2>('ALL');
  const [activeTab, setActiveTab] = useState<'all' | 'taken' | 'planning'>('all');

  const takenCourseCodes = useMemo(() => userCourses.map(c => c.courseCode), [userCourses]);

  const filteredCourses = useMemo(() => {
    return UGBS_COURSES.filter(c => {
      const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === 'ALL' || c.level === levelFilter;
      const matchesSemester = semesterFilter === 'ALL' || c.semester === semesterFilter;
      
      let matchesTab = true;
      if (activeTab === 'taken') matchesTab = takenCourseCodes.includes(c.code);
      if (activeTab === 'planning') matchesTab = !takenCourseCodes.includes(c.code);
      
      return matchesSearch && matchesLevel && matchesSemester && matchesTab;
    });
  }, [searchTerm, levelFilter, semesterFilter, activeTab, takenCourseCodes]);

  const handleToggleCourse = (course: Course) => {
    const existing = userCourses.find(c => c.courseCode === course.code);
    if (existing) {
      removeCourse(existing.id);
    } else {
      addCourse({
        id: Math.random().toString(36).substr(2, 9),
        courseCode: course.code,
        courseTitle: course.title,
        creditHours: course.creditHours,
        grade: '',
        semester: course.semester,
        level: course.level
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">Smart Course Memory</h1>
        <p className="text-muted-foreground">Persistently track your degree execution plan.</p>
      </div>

      <div className="flex border-b border-border">
        <button 
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('all')}
        >
          Knowledge Base ({UGBS_COURSES.length})
        </button>
        <button 
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'taken' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('taken')}
        >
          My Taken Courses ({userCourses.length})
        </button>
        <button 
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'planning' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('planning')}
        >
          Missing / Planning
        </button>
      </div>

      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-border bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search course code or title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2">
              {[100, 200, 300, 400].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(levelFilter === lvl as any ? 'ALL' : lvl as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    levelFilter === lvl ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Sem:</span>
            {[1, 2].map(sem => (
              <button
                key={sem}
                onClick={() => setSemesterFilter(semesterFilter === sem as any ? 'ALL' : sem as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  semesterFilter === sem ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCourses.map((course) => {
            const isTaken = takenCourseCodes.includes(course.code);
            const userCourseRecord = userCourses.find(c => c.courseCode === course.code);
            
            let prereqStatus = 'met'; // met, missing, none
            let missingPrereqs: string[] = [];
            
            if (course.prerequisites && course.prerequisites.length > 0) {
              missingPrereqs = course.prerequisites.filter(p => !takenCourseCodes.includes(p));
              if (missingPrereqs.length > 0) prereqStatus = 'missing';
            } else {
              prereqStatus = 'none';
            }

            return (
              <AnimatedCard key={course.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} layout className={`group hover:border-primary/50 overflow-hidden relative cursor-default ${isTaken ? 'border-primary/40 bg-primary/5' : ''}`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                <CardHeader className="pb-2 relative">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className={`mb-2 font-mono ${isTaken ? 'text-primary border-primary/20 bg-primary/10' : 'text-muted-foreground bg-muted/30 border-muted-foreground/20'}`}>
                      {course.code}
                    </Badge>
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{course.creditHours} Credits</span>
                  </div>
                  <CardTitle className="text-lg font-light leading-snug">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs mt-2">
                    <Badge variant="secondary" className="bg-muted text-foreground border-border font-medium">L{course.level}</Badge>
                    <Badge variant="secondary" className="bg-muted text-foreground border-border font-medium">Sem {course.semester}</Badge>
                    <Badge variant="secondary" className="bg-muted text-foreground border-border font-medium capitalize">{course.type}</Badge>
                    {course.difficulty && (
                      <Badge variant="secondary" className={`border-border font-medium ${course.difficulty === 'High' ? 'text-destructive bg-destructive/10' : course.difficulty === 'Medium' ? 'text-orange-500 bg-orange-500/10' : 'text-green-500 bg-green-500/10'}`}>
                        {course.difficulty} Difficulty
                      </Badge>
                    )}
                  </div>

                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-[10px] uppercase font-bold tracking-widest mb-1 text-muted-foreground">Prerequisites</p>
                      <div className="flex gap-1 flex-wrap">
                        {course.prerequisites.map(p => {
                          const pTaken = takenCourseCodes.includes(p);
                          return (
                            <span key={p} className={`text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${pTaken ? 'text-green-500 bg-green-500/10' : 'text-destructive bg-destructive/10'}`}>
                              {pTaken ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                              {p}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    {isTaken ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {userCourseRecord?.grade ? `Completed (Grade: ${userCourseRecord.grade})` : 'Marked as Taken'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {prereqStatus === 'missing' ? 'Locked (Prereqs missing)' : 'Available to take'}
                      </span>
                    )}

                    <Button 
                      variant={isTaken ? 'ghost' : 'outline'} 
                      size="sm" 
                      onClick={() => handleToggleCourse(course)}
                      className={isTaken ? 'text-destructive hover:bg-destructive/10 hover:text-destructive' : 'text-primary hover:bg-primary border-primary hover:text-primary-foreground'}
                      disabled={!isTaken && prereqStatus === 'missing'}
                      title={prereqStatus === 'missing' && !isTaken ? 'Cannot take until prerequisites are met' : ''}
                    >
                      {isTaken ? 'Remove' : 'Add to Memory'}
                    </Button>
                  </div>
                </CardContent>
              </AnimatedCard>
            );
          })}
          {filteredCourses.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-12 text-center text-muted-foreground">
               No courses found matching your criteria.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
