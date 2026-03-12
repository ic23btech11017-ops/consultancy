export type TestType = 'IELTS' | 'PTE' | 'SAT';
export type Branch = 'Hyderabad' | 'Kolkata' | 'Delhi';

// Walk-in Enquiries
export type WalkInStatus = 'New Inquiry' | 'Demo Scheduled' | 'Demo Attended' | 'Enrolled' | 'Lost';

export interface WalkInEnquiry {
  id: string;
  name: string;
  phone: string;
  branch: Branch;
  interestedTest: TestType;
  inquiryDate: string;
  assignedCounselor: string;
  followUpDate: string;
  notes: string;
  status: WalkInStatus;
}

// Test Prep Students
export type TestPrepStudentStatus = 'Active' | 'Completed' | 'Dropped';
export type FeeStatus = 'Paid' | 'Pending' | 'Partial';

export interface TestPrepStudent {
  id: string;
  studentId: string;
  studentName: string;
  testType: TestType;
  branch: Branch;
  batch: string;
  trainer: string;
  startDate: string;
  endDate: string;
  feeStatus: FeeStatus;
  currentScore: string;
  targetScore: string;
  status: TestPrepStudentStatus;
  referredToCounseling: boolean;
}

// Batches
export type BatchStatus = 'Upcoming' | 'Running' | 'Completed';

export interface Batch {
  id: string;
  batchName: string;
  testType: TestType;
  branch: Branch;
  trainer: string;
  startDate: string;
  endDate: string;
  capacity: number;
  studentsEnrolled: number;
  status: BatchStatus;
}

// --- Mock Data ---

export let walkInEnquiries: WalkInEnquiry[] = [
  {
    id: 'WI001',
    name: 'Rahul Kumar',
    phone: '+91 98765 43210',
    branch: 'Hyderabad',
    interestedTest: 'IELTS',
    inquiryDate: '2026-03-12',
    assignedCounselor: 'Ravi Mehta',
    followUpDate: '2026-03-14',
    notes: 'Interested in morning batch',
    status: 'New Inquiry',
  },
  {
    id: 'WI002',
    name: 'Priya Patel',
    phone: '+91 87654 32109',
    branch: 'Kolkata',
    interestedTest: 'IELTS',
    inquiryDate: '2026-03-12',
    assignedCounselor: 'Anjali Rao',
    followUpDate: '2026-03-15',
    notes: 'Wants weekend classes',
    status: 'Demo Scheduled',
  },
  {
    id: 'WI003',
    name: 'Vikram Singh',
    phone: '+91 76543 21098',
    branch: 'Delhi',
    interestedTest: 'SAT',
    inquiryDate: '2026-03-11',
    assignedCounselor: 'Ravi Mehta',
    followUpDate: '2026-03-13',
    notes: 'Planning to apply for Fall 2027',
    status: 'Demo Attended',
  },
  {
    id: 'WI004',
    name: 'Sneha Gupta',
    phone: '+91 65432 10987',
    branch: 'Hyderabad',
    interestedTest: 'IELTS',
    inquiryDate: '2026-03-10',
    assignedCounselor: 'Anjali Rao',
    followUpDate: '2026-03-12',
    notes: 'Converted to student',
    status: 'Enrolled',
  },
  {
    id: 'WI005',
    name: 'Aditya Rao',
    phone: '+91 77654 32100',
    branch: 'Kolkata',
    interestedTest: 'SAT',
    inquiryDate: '2026-03-09',
    assignedCounselor: 'Ravi Mehta',
    followUpDate: '2026-03-11',
    notes: 'Did not respond after demo',
    status: 'Lost',
  },
  {
    id: 'WI006',
    name: 'Meera Joshi',
    phone: '+91 91234 56700',
    branch: 'Delhi',
    interestedTest: 'IELTS',
    inquiryDate: '2026-03-12',
    assignedCounselor: 'Ravi Mehta',
    followUpDate: '2026-03-14',
    notes: 'Walk-in today, very interested',
    status: 'New Inquiry',
  },
];

