export interface Course {
  id: string;
  code: string;
  title: string;
  creditHours: number;
  level: 100 | 200 | 300 | 400;
  semester: 1 | 2;
  school: string;
  department: string;
  type: 'core' | 'elective';
  prerequisites?: string[];
  difficulty?: 'Low' | 'Medium' | 'High';
}

export const UGBS_COURSES: Course[] = [
  // L100 Semester 1
  { id: 'ugrc110', code: 'UGRC 110', title: 'Academic Writing I', creditHours: 3, level: 100, semester: 1, school: 'University', department: 'General', type: 'core', difficulty: 'Medium' },
  { id: 'ugrc150', code: 'UGRC 150', title: 'Critical Thinking & Practical Reasoning', creditHours: 3, level: 100, semester: 1, school: 'University', department: 'General', type: 'core', difficulty: 'High' },
  { id: 'ugbs101', code: 'UGBS 101', title: 'Introduction to Business Administration', creditHours: 3, level: 100, semester: 1, school: 'UGBS', department: 'General', type: 'core', difficulty: 'Low' },
  { id: 'ugbs105', code: 'UGBS 105', title: 'Introduction to Public Administration', creditHours: 3, level: 100, semester: 1, school: 'UGBS', department: 'PAHS', type: 'core', difficulty: 'Low' },
  { id: 'math121', code: 'MATH 121', title: 'Algebra and Trigonometry', creditHours: 3, level: 100, semester: 1, school: 'Science', department: 'Math', type: 'elective', difficulty: 'High' },
  { id: 'econ101', code: 'ECON 101', title: 'Introduction to Economics I', creditHours: 3, level: 100, semester: 1, school: 'Social Science', department: 'Economics', type: 'elective', difficulty: 'Medium' },

  // L100 Semester 2
  { id: 'ugrc120', code: 'UGRC 120', title: 'Numeracy Skills', creditHours: 3, level: 100, semester: 2, school: 'University', department: 'General', type: 'core', difficulty: 'Medium' },
  { id: 'ugbs102', code: 'UGBS 102', title: 'Introduction to Computing in Business', creditHours: 3, level: 100, semester: 2, school: 'UGBS', department: 'OMIS', type: 'core', difficulty: 'Medium' },
  { id: 'ugbs104', code: 'UGBS 104', title: 'Principles of Management', creditHours: 3, level: 100, semester: 2, school: 'UGBS', department: 'OMIS', type: 'core', difficulty: 'Low' },
  { id: 'ugbs108', code: 'UGBS 108', title: 'Psychology for Everyday Living', creditHours: 3, level: 100, semester: 2, school: 'Social Science', department: 'Psychology', type: 'core', difficulty: 'Low' },
  
  // L200 Semester 1
  { id: 'ugrc210', code: 'UGRC 210', title: 'Academic Writing II', creditHours: 3, level: 200, semester: 1, school: 'University', department: 'General', type: 'core', prerequisites: ['UGRC 110'], difficulty: 'Medium' },
  { id: 'ugbs201', code: 'UGBS 201', title: 'Microeconomics and Business', creditHours: 3, level: 200, semester: 1, school: 'UGBS', department: 'General', type: 'core', prerequisites: ['ECON 101'], difficulty: 'High' },
  { id: 'ugbs203', code: 'UGBS 203', title: 'Commercial Law I', creditHours: 3, level: 200, semester: 1, school: 'UGBS', department: 'General', type: 'core', difficulty: 'Medium' },
  { id: 'ugbs205', code: 'UGBS 205', title: 'Fundamentals of Accounting Methods', creditHours: 3, level: 200, semester: 1, school: 'UGBS', department: 'Accounting', type: 'core', difficulty: 'Medium' },
  { id: 'ugbs207', code: 'UGBS 207', title: 'Social Responsibility and Ethics', creditHours: 3, level: 200, semester: 1, school: 'UGBS', department: 'General', type: 'core', difficulty: 'Low' },
  
  // L200 Semester 2
  { id: 'ugrc220', code: 'UGRC 220', title: 'Introduction to African Studies', creditHours: 3, level: 200, semester: 2, school: 'University', department: 'General', type: 'core', difficulty: 'Low' },
  { id: 'ugbs202', code: 'UGBS 202', title: 'Business Mathematics', creditHours: 3, level: 200, semester: 2, school: 'UGBS', department: 'OMIS', type: 'core', prerequisites: ['MATH 121'], difficulty: 'High' },
  { id: 'ugbs204', code: 'UGBS 204', title: 'Macroeconomics and Business', creditHours: 3, level: 200, semester: 2, school: 'UGBS', department: 'General', type: 'core', prerequisites: ['ECON 102'], difficulty: 'High' },
  { id: 'ugbs206', code: 'UGBS 206', title: 'Commercial Law II', creditHours: 3, level: 200, semester: 2, school: 'UGBS', department: 'General', type: 'core', prerequisites: ['UGBS 203'], difficulty: 'Medium' },
  { id: 'ugbs208', code: 'UGBS 208', title: 'Introduction to Financial Accounting', creditHours: 3, level: 200, semester: 2, school: 'UGBS', department: 'Accounting', type: 'core', prerequisites: ['UGBS 205'], difficulty: 'High' },

  // L300 Semester 1 (Accounting Option focus but typical UGBS)
  { id: 'ugbs301', code: 'UGBS 301', title: 'Quantitative Methods', creditHours: 3, level: 300, semester: 1, school: 'UGBS', department: 'OMIS', type: 'core', prerequisites: ['UGBS 202'], difficulty: 'High' },
  { id: 'ugbs303', code: 'UGBS 303', title: 'Computer Applications in Management', creditHours: 3, level: 300, semester: 1, school: 'UGBS', department: 'OMIS', type: 'core', prerequisites: ['UGBS 102'], difficulty: 'Medium' },
  { id: 'acct301', code: 'ACCT 301', title: 'Introduction to Financial Reporting', creditHours: 3, level: 300, semester: 1, school: 'UGBS', department: 'Accounting', type: 'core', prerequisites: ['UGBS 208'], difficulty: 'High' },
  { id: 'finc301', code: 'FINC 301', title: 'Introduction to Business Finance', creditHours: 3, level: 300, semester: 1, school: 'UGBS', department: 'Finance', type: 'core', prerequisites: ['UGBS 205'], difficulty: 'Medium' },
  { id: 'mktg301', code: 'MKTG 301', title: 'Principles of Marketing', creditHours: 3, level: 300, semester: 1, school: 'UGBS', department: 'Marketing', type: 'core', difficulty: 'Medium' },
  
  // L300 Semester 2
  { id: 'ugbs302', code: 'UGBS 302', title: 'Research Methods', creditHours: 3, level: 300, semester: 2, school: 'UGBS', department: 'OMIS', type: 'core', difficulty: 'High' },
  { id: 'acct302', code: 'ACCT 302', title: 'Financial Reporting', creditHours: 3, level: 300, semester: 2, school: 'UGBS', department: 'Accounting', type: 'core', prerequisites: ['ACCT 301'], difficulty: 'High' },
  { id: 'acct304', code: 'ACCT 304', title: 'Auditing', creditHours: 3, level: 300, semester: 2, school: 'UGBS', department: 'Accounting', type: 'core', prerequisites: ['ACCT 301'], difficulty: 'Medium' },
  { id: 'finc302', code: 'FINC 302', title: 'Business Finance', creditHours: 3, level: 300, semester: 2, school: 'UGBS', department: 'Finance', type: 'core', prerequisites: ['FINC 301'], difficulty: 'High' },
  { id: 'mktg306', code: 'MKTG 306', title: 'Fundamentals of Entrepreneurship', creditHours: 3, level: 300, semester: 2, school: 'UGBS', department: 'Marketing', type: 'core', difficulty: 'Low' },

  // L400 Semester 1
  { id: 'ugbs401', code: 'UGBS 401', title: 'Company Law', creditHours: 3, level: 400, semester: 1, school: 'UGBS', department: 'General', type: 'core', prerequisites: ['UGBS 206'], difficulty: 'Medium' },
  { id: 'acct401', code: 'ACCT 401', title: 'Corporate Reporting and Analysis', creditHours: 3, level: 400, semester: 1, school: 'UGBS', department: 'Accounting', type: 'core', prerequisites: ['ACCT 302'], difficulty: 'High' },
  { id: 'acct403', code: 'ACCT 403', title: 'Cost Accounting', creditHours: 3, level: 400, semester: 1, school: 'UGBS', department: 'Accounting', type: 'core', difficulty: 'Medium' },
  { id: 'finc401', code: 'FINC 401', title: 'Investment Fundamentals', creditHours: 3, level: 400, semester: 1, school: 'UGBS', department: 'Finance', type: 'core', prerequisites: ['FINC 302'], difficulty: 'High' },
  
  // L400 Semester 2
  { id: 'ugbs402', code: 'UGBS 402', title: 'Business Policy', creditHours: 3, level: 400, semester: 2, school: 'UGBS', department: 'General', type: 'core', prerequisites: ['ugbs104'], difficulty: 'High' },
  { id: 'acct402', code: 'ACCT 402', title: 'Public Sector Accounting', creditHours: 3, level: 400, semester: 2, school: 'UGBS', department: 'Accounting', type: 'core', difficulty: 'Medium' },
  { id: 'acct404', code: 'ACCT 404', title: 'Management Accounting', creditHours: 3, level: 400, semester: 2, school: 'UGBS', department: 'Accounting', type: 'core', prerequisites: ['ACCT 403'], difficulty: 'High' },
  { id: 'finc402', code: 'FINC 402', title: 'Monetary Theory', creditHours: 3, level: 400, semester: 2, school: 'UGBS', department: 'Finance', type: 'core', prerequisites: ['FINC 401'], difficulty: 'High' },
];
