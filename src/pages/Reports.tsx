import React, { useMemo, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Globe, 
  DollarSign, 
  Users,
  ArrowUpRight,
  Calendar,
  GraduationCap,
  Building2,
  Briefcase,
  Megaphone,
  ClipboardList,
  Filter,
  Handshake,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { 
  students, 
  applications, 
  visaCases, 
  payments,
  leads,
  partners,
  commissions,
  campaigns,
  walkInEnquiries,
  testPrepStudents,
  batches,
} from '../data/mockData';

type ReportTab = 'walkin' | 'department' | 'country' | 'university' | 'intake' | 'yearly' | 'commission' | 'leadsource' | 'partner';

const tabs: { key: ReportTab; label: string; icon: React.ElementType }[] = [
  { key: 'walkin', label: 'Walk-in', icon: ClipboardList },
  { key: 'department', label: 'Department', icon: Building2 },
  { key: 'country', label: 'Country', icon: Globe },
  { key: 'university', label: 'University', icon: GraduationCap },
  { key: 'intake', label: 'Intake', icon: Calendar },
  { key: 'yearly', label: 'Yearly', icon: BarChart3 },
  { key: 'commission', label: 'Commission', icon: DollarSign },
  { key: 'leadsource', label: 'Lead Source', icon: Megaphone },
  { key: 'partner', label: 'Partner', icon: Handshake },
];

// ── Helper: progress bar ──
const ProgressBar: React.FC<{ value: number; max: number; color?: string }> = ({ value, max, color = 'bg-blue-500' }) => (
  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
    <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }} />
  </div>
);

