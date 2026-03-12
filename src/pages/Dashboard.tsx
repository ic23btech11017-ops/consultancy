import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { 
  Users, 
  UserCheck, 
  FileText, 
  CheckCircle, 
  DollarSign, 
  Clock,
  TrendingUp,
  Globe,
  Calendar,
  ChevronRight,
  GitBranch,
  BookOpen,
  ArrowRight,
  MapPin,
  GraduationCap,
  UserPlus,
  Target,
  Building2,
  Briefcase,
} from 'lucide-react';
import { leads, students, applications, visaCases, payments, walkInEnquiries, commissions } from '../data/mockData';
import { testPrepStudents, batches } from '../data/testPrepData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date('2026-03-12');

  // 1. KPI Calculations
  const kpis = useMemo(() => {
    const totalLeads = leads.length;
    const totalStudents = students.length;
    const activeApps = applications.filter(a => ['Draft', 'Submitted', 'In Review'].includes(a.status)).length;
    const visaApproved = visaCases.filter(v => v.currentStage === 'Visa Approved').length;
    const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);

    return [
      { label: 'Total Leads', value: totalLeads, icon: Users, color: 'blue', path: '/counseling' },
      { label: 'Total Students', value: totalStudents, icon: UserCheck, color: 'emerald', path: '/students' },
      { label: 'Active Applications', value: activeApps, icon: FileText, color: 'indigo', path: '/applications' },
      { label: 'Visa Approved', value: visaApproved, icon: CheckCircle, color: 'purple', path: '/visa-processing' },
      { label: 'Revenue Collected', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'amber', path: '/finance' },
      { label: 'Pending Payments', value: `$${pendingPayments.toLocaleString()}`, icon: Clock, color: 'rose', path: '/finance' },
      { label: 'Walk-ins Today', value: walkInEnquiries.filter(w => w.inquiryDate === '2026-03-12').length, icon: UserPlus, color: 'teal', path: '/test-preparation' },
      { label: 'Lead Conversion', value: `${leads.length > 0 ? Math.round((leads.filter(l => l.status === 'Converted').length / leads.length) * 100) : 0}%`, icon: Target, color: 'cyan', path: '/counseling' },
    ];
  }, []);

  // 2. Application Status Summary
  const appStatusSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  // 3. Visa Stage Distribution
  const visaStageDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    visaCases.forEach(vc => {
      counts[vc.currentStage] = (counts[vc.currentStage] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  // 4. Revenue Summary
  const revenueStats = useMemo(() => {
    const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
    const totalFees = totalPaid + totalPending;
    const collectionRate = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;

    return { totalPaid, totalPending, totalFees, collectionRate };
  }, []);

  // 5. Country Insights
  const countryInsights = useMemo(() => {
    const studentCounts: Record<string, number> = {};
    const revenueByCountry: Record<string, number> = {};

    students.forEach(student => {
      studentCounts[student.country] = (studentCounts[student.country] || 0) + 1;
    });

    payments.forEach(payment => {
      const student = students.find(s => s.id === payment.studentId);
      if (student && payment.status === 'Paid') {
        revenueByCountry[student.country] = (revenueByCountry[student.country] || 0) + payment.amount;
      }
    });

    const countries = Array.from(new Set([...Object.keys(studentCounts), ...Object.keys(revenueByCountry)]));
    return countries.map(country => ({
      name: country,
      students: studentCounts[country] || 0,
      revenue: revenueByCountry[country] || 0
    })).sort((a, b) => b.revenue - a.revenue);
  }, []);

  // 6. Upcoming Interviews
  const upcomingInterviews = useMemo(() => {
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return visaCases
      .filter(vc => {
        if (!vc.appointmentDate) return false;
        const apptDate = new Date(vc.appointmentDate);
        return apptDate >= today && apptDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.appointmentDate!).getTime() - new Date(b.appointmentDate!).getTime());
  }, []);

  // 7. Counseling Pipeline Summary
  const pipelineStats = useMemo(() => {
    const activeStages = ['New Inquiry', 'Initial Counseling', 'Destination Selection', 'Course Shortlisting', 'University Selection', 'Application Preparation', 'Application Started'];
    const stageCounts: Record<string, number> = {};
    leads.forEach(l => { stageCounts[l.status] = (stageCounts[l.status] || 0) + 1; });

    const totalActive = leads.filter(l => activeStages.includes(l.status)).length;
    const converted = leads.filter(l => l.status === 'Converted').length;
    const lost = leads.filter(l => l.status === 'Lost').length;
    const closed = converted + lost;
    const conversionRate = closed > 0 ? Math.round((converted / closed) * 100) : 0;
    const awaitingTest = leads.filter(l => (l.testStatus === 'Not Taken' || l.testStatus === 'Enrolled') && activeStages.includes(l.status)).length;

    const topStages = Object.entries(stageCounts)
      .sort((a, b) => b[1] - a[1]);

    return { totalActive, converted, lost, conversionRate, awaitingTest, topStages, total: leads.length };
  }, []);

  // 8. Test Prep Summary
  const testPrepStats = useMemo(() => {
    const active = testPrepStudents.filter(s => s.status === 'Active').length;
    const completed = testPrepStudents.filter(s => s.status === 'Completed').length;
    const dropped = testPrepStudents.filter(s => s.status === 'Dropped').length;
    const referredToCounseling = testPrepStudents.filter(s => s.referredToCounseling).length;
    const runningBatches = batches.filter(b => b.status === 'Running').length;
    const totalCapacity = batches.filter(b => b.status === 'Running').reduce((s, b) => s + b.capacity, 0);
    const totalEnrolled = batches.filter(b => b.status === 'Running').reduce((s, b) => s + b.studentsEnrolled, 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

    const byTestType: Record<string, number> = {};
    testPrepStudents.forEach(s => { byTestType[s.testType] = (byTestType[s.testType] || 0) + 1; });

    return { active, completed, dropped, referredToCounseling, runningBatches, occupancyRate, totalEnrolled, totalCapacity, byTestType };
  }, []);

  // 9. Top Universities
  const topUniversities = useMemo(() => {
    const uniCounts: Record<string, { apps: number; offers: number; visas: number }> = {};
    applications.forEach(app => {
      if (!uniCounts[app.university]) uniCounts[app.university] = { apps: 0, offers: 0, visas: 0 };
      uniCounts[app.university].apps++;
      if (['Conditional Offer', 'Unconditional Offer', 'Enrolled'].includes(app.status)) uniCounts[app.university].offers++;
    });
    visaCases.forEach(vc => {
      if (vc.university && uniCounts[vc.university] && vc.currentStage === 'Visa Approved') {
        uniCounts[vc.university].visas++;
      }
    });
    return Object.entries(uniCounts)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.apps - a.apps)
      .slice(0, 5);
  }, []);

  // 10. Commission Overview
  const commissionOverview = useMemo(() => {
    const totalExpected = commissions.reduce((s, c) => s + c.expectedAmount, 0);
    const totalReceived = commissions.filter(c => c.status === 'Received').reduce((s, c) => s + c.expectedAmount, 0);
    const pending = commissions.filter(c => c.status === 'Pending').length;
    const received = commissions.filter(c => c.status === 'Received').length;
    return { totalExpected, totalReceived, pending, received, total: commissions.length };
  }, []);

  // 11. Applications by Country
  const appsByCountry = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach(app => {
      counts[app.country] = (counts[app.country] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Executive Dashboard" 
        subtitle="Real-time performance metrics and consultancy overview." 
      />

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <Card 
            key={idx} 
            hoverable
            className="border-none shadow-sm group"
            onClick={() => navigate(kpi.path)}
          >
            <div className="flex flex-col space-y-2">
              <div className={`p-2 w-fit rounded-lg bg-${kpi.color}-50 dark:bg-${kpi.color}-900/20 text-${kpi.color}-600 dark:text-${kpi.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Counseling Pipeline & Test Prep */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Counseling Pipeline */}
        <Card className="border-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <GitBranch className="w-5 h-5 mr-2 text-blue-500" />
              Counseling Pipeline
            </h3>
            <button
              onClick={() => navigate('/counseling')}
              className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              View Pipeline <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Mini KPIs Row */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{pipelineStats.totalActive}</p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-tight">Active</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{pipelineStats.conversionRate}%</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-tight">Conv. Rate</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{pipelineStats.awaitingTest}</p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-tight">Need Test</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{pipelineStats.lost}</p>
              <p className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase tracking-tight">Lost</p>
            </div>
          </div>

          {/* Stage Breakdown */}
          <div className="space-y-2.5">
            {pipelineStats.topStages.map(([stage, count]) => (
              <div key={stage} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">{stage}</span>
                  <span className="text-gray-900 dark:text-white font-bold">{count}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(count / pipelineStats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Leads Quick View */}
          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Latest Leads</p>
            <div className="space-y-2">
              {leads.slice(0, 3).map(lead => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => lead.studentId ? navigate(`/students/${lead.studentId}`) : navigate(`/counseling/${lead.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{lead.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center"><MapPin className="w-2.5 h-2.5 mr-0.5" />{lead.interestedCountry || 'TBD'}</span>
                        <span>•</span>
                        <span>{lead.targetLevel}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                    lead.status === 'Converted' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                    : lead.status === 'Lost' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  }`}>{lead.status}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Test Preparation */}
        <Card className="border-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-amber-500" />
              Test Preparation
            </h3>
            <button
              onClick={() => navigate('/test-preparation')}
              className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1 transition-colors"
            >
              View Module <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Mini KPIs Row */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{testPrepStats.active}</p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-tight">Active</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{testPrepStats.completed}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-tight">Completed</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{testPrepStats.referredToCounseling}</p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-tight">Referred</p>
            </div>
            <div className="p-3 bg-violet-50 dark:bg-violet-900/10 rounded-xl border border-violet-100 dark:border-violet-900/20 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{testPrepStats.runningBatches}</p>
              <p className="text-[10px] text-violet-600 dark:text-violet-400 font-bold uppercase tracking-tight">Running</p>
            </div>
          </div>

          {/* Batch Occupancy */}
          <div className="space-y-2 mb-5">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Batch Occupancy</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{testPrepStats.occupancyRate}%</p>
              </div>
              <p className="text-xs text-gray-400">{testPrepStats.totalEnrolled}/{testPrepStats.totalCapacity} seats filled</p>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                style={{ width: `${testPrepStats.occupancyRate}%` }}
              />
            </div>
          </div>

          {/* Test Type Breakdown */}
          <div className="space-y-2.5 mb-5">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">By Test Type</p>
            {Object.entries(testPrepStats.byTestType).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{type}</span>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg">
                  {count} students
                </span>
              </div>
            ))}
          </div>

          {/* Active Students Quick View */}
          <div className="pt-5 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Active Students</p>
            <div className="space-y-2">
              {testPrepStudents.filter(s => s.status === 'Active').slice(0, 3).map(student => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => navigate(`/students/${student.studentId}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      {student.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{student.studentName}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                        <span>{student.testType}</span>
                        <span>•</span>
                        <span>{student.branch}</span>
                        {student.currentScore && <><span>•</span><span>Score: {student.currentScore}</span></>}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                    student.feeStatus === 'Paid' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                    : student.feeStatus === 'Partial' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  }`}>{student.feeStatus}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Status Summary */}
        <Card className="border-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              Application Status
            </h3>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Live Feed</span>
          </div>
          <div className="space-y-4">
            {appStatusSummary.map(([status, count]) => (
              <div 
                key={status} 
                className="space-y-1.5 cursor-pointer p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => navigate(`/applications?status=${status}`)}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">{status}</span>
                  <span className="text-gray-900 dark:text-white font-bold">{count}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${(count / applications.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Visa Stage Distribution */}
        <Card className="border-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Globe className="w-5 h-5 mr-2 text-purple-500" />
              Visa Pipeline
            </h3>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Distribution</span>
          </div>
          <div className="space-y-4">
            {visaStageDistribution.map(([stage, count]) => (
              <div 
                key={stage} 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-purple-200 dark:hover:border-purple-900/30 transition-all cursor-pointer"
                onClick={() => navigate(`/visa-processing?stage=${stage}`)}
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stage}</span>
                <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-lg">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Revenue Summary */}
        <Card 
          className="border-none shadow-sm flex flex-col cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => navigate('/finance')}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-emerald-500" />
              Revenue Summary
            </h3>
          </div>
          <div className="space-y-6 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">Total Paid</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">${revenueStats.totalPaid.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                <p className="text-[10px] text-rose-600 dark:text-rose-400 uppercase font-bold tracking-wider">Pending</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">${revenueStats.totalPending.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Collection Rate</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{revenueStats.collectionRate.toFixed(1)}%</p>
                </div>
                <p className="text-xs text-gray-400">Target: 95%</p>
              </div>
              <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                  style={{ width: `${revenueStats.collectionRate}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>Total Service Fees</span>
              <span className="text-gray-900 dark:text-white font-bold">${revenueStats.totalFees.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Universities, Applications by Country & Commission Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Universities */}
        <Card className="border-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-violet-500" />
              Top Universities
            </h3>
            <button
              onClick={() => navigate('/reports')}
              className="text-xs font-bold text-violet-500 hover:text-violet-600 flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {topUniversities.map((uni, idx) => (
              <div
                key={uni.name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-[10px] font-bold text-violet-600 dark:text-violet-400">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[140px]">{uni.name}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md">{uni.apps} apps</span>
                  <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md">{uni.offers} offers</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Applications by Country */}
        <Card className="border-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Globe className="w-5 h-5 mr-2 text-cyan-500" />
              Applications by Country
            </h3>
          </div>
          <div className="space-y-3">
            {appsByCountry.map(({ country, count }) => (
              <div key={country} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">{country}</span>
                  <span className="text-gray-900 dark:text-white font-bold">{count}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(count / applications.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Commission Overview */}
        <Card className="border-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-amber-500" />
              Commission Tracker
            </h3>
            <button
              onClick={() => navigate('/finance')}
              className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1 transition-colors"
            >
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">Received</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">${commissionOverview.totalReceived.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20">
              <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold tracking-wider">Expected</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">${commissionOverview.totalExpected.toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Collection Progress</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                  {commissionOverview.totalExpected > 0 ? Math.round((commissionOverview.totalReceived / commissionOverview.totalExpected) * 100) : 0}%
                </p>
              </div>
              <p className="text-xs text-gray-400">{commissionOverview.received}/{commissionOverview.total} received</p>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                style={{ width: `${commissionOverview.totalExpected > 0 ? (commissionOverview.totalReceived / commissionOverview.totalExpected) * 100 : 0}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Insights */}
        <Card className="border-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Globe className="w-5 h-5 mr-2 text-indigo-500" />
              Country Insights
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {countryInsights.map(country => (
              <div 
                key={country.name} 
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 group hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-indigo-200 dark:hover:border-indigo-900/30 transition-all cursor-pointer"
                onClick={() => navigate(`/students?country=${country.name}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-900 dark:text-white">{country.name}</h4>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase">Market</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Students</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{country.students}</p>
                  </div>
                  <div 
                    className="hover:text-indigo-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/finance?country=${country.name}`);
                    }}
                  >
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Revenue</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">${country.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Interviews */}
        <Card className="border-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-rose-500" />
              Upcoming Interviews
            </h3>
            <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">Next 7 Days</span>
          </div>
          <div className="space-y-3">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map(vc => (
                <div 
                  key={vc.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm transition-all group cursor-pointer"
                  onClick={() => navigate(`/students/${vc.studentId}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-500 shadow-sm border border-gray-100 dark:border-gray-700 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{vc.studentName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{vc.country} • {vc.currentStage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {new Date(vc.appointmentDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Appointment</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-300 dark:text-gray-700">
                  <Calendar className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No interviews scheduled for the next 7 days.</p>
              </div>
            )}
          </div>
          {upcomingInterviews.length > 0 && (
            <button 
              className="w-full mt-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center group transition-colors"
              onClick={() => navigate('/visa-processing')}
            >
              View All Appointments
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

