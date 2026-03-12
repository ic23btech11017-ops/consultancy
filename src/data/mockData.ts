// ── Shared Types ──
export type PipelineStage = 'New Inquiry' | 'Initial Counseling' | 'Destination Selection' | 'Course Shortlisting' | 'University Selection' | 'Application Preparation' | 'Application Started' | 'Converted' | 'Lost';
export type TestStatus = 'Not Taken' | 'Enrolled' | 'Score Available';
export type LeadSource = 'Walk-in' | 'Marketing Lead' | 'Test Prep Referral' | 'Facebook Ads' | 'Google Search' | 'Instagram' | 'Referral' | 'Direct Walk-in';
export type Branch = 'Hyderabad' | 'Kolkata' | 'Delhi';
export type TestType = 'IELTS' | 'PTE' | 'SAT';
export type WalkInStatus = 'New Inquiry' | 'Demo Scheduled' | 'Demo Attended' | 'Enrolled' | 'Lost';
export type TestPrepStudentStatus = 'Active' | 'Completed' | 'Dropped';
export type FeeStatus = 'Paid' | 'Pending' | 'Partial';
export type BatchStatus = 'Upcoming' | 'Running' | 'Completed';
export type CommissionStatus = 'Pending' | 'Requested' | 'Received';
export type PaymentFeeStatus = 'Paid' | 'Partial' | 'Unpaid' | 'Refunded';
export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Online Gateway';

// ── Interfaces ──
export interface PipelineLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  interestedCountry: string;
  targetLevel: string;
  assignedCounsellor: string;
  status: PipelineStage;
  studentId?: string;
  testStatus: TestStatus;
  testScore?: string;
  testType?: string;
  preferredCourses?: string[];
  budgetRange?: string;
  intakeTarget?: string;
  counselorNotes?: string[];
  academicGoals?: string;
}

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

export interface Commission {
  id: string;
  studentId: string;
  studentName: string;
  university: string;
  partnerId: string;
  commissionRate: number;
  expectedAmount: number;
  status: CommissionStatus;
}

export interface TestPrepFee {
  id: string;
  studentId: string;
  studentName: string;
  testType: TestType;
  branch: Branch;
  courseFee: number;
  amountPaid: number;
  pendingAmount: number;
  paymentStatus: PaymentFeeStatus;
  enrollmentDate: string;
}

export interface ServiceFee {
  id: string;
  studentId: string;
  studentName: string;
  branch: Branch;
  serviceFee: number;
  amountPaid: number;
  pendingAmount: number;
  paymentStatus: PaymentFeeStatus;
  createdDate: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  amount: number;
  paymentMode: PaymentMode;
  referenceNumber: string;
  feeType: 'Test Prep' | 'Service Fee';
  notes?: string;
}

export interface Campaign {
  id: string;
  name: string;
  source: LeadSource;
  startDate: string;
  endDate: string;
  budget: number;
  leadsGenerated: number;
  conversions: number;
}