// ── Helper: stat card ──
const StatCard: React.FC<{ label: string; value: string | number; icon: React.ElementType; color: string; bg: string; sub?: string }> = ({ label, value, icon: Icon, color, bg, sub }) => (
  <Card className="border-none shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg ${bg} ${color}`}><Icon size={20} /></div>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
    {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
  </Card>
);

// ═══════════════════════════════════════════
// Walk-in Reports Tab
// ═══════════════════════════════════════════
const WalkInReports: React.FC = () => {
  const [branchFilter, setBranchFilter] = useState('All');
  const today = '2026-03-12';

  const data = useMemo(() => {
    const filtered = branchFilter === 'All' ? walkInEnquiries : walkInEnquiries.filter(w => w.branch === branchFilter);
    const walkinsToday = filtered.filter(w => w.inquiryDate === today).length;
    const walkinsThisWeek = filtered.filter(w => {
      const d = new Date(w.inquiryDate);
      const t = new Date(today);
      const weekStart = new Date(t);
      weekStart.setDate(t.getDate() - t.getDay());
      return d >= weekStart && d <= t;
    }).length;
    const demoBooked = filtered.filter(w => w.status === 'Demo Scheduled' || w.status === 'Demo Attended').length;
    const enrolled = filtered.filter(w => w.status === 'Enrolled').length;
    const conversionRate = filtered.length > 0 ? ((enrolled / filtered.length) * 100).toFixed(1) : '0.0';

    // By branch breakdown
    const byBranch: Record<string, { total: number; demoBooked: number; enrolled: number }> = {};
    walkInEnquiries.forEach(w => {
      if (!byBranch[w.branch]) byBranch[w.branch] = { total: 0, demoBooked: 0, enrolled: 0 };
      byBranch[w.branch].total++;
      if (w.status === 'Demo Scheduled' || w.status === 'Demo Attended') byBranch[w.branch].demoBooked++;
      if (w.status === 'Enrolled') byBranch[w.branch].enrolled++;
    });

    return { walkinsToday, walkinsThisWeek, demoBooked, enrolled, conversionRate, filtered, byBranch };
  }, [branchFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daily Walk-in Report</h3>
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="bg-transparent text-sm focus:outline-none dark:text-white cursor-pointer">
            <option value="All">All Branches</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Walk-ins Today" value={data.walkinsToday} icon={Users} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard label="This Week" value={data.walkinsThisWeek} icon={Calendar} color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/20" />
        <StatCard label="Demo Booked" value={data.demoBooked} icon={ClipboardList} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" />
        <StatCard label="Enrolled" value={data.enrolled} icon={CheckCircle2} color="text-green-600" bg="bg-green-50 dark:bg-green-900/20" />
        <StatCard label="Conversion Rate" value={`${data.conversionRate}%`} icon={TrendingUp} color="text-purple-600" bg="bg-purple-50 dark:bg-purple-900/20" />
      </div>

      {/* Branch breakdown table */}
      <Card className="p-0 overflow-hidden border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Walk-ins</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Demo Booked</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enrolled</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {Object.entries(data.byBranch).map(([branch, stats]: [string, { total: number; demoBooked: number; enrolled: number }]) => (
                <tr key={branch} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{branch}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{stats.total}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{stats.demoBooked}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{stats.enrolled}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{stats.total > 0 ? ((stats.enrolled / stats.total) * 100).toFixed(1) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail table */}
      <Card className="p-0 overflow-hidden border-none shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Walk-in Details</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Branch</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Test</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Counselor</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.filtered.map(w => (
                <tr key={w.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-300">{w.inquiryDate}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">{w.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-300">{w.branch}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-300">{w.interestedTest}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-300">{w.assignedCounselor}</td>
                  <td className="px-6 py-3">
                    <Badge variant={w.status === 'Enrolled' ? 'success' : w.status === 'Lost' ? 'error' : w.status === 'New Inquiry' ? 'info' : 'warning'}>{w.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════
// Department Reports Tab
// ═══════════════════════════════════════════
const DepartmentReports: React.FC = () => {
  const data = useMemo(() => {
    const paidRevenue = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);

    const departments = [
      {
        name: 'Student Services (Test Prep)',
        active: testPrepStudents.filter(s => s.status === 'Active').length,
        completed: testPrepStudents.filter(s => s.status === 'Completed').length,
        revenue: testPrepStudents.filter(s => s.feeStatus === 'Paid').length * 3000, // approx per student
      },
      {
        name: 'Counseling',
        active: leads.filter(l => !['Converted', 'Lost'].includes(l.status)).length,
        completed: leads.filter(l => l.status === 'Converted').length,
        revenue: 0,
      },
      {
        name: 'Applications',
        active: applications.filter(a => ['Draft', 'Submitted'].includes(a.status)).length,
        completed: applications.filter(a => ['Offer Received', 'Accepted'].includes(a.status)).length,
        revenue: 0,
      },
      {
        name: 'Visa Processing',
        active: visaCases.filter(v => v.currentStage !== 'Visa Approved' && v.currentStage !== 'Visa Rejected').length,
        completed: visaCases.filter(v => v.currentStage === 'Visa Approved').length,
        revenue: 0,
      },
      {
        name: 'Marketing',
        active: campaigns.length,
        completed: campaigns.filter(c => new Date(c.endDate) < new Date('2026-03-12')).length,
        revenue: 0,
      },
      {
        name: 'Finance',
        active: payments.filter(p => p.status === 'Pending').length,
        completed: payments.filter(p => p.status === 'Paid').length,
        revenue: paidRevenue,
      },
    ];

    return departments;
  }, []);

  const maxActive = Math.max(...data.map(d => d.active), 1);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Department Performance</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(dept => (
          <Card key={dept.name} className="border-none shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">{dept.name}</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Active Cases</span>
                <span className="font-bold text-gray-900 dark:text-white">{dept.active}</span>
              </div>
              <ProgressBar value={dept.active} max={maxActive} color="bg-blue-500" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Completed</span>
                <span className="font-bold text-green-600">{dept.completed}</span>
              </div>
              {dept.revenue > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Revenue</span>
                  <span className="font-bold text-indigo-600">${dept.revenue.toLocaleString()}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Department summary table */}
      <Card className="p-0 overflow-hidden border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Cases</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.map(dept => (
                <tr key={dept.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{dept.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{dept.active}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-medium">{dept.completed}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{dept.revenue > 0 ? `$${dept.revenue.toLocaleString()}` : '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════
// Country Reports Tab
// ═══════════════════════════════════════════
const CountryReports: React.FC = () => {
  const data = useMemo(() => {
    const countryMap: Record<string, { applications: number; offers: number; visas: number; rejected: number }> = {};
    const targetCountries = ['Australia', 'UK', 'Canada', 'USA', 'New Zealand', 'Ireland', 'Germany'];
    targetCountries.forEach(c => { countryMap[c] = { applications: 0, offers: 0, visas: 0, rejected: 0 }; });

    applications.forEach(app => {
      const c = app.country;
      if (!countryMap[c]) countryMap[c] = { applications: 0, offers: 0, visas: 0, rejected: 0 };
      countryMap[c].applications++;
      if (app.status === 'Offer Received' || app.status === 'Accepted') countryMap[c].offers++;
    });

    visaCases.forEach(vc => {
      const c = vc.country;
      if (!countryMap[c]) countryMap[c] = { applications: 0, offers: 0, visas: 0, rejected: 0 };
      if (vc.currentStage === 'Visa Approved') countryMap[c].visas++;
      if (vc.currentStage === 'Visa Rejected') countryMap[c].rejected++;
    });

    return Object.entries(countryMap)
      .map(([country, stats]) => ({
        country,
        ...stats,
        successRate: stats.applications > 0 ? ((stats.visas / stats.applications) * 100).toFixed(1) : '0.0',
      }))
      .sort((a, b) => b.applications - a.applications);
  }, []);

  const maxApps = Math.max(...data.map(d => d.applications), 1);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Country-wise Performance</h3>

      {/* Country cards for top performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.filter(d => d.applications > 0).map(d => (
          <Card key={d.country} className="border-none shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">{d.country}</h4>
              <Badge variant={Number(d.successRate) >= 50 ? 'success' : Number(d.successRate) > 0 ? 'warning' : 'info'}>{d.successRate}%</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Applications</span><span className="font-bold text-gray-900 dark:text-white text-lg">{d.applications}</span></div>
              <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Offers</span><span className="font-bold text-green-600 text-lg">{d.offers}</span></div>
              <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Visas</span><span className="font-bold text-blue-600 text-lg">{d.visas}</span></div>
              <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Success Rate</span><span className="font-bold text-purple-600 text-lg">{d.successRate}%</span></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Full table */}
      <Card className="p-0 overflow-hidden border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Country</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applications</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Offers</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Visas</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.map(d => (
                <tr key={d.country} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{d.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{d.applications}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-medium">{d.offers}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-medium">{d.visas}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white w-12">{d.successRate}%</span>
                      <div className="flex-1"><ProgressBar value={Number(d.successRate)} max={100} color="bg-purple-500" /></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════
// University Reports Tab
// ═══════════════════════════════════════════
const UniversityReports: React.FC = () => {
  const data = useMemo(() => {
    const uniMap: Record<string, { applications: number; offers: number; enrollments: number; visas: number }> = {};

    applications.forEach(app => {
      if (!uniMap[app.university]) uniMap[app.university] = { applications: 0, offers: 0, enrollments: 0, visas: 0 };
      uniMap[app.university].applications++;
      if (app.status === 'Offer Received') uniMap[app.university].offers++;
      if (app.status === 'Accepted') { uniMap[app.university].offers++; uniMap[app.university].enrollments++; }
    });

    visaCases.forEach(vc => {
      if (vc.university && uniMap[vc.university] && vc.currentStage === 'Visa Approved') {
        uniMap[vc.university].visas++;
      }
    });

    return Object.entries(uniMap)
      .map(([university, stats]) => ({ university, ...stats }))
      .sort((a, b) => b.applications - a.applications);
  }, []);

  const maxApps = Math.max(...data.map(d => d.applications), 1);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">University-wise Performance</h3>

      {/* Bar chart representation */}
      <Card className="border-none shadow-sm">
        <div className="space-y-5">
          {data.map(d => (
            <div key={d.university} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">{d.university}</span>
                <span className="font-bold text-gray-900 dark:text-white">{d.applications} apps</span>
              </div>
              <ProgressBar value={d.applications} max={maxApps} color="bg-indigo-500" />
            </div>
          ))}
        </div>
      </Card>

      {/* Detail table */}
      <Card className="p-0 overflow-hidden border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">University</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applications</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Offers</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enrollments</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Visas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.map(d => (
                <tr key={d.university} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{d.university}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{d.applications}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-medium">{d.offers}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-medium">{d.enrollments}</td>
                  <td className="px-6 py-4 text-sm text-purple-600 font-medium">{d.visas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════
// Intake Reports Tab
// ═══════════════════════════════════════════
const IntakeReports: React.FC = () => {
  const data = useMemo(() => {
    const intakeMap: Record<string, { applications: number; visas: number; revenue: number }> = {};

    applications.forEach(app => {
      const intake = app.intake;
      if (!intakeMap[intake]) intakeMap[intake] = { applications: 0, visas: 0, revenue: 0 };
      intakeMap[intake].applications++;
    });

    visaCases.forEach(vc => {
      if (vc.intake && intakeMap[vc.intake] && vc.currentStage === 'Visa Approved') {
        intakeMap[vc.intake].visas++;
      }
    });

    // Revenue by intake: find student's application intake, sum paid payments
    payments.filter(p => p.status === 'Paid').forEach(p => {
      const app = applications.find(a => a.studentId === p.studentId);
      if (app && intakeMap[app.intake]) {
        intakeMap[app.intake].revenue += p.amount;
      }
    });

    return Object.entries(intakeMap)
      .map(([intake, stats]) => ({ intake, ...stats }))
      .sort((a, b) => b.applications - a.applications);
  }, []);

  const maxApps = Math.max(...data.map(d => d.applications), 1);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Intake-wise Performance</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(d => (
          <Card key={d.intake} className="border-none shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{d.intake}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Applications</span><span className="font-bold text-gray-900 dark:text-white">{d.applications}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Visas Approved</span><span className="font-bold text-green-600">{d.visas}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Revenue</span><span className="font-bold text-indigo-600">${d.revenue.toLocaleString()}</span></div>
            </div>
            <div className="mt-3"><ProgressBar value={d.applications} max={maxApps} color="bg-amber-500" /></div>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Intake</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applications</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Visas</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.map(d => (
                <tr key={d.intake} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{d.intake}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{d.applications}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-medium">{d.visas}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-indigo-600">${d.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════
// Yearly Reports Tab
// ═══════════════════════════════════════════
const YearlyReports: React.FC = () => {
  const data = useMemo(() => {
    const yearMap: Record<number, { applications: number; visas: number; revenue: number }> = {};

    applications.forEach(app => {
      const y = app.year;
      if (!yearMap[y]) yearMap[y] = { applications: 0, visas: 0, revenue: 0 };
      yearMap[y].applications++;
    });

    visaCases.forEach(vc => {
      // Derive year from intake or linked application
      const app = applications.find(a => a.studentId === vc.studentId);
      const y = app?.year;
      if (y && yearMap[y] && vc.currentStage === 'Visa Approved') yearMap[y].visas++;
    });

    payments.filter(p => p.status === 'Paid').forEach(p => {
      const app = applications.find(a => a.studentId === p.studentId);
      const y = app?.year;
      if (y && yearMap[y]) yearMap[y].revenue += p.amount;
    });

    return Object.entries(yearMap)
      .map(([year, stats]) => ({ year: Number(year), ...stats }))
      .sort((a, b) => b.year - a.year);
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Year-wise Performance</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map(d => (
          <Card key={d.year} className="border-none shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-2xl font-black text-gray-900 dark:text-white">{d.year}</h4>
              <Badge variant="info">Annual</Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Applications</span><span className="font-bold text-gray-900 dark:text-white">{d.applications}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Visas Approved</span><span className="font-bold text-green-600">{d.visas}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Revenue</span><span className="font-bold text-indigo-600">${d.revenue.toLocaleString()}</span></div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applications</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Visas</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.map(d => (
                <tr key={d.year} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{d.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{d.applications}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-medium">{d.visas}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-indigo-600">${d.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════
// Commission Reports Tab
// ═══════════════════════════════════════════
const CommissionReports: React.FC = () => {
  const partnerData = useMemo(() => {
    return partners.map(p => {
      const partnerComms = commissions.filter(c => c.partnerId === p.id);
      const totalExpected = partnerComms.reduce((s, c) => s + c.expectedAmount, 0);
      const totalReceived = partnerComms.filter(c => c.status === 'Received').reduce((s, c) => s + c.expectedAmount, 0);
      return { ...p, totalExpected, totalReceived, pending: totalExpected - totalReceived, commissionCount: partnerComms.length };
    });
  }, []);

  const totalExpected = commissions.reduce((s, c) => s + c.expectedAmount, 0);
  const totalReceived = commissions.filter(c => c.status === 'Received').reduce((s, c) => s + c.expectedAmount, 0);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Commission Tracking</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Expected" value={`$${totalExpected.toLocaleString()}`} icon={DollarSign} color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/20" />
        <StatCard label="Received" value={`$${totalReceived.toLocaleString()}`} icon={CheckCircle2} color="text-green-600" bg="bg-green-50 dark:bg-green-900/20" />
        <StatCard label="Pending" value={`$${(totalExpected - totalReceived).toLocaleString()}`} icon={Briefcase} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" />
      </div>

      {/* Per Partner */}
      <Card className="border-none shadow-sm">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">By Partner</h4>
        <div className="space-y-4">
          {partnerData.map(p => (
            <div key={p.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{p.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{p.country} • {p.commissionPercentage}% rate</p>
                </div>
                <Badge variant={p.pending <= 0 ? 'success' : 'warning'}>{p.pending <= 0 ? 'Settled' : 'Pending'}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Expected</span><span className="font-bold text-gray-900 dark:text-white">${p.totalExpected.toLocaleString()}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Received</span><span className="font-bold text-green-600">${p.totalReceived.toLocaleString()}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Pending</span><span className="font-bold text-amber-600">${p.pending.toLocaleString()}</span></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Per Student commission table */}
      <Card className="p-0 overflow-hidden border-none shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Student Commission Details</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">University</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Partner</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {commissions.map(c => {
                const partner = partners.find(p => p.id === c.partnerId);
                return (
                  <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{c.studentName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{c.studentId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{c.university}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{partner?.name || c.partnerId}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">${c.expectedAmount.toLocaleString()}</td>
                    <td className="px-6 py-4"><Badge variant={c.status === 'Received' ? 'success' : 'warning'}>{c.status}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════
// Lead Source Reports Tab
// ═══════════════════════════════════════════
const LeadSourceReports: React.FC = () => {
  const data = useMemo(() => {
    const sourceMap: Record<string, { leads: number; applications: number; conversions: number }> = {};

    leads.forEach(l => {
      if (!sourceMap[l.source]) sourceMap[l.source] = { leads: 0, applications: 0, conversions: 0 };
      sourceMap[l.source].leads++;
      if (l.status === 'Converted' || l.status === 'Application Started') sourceMap[l.source].conversions++;
    });

    // Count applications traced through lead→student→application chain
    leads.forEach(l => {
      if (l.studentId) {
        const appCount = applications.filter(a => a.studentId === l.studentId).length;
        if (sourceMap[l.source]) sourceMap[l.source].applications += appCount;
      }
    });

    return Object.entries(sourceMap)
      .map(([source, stats]) => ({
        source,
        ...stats,
        conversionRate: stats.leads > 0 ? ((stats.conversions / stats.leads) * 100).toFixed(1) : '0.0',
      }))
      .sort((a, b) => b.leads - a.leads);
  }, []);

  const maxLeads = Math.max(...data.map(d => d.leads), 1);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lead Source Performance</h3>

      {/* Source breakdown bar chart */}
      <Card className="border-none shadow-sm">
        <div className="space-y-5">
          {data.map(d => (
            <div key={d.source} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">{d.source}</span>
                <span className="font-bold text-gray-900 dark:text-white">{d.leads} leads</span>
              </div>
              <ProgressBar value={d.leads} max={maxLeads} color="bg-rose-500" />
            </div>
          ))}
        </div>
      </Card>

      {/* Campaign stats */}
      <Card className="border-none shadow-sm">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Campaign Performance</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map(c => (
            <div key={c.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{c.name}</p>
                <Badge variant="info">{c.source}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Budget</span><span className="font-bold text-gray-900 dark:text-white">₹{c.budget.toLocaleString()}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Leads</span><span className="font-bold text-blue-600">{c.leadsGenerated}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 block text-xs">Conversions</span><span className="font-bold text-green-600">{c.conversions}</span></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detail table */}
      <Card className="p-0 overflow-hidden border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Leads</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applications</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conversions</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.map(d => (
                <tr key={d.source} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{d.source}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{d.leads}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-medium">{d.applications}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-medium">{d.conversions}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white w-12">{d.conversionRate}%</span>
                      <div className="flex-1"><ProgressBar value={Number(d.conversionRate)} max={100} color="bg-rose-500" /></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ── Partner Reports ──
const PartnerReports: React.FC = () => {
  const data = useMemo(() => {
    const partnerStats = partners.map(p => {
      const pComms = commissions.filter(c => c.partnerId === p.id);
      const pApps = applications.filter(a => a.partnerId === p.id);
      const totalExpected = pComms.reduce((s, c) => s + c.expectedAmount, 0);
      const totalReceived = pComms.filter(c => c.status === 'Received').reduce((s, c) => s + c.expectedAmount, 0);
      const universities = [...new Set(pApps.map(a => a.university))];

      return {
        id: p.id,
        name: p.name,
        country: p.country,
        commissionRate: p.commissionPercentage,
        referrals: pApps.length,
        assignedStudents: p.assignedStudents.length,
        totalExpected,
        totalReceived,
        universities,
      };
    }).sort((a, b) => b.referrals - a.referrals);

    // University breakdown across all partners
    const uniPartnerMap: Record<string, { partners: string[]; apps: number; commission: number }> = {};
    partners.forEach(p => {
      const pApps = applications.filter(a => a.partnerId === p.id);
      pApps.forEach(app => {
        if (!uniPartnerMap[app.university]) uniPartnerMap[app.university] = { partners: [], apps: 0, commission: 0 };
        if (!uniPartnerMap[app.university].partners.includes(p.name)) uniPartnerMap[app.university].partners.push(p.name);
        uniPartnerMap[app.university].apps++;
      });
      commissions.filter(c => c.partnerId === p.id).forEach(c => {
        if (uniPartnerMap[c.university]) uniPartnerMap[c.university].commission += c.expectedAmount;
      });
    });
    const uniBreakdown = Object.entries(uniPartnerMap)
      .map(([uni, d]) => ({ university: uni, ...d }))
      .sort((a, b) => b.apps - a.apps);

    const totalReferrals = partnerStats.reduce((s, p) => s + p.referrals, 0);
    const totalCommExpected = partnerStats.reduce((s, p) => s + p.totalExpected, 0);
    const totalCommReceived = partnerStats.reduce((s, p) => s + p.totalReceived, 0);

    return { partnerStats, uniBreakdown, totalReferrals, totalCommExpected, totalCommReceived };
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Partners" value={partners.length} icon={Handshake} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard label="Total Referrals" value={data.totalReferrals} icon={Users} color="text-purple-600" bg="bg-purple-50 dark:bg-purple-900/20" />
        <StatCard label="Commission Expected" value={`$${data.totalCommExpected.toLocaleString()}`} icon={DollarSign} color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/20" sub={`${data.partnerStats.filter(p => p.totalExpected > 0).length} partners with deals`} />
        <StatCard label="Commission Received" value={`$${data.totalCommReceived.toLocaleString()}`} icon={CheckCircle2} color="text-green-600" bg="bg-green-50 dark:bg-green-900/20" sub={`$${(data.totalCommExpected - data.totalCommReceived).toLocaleString()} pending`} />
      </div>

      {/* Per-Partner Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Partner Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Partner</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Referrals</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Universities</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expected</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.partnerStats.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.country}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{p.commissionRate}%</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{p.assignedStudents}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-lg">
                      {p.referrals}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.universities.length}</td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">${p.totalExpected.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">${p.totalReceived.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* University Breakdown Across Partners */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">University Distribution Across Partners</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">University</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applications</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Partners</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.uniBreakdown.map(u => (
                <tr key={u.university} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{u.university}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-lg">
                      {u.apps}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">${u.commission.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {u.partners.map(pn => (
                        <span key={pn} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-medium rounded-md">
                          {pn}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════
// Main Reports Page
// ═══════════════════════════════════════════
const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('walkin');

  // Top-level KPIs
  const topKpis = useMemo(() => {
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(l => l.status === 'Converted' || l.status === 'Application Started').length;
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';

    const totalVisaCases = visaCases.length;
    const approvedVisas = visaCases.filter(vc => vc.visaResult === 'Approved' || vc.currentStage === 'Visa Approved').length;
    const visaSuccessRate = totalVisaCases > 0 ? ((approvedVisas / totalVisaCases) * 100).toFixed(1) : '0.0';

    const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0);
    const activeMarkets = new Set(applications.map(a => a.country)).size;

    return { conversionRate, convertedLeads, totalLeads, visaSuccessRate, approvedVisas, totalVisaCases, totalRevenue, activeMarkets };
  }, []);

  const tabContent: Record<ReportTab, React.ReactNode> = {
    walkin: <WalkInReports />,
    department: <DepartmentReports />,
    country: <CountryReports />,
    university: <UniversityReports />,
    intake: <IntakeReports />,
    yearly: <YearlyReports />,
    commission: <CommissionReports />,
    leadsource: <LeadSourceReports />,
    partner: <PartnerReports />,
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Reports & Analytics" 
        subtitle="Operational analytics across all departments and modules." 
      />

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg"><Users size={20} /></div>
            <Badge variant="info">Lead Conversion</Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{topKpis.conversionRate}%</p>
          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span className="font-bold text-blue-600 mr-1">{topKpis.convertedLeads}</span> out of {topKpis.totalLeads} leads converted
          </div>
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${topKpis.conversionRate}%` }} />
          </div>
        </Card>

        <Card className="border-none shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg"><CheckCircle2 size={20} /></div>
            <Badge variant="success">Visa Success</Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{topKpis.visaSuccessRate}%</p>
          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span className="font-bold text-green-600 mr-1">{topKpis.approvedVisas}</span> out of {topKpis.totalVisaCases} cases approved
          </div>
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-600 h-full rounded-full" style={{ width: `${topKpis.visaSuccessRate}%` }} />
          </div>
        </Card>

        <Card className="border-none shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg"><DollarSign size={20} /></div>
            <Badge variant="info">Total Revenue</Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${topKpis.totalRevenue.toLocaleString()}</p>
          <div className="mt-2 flex items-center text-xs text-green-600 font-bold">
            <ArrowUpRight size={12} className="mr-1" /> Collected from payments
          </div>
        </Card>

        <Card className="border-none shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg"><Globe size={20} /></div>
            <Badge variant="info">Active Markets</Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{topKpis.activeMarkets}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">Countries with active applications</div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <nav className="flex space-x-1 min-w-max" role="tablist">
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {tabContent[activeTab]}
    </div>
  );
};

export default Reports;
