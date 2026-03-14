import { students as INITIAL_STUDENTS, type Branch, type LeadSource } from './mockData';

export type StudentStatus = 'Active' | 'Application In Progress' | 'Visa In Process' | 'Completed';
export type Qualification = '12th' | 'Bachelors' | 'Masters';
export type TargetLevel = 'Bachelors' | 'Masters' | 'PhD' | 'Diploma';

export interface Student {
  id: string;
  name: string;
  phone: string;
  email: string;
  highestQualification: Qualification;
  targetLevel: TargetLevel;
  country: string;
  assignedCounsellor: string;
  status: StudentStatus;
  branch: Branch;
  leadSource: LeadSource;
}

export let MOCK_STUDENTS: Student[] = INITIAL_STUDENTS as Student[];

export const updateStudentStatus = (id: string, newStatus: StudentStatus) => {
  const index = MOCK_STUDENTS.findIndex(s => s.id === id);
  if (index !== -1) {
    MOCK_STUDENTS[index] = { ...MOCK_STUDENTS[index], status: newStatus };
    const sharedIndex = INITIAL_STUDENTS.findIndex(s => s.id === id);
    if (sharedIndex !== -1) {
      INITIAL_STUDENTS[sharedIndex] = { ...INITIAL_STUDENTS[sharedIndex], status: newStatus };
    }
    return true;
  }
  return false;
};

export const updateStudentProfile = (id: string, updates: Partial<Student>) => {
  const index = MOCK_STUDENTS.findIndex(s => s.id === id);
  if (index !== -1) {
    MOCK_STUDENTS[index] = { ...MOCK_STUDENTS[index], ...updates };
  }

  const sharedIndex = INITIAL_STUDENTS.findIndex(s => s.id === id);
  if (sharedIndex !== -1) {
    INITIAL_STUDENTS[sharedIndex] = { ...INITIAL_STUDENTS[sharedIndex], ...updates };
    return true;
  }

  return index !== -1;
};

export const addStudent = (student: Student) => {
  MOCK_STUDENTS = [student, ...MOCK_STUDENTS];
};