export const leads: PipelineLead[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    phone: '+91 91122 33445',
    email: 'arjun.s@example.com',
    source: 'Facebook Ads',
    interestedCountry: '',
    targetLevel: 'Masters',
    assignedCounsellor: 'Ravi Mehta',
    status: 'New Inquiry',
    testStatus: 'Not Taken',
    budgetRange: '₹15-20 Lakhs',
    intakeTarget: 'Fall 2026',
    academicGoals: 'Wants to pursue a career in data science',
  },
  {
    id: '2',
    name: 'Priya Patel',
    phone: '+91 87654 32109',
    email: 'priya.p@example.com',
    source: 'Google Search',
    interestedCountry: '',
    targetLevel: 'Bachelors',
    assignedCounsellor: 'Anjali Rao',
    status: 'Initial Counseling',
    testStatus: 'Enrolled',
    testType: 'IELTS',
    budgetRange: '₹10-15 Lakhs',
    intakeTarget: 'Fall 2026',
    counselorNotes: ['Very interested, parents supportive', 'Needs help with SOP'],
    academicGoals: 'Business management career',
  },
  {
    id: '3',
    name: 'Rahul Verma',
    phone: '+91 70012 34567',
    email: 'rahul.v@example.com',
    source: 'Referral',
    interestedCountry: 'USA',
    targetLevel: 'Masters',
    assignedCounsellor: 'Ravi Mehta',
    status: 'Destination Selection',
    testStatus: 'Score Available',
    testScore: '7.5',
    testType: 'IELTS',
    preferredCourses: ['MS Computer Science', 'MS AI'],
    budgetRange: '₹25-35 Lakhs',
    intakeTarget: 'Fall 2026',
    counselorNotes: ['Strong academic profile', 'Comparing USA vs Canada'],
    academicGoals: 'Top 50 university in CS or AI',
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    phone: '+91 65432 10987',
    email: 'sneha.g@example.com',
    source: 'Instagram',
    interestedCountry: 'Australia',
    targetLevel: 'Diploma',
    assignedCounsellor: 'Anjali Rao',
    status: 'Converted',
    studentId: 'ST006',
    testStatus: 'Score Available',
    testScore: '7.5',
    testType: 'IELTS',
    preferredCourses: ['Diploma in IT'],
    budgetRange: '₹8-12 Lakhs',
    intakeTarget: 'Spring 2026',
    counselorNotes: ['Converted successfully', 'Application submitted to Monash'],
    academicGoals: 'Fast-track IT career in Australia',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    phone: '+91 55443 21890',
    email: 'vikram.s@example.com',
    source: 'Direct Walk-in',
    interestedCountry: 'Germany',
    targetLevel: 'PhD',
    assignedCounsellor: 'Ravi Mehta',
    status: 'Lost',
    testStatus: 'Not Taken',
    preferredCourses: ['PhD Physics'],
    budgetRange: '₹5-10 Lakhs',
    intakeTarget: 'Fall 2027',
    counselorNotes: ['Did not respond after initial counseling', 'Might be exploring other consultancies'],
  },
  {
    id: '6',
    name: 'Meera Joshi',
    phone: '+91 91234 56700',
    email: 'meera.j@example.com',
    source: 'Walk-in',
    interestedCountry: 'UK',
    targetLevel: 'Masters',
    assignedCounsellor: 'Ravi Mehta',
    status: 'University Selection',
    testStatus: 'Score Available',
    testScore: '7.0',
    testType: 'IELTS',
    preferredCourses: ['MSc Marketing', 'MBA'],
    budgetRange: '₹18-25 Lakhs',
    intakeTarget: 'Fall 2026',
    counselorNotes: ['Shortlisted 5 universities', 'Narrowing down to top 3'],
    academicGoals: 'Career in digital marketing strategy',
  },
  {
    id: '7',
    name: 'Karthik Nair',
    phone: '+91 88234 56789',
    email: 'karthik.n@example.com',
    source: 'Marketing Lead',
    interestedCountry: 'Canada',
    targetLevel: 'Masters',
    assignedCounsellor: 'Anjali Rao',
    status: 'Application Started',
    studentId: 'ST010',
    testStatus: 'Score Available',
    testScore: '315',
    testType: 'GRE',
    preferredCourses: ['MS Data Science'],
    budgetRange: '₹20-30 Lakhs',
    intakeTarget: 'Fall 2026',
    counselorNotes: ['Application to UBC submitted', 'Awaiting University of Toronto decision'],
    academicGoals: 'Become a data scientist at a top Canadian firm',
  },
  {
    id: '8',
    name: 'Aditya Rao',
    phone: '+91 77654 32100',
    email: 'aditya.r@example.com',
    source: 'Test Prep Referral',
    interestedCountry: 'USA',
    targetLevel: 'Bachelors',
    assignedCounsellor: 'Ravi Mehta',
    status: 'Course Shortlisting',
    testStatus: 'Score Available',
    testScore: '1400',
    testType: 'SAT',
    preferredCourses: ['BS Computer Science', 'BS Engineering'],
    budgetRange: '₹30-50 Lakhs',
    intakeTarget: 'Fall 2026',
    counselorNotes: ['Referred from test prep after SAT score', 'Parents want Ivy League or top 30'],
    academicGoals: 'Computer Science at a top US university',
  },
  {
    id: '9',
    name: 'Divya Menon',
    phone: '+91 99876 11223',
    email: 'divya.m@example.com',
    source: 'Walk-in',
    interestedCountry: '',
    targetLevel: 'Masters',
    assignedCounsellor: 'Anjali Rao',
    status: 'New Inquiry',
    testStatus: 'Not Taken',
    preferredCourses: ['MSc Nursing'],
    budgetRange: '₹12-18 Lakhs',
    intakeTarget: 'Spring 2027',
    academicGoals: 'Registered nurse career abroad',
  },
  {
    id: '10',
    name: 'Rishi Kapoor',
    phone: '+91 88765 44321',
    email: 'rishi.k@example.com',
    source: 'Referral',
    interestedCountry: 'Canada',
    targetLevel: 'Masters',
    assignedCounsellor: 'Ravi Mehta',
    status: 'Application Preparation',
    testStatus: 'Score Available',
    testScore: '72',
    testType: 'PTE',
    preferredCourses: ['MBA', 'MS Finance'],
    budgetRange: '₹20-28 Lakhs',
    intakeTarget: 'Fall 2026',
    counselorNotes: ['PTE score received', 'Gathering transcripts and SOP', 'Financial documents in progress'],
    academicGoals: 'Finance leadership role after MBA',
  },
  {
    id: '11',
    name: 'Pooja Iyer',
    phone: '+91 88776 55443',
    email: 'pooja.i@example.com',
    source: 'Walk-in',
    interestedCountry: 'New Zealand',
    targetLevel: 'Bachelors',
    assignedCounsellor: 'Anjali Rao',
    status: 'Destination Selection',
    testStatus: 'Not Taken',
    budgetRange: '₹8-12 Lakhs',
    intakeTarget: 'Fall 2026',
    counselorNotes: ['Considering New Zealand vs Australia', 'Budget is a key factor'],
    academicGoals: 'Hospitality management career',
  },
  {
    id: '12',
    name: 'Nikhil Bhatt',
    phone: '+91 99123 44567',
    email: 'nikhil.b@example.com',
    source: 'Marketing Lead',
    interestedCountry: 'UK',
    targetLevel: 'Masters',
    assignedCounsellor: 'Ravi Mehta',
    status: 'Application Preparation',
    testStatus: 'Score Available',
    testScore: '7.5',
    testType: 'IELTS',
    preferredCourses: ['MSc Data Analytics', 'MSc Business Analytics'],
    budgetRange: '₹18-25 Lakhs',
    intakeTarget: 'Fall 2026',
    counselorNotes: ['University of Leeds and Manchester selected', 'SOP draft under review', 'Transcripts verified'],
    academicGoals: 'Analytics professional in UK tech sector',
  },
];

