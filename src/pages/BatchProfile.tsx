import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  GraduationCap,
  Users,
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronRight,
  BookOpen,
  Target,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { batches, testPrepStudents } from '../data/mockData';

const examInfo: Record<string, { description: string; format: string; sections: string[]; duration: string; scoring: string }> = {
  IELTS: {
    description: 'The International English Language Testing System (IELTS) measures English language proficiency for study, work, and migration purposes.',
    format: 'Paper-based or Computer-delivered',
    sections: ['Listening (30 min)', 'Reading (60 min)', 'Writing (60 min)', 'Speaking (11–14 min)'],
    duration: '2 hours 45 minutes',
    scoring: 'Band score 1–9 (half-band increments)',
  },
  PTE: {
    description: 'Pearson Test of English Academic (PTE) is a computer-based English language test for study abroad and immigration.',
    format: 'Computer-based, AI-scored',
    sections: ['Speaking & Writing (54–67 min)', 'Reading (29–30 min)', 'Listening (30–43 min)'],
    duration: 'Approximately 2 hours',
    scoring: 'Score range 10–90',
  },
  SAT: {
    description: 'The Scholastic Assessment Test (SAT) is a standardized test for college admissions in the United States.',
    format: 'Digital adaptive test',
    sections: ['Reading & Writing (64 min)', 'Math (70 min)'],
    duration: '2 hours 14 minutes',
    scoring: 'Total score 400–1600',
  },
};

const BatchProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const batch = useMemo(() => batches.find(b => b.id === id), [id]);

  const enrolledStudents = useMemo(() => {
    if (!batch) return [];
    return testPrepStudents.filter(s => s.batch === batch.batchName);
  }, [batch]);

  if (!batch) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full text-red-600">
          <BookOpen size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Batch Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400">The batch you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/test-preparation')}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Test Preparation
        </button>
      </div>
    );
  }

  const exam = examInfo[batch.testType];
  const occupancy = batch.capacity > 0 ? Math.round((batch.studentsEnrolled / batch.capacity) * 100) : 0;
  const startDate = new Date(batch.startDate);
  const endDate = new Date(batch.endDate);
  const durationWeeks = Math.round((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const today = new Date('2026-03-12');
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/test-preparation')}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{batch.batchName}</h1>
              <Badge variant={batch.status === 'Running' ? 'success' : batch.status === 'Upcoming' ? 'info' : 'default'}>
                {batch.status}
              </Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 flex items-center mt-1 gap-3 text-sm">
              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" />{batch.branch}</span>
              <span>•</span>
              <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" />Trainer: {batch.trainer}</span>
              <span>•</span>
              <span>ID: {batch.id}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-none shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Test Type</p>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            <p className="text-xl font-bold text-gray-900 dark:text-white">{batch.testType}</p>
          </div>
        </Card>
        <Card className="border-none shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Enrolled / Capacity</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{batch.studentsEnrolled} / {batch.capacity}</p>
          <div className="mt-2 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${occupancy > 80 ? 'bg-red-500' : occupancy > 50 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
              style={{ width: `${occupancy}%` }}
            />
          </div>
        </Card>
        <Card className="border-none shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Duration</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{durationWeeks} weeks</p>
        </Card>
        <Card className="border-none shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Days Remaining</p>
          <p className={`text-xl font-bold ${daysRemaining <= 7 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
            {batch.status === 'Completed' ? 'Finished' : `${daysRemaining} days`}
          </p>
        </Card>
        <Card className="border-none shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Occupancy</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{occupancy}%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam Information */}
        <Card className="border-none shadow-sm lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{batch.testType} Exam Details</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{exam.description}</p>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Format</p>
              <p className="text-sm text-gray-900 dark:text-white font-medium">{exam.format}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Duration</p>
              <p className="text-sm text-gray-900 dark:text-white font-medium">{exam.duration}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Scoring</p>
              <p className="text-sm text-gray-900 dark:text-white font-medium">{exam.scoring}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Sections</p>
              <div className="space-y-1.5">
                {exam.sections.map(section => (
                  <div key={section} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{section}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Schedule & Batch Info */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Schedule & Batch Info</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
              <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold tracking-wider">Start Date</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/20">
              <p className="text-[10px] text-purple-600 dark:text-purple-400 uppercase font-bold tracking-wider">End Date</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                {endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{batch.trainer}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight">Trainer</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{batch.branch}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight">Branch</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{batch.testType}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight">Exam</p>
            </div>
          </div>

          {/* Upcoming Exam Date */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Upcoming Exam Window</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {batch.status === 'Completed' ? 'Batch has concluded — students should have already taken the exam.' : `Students are expected to sit for the ${batch.testType} exam around this period.`}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enrolled Students */}
      <Card className="p-0 overflow-hidden border-none shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Enrolled Students
          </h3>
          <Badge variant="info">{enrolledStudents.length} Students</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fee Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Referred</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {enrolledStudents.map(student => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/students/${student.studentId}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        {student.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{student.studentName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {student.currentScore || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {student.targetScore}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={student.feeStatus === 'Paid' ? 'success' : student.feeStatus === 'Partial' ? 'warning' : 'danger'}>
                      {student.feeStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={student.status === 'Active' ? 'info' : student.status === 'Completed' ? 'success' : 'danger'}>
                      {student.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {student.referredToCounseling ? (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                        <AlertCircle className="w-3.5 h-3.5" /> No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/students/${student.studentId}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all inline-block"
                      onClick={e => e.stopPropagation()}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {enrolledStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No students enrolled in this batch yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default BatchProfile;
