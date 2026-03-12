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
  ChevronRight
} from 'lucide-react';
import { leads, students, applications, visaCases, payments } from '../data/mockData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date('2026-03-01');

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

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Executive Dashboard" 
        subtitle="Real-time performance metrics and consultancy overview." 
      />

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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

