import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Grade = 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'E' | 'F' | '';

export const GRADE_POINTS: Record<string, number> = {
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D+': 1.5,
  'D': 1.0,
  'E': 0.5,
  'F': 0.0,
};

export interface UserCourse {
  id: string; // Unique ID for the student's taken course
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  grade: Grade;
  semester: 1 | 2;
  level: 100 | 200 | 300 | 400;
}

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  userCourses: UserCourse[];
  addCourse: (course: UserCourse) => void;
  updateCourse: (id: string, updates: Partial<UserCourse>) => void;
  removeCourse: (id: string) => void;
  
  clearAll: () => void;
  
  program: string;
  setProgram: (program: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      userCourses: [],
      addCourse: (course) => set((state) => ({ userCourses: [...state.userCourses, course] })),
      updateCourse: (id, updates) => set((state) => ({
        userCourses: state.userCourses.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      removeCourse: (id) => set((state) => ({
        userCourses: state.userCourses.filter(c => c.id !== id)
      })),
      
      clearAll: () => set({ userCourses: [] }),
      
      program: 'BSc Administration',
      setProgram: (program) => set({ program }),
    }),
    { name: 'ug-academic-master-storage' }
  )
);