export const students = [
  {
    id: "ST001",
    name: "Rahul Kumar",
    phone: "+91 98765 43210",
    email: "rahul@example.com",
    country: "India",
    highestQualification: "Bachelors",
    targetLevel: "Masters",
    assignedCounsellor: "Ravi Mehta",
    status: "Visa In Process",
    branch: "Hyderabad" as Branch,
    leadSource: "Walk-in" as LeadSource,
  },
  {
    id: "ST002",
    name: "Ananya Sharma",
    phone: "+91 99876 54321",
    email: "ananya@example.com",
    country: "India",
    highestQualification: "12th",
    targetLevel: "Bachelors",
    assignedCounsellor: "John Doe",
    status: "Visa In Process",
    branch: "Kolkata" as Branch,
    leadSource: "Google Search" as LeadSource,
  },
  {
    id: "ST003",
    name: "Vikram Singh",
    phone: "+91 91234 56789",
    email: "vikram@example.com",
    country: "India",
    highestQualification: "Bachelors",
    targetLevel: "Masters",
    assignedCounsellor: "Ravi Mehta",
    status: "Visa In Process",
    branch: "Delhi" as Branch,
    leadSource: "Referral" as LeadSource,
  },
  {
    id: "ST004",
    name: "Priya Patel",
    phone: "+91 92345 67890",
    email: "priya@example.com",
    country: "India",
    highestQualification: "Masters",
    targetLevel: "PhD",
    assignedCounsellor: "Jane Smith",
    status: "Visa Approved",
    branch: "Hyderabad" as Branch,
    leadSource: "Facebook Ads" as LeadSource,
  },
  {
    id: "ST005",
    name: "Arjun Reddy",
    phone: "+91 93456 78901",
    email: "arjun@example.com",
    country: "India",
    highestQualification: "Bachelors",
    targetLevel: "Masters",
    assignedCounsellor: "Ravi Mehta",
    status: "Documents Pending",
    branch: "Hyderabad" as Branch,
    leadSource: "Direct Walk-in" as LeadSource,
  },
  {
    id: "ST006",
    name: "Sneha Gupta",
    phone: "+91 65432 10987",
    email: "sneha@example.com",
    country: "India",
    highestQualification: "12th",
    targetLevel: "Diploma",
    assignedCounsellor: "Anjali Rao",
    status: "Active",
    branch: "Hyderabad" as Branch,
    leadSource: "Instagram" as LeadSource,
  },
  {
    id: "ST007",
    name: "Arun Menon",
    phone: "+91 95678 90123",
    email: "arun.menon@example.com",
    country: "India",
    highestQualification: "12th",
    targetLevel: "Bachelors",
    assignedCounsellor: "Ravi Mehta",
    status: "Active",
    branch: "Delhi" as Branch,
    leadSource: "Walk-in" as LeadSource,
  },
  {
    id: "ST008",
    name: "Kavya Nair",
    phone: "+91 96789 01234",
    email: "kavya.nair@example.com",
    country: "India",
    highestQualification: "Bachelors",
    targetLevel: "Masters",
    assignedCounsellor: "Anjali Rao",
    status: "Active",
    branch: "Delhi" as Branch,
    leadSource: "Marketing Lead" as LeadSource,
  },
  {
    id: "ST009",
    name: "Rohan Das",
    phone: "+91 97890 12345",
    email: "rohan.das@example.com",
    country: "India",
    highestQualification: "12th",
    targetLevel: "Bachelors",
    assignedCounsellor: "John Doe",
    status: "Active",
    branch: "Kolkata" as Branch,
    leadSource: "Referral" as LeadSource,
  },
  {
    id: "ST010",
    name: "Karthik Nair",
    phone: "+91 88234 56789",
    email: "karthik.n@example.com",
    country: "India",
    highestQualification: "Bachelors",
    targetLevel: "Masters",
    assignedCounsellor: "Anjali Rao",
    status: "Application In Progress",
    branch: "Kolkata" as Branch,
    leadSource: "Marketing Lead" as LeadSource,
  }
];

