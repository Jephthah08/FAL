import { UGBS_COURSES, Course } from '../data/courses';

export function getMissingCoreCourses(takenCourseCodes: string[], level: number, semester: number) {
  return UGBS_COURSES.filter(course => {
    return course.type === 'core' && course.level <= level && course.semester === semester && !takenCourseCodes.includes(course.code);
  });
}

export function recommendNextCourses(takenCourseCodes: string[], level: number, semester: number): Course[] {
  // Recommend courses that haven't been taken, are in the target level/sem, 
  // and have their prerequisites met.
  return UGBS_COURSES.filter(course => {
    if (takenCourseCodes.includes(course.code)) return false;
    if (course.level !== level || course.semester !== semester) return false;
    
    if (course.prerequisites && course.prerequisites.length > 0) {
      const missingPrereqs = course.prerequisites.filter(prereq => !takenCourseCodes.includes(prereq));
      if (missingPrereqs.length > 0) return false;
    }
    
    return true;
  });
}

export function generateInsights(takenCourses: { courseCode: string; grade: string; creditHours: number }[]) {
  let highImpact = takenCourses.filter(c => c.creditHours >= 3 && ['A', 'B+'].includes(c.grade));
  let needsImprovement = takenCourses.filter(c => ['D+', 'D', 'E', 'F'].includes(c.grade));

  const insights = [];
  
  if (highImpact.length > 2) {
    insights.push("You are performing exceptionally well in high-credit courses.");
  }
  if (needsImprovement.length > 0) {
    insights.push(`You have ${needsImprovement.length} course(s) dragging your GPA down. Consider registering for core-elective alternatives if applicable, or target high grades next semester to offset them.`);
  }

  const creditsThisSem = takenCourses.reduce((acc, c) => acc + c.creditHours, 0);
  if (creditsThisSem > 18) {
    insights.push("Warning: You have a very heavy credit load. Prioritize time management.");
  }

  return insights;
}