export let testPrepStudents: TestPrepStudent[] = [
  {
    id: 'TPS001',
    studentId: 'ST001',
    studentName: 'Rahul Kumar',
    testType: 'IELTS',
    branch: 'Hyderabad',
    batch: 'IELTS Morning Batch - Mar',
    trainer: 'Sarah',
    startDate: '2026-02-01',
    endDate: '2026-04-01',
    feeStatus: 'Paid',
    currentScore: '7.0',
    targetScore: '7.5',
    status: 'Active',
    referredToCounseling: true,
  },
  {
    id: 'TPS002',
    studentId: 'ST002',
    studentName: 'Ananya Sharma',
    testType: 'PTE',
    branch: 'Kolkata',
    batch: 'PTE Evening Batch - Mar',
    trainer: 'David',
    startDate: '2026-02-15',
    endDate: '2026-04-15',
    feeStatus: 'Partial',
    currentScore: '62',
    targetScore: '79',
    status: 'Active',
    referredToCounseling: false,
  },
  {
    id: 'TPS003',
    studentId: 'ST006',
    studentName: 'Sneha Gupta',
    testType: 'IELTS',
    branch: 'Hyderabad',
    batch: 'IELTS Morning Batch - Mar',
    trainer: 'Sarah',
    startDate: '2026-02-01',
    endDate: '2026-04-01',
    feeStatus: 'Paid',
    currentScore: '7.5',
    targetScore: '7.0',
    status: 'Completed',
    referredToCounseling: true,
  },
  {
    id: 'TPS004',
    studentId: 'ST007',
    studentName: 'Arun Menon',
    testType: 'SAT',
    branch: 'Delhi',
    batch: 'SAT Weekend Batch - Feb',
    trainer: 'Emily',
    startDate: '2026-01-15',
    endDate: '2026-03-15',
    feeStatus: 'Pending',
    currentScore: '1350',
    targetScore: '1500',
    status: 'Active',
    referredToCounseling: false,
  },
  {
    id: 'TPS005',
    studentId: 'ST008',
    studentName: 'Kavya Nair',
    testType: 'PTE',
    branch: 'Delhi',
    batch: 'PTE Morning Batch - Feb',
    trainer: 'David',
    startDate: '2026-01-10',
    endDate: '2026-03-10',
    feeStatus: 'Paid',
    currentScore: '',
    targetScore: '65',
    status: 'Dropped',
    referredToCounseling: false,
  },
  {
    id: 'TPS006',
    studentId: 'ST009',
    studentName: 'Rohan Das',
    testType: 'IELTS',
    branch: 'Kolkata',
    batch: 'IELTS Evening Batch - Mar',
    trainer: 'Sarah',
    startDate: '2026-03-01',
    endDate: '2026-05-01',
    feeStatus: 'Paid',
    currentScore: '6.0',
    targetScore: '7.0',
    status: 'Active',
    referredToCounseling: false,
  },
];

export const batches: Batch[] = [
  {
    id: 'B001',
    batchName: 'IELTS Morning Batch - Mar',
    testType: 'IELTS',
    branch: 'Hyderabad',
    trainer: 'Sarah',
    startDate: '2026-02-01',
    endDate: '2026-04-01',
    capacity: 20,
    studentsEnrolled: 14,
    status: 'Running',
  },
  {
    id: 'B002',
    batchName: 'PTE Evening Batch - Mar',
    testType: 'PTE',
    branch: 'Kolkata',
    trainer: 'David',
    startDate: '2026-02-15',
    endDate: '2026-04-15',
    capacity: 15,
    studentsEnrolled: 10,
    status: 'Running',
  },
  {
    id: 'B003',
    batchName: 'SAT Weekend Batch - Feb',
    testType: 'SAT',
    branch: 'Delhi',
    trainer: 'Emily',
    startDate: '2026-01-15',
    endDate: '2026-03-15',
    capacity: 12,
    studentsEnrolled: 8,
    status: 'Running',
  },
  {
    id: 'B004',
    batchName: 'IELTS Evening Batch - Mar',
    testType: 'IELTS',
    branch: 'Kolkata',
    trainer: 'Sarah',
    startDate: '2026-03-01',
    endDate: '2026-05-01',
    capacity: 20,
    studentsEnrolled: 6,
    status: 'Running',
  },
  {
    id: 'B005',
    batchName: 'PTE Morning Batch - Apr',
    testType: 'PTE',
    branch: 'Hyderabad',
    trainer: 'David',
    startDate: '2026-04-01',
    endDate: '2026-06-01',
    capacity: 15,
    studentsEnrolled: 0,
    status: 'Upcoming',
  },
  {
    id: 'B006',
    batchName: 'IELTS Jan Batch',
    testType: 'IELTS',
    branch: 'Delhi',
    trainer: 'Sarah',
    startDate: '2026-01-05',
    endDate: '2026-02-28',
    capacity: 18,
    studentsEnrolled: 18,
    status: 'Completed',
  },
];
