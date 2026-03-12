import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import {
  Plus,
  Search,
  Users,
  BookOpen,
  Layers,
  UserCheck,
  Phone,
  MapPin,
  Calendar,
  ArrowRight,
  X,
} from 'lucide-react';
import {
  walkInEnquiries as INITIAL_WALKINS,
  testPrepStudents as INITIAL_STUDENTS,
  batches as INITIAL_BATCHES,
  type WalkInEnquiry,
  type WalkInStatus,
  type TestPrepStudent,
  type TestPrepStudentStatus,
  type Batch,
  type BatchStatus,
  type TestType,
  type Branch,
  type FeeStatus,
} from '../data/testPrepData';

type Tab = 'walkins' | 'students' | 'batches';

const TEST_TYPES: TestType[] = ['IELTS', 'PTE', 'SAT'];
const BRANCHES: Branch[] = ['Hyderabad', 'Kolkata', 'Delhi'];
const COUNSELORS = ['Ravi Mehta', 'Anjali Rao'];
const TRAINERS = ['Sarah', 'David', 'Emily'];

const TestPreparation: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('walkins');
  const [walkIns, setWalkIns] = useState<WalkInEnquiry[]>(INITIAL_WALKINS);
  const [students, setStudents] = useState<TestPrepStudent[]>(INITIAL_STUDENTS);
  const [batches] = useState<Batch[]>(INITIAL_BATCHES);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showBatchChangeModal, setShowBatchChangeModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Walk-in form state
  const [newWalkIn, setNewWalkIn] = useState<Partial<WalkInEnquiry>>({
    name: '', phone: '', branch: 'Hyderabad', interestedTest: 'IELTS',
    assignedCounselor: 'Ravi Mehta', followUpDate: '', notes: '',
  });

  // Student form state
  const [newStudent, setNewStudent] = useState<Partial<TestPrepStudent>>({
    studentName: '', testType: 'IELTS', branch: 'Hyderabad', batch: '',
    trainer: 'Sarah', startDate: '', endDate: '', feeStatus: 'Pending',
    currentScore: '', targetScore: '',
  });

  // Score update form
  const [scoreValue, setScoreValue] = useState('');

  // Batch change form
  const [newBatchValue, setNewBatchValue] = useState('');

  // --- Dashboard Summary Cards ---
  const summaryCards = useMemo(() => {
    const today = '2026-03-12';
    const walkInsToday = walkIns.filter(w => w.inquiryDate === today).length;
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const batchesRunning = batches.filter(b => b.status === 'Running').length;
    const referredToCounseling = students.filter(s => s.referredToCounseling).length;
    return [
      { label: 'Walk-ins Today', value: walkInsToday, icon: Users, color: 'blue' },
      { label: 'Active Students', value: activeStudents, icon: BookOpen, color: 'emerald' },
      { label: 'Batches Running', value: batchesRunning, icon: Layers, color: 'indigo' },
      { label: 'Referred to Counseling', value: referredToCounseling, icon: UserCheck, color: 'purple' },
    ];
  }, [walkIns, students, batches]);

  // --- Filtered data ---
  const filteredWalkIns = useMemo(() =>
    walkIns.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [walkIns, searchQuery]
  );

  const filteredStudents = useMemo(() =>
    students.filter(s => s.studentName.toLowerCase().includes(searchQuery.toLowerCase())),
    [students, searchQuery]
  );

  const filteredBatches = useMemo(() =>
    batches.filter(b => b.batchName.toLowerCase().includes(searchQuery.toLowerCase())),
    [batches, searchQuery]
  );

  // --- Handlers ---
  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: WalkInEnquiry = {
      ...(newWalkIn as WalkInEnquiry),
      id: 'WI' + String(walkIns.length + 1).padStart(3, '0'),
      inquiryDate: new Date().toISOString().split('T')[0],
      status: 'New Inquiry',
    };
    setWalkIns([entry, ...walkIns]);
    setShowWalkInModal(false);
    setNewWalkIn({ name: '', phone: '', branch: 'Hyderabad', interestedTest: 'IELTS', assignedCounselor: 'Ravi Mehta', followUpDate: '', notes: '' });
  };

  const handleWalkInStatusChange = (id: string, newStatus: WalkInStatus) => {
    setWalkIns(walkIns.map(w => w.id === id ? { ...w, status: newStatus } : w));
  };

  const handleConvertToStudent = (walkIn: WalkInEnquiry) => {
    const matchingBatch = batches.find(b => b.testType === walkIn.interestedTest && b.branch === walkIn.branch && b.status !== 'Completed');
    const student: TestPrepStudent = {
      id: 'TPS' + String(students.length + 1).padStart(3, '0'),
      studentId: '',
      studentName: walkIn.name,
      testType: walkIn.interestedTest,
      branch: walkIn.branch,
      batch: matchingBatch?.batchName || '',
      trainer: matchingBatch?.trainer || '',
      startDate: matchingBatch?.startDate || '',
      endDate: matchingBatch?.endDate || '',
      feeStatus: 'Pending',
      currentScore: '',
      targetScore: '',
      status: 'Active',
      referredToCounseling: false,
    };
    setStudents([student, ...students]);
    handleWalkInStatusChange(walkIn.id, 'Enrolled');
  };

  const handleReferToCounseling = (studentId: string) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, referredToCounseling: true } : s));
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const student: TestPrepStudent = {
      ...(newStudent as TestPrepStudent),
      id: 'TPS' + String(students.length + 1).padStart(3, '0'),
      studentId: '',
      status: 'Active',
      referredToCounseling: false,
    };
    setStudents([student, ...students]);
    setShowStudentModal(false);
    setNewStudent({ studentName: '', testType: 'IELTS', branch: 'Hyderabad', batch: '', trainer: 'Sarah', startDate: '', endDate: '', feeStatus: 'Pending', currentScore: '', targetScore: '' });
  };

  const handleUpdateScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudentId) {
      setStudents(students.map(s => s.id === editingStudentId ? { ...s, currentScore: scoreValue } : s));
    }
    setShowScoreModal(false);
    setScoreValue('');
    setEditingStudentId(null);
  };

  const handleChangeBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudentId) {
      const batch = batches.find(b => b.batchName === newBatchValue);
      setStudents(students.map(s => s.id === editingStudentId ? { ...s, batch: newBatchValue, trainer: batch?.trainer || s.trainer } : s));
    }
    setShowBatchChangeModal(false);
    setNewBatchValue('');
    setEditingStudentId(null);
  };

  const handleStudentStatusChange = (id: string, newStatus: TestPrepStudentStatus) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  // --- Badge helpers ---
  const getWalkInBadge = (status: WalkInStatus) => {
    const map: Record<WalkInStatus, 'info' | 'warning' | 'indigo' | 'success' | 'error'> = {
      'New Inquiry': 'info', 'Demo Scheduled': 'warning', 'Demo Attended': 'indigo',
      'Enrolled': 'success', 'Lost': 'error',
    };
    return <Badge variant={map[status]}>{status}</Badge>;
  };

  const getStudentBadge = (status: TestPrepStudentStatus) => {
    const map: Record<TestPrepStudentStatus, 'success' | 'info' | 'error'> = {
      'Active': 'success', 'Completed': 'info', 'Dropped': 'error',
    };
    return <Badge variant={map[status]}>{status}</Badge>;
  };

  const getBatchBadge = (status: BatchStatus) => {
    const map: Record<BatchStatus, 'warning' | 'success' | 'info'> = {
      'Upcoming': 'warning', 'Running': 'success', 'Completed': 'info',
    };
    return <Badge variant={map[status]}>{status}</Badge>;
  };

  const getFeeBadge = (status: FeeStatus) => {
    const map: Record<FeeStatus, 'success' | 'error' | 'warning'> = {
      'Paid': 'success', 'Pending': 'error', 'Partial': 'warning',
    };
    return <Badge variant={map[status]}>{status}</Badge>;
  };

  // --- Tab config ---
  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'walkins', label: 'Walk-in Enquiries', icon: Users },
    { key: 'students', label: 'Students', icon: BookOpen },
    { key: 'batches', label: 'Batches', icon: Layers },
  ];

  const inputCls = "w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all duration-200";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const thCls = "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader
          title="Test Preparation"
          subtitle="Manage walk-in enquiries, test prep students, and coaching batches."
        />
        {activeTab === 'walkins' && (
          <button onClick={() => setShowWalkInModal(true)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm font-medium text-sm">
            <Plus className="w-4 h-4 mr-2" />Add Enquiry
          </button>
        )}
        {activeTab === 'students' && (
          <button onClick={() => setShowStudentModal(true)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm font-medium text-sm">
            <Plus className="w-4 h-4 mr-2" />Add Student
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${card.color}-100 dark:bg-${card.color}-900/20`}>
              <card.icon className={`w-6 h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="flex items-center bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearchQuery(''); }}
              className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
          />
        </div>
      </div>

      {/* Walk-in Enquiries Tab */}
      {activeTab === 'walkins' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <th className={thCls}>Name</th>
                  <th className={thCls}>Phone</th>
                  <th className={thCls}>Branch</th>
                  <th className={thCls}>Interested Test</th>
                  <th className={thCls}>Inquiry Date</th>
                  <th className={thCls}>Counselor</th>
                  <th className={thCls}>Follow-up</th>
                  <th className={thCls}>Status</th>
                  <th className={`${thCls} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredWalkIns.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{w.name}</div>
                      {w.notes && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{w.notes}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{w.phone}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.branch}</span>
                    </td>
                    <td className="px-6 py-4"><Badge variant={w.interestedTest === 'IELTS' ? 'info' : w.interestedTest === 'PTE' ? 'indigo' : 'warning'}>{w.interestedTest}</Badge></td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{w.inquiryDate}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{w.assignedCounselor}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{w.followUpDate}</td>
                    <td className="px-6 py-4">{getWalkInBadge(w.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        {w.status === 'New Inquiry' && (
                          <button onClick={() => handleWalkInStatusChange(w.id, 'Demo Scheduled')} className="px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200">
                            Schedule Demo
                          </button>
                        )}
                        {(w.status === 'Demo Attended' || w.status === 'Demo Scheduled') && (
                          <button onClick={() => handleConvertToStudent(w)} className="px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200">
                            Convert to Student
                          </button>
                        )}
                        {w.status !== 'Enrolled' && w.status !== 'Lost' && (
                          <button onClick={() => handleWalkInStatusChange(w.id, 'Lost')} className="px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200">
                            Lost
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredWalkIns.length === 0 && (
                  <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No walk-in enquiries found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <th className={thCls}>Student Name</th>
                  <th className={thCls}>Test Type</th>
                  <th className={thCls}>Branch</th>
                  <th className={thCls}>Batch</th>
                  <th className={thCls}>Trainer</th>
                  <th className={thCls}>Start Date</th>
                  <th className={thCls}>End Date</th>
                  <th className={thCls}>Fee</th>
                  <th className={thCls}>Score</th>
                  <th className={thCls}>Status</th>
                  <th className={`${thCls} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredStudents.map((s) => (
                  <tr key={s.id} onClick={() => navigate(s.studentId ? `/students/${s.studentId}` : `/test-preparation/${s.id}`)} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">{s.studentName}</div>
                      {s.referredToCounseling && <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">Referred to Counseling</div>}
                    </td>
                    <td className="px-6 py-4"><Badge variant={s.testType === 'IELTS' ? 'info' : s.testType === 'PTE' ? 'indigo' : 'warning'}>{s.testType}</Badge></td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{s.branch}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{s.batch || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{s.trainer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{s.startDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{s.endDate}</td>
                    <td className="px-6 py-4">{getFeeBadge(s.feeStatus)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {s.currentScore ? <span className="font-medium">{s.currentScore}</span> : '—'}
                      {s.targetScore && <span className="text-xs text-gray-400 ml-1">/ {s.targetScore}</span>}
                    </td>
                    <td className="px-6 py-4">{getStudentBadge(s.status)}</td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        {s.status === 'Active' && (
                          <>
                            <button onClick={() => { setEditingStudentId(s.id); setScoreValue(s.currentScore); setShowScoreModal(true); }} className="px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200">
                              Update Score
                            </button>
                            <button onClick={() => { setEditingStudentId(s.id); setNewBatchValue(s.batch); setShowBatchChangeModal(true); }} className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200">
                              Change Batch
                            </button>
                            {!s.referredToCounseling && (
                              <button onClick={() => handleReferToCounseling(s.id)} className="px-2.5 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200 flex items-center gap-1">
                                <ArrowRight className="w-3 h-3" />Refer to Counseling
                              </button>
                            )}
                            <button onClick={() => handleStudentStatusChange(s.id, 'Completed')} className="px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200">
                              Complete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr><td colSpan={11} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No test prep students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Batches Tab */}
      {activeTab === 'batches' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <th className={thCls}>Batch Name</th>
                  <th className={thCls}>Test Type</th>
                  <th className={thCls}>Branch</th>
                  <th className={thCls}>Trainer</th>
                  <th className={thCls}>Start Date</th>
                  <th className={thCls}>End Date</th>
                  <th className={thCls}>Enrolled</th>
                  <th className={thCls}>Capacity</th>
                  <th className={thCls}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{b.batchName}</div>
                    </td>
                    <td className="px-6 py-4"><Badge variant={b.testType === 'IELTS' ? 'info' : b.testType === 'PTE' ? 'indigo' : 'warning'}>{b.testType}</Badge></td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{b.branch}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{b.trainer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{b.startDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{b.endDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">{b.studentsEnrolled}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <span>{b.capacity}</span>
                        <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${b.studentsEnrolled / b.capacity > 0.8 ? 'bg-red-500' : b.studentsEnrolled / b.capacity > 0.5 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min((b.studentsEnrolled / b.capacity) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getBatchBadge(b.status)}</td>
                  </tr>
                ))}
                {filteredBatches.length === 0 && (
                  <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No batches found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ===== MODALS ===== */}

      {/* Add Walk-in Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Walk-in Enquiry</h3>
              <button onClick={() => setShowWalkInModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddWalkIn} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Name *</label><input required value={newWalkIn.name} onChange={(e) => setNewWalkIn({ ...newWalkIn, name: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Phone *</label><input required value={newWalkIn.phone} onChange={(e) => setNewWalkIn({ ...newWalkIn, phone: e.target.value })} className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Branch</label>
                  <select value={newWalkIn.branch} onChange={(e) => setNewWalkIn({ ...newWalkIn, branch: e.target.value as Branch })} className={inputCls}>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Interested Test</label>
                  <select value={newWalkIn.interestedTest} onChange={(e) => setNewWalkIn({ ...newWalkIn, interestedTest: e.target.value as TestType })} className={inputCls}>
                    {TEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Assigned Counselor</label>
                  <select value={newWalkIn.assignedCounselor} onChange={(e) => setNewWalkIn({ ...newWalkIn, assignedCounselor: e.target.value })} className={inputCls}>
                    {COUNSELORS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>Follow-up Date</label><input type="date" value={newWalkIn.followUpDate} onChange={(e) => setNewWalkIn({ ...newWalkIn, followUpDate: e.target.value })} className={inputCls} /></div>
              </div>
              <div><label className={labelCls}>Notes</label><textarea value={newWalkIn.notes} onChange={(e) => setNewWalkIn({ ...newWalkIn, notes: e.target.value })} rows={3} className={inputCls} /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowWalkInModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">Add Enquiry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Test Prep Student</h3>
              <button onClick={() => setShowStudentModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div><label className={labelCls}>Student Name *</label><input required value={newStudent.studentName} onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })} className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Test Type</label>
                  <select value={newStudent.testType} onChange={(e) => setNewStudent({ ...newStudent, testType: e.target.value as TestType })} className={inputCls}>
                    {TEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Branch</label>
                  <select value={newStudent.branch} onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value as Branch })} className={inputCls}>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Batch</label>
                  <select value={newStudent.batch} onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })} className={inputCls}>
                    <option value="">Select Batch</option>
                    {batches.filter(b => b.status !== 'Completed').map(b => <option key={b.id} value={b.batchName}>{b.batchName}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Trainer</label>
                  <select value={newStudent.trainer} onChange={(e) => setNewStudent({ ...newStudent, trainer: e.target.value })} className={inputCls}>
                    {TRAINERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Start Date</label><input type="date" value={newStudent.startDate} onChange={(e) => setNewStudent({ ...newStudent, startDate: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>End Date</label><input type="date" value={newStudent.endDate} onChange={(e) => setNewStudent({ ...newStudent, endDate: e.target.value })} className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Fee Status</label>
                  <select value={newStudent.feeStatus} onChange={(e) => setNewStudent({ ...newStudent, feeStatus: e.target.value as FeeStatus })} className={inputCls}>
                    <option value="Paid">Paid</option><option value="Pending">Pending</option><option value="Partial">Partial</option>
                  </select>
                </div>
                <div><label className={labelCls}>Current Score</label><input value={newStudent.currentScore} onChange={(e) => setNewStudent({ ...newStudent, currentScore: e.target.value })} className={inputCls} placeholder="Optional" /></div>
                <div><label className={labelCls}>Target Score *</label><input required value={newStudent.targetScore} onChange={(e) => setNewStudent({ ...newStudent, targetScore: e.target.value })} className={inputCls} /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowStudentModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Score Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update Score</h3>
              <button onClick={() => { setShowScoreModal(false); setEditingStudentId(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdateScore} className="p-6 space-y-4">
              <div><label className={labelCls}>New Score</label><input required value={scoreValue} onChange={(e) => setScoreValue(e.target.value)} className={inputCls} placeholder="e.g., 7.5 or 1450" /></div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowScoreModal(false); setEditingStudentId(null); }} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Batch Modal */}
      {showBatchChangeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Batch</h3>
              <button onClick={() => { setShowBatchChangeModal(false); setEditingStudentId(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleChangeBatch} className="p-6 space-y-4">
              <div>
                <label className={labelCls}>New Batch</label>
                <select required value={newBatchValue} onChange={(e) => setNewBatchValue(e.target.value)} className={inputCls}>
                  <option value="">Select Batch</option>
                  {batches.filter(b => b.status !== 'Completed').map(b => <option key={b.id} value={b.batchName}>{b.batchName}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowBatchChangeModal(false); setEditingStudentId(null); }} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">Change</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPreparation;
