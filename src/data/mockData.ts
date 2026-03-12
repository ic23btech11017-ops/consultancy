export type PipelineStage = 'New Inquiry' | 'Initial Counseling' | 'Destination Selection' | 'Course Shortlisting' | 'University Selection' | 'Application Preparation' | 'Application Started' | 'Converted' | 'Lost';
export type TestStatus = 'Not Taken' | 'Enrolled' | 'Score Available';
export type LeadSource = 'Walk-in' | 'Marketing Lead' | 'Test Prep Referral' | 'Facebook Ads' | 'Google Search' | 'Instagram' | 'Referral' | 'Direct Walk-in';

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

export const leads: PipelineLead[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    phone: '+91 98765 43210',
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
    phone: '+91 76543 21098',
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
    testScore: '6.5',
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
    phone: '+91 54321 09876',
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
    studentId: 'ST003',
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
    status: "Visa In Process"
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
    status: "Active"
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
    status: "Application Submitted"
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
    status: "Visa Approved"
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
    status: "Documents Pending"
  },
  {
    id: "ST006",
    name: "Sneha Gupta",
    phone: "+91 94567 89012",
    email: "sneha@example.com",
    country: "India",
    highestQualification: "12th",
    targetLevel: "Bachelors",
    assignedCounsellor: "John Doe",
    status: "Active"
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
    status: "Active"
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
    status: "Active"
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
    status: "Active"
  }
];

export const applications = [
  {
    id: "APP001",
    studentId: "ST001",
    university: "University of Toronto",
    course: "MSc Computer Science",
    country: "Canada",
    intake: "Fall 2025",
    status: "Submitted"
  },
  {
    id: "APP002",
    studentId: "ST002",
    university: "University of Melbourne",
    course: "BBA",
    country: "Australia",
    intake: "Fall 2025",
    status: "Draft"
  },
  {
    id: "APP003",
    studentId: "ST003",
    university: "Arizona State University",
    course: "MS Data Science",
    country: "USA",
    intake: "Spring 2025",
    status: "Submitted"
  },
  {
    id: "APP004",
    studentId: "ST004",
    university: "University of Oxford",
    course: "PhD in Physics",
    country: "UK",
    intake: "Fall 2025",
    status: "Offer Received"
  },
  {
    id: "APP005",
    studentId: "ST005",
    university: "TU Munich",
    course: "MSc Mechanical Engineering",
    country: "Germany",
    intake: "Winter 2025",
    status: "In Review"
  },
  {
    id: "APP006",
    studentId: "ST006",
    university: "Monash University",
    course: "Bachelor of IT",
    country: "Australia",
    intake: "Fall 2025",
    status: "Draft"
  }
];

export const visaCases = [
  {
    id: "VC001",
    studentId: "ST001",
    studentName: "Rahul Kumar",
    country: "Canada",
    currentStage: "Visa Form Filled",
    appointmentDate: "2026-03-05"
  },
  {
    id: "VC002",
    studentId: "ST002",
    studentName: "Ananya Sharma",
    country: "Australia",
    currentStage: "Documents Verified",
    appointmentDate: "2026-03-10"
  },
  {
    id: "VC003",
    studentId: "ST004",
    studentName: "Priya Patel",
    country: "UK",
    currentStage: "Visa Approved",
    visaResult: "Approved"
  },
  {
    id: "VC004",
    studentId: "ST003",
    studentName: "Vikram Singh",
    country: "USA",
    currentStage: "Appointment Scheduled",
    appointmentDate: "2026-03-02"
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
    country: "United Kingdom",
    commissionPercentage: 15,
    assignedStudents: ["ST001", "ST004"],
    commissionReceived: 2500
  },
  {
    id: "PRT002",
    name: "Overseas Pathway Ltd",
    country: "Canada",
    commissionPercentage: 10,
    assignedStudents: ["ST003"],
    commissionReceived: 0
  },
  {
    id: "PRT003",
    name: "Study Bridge Australia",
    country: "Australia",
    commissionPercentage: 12,
    assignedStudents: ["ST002", "ST006"],
    commissionReceived: 1200
  }
];
