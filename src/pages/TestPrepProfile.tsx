import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import {
  ArrowLeft,
  User,
  BookOpen,
  Target,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Layers,
  UserCheck,
  AlertCircle,
  TrendingUp,
  History,
  Plus,
  X,
  ArrowRight,
  DollarSign,
  StickyNote,
  Trash2,
} from 'lucide-react';
import {
  testPrepStudents,
  batches,
  type TestPrepStudent,
  type TestPrepStudentStatus,
  type FeeStatus,
} from '../data/testPrepData';
import { students as centralStudents, applications, visaCases } from '../data/mockData';

interface ScoreEntry {
  id: string;
  date: string;
  score: string;
  notes: string;
}

interface Note {
  id: string;
  text: string;
  timestamp: string;
  user: string;
}

const TestPrepProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  const initialStudent = testPrepStudents.find(s => s.id === id);
  const [student, setStudent] = useState<TestPrepStudent | null>(initialStudent ? { ...initialStudent } : null);

  // Score history
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>(
    initialStudent?.currentScore
      ? [{ id: '1', date: '2026-03-01', score: initialStudent.currentScore, notes: 'Latest mock test' }]
      : []
  );
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [newScore, setNewScore] = useState({ score: '', notes: '' });

  // Batch change
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [newBatchValue, setNewBatchValue] = useState('');

  // Notes
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', text: 'Student is progressing well in reading and writing sections.', timestamp: '2026-03-10 10:00 AM', user: 'Admin' },
    { id: '2', text: 'Needs more practice on listening. Suggested additional material.', timestamp: '2026-03-05 02:30 PM', user: 'Admin' },
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  if (!student) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/test-preparation')}
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Test Preparation
        </button>
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">The test prep student with ID {id} could not be found.</p>
          <button
            onClick={() => navigate('/test-preparation')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
          >
            Return to Test Preparation
          </button>
        </Card>
      </div>
    );
  }

  // Cross-module data
  const centralStudent = student.studentId ? centralStudents.find(s => s.id === student.studentId) : null;
  const studentApps = student.studentId ? applications.filter(a => a.studentId === student.studentId) : [];
  const studentVisa = student.studentId ? visaCases.find(v => v.studentId === student.studentId) : null;
  const currentBatch = batches.find(b => b.batchName === student.batch);

  // Handlers
  const handleAddScore = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: ScoreEntry = {
      id: String(scoreHistory.length + 1),
      date: new Date().toISOString().split('T')[0],
      score: newScore.score,
      notes: newScore.notes,
    };
    setScoreHistory([entry, ...scoreHistory]);
    setStudent({ ...student, currentScore: newScore.score });
    setShowScoreModal(false);
    setNewScore({ score: '', notes: '' });
  };

  const handleChangeBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = batches.find(b => b.batchName === newBatchValue);
    setStudent({
      ...student,
      batch: newBatchValue,
      trainer: batch?.trainer || student.trainer,
    });
    setShowBatchModal(false);
    setNewBatchValue('');
  };

  const handleReferToCounseling = () => {
    setStudent({ ...student, referredToCounseling: true });
  };

  const handleStatusChange = (newStatus: TestPrepStudentStatus) => {
    setStudent({ ...student, status: newStatus });
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const note: Note = {
      id: String(notes.length + 1),
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

  const getStatusBadge = (status: TestPrepStudentStatus) => {
    const map: Record<TestPrepStudentStatus, 'success' | 'info' | 'error'> = {
      Active: 'success', Completed: 'info', Dropped: 'error',
    };
    return <Badge variant={map[status]}>{status}</Badge>;
  };

  const getFeeBadge = (status: FeeStatus) => {
    const map: Record<FeeStatus, 'success' | 'error' | 'warning'> = {
      Paid: 'success', Pending: 'error', Partial: 'warning',
    };
    return <Badge variant={map[status]}>{status}</Badge>;
  };

  const tabs = [
    { name: 'Overview', icon: User },
    { name: 'Scores', icon: TrendingUp },
    { name: 'Cross-Module', icon: Layers },
    { name: 'Notes', icon: StickyNote },
  ];

  const inputCls = "w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all duration-200";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/test-preparation')}
        className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Test Preparation
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">
            {student.studentName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.studentName}</h1>
              <div className="relative group/status">
                <select
                  value={student.status}
                  onChange={(e) => handleStatusChange(e.target.value as TestPrepStudentStatus)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Dropped">Dropped</option>
                </select>
                {getStatusBadge(student.status)}
              </div>
              <Badge variant={student.testType === 'IELTS' ? 'info' : student.testType === 'PTE' ? 'indigo' : 'warning'}>{student.testType}</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {student.id} &bull; {student.branch} Branch</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {student.status === 'Active' && !student.referredToCounseling && (
            <button onClick={handleReferToCounseling} className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors duration-200">
              <ArrowRight className="w-4 h-4 mr-2" />Refer to Counseling
            </button>
          )}
          {student.referredToCounseling && (
            <Badge variant="indigo">Referred to Counseling</Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
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
            {/* Personal & Course Info */}
            <Card className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Student Information</h3>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">Full Name:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{student.studentName}</span>
                </div>
                <div className="flex items-center text-sm">
                  <BookOpen className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">Test Type:</span>
                  <Badge variant={student.testType === 'IELTS' ? 'info' : student.testType === 'PTE' ? 'indigo' : 'warning'}>{student.testType}</Badge>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">Branch:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{student.branch}</span>
                </div>
                <div className="flex items-center text-sm">
                  <UserCheck className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">Trainer:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{student.trainer}</span>
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">Fee Status:</span>
                  {getFeeBadge(student.feeStatus)}
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
                  <span className="text-gray-900 dark:text-white font-medium">{student.batch || '—'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">Start Date:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{student.startDate || '—'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">End Date:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{student.endDate || '—'}</span>
                </div>
                {currentBatch && (
                  <>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400 w-36 ml-7">Batch Capacity:</span>
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
              {student.status === 'Active' && (
                <button onClick={() => { setNewBatchValue(student.batch); setShowBatchModal(true); }} className="w-full mt-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors duration-200">
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
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{student.currentScore || '—'}</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Target</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{student.targetScore || '—'}</p>
                  </div>
                </div>
                {student.currentScore && student.targetScore && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.min(Math.round((parseFloat(student.currentScore) / parseFloat(student.targetScore)) * 100), 100)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${parseFloat(student.currentScore) >= parseFloat(student.targetScore) ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min((parseFloat(student.currentScore) / parseFloat(student.targetScore)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                {student.status === 'Active' && (
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
                  <div className={`text-2xl font-bold ${student.referredToCounseling ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                    {student.referredToCounseling ? 'Yes' : 'No'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Counseling Referral</div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* SCORES TAB */}
        {activeTab === 'Scores' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Score History</h3>
              {student.status === 'Active' && (
                <button onClick={() => setShowScoreModal(true)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm font-medium text-sm">
                  <Plus className="w-4 h-4 mr-2" />Add Score
                </button>
              )}
            </div>

            {/* Score progress card */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Test Type</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.testType}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current → Target</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {student.currentScore || '—'} <ArrowRight className="w-4 h-4 inline text-gray-400" /> {student.targetScore || '—'}
                  </p>
                </div>
              </div>
              {student.currentScore && student.targetScore && (
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${parseFloat(student.currentScore) >= parseFloat(student.targetScore) ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min((parseFloat(student.currentScore) / parseFloat(student.targetScore)) * 100, 100)}%` }}
                  />
                </div>
              )}
            </Card>

            {/* Score history timeline */}
            <Card className="p-0 overflow-hidden">
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
            </Card>
          </div>
        )}

        {/* CROSS-MODULE TAB */}
        {activeTab === 'Cross-Module' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cross-Module Student Record</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This shows how {student.studentName} exists across different modules in the system, linked through <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">studentId</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Test Prep Module */}
              <Card className="space-y-4 border-l-4 border-l-blue-500">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">Test Prep Module</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">{student.testType} Batch:</span><span className="text-gray-900 dark:text-white font-medium">{student.batch || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Score:</span><span className="text-gray-900 dark:text-white font-medium">{student.currentScore || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Status:</span>{getStatusBadge(student.status)}</div>
                </div>
              </Card>

              {/* Counseling Module */}
              <Card className={`space-y-4 border-l-4 ${student.referredToCounseling ? 'border-l-purple-500' : 'border-l-gray-300 dark:border-l-gray-600'}`}>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-500" />
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">Counseling Module</h4>
                </div>
                {student.referredToCounseling ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Status:</span><Badge variant="success">Referred</Badge></div>
                    {centralStudent && (
                      <>
                        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Counsellor:</span><span className="text-gray-900 dark:text-white font-medium">{centralStudent.assignedCounsellor}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Destination:</span><span className="text-gray-900 dark:text-white font-medium">{centralStudent.country}</span></div>
                      </>
                    )}
                    {!centralStudent && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Referral sent. Awaiting counselor assignment.</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500">Not yet referred to counseling.</p>
                )}
              </Card>

              {/* Applications Module */}
              <Card className={`space-y-4 border-l-4 ${studentApps.length > 0 ? 'border-l-emerald-500' : 'border-l-gray-300 dark:border-l-gray-600'}`}>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-500" />
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">Applications Module</h4>
                </div>
                {studentApps.length > 0 ? (
                  <div className="space-y-3">
                    {studentApps.map(app => (
                      <div key={app.id} className="text-sm border border-gray-100 dark:border-gray-700 rounded-lg p-3 space-y-1">
                        <div className="flex justify-between"><span className="font-medium text-gray-900 dark:text-white">{app.university}</span><Badge variant={app.status === 'Submitted' ? 'info' : app.status === 'Offer Received' ? 'success' : 'warning'}>{app.status}</Badge></div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{app.course} &bull; {app.country}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500">No university applications yet.</p>
                )}
              </Card>

              {/* Visa Module */}
              <Card className={`space-y-4 border-l-4 ${studentVisa ? 'border-l-indigo-500' : 'border-l-gray-300 dark:border-l-gray-600'}`}>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500" />
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">Visa Module</h4>
                </div>
                {studentVisa ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Country:</span><span className="text-gray-900 dark:text-white font-medium">{studentVisa.country}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Stage:</span><Badge variant="indigo">{studentVisa.currentStage}</Badge></div>
                    {studentVisa.appointmentDate && (
                      <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Appointment:</span><span className="text-gray-900 dark:text-white font-medium">{studentVisa.appointmentDate}</span></div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500">No visa case yet.</p>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'Notes' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Internal Notes</h3>
            <Card>
              <div className="flex gap-3">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add a note about this student..."
                  rows={3}
                  className={inputCls}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNoteText.trim()}
                  className="self-end px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
            </Card>
            <div className="space-y-3">
              {notes.map((note) => (
                <Card key={note.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{note.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{note.user} &bull; {note.timestamp}</p>
                  </div>
                  <button onClick={() => handleDeleteNote(note.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Card>
              ))}
              {notes.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No notes yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== MODALS ===== */}

      {/* Add Score Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Score</h3>
              <button onClick={() => setShowScoreModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddScore} className="p-6 space-y-4">
              <div><label className={labelCls}>Score *</label><input required value={newScore.score} onChange={(e) => setNewScore({ ...newScore, score: e.target.value })} className={inputCls} placeholder="e.g., 7.5 or 1450" /></div>
              <div><label className={labelCls}>Notes</label><input value={newScore.notes} onChange={(e) => setNewScore({ ...newScore, notes: e.target.value })} className={inputCls} placeholder="Mock test, official test, etc." /></div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowScoreModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Batch</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
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
                <button type="button" onClick={() => setShowBatchModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">Change</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPrepProfile;
