// ── Shared Types ──
export type PipelineStage = 'New Inquiry' | 'Initial Counseling' | 'Destination Selection' | 'Course Shortlisting' | 'University Selection' | 'Application Preparation' | 'Application Started' | 'Converted' | 'Lost';
export type TestStatus = 'Not Taken' | 'Enrolled' | 'Score Available';
export type LeadSource = 'Walk-in' | 'Marketing Lead' | 'Test Prep Referral' | 'Facebook Ads' | 'Google Search' | 'Instagram' | 'Referral' | 'Direct Walk-in' | 'Website Form';
export type Branch = 'Hyderabad' | 'Kolkata' | 'Delhi';
export type TestType = 'IELTS' | 'PTE' | 'SAT';
export type WalkInStatus = 'New Inquiry' | 'Demo Scheduled' | 'Demo Attended' | 'Enrolled' | 'Lost';
export type TestPrepStudentStatus = 'Active' | 'Completed' | 'Dropped';
export type FeeStatus = 'Paid' | 'Pending' | 'Partial';
export type BatchStatus = 'Upcoming' | 'Running' | 'Completed';
export type CommissionStatus = 'Pending' | 'Requested' | 'Received';
export type PaymentFeeStatus = 'Paid' | 'Partial' | 'Unpaid' | 'Refunded';
export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Online Gateway';
export type CampaignStatus = 'Active' | 'Paused' | 'Completed' | 'Scheduled';

// ── Canonical source registry (v1 — source-level attribution) ──
// This is the single source of truth for all allowed lead sources.
// source is immutable after lead creation (admin correction only).
export const LEAD_SOURCES: LeadSource[] = [
  'Walk-in',
  'Direct Walk-in',
  'Facebook Ads',
  'Google Search',
  'Instagram',
  'Website Form',
  'Marketing Lead',
  'Referral',
  'Test Prep Referral',
];

// ── Interfaces ──
export interface PipelineLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource; // immutable after creation — admin correction only
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
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  leadsGenerated: number;
  conversions: number;
  targetCountry?: string;
  targetLevel?: string;
  description?: string;
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
  {
    id: '13',
    name: 'Sanya Kapoor',
    phone: '+91 80012 34567',
    email: 'sanya.k@example.com',
    source: 'Website Form',
    interestedCountry: 'Canada',
    targetLevel: 'Masters',
    assignedCounsellor: 'Anjali Rao',
    status: 'New Inquiry',
    testStatus: 'Not Taken',
    budgetRange: '₹20-30 Lakhs',
    intakeTarget: 'Fall 2026',
    academicGoals: 'Masters in Business Analytics at a Canadian university',
  },
  {
    id: '14',
    name: 'Mohit Saxena',
    phone: '+91 99234 11223',
    email: 'mohit.s@example.com',
    source: 'Website Form',
    interestedCountry: 'UK',
    targetLevel: 'Masters',
    assignedCounsellor: 'Ravi Mehta',
    status: 'Initial Counseling',
    testStatus: 'Enrolled',
    testType: 'IELTS',
    budgetRange: '₹15-22 Lakhs',
    intakeTarget: 'Fall 2026',
    counselorNotes: ['Came via website contact form', 'Interested in MSc courses in London'],
    academicGoals: 'Technology management career in UK',
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
  { id: 'CMP001', name: 'Spring 2026 Facebook Campaign', source: 'Facebook Ads', status: 'Completed', startDate: '2025-11-01', endDate: '2026-02-28', budget: 50000, spend: 48200, impressions: 320000, clicks: 4800, leadsGenerated: 200, conversions: 80, targetCountry: 'UK', targetLevel: 'Masters', description: 'Targeted Facebook ads for UK Masters aspirants' },
  { id: 'CMP002', name: 'Google Ads – Masters Abroad', source: 'Google Search', status: 'Active', startDate: '2025-12-01', endDate: '2026-03-31', budget: 75000, spend: 52000, impressions: 510000, clicks: 7200, leadsGenerated: 180, conversions: 65, targetCountry: 'USA', targetLevel: 'Masters', description: 'Google Search ads targeting Masters study abroad keywords' },
  { id: 'CMP003', name: 'Instagram Study Abroad Series', source: 'Instagram', status: 'Active', startDate: '2026-01-01', endDate: '2026-04-30', budget: 30000, spend: 18500, impressions: 280000, clicks: 3100, leadsGenerated: 120, conversions: 40, targetCountry: 'Australia', targetLevel: 'Bachelors', description: 'Instagram reel series for student study abroad stories' },
  { id: 'CMP004', name: 'Referral Bonus Program', source: 'Referral', status: 'Active', startDate: '2025-10-01', endDate: '2026-06-30', budget: 20000, spend: 12000, impressions: 0, clicks: 0, leadsGenerated: 90, conversions: 55, description: 'Alumni and student referral incentive program' },
  { id: 'CMP005', name: 'Walk-in Open House Events', source: 'Walk-in', status: 'Completed', startDate: '2026-01-15', endDate: '2026-03-15', budget: 15000, spend: 14800, impressions: 0, clicks: 0, leadsGenerated: 75, conversions: 35, description: 'Monthly open house events at all three branches' },
  { id: 'CMP006', name: 'Direct Walk-in Promotions', source: 'Direct Walk-in', status: 'Active', startDate: '2026-02-01', endDate: '2026-05-31', budget: 10000, spend: 3200, impressions: 0, clicks: 0, leadsGenerated: 50, conversions: 20, description: 'In-branch promotional materials and outreach' },
  { id: 'CMP007', name: 'Test Prep Cross-Sell Campaign', source: 'Test Prep Referral', status: 'Active', startDate: '2025-11-15', endDate: '2026-04-15', budget: 25000, spend: 16400, impressions: 0, clicks: 0, leadsGenerated: 60, conversions: 30, description: 'Convert test prep students into overseas counseling pipeline' },
  { id: 'CMP008', name: 'Marketing Lead Nurture Funnel', source: 'Marketing Lead', status: 'Active', startDate: '2026-01-01', endDate: '2026-06-30', budget: 40000, spend: 21000, impressions: 195000, clicks: 2900, leadsGenerated: 150, conversions: 50, targetLevel: 'Masters', description: 'Email + WhatsApp nurture sequences for inbound marketing leads' },
  { id: 'CMP009', name: 'Canada Fall 2026 Google Campaign', source: 'Google Search', status: 'Scheduled', startDate: '2026-04-01', endDate: '2026-07-31', budget: 60000, spend: 0, impressions: 0, clicks: 0, leadsGenerated: 0, conversions: 0, targetCountry: 'Canada', targetLevel: 'Masters', description: 'Planned Google Ads campaign for Canada Fall 2026 intake' },
  { id: 'CMP010', name: 'KALNET Website Lead Forms', source: 'Website Form', status: 'Active', startDate: '2026-01-01', endDate: '2026-12-31', budget: 35000, spend: 8500, impressions: 0, clicks: 0, leadsGenerated: 45, conversions: 18, description: 'Lead capture forms on KALNET website — contact page, program pages, and landing pages' },
];