export const applications = [
  {
    id: "APP001",
    studentId: "ST001",
    university: "University of Toronto",
    course: "MSc Computer Science",
    country: "Canada",
    intake: "Fall 2026",
    year: 2026,
    status: "Submitted",
    partnerId: "PRT002",
  },
  {
    id: "APP002",
    studentId: "ST002",
    university: "University of Melbourne",
    course: "BBA",
    country: "Australia",
    intake: "Fall 2026",
    year: 2026,
    status: "Draft",
    partnerId: "PRT003",
  },
  {
    id: "APP003",
    studentId: "ST003",
    university: "Arizona State University",
    course: "MS Data Science",
    country: "USA",
    intake: "Spring 2026",
    year: 2026,
    status: "Submitted",
    partnerId: "PRT002",
  },
  {
    id: "APP004",
    studentId: "ST004",
    university: "University of Oxford",
    course: "PhD in Physics",
    country: "UK",
    intake: "Fall 2026",
    year: 2026,
    status: "Offer Received",
    partnerId: "PRT001",
  },
  {
    id: "APP005",
    studentId: "ST005",
    university: "TU Munich",
    course: "MSc Mechanical Engineering",
    country: "Germany",
    intake: "Winter 2026",
    year: 2026,
    status: "Submitted",
  },
  {
    id: "APP006",
    studentId: "ST006",
    university: "Monash University",
    course: "Diploma in IT",
    country: "Australia",
    intake: "Spring 2026",
    year: 2026,
    status: "Accepted",
    partnerId: "PRT003",
  },
  {
    id: "APP007",
    studentId: "ST010",
    university: "University of British Columbia",
    course: "MS Data Science",
    country: "Canada",
    intake: "Fall 2026",
    year: 2026,
    status: "Submitted",
    partnerId: "PRT002",
  }
];

