import { students as INITIAL_STUDENTS } from './mockData';

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
}

export let MOCK_STUDENTS: Student[] = INITIAL_STUDENTS as Student[];

export const updateStudentStatus = (id: string, newStatus: StudentStatus) => {
  const index = MOCK_STUDENTS.findIndex(s => s.id === id);
  if (index !== -1) {
    MOCK_STUDENTS[index] = { ...MOCK_STUDENTS[index], status: newStatus };
    return true;
  }
  return false;
};

export const addStudent = (student: Student) => {
  MOCK_STUDENTS = [student, ...MOCK_STUDENTS];
};
