import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  Mail, 
  Phone, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  User,
  ChevronRight,
  DollarSign,
  GraduationCap,
  FileText,
  Users
} from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { partners, students, commissions, applications } from '../data/mockData';

const PartnerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const partner = useMemo(() => partners.find(p => p.id === id), [id]);

  const assignedStudentsData = useMemo(() => {
    if (!partner) return [];
    return partner.assignedStudents.map(studentId => {
      const student = students.find(s => s.id === studentId);
      const commission = commissions.find(c => c.partnerId === partner.id && c.studentId === studentId);
      return { ...student, commissionEntry: commission };
    });
  }, [partner]);

  // Commissions linked to this partner
  const partnerCommissions = useMemo(() => {
    if (!partner) return [];
    return commissions.filter(c => c.partnerId === partner.id);
  }, [partner]);

  // Applications referred by this partner
  const partnerApplications = useMemo(() => {
    if (!partner) return [];
    return applications.filter(a => a.partnerId === partner.id);
  }, [partner]);

  // University distribution of referrals
  const universityDistribution = useMemo(() => {
    const uniMap: Record<string, { apps: number; commissionExpected: number; commissionReceived: number }> = {};
    partnerApplications.forEach(app => {
      if (!uniMap[app.university]) uniMap[app.university] = { apps: 0, commissionExpected: 0, commissionReceived: 0 };
      uniMap[app.university].apps++;
    });
    partnerCommissions.forEach(comm => {
      if (!uniMap[comm.university]) uniMap[comm.university] = { apps: 0, commissionExpected: 0, commissionReceived: 0 };
      uniMap[comm.university].commissionExpected += comm.expectedAmount;
      if (comm.status === 'Received') uniMap[comm.university].commissionReceived += comm.expectedAmount;
    });
    return Object.entries(uniMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.apps - a.apps);
  }, [partnerApplications, partnerCommissions]);

  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full text-red-600">
          <Briefcase size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Partner Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400">The partner you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/partners')}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Partners
        </button>
      </div>
    );
  }

  const totalExpected = partnerCommissions.reduce((s, c) => s + c.expectedAmount, 0);
  const totalReceived = partnerCommissions.filter(c => c.status === 'Received').reduce((s, c) => s + c.expectedAmount, 0);
  const status = totalReceived >= totalExpected && totalExpected > 0 ? 'Settled' : 'Pending';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/partners')}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{partner.name}</h1>
              <Badge variant={status === 'Settled' ? 'success' : 'warning'}>{status}</Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
              <Globe className="w-4 h-4 mr-1.5" />
              {partner.country} Partner • ID: {partner.id}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm font-bold">
            Edit Partner
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-bold shadow-sm">
            Contact Partner
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-none shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Commission Rate</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{partner.commissionPercentage}%</p>
        </Card>
        <Card className="border-none shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Assigned Students</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{partner.assignedStudents.length}</p>
        </Card>
        <Card className="border-none shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Referrals</p>
          <p className="text-2xl font-bold text-blue-600">{partnerApplications.length}</p>
        </Card>
        <Card className="border-none shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Universities</p>
          <p className="text-2xl font-bold text-purple-600">{universityDistribution.length}</p>
        </Card>
        <Card className="border-none shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Expected Commission</p>
          <p className="text-2xl font-bold text-indigo-600">${totalExpected.toLocaleString()}</p>
        </Card>
        <Card className="border-none shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Received Commission</p>
          <p className="text-2xl font-bold text-green-600">${totalReceived.toLocaleString()}</p>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Partner Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Partner Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Email Address</p>
                  <p className="text-gray-900 dark:text-white font-medium">contact@{partner.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Phone Number</p>
                  <p className="text-gray-900 dark:text-white font-medium">+1 (555) 000-0000</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Region</p>
                  <p className="text-gray-900 dark:text-white font-medium">{partner.country}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <button className="w-full py-2.5 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-sm font-bold transition-all text-left px-4 flex items-center justify-between text-gray-700 dark:text-gray-300">
                Generate Report
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full py-2.5 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-sm font-bold transition-all text-left px-4 flex items-center justify-between text-gray-700 dark:text-gray-300">
                Record Payment
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full py-2.5 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-sm font-bold transition-all text-left px-4 flex items-center justify-between text-gray-700 dark:text-gray-300">
                Assign Student
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>

        {/* Assigned Students */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border-none shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Assigned Students</h3>
              <Badge variant="info">{assignedStudentsData.length} Total</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expected Comm.</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {assignedStudentsData.map((student) => (
                    <tr key={student?.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <Link to={`/students/${student?.id}`} className="group">
                          <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{student?.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{student?.id}</div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={student?.status === 'Visa Approved' ? 'success' : 'info'}>
                          {student?.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {student.commissionEntry ? `$${student.commissionEntry.expectedAmount.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={`/students/${student?.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all inline-block"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Commission Breakdown */}
          <Card className="border-none shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Commission Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Settled Amount</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payments already received</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600">${totalReceived.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Pending Amount</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting payment from universities</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-yellow-600">${(totalExpected - totalReceived).toLocaleString()}</p>
              </div>
            </div>
          </Card>

          {/* Referral Commission Details */}
          <Card className="p-0 overflow-hidden border-none shadow-sm" shadowColor="emerald">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                Referral Commission Details
              </h3>
              <Badge variant="info">{partnerCommissions.length} Entries</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">University</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {partnerCommissions.map(comm => (
                    <tr key={comm.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/students/${comm.studentId}`} className="text-sm font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                          {comm.studentName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{comm.university}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{comm.commissionRate}%</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">${comm.expectedAmount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant={comm.status === 'Received' ? 'success' : 'warning'}>{comm.status}</Badge>
                      </td>
                    </tr>
                  ))}
                  {partnerCommissions.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No commission records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* University Distribution */}
          <Card className="border-none shadow-sm" shadowColor="purple">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-500" />
                University Distribution
              </h3>
            </div>
            <div className="space-y-3">
              {universityDistribution.map(uni => (
                <div key={uni.name} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{uni.name}</h4>
                    <Badge variant="info">{uni.apps} {uni.apps === 1 ? 'app' : 'apps'}</Badge>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                    <span>Expected: <span className="font-bold text-indigo-600">${uni.commissionExpected.toLocaleString()}</span></span>
                    <span>Received: <span className="font-bold text-emerald-600">${uni.commissionReceived.toLocaleString()}</span></span>
                  </div>
                </div>
              ))}
              {universityDistribution.length === 0 && (
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-8">No university referrals yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerProfile;