export const visaCases = [
  {
    id: "VC001",
    studentId: "ST001",
    studentName: "Rahul Kumar",
    country: "Canada",
    university: "University of Toronto",
    intake: "Fall 2026",
    currentStage: "Visa Form Filled",
    appointmentDate: "2026-03-05"
  },
  {
    id: "VC002",
    studentId: "ST002",
    studentName: "Ananya Sharma",
    country: "Australia",
    university: "University of Melbourne",
    intake: "Fall 2026",
    currentStage: "Documents Verified",
    appointmentDate: "2026-03-10"
  },
  {
    id: "VC003",
    studentId: "ST004",
    studentName: "Priya Patel",
    country: "UK",
    university: "University of Oxford",
    intake: "Fall 2026",
    currentStage: "Visa Approved",
    visaResult: "Approved"
  },
  {
    id: "VC004",
    studentId: "ST003",
    studentName: "Vikram Singh",
    country: "USA",
    university: "Arizona State University",
    intake: "Spring 2026",
    currentStage: "Appointment Booked",
    appointmentDate: "2026-03-15"
  }
];

export const payments = [
  {
    id: "PAY001",
    studentId: "ST001",
    amount: 5000,
    status: "Paid",
    date: "2025-01-10",
    description: "Consultancy Fee"
  },
  {
    id: "PAY002",
    studentId: "ST002",
    amount: 2500,
    status: "Pending",
    date: "2025-02-15",
    description: "Application Fee"
  },
  {
    id: "PAY003",
    studentId: "ST003",
    amount: 5000,
    status: "Paid",
    date: "2025-01-20",
    description: "Consultancy Fee"
  },
  {
    id: "PAY004",
    studentId: "ST004",
    amount: 10000,
    status: "Paid",
    date: "2025-02-01",
    description: "Full Package Fee"
  },
  {
    id: "PAY005",
    studentId: "ST005",
    amount: 2000,
    status: "Paid",
    date: "2025-02-10",
    description: "Document Processing Fee"
  },
  {
    id: "PAY006",
    studentId: "ST006",
    amount: 2500,
    status: "Pending",
    date: "2025-02-28",
    description: "Application Fee"
  }
];

export const partners = [
  {
    id: "PRT001",
    name: "Global Education Services",
    country: "UK",
    commissionPercentage: 15,
    assignedStudents: ["ST004"],
    commissionReceived: 0
  },
  {
    id: "PRT002",
    name: "Overseas Pathway Ltd",
    country: "Canada",
    commissionPercentage: 10,
    assignedStudents: ["ST001", "ST003", "ST010"],
    commissionReceived: 1500
  },
  {
    id: "PRT003",
    name: "Study Bridge Australia",
    country: "Australia",
    commissionPercentage: 12,
    assignedStudents: ["ST002", "ST006"],
    commissionReceived: 1800
  }
];

// ── Commissions ──
export const commissions: Commission[] = [
  { id: 'COM001', studentId: 'ST001', studentName: 'Rahul Kumar', university: 'University of Toronto', partnerId: 'PRT002', commissionRate: 10, expectedAmount: 1500, status: 'Received' },
  { id: 'COM002', studentId: 'ST003', studentName: 'Vikram Singh', university: 'Arizona State University', partnerId: 'PRT002', commissionRate: 12, expectedAmount: 2400, status: 'Pending' },
  { id: 'COM003', studentId: 'ST004', studentName: 'Priya Patel', university: 'University of Oxford', partnerId: 'PRT001', commissionRate: 8, expectedAmount: 3200, status: 'Pending' },
  { id: 'COM004', studentId: 'ST006', studentName: 'Sneha Gupta', university: 'Monash University', partnerId: 'PRT003', commissionRate: 12, expectedAmount: 1800, status: 'Received' },
  { id: 'COM005', studentId: 'ST010', studentName: 'Karthik Nair', university: 'University of British Columbia', partnerId: 'PRT002', commissionRate: 10, expectedAmount: 2000, status: 'Pending' },
];

