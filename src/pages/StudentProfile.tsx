import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StudentStatus, updateStudentStatus, updateStudentProfile } from '../data/students';
import { students, applications as applicationsData, payments as paymentsData, visaCases as visaCasesData, leads as pipelineLeads, type PipelineLead } from '../data/mockData';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { 
  ArrowLeft, 
  Edit3, 
  User, 
  GraduationCap, 
  FileText, 
  Send, 
  Plane, 
  Wallet, 
  StickyNote,
  Phone,
  Mail,
  Globe,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  Upload,
  Check,
  X,
  ChevronRight,
  History,
  FileCheck,
  MessageSquare,
  DollarSign,
  BookOpen,
  Target,
  MapPin,
  Layers,
  Calendar,
  TrendingUp,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import {
  testPrepStudents,
  batches as testPrepBatches,
  type TestPrepStudent,
  type TestPrepStudentStatus,
  type FeeStatus,
} from '../data/testPrepData';

type EditableStudent = NonNullable<ReturnType<typeof students.find>> & {
  gpa: string;
  ieltsScore: string;
  preferredCountry: string;
};

type DocStatus = 'Missing' | 'Uploaded' | 'Verified';
type AppStatus = 'Draft' | 'Submitted' | 'Offer Received' | 'Rejected' | 'Accepted';
type VisaResult = 'Pending' | 'Approved' | 'Rejected';

interface Document {
  id: string;
  name: string;
  category: string;
  required: boolean;
  status: DocStatus;
  lastUpdated?: string;
  fileName?: string;
  uploadedDate?: string;
  verifiedDate?: string;
  remarks?: string;
  verifiedBy?: string;
}

interface Application {
  id: string;
  university: string;
  course: string;
  intake: string;
  country: string;
  status: AppStatus;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  mode: string;
  status: string;
}

interface Note {
  id: string;
  text: string;
  timestamp: string;
  user: string;
}

const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  // --- MOCK DATA & STATE ---
  
  // 1. Personal & Academic Info
  const initialStudent = students.find(s => s.id === id);
  const [student, setStudent] = useState(initialStudent ? {
    ...initialStudent,
    gpa: '3.8',
    ieltsScore: '7.5',
    preferredCountry: initialStudent.country || 'UK',
  } as EditableStudent : null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileDraft, setProfileDraft] = useState<EditableStudent | null>(null);

  if (!student) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => navigate('/students')}
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Students
        </button>
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">The student with ID {id} could not be found in our records.</p>
          <button 
            onClick={() => navigate('/students')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
          >
            Return to Student List
          </button>
        </Card>
      </div>
    );
  }

  // 2. Documents State
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Passport', category: 'Identity Documents', required: true, status: 'Verified', lastUpdated: '2025-01-15', fileName: `passport_${student.name.split(' ')[0].toLowerCase()}.pdf`, uploadedDate: '2025-01-10', verifiedDate: '2025-01-15', verifiedBy: 'Admin' },
    { id: '2', name: 'Aadhaar', category: 'Identity Documents', required: false, status: 'Missing' },
    { id: '3', name: '10th Marksheet', category: 'Academic Documents', required: true, status: 'Verified', lastUpdated: '2025-01-12', fileName: '10th_marksheet.pdf', uploadedDate: '2025-01-11', verifiedDate: '2025-01-12', verifiedBy: 'Admin' },
    { id: '4', name: '12th Marksheet', category: 'Academic Documents', required: true, status: 'Verified', lastUpdated: '2025-01-12', fileName: '12th_marksheet.pdf', uploadedDate: '2025-01-11', verifiedDate: '2025-01-12', verifiedBy: 'Admin' },
    { id: '5', name: 'Bachelor\'s Transcript', category: 'Academic Documents', required: true, status: 'Uploaded', lastUpdated: '2025-02-01', fileName: 'bachelors_transcript.pdf', uploadedDate: '2025-02-01' },
    { id: '6', name: 'Degree Certificate', category: 'Academic Documents', required: true, status: 'Missing' },
    { id: '7', name: 'IELTS Scorecard', category: 'English Test', required: true, status: 'Uploaded', lastUpdated: '2025-02-05', fileName: 'ielts_report.pdf', uploadedDate: '2025-02-05' },
    { id: '8', name: 'Bank Statement', category: 'Financial Documents', required: true, status: 'Missing' },
    { id: '9', name: 'SOP', category: 'University Documents', required: true, status: 'Uploaded', lastUpdated: '2025-02-10', fileName: 'sop_v1.docx', uploadedDate: '2025-02-10' },
    { id: '10', name: 'LOR 1', category: 'University Documents', required: true, status: 'Uploaded', lastUpdated: '2025-02-10', fileName: 'lor_prof_sharma.pdf', uploadedDate: '2025-02-10' },
    { id: '11', name: 'Offer Letter', category: 'University Documents', required: true, status: 'Missing' },
    { id: '12', name: 'Visa Application Form', category: 'Visa Documents', required: true, status: 'Missing' },
  ]);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [docRemarks, setDocRemarks] = useState('');
  const [isVerifiedToggle, setIsVerifiedToggle] = useState(false);

  // 3. Applications State
  const initialApplications = applicationsData.filter(app => app.studentId === id);
  const [applications, setApplications] = useState<Application[]>(initialApplications as Application[]);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [newApp, setNewApp] = useState<Partial<Application>>({
    university: '',
    course: '',
    intake: 'Fall 2025',
    country: 'UK',
    status: 'Draft',
  });

  // 4. Visa Workflow State
  const visaStages = [
    'Documents Verified',
    'Financial Prepared',
    'Visa Form Filled',
    'Appointment Booked',
    'Interview Done',
    'Visa Approved'
  ];

  const [currentVisaStage, setCurrentVisaStage] = useState(1);
  const [visaAppointmentDate, setVisaAppointmentDate] = useState('2025-08-15');
  const [visaResult, setVisaResult] = useState<VisaResult>('Pending');

  // Sync with global visa cases
  useEffect(() => {
    const saved = localStorage.getItem('kalnet_visa_cases');
    const allCases = saved ? JSON.parse(saved) : visaCasesData;
    const studentCase = allCases.find((c: any) => c.studentId === id);
    
    if (studentCase) {
      const stageIndex = visaStages.indexOf(studentCase.currentStage);
      if (stageIndex !== -1) setCurrentVisaStage(stageIndex);
      if (studentCase.appointmentDate) setVisaAppointmentDate(studentCase.appointmentDate);
      if (studentCase.visaResult) setVisaResult(studentCase.visaResult as VisaResult);
    }
  }, [id]);

  const updateGlobalVisaState = (updates: any) => {
    const saved = localStorage.getItem('kalnet_visa_cases');
    const allCases = saved ? JSON.parse(saved) : visaCasesData;
    const updatedCases = allCases.map((c: any) => 
      c.studentId === id ? { ...c, ...updates } : c
    );
    localStorage.setItem('kalnet_visa_cases', JSON.stringify(updatedCases));
  };

  const handleMarkStageComplete = () => {
    if (currentVisaStage < visaStages.length - 1) {
      const nextStage = visaStages[currentVisaStage + 1];
      setCurrentVisaStage(s => s + 1);
      updateGlobalVisaState({ currentStage: nextStage });
    }
  };

  // 5. Finance State
  const [totalServiceFee] = useState(50000);
  const initialPayments = paymentsData.filter(p => p.studentId === id);
  const [payments, setPayments] = useState<Payment[]>(initialPayments.map(p => ({
    id: p.id,
    date: p.date,
    amount: p.amount,
    mode: 'Bank Transfer',
    status: p.status === 'Paid' ? 'Success' : 'Pending'
  })));
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ amount: '', mode: 'UPI', status: 'Success' });

  const totalPaid = useMemo(() => payments.reduce((sum, p) => sum + p.amount, 0), [payments]);
  const pendingAmount = totalServiceFee - totalPaid;

  // 6. Notes State
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', text: 'Student is highly motivated and has a strong academic background.', timestamp: '2024-11-20 10:30 AM', user: 'Admin' },
    { id: '2', text: 'Need to follow up on the degree certificate.', timestamp: '2025-01-10 02:15 PM', user: 'Admin' },
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  // 7. Test Preparation State
  const testPrepStudent = testPrepStudents.find(s => s.studentId === id);
  const [tpStudent, setTpStudent] = useState<TestPrepStudent | null>(testPrepStudent ? { ...testPrepStudent } : null);

  interface ScoreEntry { id: string; date: string; score: string; notes: string; }
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>(
    testPrepStudent?.currentScore
      ? [{ id: '1', date: '2026-03-01', score: testPrepStudent.currentScore, notes: 'Latest mock test' }]
      : []
  );
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [newScore, setNewScore] = useState({ score: '', notes: '' });
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [newBatchValue, setNewBatchValue] = useState('');

  const currentBatch = tpStudent ? testPrepBatches.find(b => b.batchName === tpStudent.batch) : null;

  // --- HANDLERS ---

  const handleManageDoc = (doc: Document) => {
    setSelectedDoc(doc);
    setDocRemarks(doc.remarks || '');
    setIsVerifiedToggle(doc.status === 'Verified');
    setIsDocModalOpen(true);
  };

  const handleSaveDocManagement = () => {
    if (!selectedDoc) return;

    setDocuments(docs => docs.map(d => {
      if (d.id === selectedDoc.id) {
        let newStatus = d.status;
        let uploadedDate = d.uploadedDate;
        let fileName = d.fileName;
        let verifiedDate = d.verifiedDate;
        let verifiedBy = d.verifiedBy;

        // If it was missing and we "uploaded" (simulated by clicking upload in modal)
        // For this mock, we'll assume if they save and it was missing, it stays missing unless they "uploaded"
        // But the user said: "Save button: Updates document status accordingly: Missing -> Uploaded, Uploaded -> Verified"
        
        if (d.status === 'Missing' && fileName) {
          newStatus = 'Uploaded';
        }
        
        if (isVerifiedToggle) {
          newStatus = 'Verified';
          verifiedDate = verifiedDate || new Date().toISOString().split('T')[0];
          verifiedBy = verifiedBy || 'Admin';
        } else if (newStatus === 'Verified') {
          // If it was verified but toggle is off
          newStatus = 'Uploaded';
        }

        return {
          ...d,
          status: newStatus,
          remarks: docRemarks,
          verifiedDate,
          verifiedBy,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return d;
    }));
    setIsDocModalOpen(false);
  };

  const simulateUpload = () => {
    if (!selectedDoc) return;
    const now = new Date().toISOString().split('T')[0];
    setSelectedDoc({
      ...selectedDoc,
      status: selectedDoc.status === 'Missing' ? 'Uploaded' : selectedDoc.status,
      fileName: `uploaded_file_${Math.floor(Math.random() * 1000)}.pdf`,
      uploadedDate: now,
      lastUpdated: now
    });
  };

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const app: Application = {
      ...newApp as Application,
      id: Math.random().toString(36).substr(2, 9),
    };
    setApplications([...applications, app]);
    setIsAppModalOpen(false);
    setNewApp({ university: '', course: '', intake: 'Fall 2025', country: 'UK', status: 'Draft' });
  };

  const handleAppStatusChange = (appId: string, status: AppStatus) => {
    setApplications(apps => apps.map(a => a.id === appId ? { ...a, status } : a));
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const payment: Payment = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      amount: Number(newPayment.amount),
      mode: newPayment.mode,
      status: newPayment.status,
    };
    setPayments([...payments, payment]);
    setIsPaymentModalOpen(false);
    setNewPayment({ amount: '', mode: 'UPI', status: 'Success' });
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const note: Note = {
      id: Math.random().toString(36).substr(2, 9),
      text: newNoteText,
      timestamp: new Date().toLocaleString(),
      user: 'Admin',
    };
    setNotes([note, ...notes]);
    setNewNoteText('');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  // Test Prep Handlers
  const handleAddScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tpStudent) return;
    const entry: ScoreEntry = {
      id: String(scoreHistory.length + 1),
      date: new Date().toISOString().split('T')[0],
      score: newScore.score,
      notes: newScore.notes,
    };
    setScoreHistory([entry, ...scoreHistory]);
    setTpStudent({ ...tpStudent, currentScore: newScore.score });
    setShowScoreModal(false);
    setNewScore({ score: '', notes: '' });
  };

  const handleChangeBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tpStudent) return;
    const batch = testPrepBatches.find(b => b.batchName === newBatchValue);
    setTpStudent({
      ...tpStudent,
      batch: newBatchValue,
      trainer: batch?.trainer || tpStudent.trainer,
    });
    setShowBatchModal(false);
    setNewBatchValue('');
  };

  const handleReferToCounseling = () => {
    if (!tpStudent) return;
    setTpStudent({ ...tpStudent, referredToCounseling: true });
  };

  const handleTpStatusChange = (newStatus: TestPrepStudentStatus) => {
    if (!tpStudent) return;
    setTpStudent({ ...tpStudent, status: newStatus });
  };

  const getTpStatusBadge = (status: TestPrepStudentStatus) => {
    const map: Record<TestPrepStudentStatus, 'success' | 'info' | 'error'> = {
      Active: 'success', Completed: 'info', Dropped: 'error',
    };
    return <Badge variant={map[status]}>{status}</Badge>;
  };

  const getTpFeeBadge = (status: FeeStatus) => {
    const map: Record<FeeStatus, 'success' | 'error' | 'warning'> = {
      Paid: 'success', Pending: 'error', Partial: 'warning',
    };
    return <Badge variant={map[status]}>{status}</Badge>;
  };

  // --- HELPERS ---

  const handleStatusChange = (newStatus: StudentStatus) => {
    if (!student) return;
    setStudent({ ...student, status: newStatus });
    updateStudentStatus(student.id, newStatus);
  };

  const handleOpenEditProfile = () => {
    if (!student) return;
    setProfileDraft({ ...student });
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileDraft) return;

    setStudent(profileDraft);
    updateStudentProfile(profileDraft.id, {
      name: profileDraft.name,
      phone: profileDraft.phone,
      email: profileDraft.email,
      country: profileDraft.country,
      highestQualification: profileDraft.highestQualification,
      targetLevel: profileDraft.targetLevel,
      assignedCounsellor: profileDraft.assignedCounsellor,
      status: profileDraft.status,
      branch: profileDraft.branch,
      leadSource: profileDraft.leadSource,
    });
    setIsEditProfileOpen(false);
    setProfileDraft(null);
  };

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case 'Active': return <Badge variant="info">Active</Badge>;
      case 'Application In Progress': return <Badge variant="warning">Application In Progress</Badge>;
      case 'Visa In Process': return <Badge variant="indigo">Visa In Process</Badge>;
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      default: return <Badge variant="info">{status}</Badge>;
    }
  };

  const getDocStatusBadge = (status: DocStatus) => {
    switch (status) {
      case 'Missing': return <Badge variant="error">Missing</Badge>;
      case 'Uploaded': return <Badge variant="warning">Uploaded</Badge>;
      case 'Verified': return <Badge variant="success">Verified</Badge>;
    }
  };

  const getAppStatusBadge = (status: AppStatus) => {
    switch (status) {
      case 'Draft': return <Badge variant="info">Draft</Badge>;
      case 'Submitted': return <Badge variant="info">Submitted</Badge>;
      case 'Offer Received': return <Badge variant="success">Offer Received</Badge>;
      case 'Rejected': return <Badge variant="error">Rejected</Badge>;
      case 'Accepted': return <Badge variant="success">Accepted</Badge>;
    }
  };

  const getVisaResultBadge = (result: VisaResult) => {
    switch (result) {
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      case 'Approved': return <Badge variant="success">Approved</Badge>;
      case 'Rejected': return <Badge variant="error">Rejected</Badge>;
    }
  };

  const validateAcademic = useMemo(() => {
    const q = student.highestQualification;
    const t = student.targetLevel;
    if (q === '12th' && !['Bachelors', 'Diploma'].includes(t)) return false;
    if (q === 'Bachelors' && t !== 'Masters') return false;
    if (q === 'Masters' && t !== 'PhD') return false;
    return true;
  }, [student.highestQualification, student.targetLevel]);

  const docProgress = useMemo(() => {
    const requiredDocs = documents.filter(d => d.required);
    const uploadedOrVerified = requiredDocs.filter(d => d.status !== 'Missing').length;
    return {
      total: requiredDocs.length,
      completed: uploadedOrVerified,
      percent: Math.round((uploadedOrVerified / requiredDocs.length) * 100)
    };
  }, [documents]);

  const tabs = [
    { name: 'Overview', icon: User },
    { name: 'Academic', icon: GraduationCap },
    { name: 'Test Preparation', icon: BookOpen },
    { name: 'Documents', icon: FileText },
    { name: 'Applications', icon: Send },
    { name: 'Visa', icon: Plane },
    { name: 'Finance', icon: Wallet },
    { name: 'Counseling', icon: GitBranch },
    { name: 'Notes', icon: StickyNote },
  ];

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/students')}
        className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Students
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
              <div className="relative group/status">
                <select
                  value={student.status}
                  onChange={(e) => handleStatusChange(e.target.value as StudentStatus)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                >
                  <option value="Active">Active</option>
                  <option value="Application In Progress">Application In Progress</option>
                  <option value="Visa In Process">Visa In Process</option>
                  <option value="Completed">Completed</option>
                </select>
                {getStatusBadge(student.status)}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Student ID: {student.id}</p>
          </div>
        </div>
        <button
          onClick={handleOpenEditProfile}
          className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-100 dark:border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-[2px] ${
              activeTab === tab.name
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">Full Name:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{student.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">Phone:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{student.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">Email:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{student.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Globe className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">Country:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{student.country}</span>
                </div>
                <div className="flex items-center text-sm">
                  <UserCheck className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">Counsellor:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{student.assignedCounsellor}</span>
                </div>
              </div>
            </Card>

            <Card className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Current Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Overall Status:</span>
                  {getStatusBadge(student.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Target Level:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{student.targetLevel}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Qualification:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{student.highestQualification}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Visa Stage:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{visaStages[currentVisaStage]}</span>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="flex flex-col items-center justify-center p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{applications.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Applications</div>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{documents.filter(d => d.status !== 'Missing').length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Docs Uploaded</div>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 text-center">
                <div className="text-2xl font-bold text-red-500">{documents.filter(d => d.required && d.status === 'Missing').length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pending Docs</div>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 text-center">
                <div className="text-2xl font-bold text-orange-500">₹{pendingAmount.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Payments Pending</div>
              </Card>
            </div>
          </div>
        )}

        {/* ACADEMIC TAB */}
        {activeTab === 'Academic' && (
          <Card className="max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 mb-6">Academic Background</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Highest Qualification</label>
                  <select 
                    value={student.highestQualification}
                    onChange={(e) => setStudent({ ...student, highestQualification: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  >
                    <option value="12th">12th</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Target Study Level</label>
                  <select 
                    value={student.targetLevel}
                    onChange={(e) => setStudent({ ...student, targetLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  >
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>

              {!validateAcademic && (
                <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Warning: Target level must be higher than completed qualification.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">GPA / Percentage</label>
                  <input 
                    type="text"
                    value={student.gpa}
                    onChange={(e) => setStudent({ ...student, gpa: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">IELTS / TOEFL Score</label>
                  <input 
                    type="text"
                    value={student.ieltsScore}
                    onChange={(e) => setStudent({ ...student, ieltsScore: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Preferred Country</label>
                <select 
                  value={student.preferredCountry}
                  onChange={(e) => setStudent({ ...student, preferredCountry: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                >
                  <option value="UK">UK</option>
                  <option value="USA">USA</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>

              <div className="pt-4">
                <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm shadow-sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Academic Details
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* TEST PREPARATION TAB */}
        {activeTab === 'Test Preparation' && (
          <div className="space-y-6">
            {tpStudent ? (
              <>
                {/* Header with status & referral */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Badge variant={tpStudent.testType === 'IELTS' ? 'info' : tpStudent.testType === 'PTE' ? 'indigo' : 'warning'}>{tpStudent.testType}</Badge>
                    <div className="relative group/tpstatus">
                      <select
                        value={tpStudent.status}
                        onChange={(e) => handleTpStatusChange(e.target.value as TestPrepStudentStatus)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Dropped">Dropped</option>
                      </select>
                      {getTpStatusBadge(tpStudent.status)}
                    </div>
                    {tpStudent.referredToCounseling && <Badge variant="indigo">Referred to Counseling</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    {tpStudent.status === 'Active' && !tpStudent.referredToCounseling && (
                      <button onClick={handleReferToCounseling} className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors duration-200">
                        <ArrowRight className="w-4 h-4 mr-2" />Refer to Counseling
                      </button>
                    )}
                  </div>
                </div>

                {/* Three-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Student & Course Info */}
                  <Card className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Test Prep Info</h3>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <BookOpen className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 w-32">Test Type:</span>
                        <Badge variant={tpStudent.testType === 'IELTS' ? 'info' : tpStudent.testType === 'PTE' ? 'indigo' : 'warning'}>{tpStudent.testType}</Badge>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 w-32">Branch:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{tpStudent.branch}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <UserCheck className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 w-32">Trainer:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{tpStudent.trainer}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <DollarSign className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 w-32">Fee Status:</span>
                        {getTpFeeBadge(tpStudent.feeStatus)}
                      </div>
                    </div>
                  </Card>

                  {/* Batch & Schedule */}
                  <Card className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Batch & Schedule</h3>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <Layers className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 w-32">Batch:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{tpStudent.batch || '—'}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 w-32">Start Date:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{tpStudent.startDate || '—'}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 w-32">End Date:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{tpStudent.endDate || '—'}</span>
                      </div>
                      {currentBatch && (
                        <>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400 w-36 ml-7">Capacity:</span>
                            <span className="text-gray-900 dark:text-white font-medium">{currentBatch.studentsEnrolled}/{currentBatch.capacity}</span>
                          </div>
                          <div className="ml-7">
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${currentBatch.studentsEnrolled / currentBatch.capacity > 0.8 ? 'bg-red-500' : currentBatch.studentsEnrolled / currentBatch.capacity > 0.5 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min((currentBatch.studentsEnrolled / currentBatch.capacity) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {tpStudent.status === 'Active' && (
                      <button onClick={() => { setNewBatchValue(tpStudent.batch); setShowBatchModal(true); }} className="w-full mt-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors duration-200">
                        Change Batch
                      </button>
                    )}
                  </Card>

                  {/* Score Summary */}
                  <div className="space-y-4">
                    <Card className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Score Summary</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Score</p>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">{tpStudent.currentScore || '—'}</p>
                        </div>
                        <div className="text-center">
                          <Target className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Target</p>
                          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{tpStudent.targetScore || '—'}</p>
                        </div>
                      </div>
                      {tpStudent.currentScore && tpStudent.targetScore && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{Math.min(Math.round((parseFloat(tpStudent.currentScore) / parseFloat(tpStudent.targetScore)) * 100), 100)}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${parseFloat(tpStudent.currentScore) >= parseFloat(tpStudent.targetScore) ? 'bg-emerald-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min((parseFloat(tpStudent.currentScore) / parseFloat(tpStudent.targetScore)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {tpStudent.status === 'Active' && (
                        <button onClick={() => setShowScoreModal(true)} className="w-full mt-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200">
                          <Plus className="w-4 h-4 inline mr-1" />Add Score
                        </button>
                      )}
                    </Card>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="flex flex-col items-center justify-center p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{scoreHistory.length}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mock Tests</div>
                      </Card>
                      <Card className="flex flex-col items-center justify-center p-4 text-center">
                        <div className={`text-2xl font-bold ${tpStudent.referredToCounseling ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                          {tpStudent.referredToCounseling ? 'Yes' : 'No'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Counseling Referral</div>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Score History Table */}
                <Card className="p-0 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Score History</h3>
                    {tpStudent.status === 'Active' && (
                      <button onClick={() => setShowScoreModal(true)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm font-medium text-sm">
                        <Plus className="w-4 h-4 mr-2" />Add Score
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {scoreHistory.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                              <History className="w-4 h-4 text-gray-400" />{entry.date}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{entry.score}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{entry.notes || '—'}</td>
                          </tr>
                        ))}
                        {scoreHistory.length === 0 && (
                          <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No scores recorded yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Add Score Modal */}
                {showScoreModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowScoreModal(false)}></div>
                    <Card className="relative w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add Score</h3>
                        <button onClick={() => setShowScoreModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
                      </div>
                      <form onSubmit={handleAddScore} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Score</label>
                          <input required value={newScore.score} onChange={e => setNewScore({ ...newScore, score: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" placeholder="e.g., 7.5 or 1450" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Notes</label>
                          <input value={newScore.notes} onChange={e => setNewScore({ ...newScore, notes: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" placeholder="Optional notes" />
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                          <button type="button" onClick={() => setShowScoreModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Save Score</button>
                        </div>
                      </form>
                    </Card>
                  </div>
                )}

                {/* Change Batch Modal */}
                {showBatchModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBatchModal(false)}></div>
                    <Card className="relative w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Change Batch</h3>
                        <button onClick={() => setShowBatchModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
                      </div>
                      <form onSubmit={handleChangeBatch} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">New Batch</label>
                          <select required value={newBatchValue} onChange={e => setNewBatchValue(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                            <option value="">Select Batch</option>
                            {testPrepBatches.filter(b => b.status !== 'Completed').map(b => <option key={b.id} value={b.batchName}>{b.batchName}</option>)}
                          </select>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                          <button type="button" onClick={() => setShowBatchModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Change</button>
                        </div>
                      </form>
                    </Card>
                  </div>
                )}
              </>
            ) : (
              <Card className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Test Preparation Record</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This student is not currently enrolled in any test preparation course.</p>
              </Card>
            )}
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'Documents' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Document Progress</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{docProgress.completed} / {docProgress.total} Required Documents Uploaded or Verified</p>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{docProgress.percent}%</div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${docProgress.percent}%` }}
                ></div>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Document Name</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Required</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {documents.map(doc => (
                      <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">{doc.category}</td>
                        <td className="px-6 py-4 text-center">
                          {doc.required ? <Badge variant="error">Yes</Badge> : <Badge variant="info">No</Badge>}
                        </td>
                        <td className="px-6 py-4 text-center">{getDocStatusBadge(doc.status)}</td>
                        <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">{doc.lastUpdated || 'Never'}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleManageDoc(doc)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 border border-blue-100 dark:border-blue-900/30"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </Card>

            {/* DOCUMENT MANAGEMENT MODAL */}
            {isDocModalOpen && selectedDoc && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDocModalOpen(false)}></div>
                <Card className="relative w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedDoc.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {selectedDoc.required && <Badge variant="error">Required</Badge>}
                          {getDocStatusBadge(selectedDoc.status)}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setIsDocModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                    {/* Section 1: File Upload */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        File Upload
                      </h4>
                      {selectedDoc.status === 'Missing' ? (
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center space-y-4">
                          <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                            <Upload className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, JPG or PNG (max. 10MB)</p>
                          </div>
                          <button 
                            onClick={simulateUpload}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
                          >
                            Upload Document
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                          <div className="flex items-center">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm mr-3">
                              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedDoc.fileName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded on {selectedDoc.uploadedDate}</p>
                            </div>
                          </div>
                          <button 
                            onClick={simulateUpload}
                            className="text-xs font-medium text-blue-600 hover:underline"
                          >
                            Replace File
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Section 2: Verification */}
                    <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center">
                        <FileCheck className="w-4 h-4 mr-2" />
                        Verification
                      </h4>
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <div 
                            onClick={() => setIsVerifiedToggle(!isVerifiedToggle)}
                            className={`w-12 h-6 rounded-full relative transition-all duration-200 ${isVerifiedToggle ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                          >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${isVerifiedToggle ? 'translate-x-6' : ''}`}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as Verified</span>
                        </label>

                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Verification Remarks
                          </label>
                          <textarea 
                            value={docRemarks}
                            onChange={(e) => setDocRemarks(e.target.value)}
                            placeholder="Add any internal notes or remarks about this document..."
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[100px] dark:text-white"
                          ></textarea>
                        </div>

                        {selectedDoc.status === 'Verified' && (
                          <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30">
                            <div>
                              <p className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Verified By</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{selectedDoc.verifiedBy || 'Admin'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Verified Date</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{selectedDoc.verifiedDate}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 3: Activity Log */}
                    <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center">
                        <History className="w-4 h-4 mr-2" />
                        Activity Log
                      </h4>
                      <div className="space-y-3">
                        {selectedDoc.uploadedDate && (
                          <div className="flex items-start space-x-3">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">Document uploaded</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{selectedDoc.uploadedDate}</p>
                            </div>
                          </div>
                        )}
                        {selectedDoc.verifiedDate && (
                          <div className="flex items-start space-x-3">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">Document verified by Admin</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{selectedDoc.verifiedDate}</p>
                            </div>
                          </div>
                        )}
                        {!selectedDoc.uploadedDate && !selectedDoc.verifiedDate && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic">No activity recorded yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-3">
                    <button 
                      onClick={() => setIsDocModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveDocManagement}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {isEditProfileOpen && profileDraft && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Student Profile</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update personal and academic details from the profile header.</p>
                </div>
                <button
                  onClick={() => {
                    setIsEditProfileOpen(false);
                    setProfileDraft(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input
                      required
                      type="text"
                      value={profileDraft.name}
                      onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Phone</label>
                    <input
                      required
                      type="text"
                      value={profileDraft.phone}
                      onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      required
                      type="email"
                      value={profileDraft.email}
                      onChange={(e) => setProfileDraft({ ...profileDraft, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Country</label>
                    <input
                      required
                      type="text"
                      value={profileDraft.country}
                      onChange={(e) => setProfileDraft({ ...profileDraft, country: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Assigned Counsellor</label>
                    <input
                      required
                      type="text"
                      value={profileDraft.assignedCounsellor}
                      onChange={(e) => setProfileDraft({ ...profileDraft, assignedCounsellor: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Preferred Country</label>
                    <select
                      value={profileDraft.preferredCountry}
                      onChange={(e) => setProfileDraft({ ...profileDraft, preferredCountry: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    >
                      <option value="UK">UK</option>
                      <option value="USA">USA</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Highest Qualification</label>
                    <select
                      value={profileDraft.highestQualification}
                      onChange={(e) => setProfileDraft({ ...profileDraft, highestQualification: e.target.value as EditableStudent['highestQualification'] })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    >
                      <option value="12th">12th</option>
                      <option value="Bachelors">Bachelors</option>
                      <option value="Masters">Masters</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Target Study Level</label>
                    <select
                      value={profileDraft.targetLevel}
                      onChange={(e) => setProfileDraft({ ...profileDraft, targetLevel: e.target.value as EditableStudent['targetLevel'] })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    >
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelors">Bachelors</option>
                      <option value="Masters">Masters</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">GPA / Percentage</label>
                    <input
                      type="text"
                      value={profileDraft.gpa}
                      onChange={(e) => setProfileDraft({ ...profileDraft, gpa: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">IELTS / TOEFL Score</label>
                    <input
                      type="text"
                      value={profileDraft.ieltsScore}
                      onChange={(e) => setProfileDraft({ ...profileDraft, ieltsScore: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    />
                  </div>
                </div>

                {((profileDraft.highestQualification === '12th' && !['Bachelors', 'Diploma'].includes(profileDraft.targetLevel)) ||
                  (profileDraft.highestQualification === 'Bachelors' && profileDraft.targetLevel !== 'Masters') ||
                  (profileDraft.highestQualification === 'Masters' && profileDraft.targetLevel !== 'PhD')) && (
                  <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Warning: Target level must be higher than completed qualification.
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditProfileOpen(false);
                      setProfileDraft(null);
                    }}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === 'Applications' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button 
                onClick={() => setIsAppModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm font-medium text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Application
              </button>
            </div>

            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">University</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Country</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Intake</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{app.university}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{app.course}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{app.country}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{app.intake}</td>
                        <td className="px-6 py-4">
                          <select 
                            value={app.status}
                            onChange={(e) => handleAppStatusChange(app.id, e.target.value as AppStatus)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 p-0 cursor-pointer"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Offer Received">Offer Received</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Accepted">Accepted</option>
                          </select>
                          <div className="mt-1">{getAppStatusBadge(app.status)}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-all duration-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {isAppModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAppModalOpen(false)}></div>
                <Card className="relative w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add Application</h3>
                    <button onClick={() => setIsAppModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleAddApplication} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">University Name</label>
                      <input required type="text" value={newApp.university} onChange={e => setNewApp({...newApp, university: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Course Name</label>
                      <input required type="text" value={newApp.course} onChange={e => setNewApp({...newApp, course: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Intake</label>
                        <input required type="text" value={newApp.intake} onChange={e => setNewApp({...newApp, intake: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Country</label>
                        <select value={newApp.country} onChange={e => setNewApp({...newApp, country: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                          <option value="UK">UK</option>
                          <option value="USA">USA</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button type="button" onClick={() => setIsAppModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Save Application</button>
                    </div>
                  </form>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* VISA TAB */}
        {activeTab === 'Visa' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-8">Visa Application Workflow</h3>
              <div className="relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-700 -z-0"></div>
                <div className="flex justify-between relative z-10">
                  {visaStages.map((stage, index) => (
                    <div key={stage} className="flex flex-col items-center text-center max-w-[100px]">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                        index <= currentVisaStage 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                          : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-400'
                      }`}>
                        {index < currentVisaStage ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        index <= currentVisaStage ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                      }`}>{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 flex justify-center">
                {currentVisaStage < visaStages.length - 1 && (
                  <button 
                    onClick={handleMarkStageComplete}
                    className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200"
                  >
                    Mark Current Stage Complete
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appointment Details</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Visa Appointment Date</label>
                    <input 
                      type="date" 
                      value={visaAppointmentDate}
                      onChange={(e) => {
                        setVisaAppointmentDate(e.target.value);
                        updateGlobalVisaState({ appointmentDate: e.target.value });
                      }}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Visa Result</label>
                    <div className="flex items-center space-x-4">
                      <select 
                        value={visaResult}
                        onChange={(e) => {
                          const result = e.target.value as VisaResult;
                          setVisaResult(result);
                          updateGlobalVisaState({ visaResult: result });
                        }}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      {getVisaResultBadge(visaResult)}
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 flex flex-col items-center justify-center text-center p-8">
                <Plane className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Visa Processing</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  Ensure all documents are verified before booking the final appointment.
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* FINANCE TAB */}
        {activeTab === 'Finance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Fee Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Total Service Fee:</span>
                    <span className="text-gray-900 dark:text-white font-bold">₹{totalServiceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Total Paid:</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">₹{totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Pending Amount:</span>
                    <span className="text-xl font-bold text-orange-500">₹{pendingAmount.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment
                </button>
              </Card>

              <Card className="md:col-span-2 p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment History</h3>
                  <Badge variant="info">{payments.length} Transactions</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mode</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.date}</td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">₹{p.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.mode}</td>
                          <td className="px-6 py-4"><Badge variant="success">{p.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {isPaymentModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsPaymentModalOpen(false)}></div>
                <Card className="relative w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add Payment</h3>
                    <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleAddPayment} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Amount (₹)</label>
                      <input required type="number" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" placeholder="Enter amount" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Payment Mode</label>
                      <select value={newPayment.mode} onChange={e => setNewPayment({...newPayment, mode: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                        <option value="UPI">UPI</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Record Payment</button>
                    </div>
                  </form>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'Counseling' && (() => {
          const pLead = pipelineLeads.find(l => l.studentId === student.id);
          if (!pLead) return (
            <Card className="flex flex-col items-center justify-center py-12 text-center">
              <GitBranch className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Pipeline Record</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This student doesn't have an associated counseling pipeline entry.</p>
            </Card>
          );
          const stageVariant: Record<string, 'info' | 'warning' | 'success' | 'error'> = {
            'New Inquiry': 'info', 'Initial Counseling': 'warning', 'Destination Selection': 'info',
            'Course Shortlisting': 'info', 'University Selection': 'info', 'Application Preparation': 'warning',
            'Application Started': 'warning', 'Converted': 'success', 'Lost': 'error',
          };
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Pipeline Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Current Stage:</span>
                    <Badge variant={stageVariant[pLead.status] || 'info'}>{pLead.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Assigned Counselor:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{pLead.assignedCounsellor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Lead Source:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{pLead.source}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Destination:</span>
                    <Badge variant="info">{pLead.interestedCountry || 'Not Selected'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Target Level:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{pLead.targetLevel}</span>
                  </div>
                  {pLead.budgetRange && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Budget Range:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{pLead.budgetRange}</span>
                    </div>
                  )}
                  {pLead.intakeTarget && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Target Intake:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{pLead.intakeTarget}</span>
                    </div>
                  )}
                  {pLead.academicGoals && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Academic Goals:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{pLead.academicGoals}</span>
                    </div>
                  )}
                </div>
              </Card>
              <div className="space-y-6">
                {pLead.preferredCourses && pLead.preferredCourses.length > 0 && (
                  <Card className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Preferred Courses</h3>
                    <div className="flex flex-wrap gap-2">
                      {pLead.preferredCourses.map(c => (
                        <span key={c} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg font-medium">{c}</span>
                      ))}
                    </div>
                  </Card>
                )}
                {pLead.counselorNotes && pLead.counselorNotes.length > 0 && (
                  <Card className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Counselor Notes</h3>
                    <div className="space-y-2">
                      {pLead.counselorNotes.map((note, i) => (
                        <div key={i} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                          {note}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          );
        })()}

        {activeTab === 'Notes' && (
          <div className="space-y-6 max-w-3xl">
            <Card className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Internal Note</h3>
              <textarea 
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Type your note here..."
                className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white resize-none"
              />
              <div className="flex justify-end">
                <button 
                  onClick={handleAddNote}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </button>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-2">Timeline Notes</h3>
              {notes.length > 0 ? (
                notes.map((note) => (
                  <Card key={note.id} className="p-5 relative group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                          {note.user[0]}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{note.user}</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {note.timestamp}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                      {note.text}
                    </p>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">No notes recorded yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