// ── Channel Details (placement-level metadata per source) ──
export interface ChannelPlacement {
  name: string;
  url?: string;
  format: string;
  status: 'Active' | 'Paused';
}

export interface ChannelDetail {
  type: 'Paid Digital' | 'Organic' | 'Offline' | 'Referral' | 'Partner Portal' | 'Website';
  description: string;
  targetAudience: string;
  avgLeadQuality: 'High' | 'Medium' | 'Low';
  placements: ChannelPlacement[];
}

export const CHANNEL_DETAILS: Record<LeadSource, ChannelDetail> = {
  'Facebook Ads': {
    type: 'Paid Digital',
    description: 'Paid lead generation via Meta Ads Manager targeting study-abroad aspirants in India.',
    targetAudience: 'Age 18–28 · Interests: Study Abroad, Education · Cities: Hyderabad, Delhi, Kolkata',
    avgLeadQuality: 'Medium',
    placements: [
      { name: 'Facebook News Feed', url: 'facebook.com/KALNETConsultancy', format: 'Image + Carousel Ad', status: 'Active' },
      { name: 'Facebook Stories', url: 'facebook.com/KALNETConsultancy', format: 'Story Ad (15s)', status: 'Active' },
      { name: 'Instagram Feed (Meta)', url: 'instagram.com/kalnet_official', format: 'Image Ad via Meta', status: 'Active' },
      { name: 'Messenger Inbox', url: 'facebook.com/KALNETConsultancy', format: 'Sponsored Message', status: 'Paused' },
    ],
  },
  'Google Search': {
    type: 'Paid Digital',
    description: 'Search intent ads targeting students actively looking for study abroad consultancies and IELTS coaching.',
    targetAudience: 'Keywords: "study abroad consultancy", "IELTS coaching", "MS in UK", "Canada student visa"',
    avgLeadQuality: 'High',
    placements: [
      { name: 'Google Search Network', url: 'ads.google.com', format: 'Text Ad (RSA)', status: 'Active' },
      { name: 'Google Display Network', url: 'ads.google.com', format: 'Banner Ad 728×90', status: 'Active' },
      { name: 'YouTube Pre-Roll', url: 'youtube.com/@KALNETStudyAbroad', format: 'Skippable Video Ad (15s)', status: 'Paused' },
      { name: 'Google Maps (Local)', url: 'maps.google.com', format: 'Local Ad Pin', status: 'Active' },
    ],
  },
  'Instagram': {
    type: 'Organic',
    description: "Organic posts and boosted content on KALNET's Instagram targeting younger study-abroad aspirants.",
    targetAudience: 'Age 17–24 · 12th grade & undergraduate students · Career-aware audience',
    avgLeadQuality: 'Medium',
    placements: [
      { name: 'Instagram Feed', url: 'instagram.com/kalnet_official', format: 'Image / Reel Post', status: 'Active' },
      { name: 'Instagram Stories', url: 'instagram.com/kalnet_official', format: 'Story with CTA Link', status: 'Active' },
      { name: 'Instagram Reels', url: 'instagram.com/kalnet_official', format: 'Short Video (30s)', status: 'Active' },
      { name: 'Instagram Explore', url: 'instagram.com/kalnet_official', format: 'Explore Page Ad', status: 'Paused' },
    ],
  },
  'Referral': {
    type: 'Referral',
    description: 'Word-of-mouth leads from converted students, alumni, and partner educational institutes.',
    targetAudience: 'Existing student network, alumni, partner college students, parent networks',
    avgLeadQuality: 'High',
    placements: [
      { name: 'Alumni Network', format: 'Word of Mouth / WhatsApp', status: 'Active' },
      { name: 'Partner Colleges', format: 'Campus Visit / Brochure', status: 'Active' },
      { name: 'Parent Referrals', format: 'Personal Introduction', status: 'Active' },
      { name: 'Counsellor Network', format: 'Direct Recommendation', status: 'Active' },
    ],
  },
  'Walk-in': {
    type: 'Offline',
    description: 'Students who walk directly into a KALNET office without prior appointment.',
    targetAudience: 'Local students near KALNET office locations in Hyderabad, Delhi, and Kolkata',
    avgLeadQuality: 'High',
    placements: [
      { name: 'Hyderabad Office', url: 'Banjara Hills, Hyderabad', format: 'Front Desk Intake', status: 'Active' },
      { name: 'Delhi Office', url: 'Connaught Place, New Delhi', format: 'Front Desk Intake', status: 'Active' },
      { name: 'Kolkata Office', url: 'Park Street, Kolkata', format: 'Front Desk Intake', status: 'Active' },
    ],
  },
  'Direct Walk-in': {
    type: 'Offline',
    description: 'Leads from students who visited after attending an offline event, seminar, or education fair.',
    targetAudience: 'Event attendees, seminar participants, education fair visitors',
    avgLeadQuality: 'High',
    placements: [
      { name: 'Education Fairs', format: 'Exhibition Stall / Booth', status: 'Active' },
      { name: 'School Seminars', format: 'Guest Lecture / Info Session', status: 'Active' },
      { name: 'College Campus Visits', format: 'On-Campus Presentation', status: 'Active' },
      { name: 'Community Events', format: 'Banner + Brochure Distribution', status: 'Paused' },
    ],
  },
  'Marketing Lead': {
    type: 'Partner Portal',
    description: 'Leads acquired through third-party education portals and aggregator platforms.',
    targetAudience: 'Students actively browsing online education platforms and comparison portals',
    avgLeadQuality: 'Medium',
    placements: [
      { name: 'Shiksha.com', url: 'shiksha.com/study-abroad', format: 'Lead Form Ad', status: 'Active' },
      { name: 'Collegedunia.com', url: 'collegedunia.com', format: 'Sponsored Profile', status: 'Active' },
      { name: 'CollegeDekho', url: 'collegedekho.com', format: 'Lead Generation Form', status: 'Paused' },
      { name: 'Leverage Edu', url: 'leverageedu.com', format: 'Partner Listing', status: 'Active' },
    ],
  },
  'Test Prep Referral': {
    type: 'Referral',
    description: "Students enrolled in KALNET's IELTS/PTE/SAT test prep programs who opt into overseas counseling.",
    targetAudience: 'Active test prep batch students across KALNET branches',
    avgLeadQuality: 'High',
    placements: [
      { name: 'IELTS Batch Counseling', format: 'In-Class Introduction Session', status: 'Active' },
      { name: 'PTE Batch Counseling', format: 'In-Class Introduction Session', status: 'Active' },
      { name: 'SAT Batch Counseling', format: 'In-Class Introduction Session', status: 'Active' },
      { name: 'WhatsApp Study Abroad Group', format: 'Group Broadcast Message', status: 'Active' },
    ],
  },
  'Website Form': {
    type: 'Website',
    description: "Leads captured directly through KALNET's website forms — contact page, program inquiry pages, and dedicated study-abroad landing pages.",
    targetAudience: 'Students visiting kalnet.in via organic search, direct traffic, or ad landing pages',
    avgLeadQuality: 'High',
    placements: [
      { name: 'Contact Us Page', url: 'kalnet.in/contact', format: 'Lead Enquiry Form', status: 'Active' },
      { name: 'UK Study Abroad Landing Page', url: 'kalnet.in/study-uk', format: 'Program Enquiry Form', status: 'Active' },
      { name: 'Canada Masters Landing Page', url: 'kalnet.in/study-canada', format: 'Program Enquiry Form', status: 'Active' },
      { name: 'Free Counseling CTA', url: 'kalnet.in/free-counseling', format: 'Appointment Booking Form', status: 'Active' },
      { name: 'Blog — Study Abroad Guide', url: 'kalnet.in/blog', format: 'Newsletter & Callback Form', status: 'Paused' },
    ],
  },
};

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