// ── Test Prep Fees ──
export const testPrepFees: TestPrepFee[] = [
  { id: 'TPF001', studentId: 'ST001', studentName: 'Rahul Kumar',    testType: 'IELTS', branch: 'Hyderabad', courseFee: 25000, amountPaid: 25000, pendingAmount: 0,     paymentStatus: 'Paid',    enrollmentDate: '2026-02-01' },
  { id: 'TPF002', studentId: 'ST002', studentName: 'Ananya Sharma',  testType: 'PTE',   branch: 'Kolkata',   courseFee: 20000, amountPaid: 10000, pendingAmount: 10000, paymentStatus: 'Partial', enrollmentDate: '2026-02-15' },
  { id: 'TPF003', studentId: 'ST006', studentName: 'Sneha Gupta',    testType: 'IELTS', branch: 'Hyderabad', courseFee: 25000, amountPaid: 25000, pendingAmount: 0,     paymentStatus: 'Paid',    enrollmentDate: '2026-02-01' },
  { id: 'TPF004', studentId: 'ST007', studentName: 'Arun Menon',     testType: 'SAT',   branch: 'Delhi',     courseFee: 30000, amountPaid: 15000, pendingAmount: 15000, paymentStatus: 'Partial', enrollmentDate: '2026-01-15' },
  { id: 'TPF005', studentId: 'ST008', studentName: 'Kavya Nair',     testType: 'PTE',   branch: 'Delhi',     courseFee: 20000, amountPaid: 20000, pendingAmount: 0,     paymentStatus: 'Paid',    enrollmentDate: '2026-01-10' },
  { id: 'TPF006', studentId: 'ST009', studentName: 'Rohan Das',      testType: 'IELTS', branch: 'Kolkata',   courseFee: 25000, amountPaid: 25000, pendingAmount: 0,     paymentStatus: 'Paid',    enrollmentDate: '2026-03-01' },
];

// ── Service Fees ──
export const serviceFees: ServiceFee[] = [
  { id: 'SF001', studentId: 'ST001', studentName: 'Rahul Kumar',    branch: 'Hyderabad', serviceFee: 80000, amountPaid: 50000, pendingAmount: 30000, paymentStatus: 'Partial', createdDate: '2026-01-15' },
  { id: 'SF002', studentId: 'ST002', studentName: 'Ananya Sharma',  branch: 'Kolkata',   serviceFee: 75000, amountPaid: 0,     pendingAmount: 75000, paymentStatus: 'Unpaid',  createdDate: '2026-02-20' },
  { id: 'SF003', studentId: 'ST003', studentName: 'Vikram Singh',   branch: 'Delhi',     serviceFee: 80000, amountPaid: 80000, pendingAmount: 0,     paymentStatus: 'Paid',    createdDate: '2026-01-10' },
  { id: 'SF004', studentId: 'ST004', studentName: 'Priya Patel',    branch: 'Hyderabad', serviceFee: 90000, amountPaid: 90000, pendingAmount: 0,     paymentStatus: 'Paid',    createdDate: '2026-01-05' },
  { id: 'SF005', studentId: 'ST005', studentName: 'Arjun Reddy',    branch: 'Hyderabad', serviceFee: 80000, amountPaid: 40000, pendingAmount: 40000, paymentStatus: 'Partial', createdDate: '2026-02-01' },
  { id: 'SF006', studentId: 'ST006', studentName: 'Sneha Gupta',    branch: 'Hyderabad', serviceFee: 75000, amountPaid: 75000, pendingAmount: 0,     paymentStatus: 'Paid',    createdDate: '2026-02-15' },
  { id: 'SF007', studentId: 'ST010', studentName: 'Karthik Nair',   branch: 'Kolkata',   serviceFee: 80000, amountPaid: 60000, pendingAmount: 20000, paymentStatus: 'Partial', createdDate: '2026-02-20' },
];

// ── Payment Records ──
export const paymentRecords: PaymentRecord[] = [
  { id: 'PR001', studentId: 'ST001', studentName: 'Rahul Kumar',    date: '2026-02-01', amount: 25000, paymentMode: 'UPI',           referenceNumber: 'UPI-2026-001',  feeType: 'Test Prep',   notes: 'Full fee paid' },
  { id: 'PR002', studentId: 'ST002', studentName: 'Ananya Sharma',  date: '2026-02-15', amount: 10000, paymentMode: 'Cash',          referenceNumber: 'CASH-0215',     feeType: 'Test Prep',   notes: 'First instalment' },
  { id: 'PR003', studentId: 'ST006', studentName: 'Sneha Gupta',    date: '2026-02-01', amount: 25000, paymentMode: 'Bank Transfer', referenceNumber: 'TXN-0201-A',    feeType: 'Test Prep' },
  { id: 'PR004', studentId: 'ST007', studentName: 'Arun Menon',     date: '2026-03-12', amount: 15000, paymentMode: 'Cash',          referenceNumber: 'CASH-0312',     feeType: 'Test Prep',   notes: 'First instalment' },
  { id: 'PR005', studentId: 'ST008', studentName: 'Kavya Nair',     date: '2026-01-10', amount: 20000, paymentMode: 'Card',          referenceNumber: 'CARD-0110-B',   feeType: 'Test Prep',   notes: 'Full fee paid' },
  { id: 'PR006', studentId: 'ST009', studentName: 'Rohan Das',      date: '2026-03-01', amount: 25000, paymentMode: 'Bank Transfer', referenceNumber: 'TXN-0301-B',    feeType: 'Test Prep' },
  { id: 'PR007', studentId: 'ST001', studentName: 'Rahul Kumar',    date: '2026-01-15', amount: 30000, paymentMode: 'Bank Transfer', referenceNumber: 'TXN-SF-001A',   feeType: 'Service Fee', notes: 'First instalment' },
  { id: 'PR008', studentId: 'ST001', studentName: 'Rahul Kumar',    date: '2026-02-10', amount: 20000, paymentMode: 'UPI',           referenceNumber: 'UPI-2026-002',  feeType: 'Service Fee', notes: 'Second instalment' },
  { id: 'PR009', studentId: 'ST003', studentName: 'Vikram Singh',   date: '2026-01-10', amount: 80000, paymentMode: 'Bank Transfer', referenceNumber: 'TXN-SF-003',    feeType: 'Service Fee', notes: 'Full fee paid' },
  { id: 'PR010', studentId: 'ST004', studentName: 'Priya Patel',    date: '2026-01-05', amount: 90000, paymentMode: 'Online Gateway',referenceNumber: 'OG-2026-004',   feeType: 'Service Fee', notes: 'Full fee paid' },
  { id: 'PR011', studentId: 'ST005', studentName: 'Arjun Reddy',    date: '2026-02-01', amount: 40000, paymentMode: 'Bank Transfer', referenceNumber: 'TXN-SF-005',    feeType: 'Service Fee' },
  { id: 'PR012', studentId: 'ST006', studentName: 'Sneha Gupta',    date: '2026-02-15', amount: 75000, paymentMode: 'UPI',           referenceNumber: 'UPI-2026-003',  feeType: 'Service Fee', notes: 'Full fee paid' },
  { id: 'PR013', studentId: 'ST010', studentName: 'Karthik Nair',   date: '2026-02-20', amount: 60000, paymentMode: 'Bank Transfer', referenceNumber: 'TXN-SF-010',    feeType: 'Service Fee', notes: 'First instalment' },
];

// ── Campaigns (Marketing / Lead Source) ──
export const campaigns: Campaign[] = [
  { id: 'CMP001', name: 'Spring 2026 Facebook Campaign', source: 'Facebook Ads', startDate: '2025-11-01', endDate: '2026-02-28', budget: 50000, leadsGenerated: 200, conversions: 80 },
  { id: 'CMP002', name: 'Google Ads - Masters Abroad', source: 'Google Search', startDate: '2025-12-01', endDate: '2026-03-31', budget: 75000, leadsGenerated: 180, conversions: 65 },
  { id: 'CMP003', name: 'Instagram Study Abroad Series', source: 'Instagram', startDate: '2026-01-01', endDate: '2026-04-30', budget: 30000, leadsGenerated: 120, conversions: 40 },
  { id: 'CMP004', name: 'Referral Bonus Program', source: 'Referral', startDate: '2025-10-01', endDate: '2026-06-30', budget: 20000, leadsGenerated: 90, conversions: 55 },
  { id: 'CMP005', name: 'Walk-in Open House Events', source: 'Walk-in', startDate: '2026-01-15', endDate: '2026-03-15', budget: 15000, leadsGenerated: 75, conversions: 35 },
  { id: 'CMP006', name: 'Direct Walk-in Promotions', source: 'Direct Walk-in', startDate: '2026-02-01', endDate: '2026-05-31', budget: 10000, leadsGenerated: 50, conversions: 20 },
  { id: 'CMP007', name: 'Test Prep Cross-Sell Campaign', source: 'Test Prep Referral', startDate: '2025-11-15', endDate: '2026-04-15', budget: 25000, leadsGenerated: 60, conversions: 30 },
  { id: 'CMP008', name: 'Marketing Lead Nurture Funnel', source: 'Marketing Lead', startDate: '2026-01-01', endDate: '2026-06-30', budget: 40000, leadsGenerated: 150, conversions: 50 },
];

// ── Walk-in Enquiries ──
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

// ── Test Prep Students ──
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

// ── Batches ──
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
