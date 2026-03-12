import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Globe, 
  DollarSign, 
  Users,
  PieChart,
  ArrowUpRight
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { 
  students, 
  applications, 
  visaCases, 
  payments 
} from '../data/mockData';

const Reports: React.FC = () => {
  // 1. Lead Conversion Rate
  // Definition: Converted = Status is not "Active" or "Documents Pending"
  const conversionStats = useMemo(() => {
    const totalLeads = students.length;
    const convertedLeads = students.filter(s => 
      s.status !== 'Active' && s.status !== 'Documents Pending'
    ).length;
    const rate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    
    return { totalLeads, convertedLeads, rate };
  }, []);

  // 2. Visa Success Rate
  const visaStats = useMemo(() => {
    const totalCases = visaCases.length;
    const approvedCases = visaCases.filter(vc => 
      vc.visaResult === 'Approved' || vc.currentStage === 'Visa Approved'
    ).length;
    const rate = totalCases > 0 ? (approvedCases / totalCases) * 100 : 0;
    
    return { totalCases, approvedCases, rate };
  }, []);

  // 3. Revenue by Country (Destination)
  const revenueByCountry = useMemo(() => {
    const revenueMap: Record<string, number> = {};
    
    payments.filter(p => p.status === 'Paid').forEach(payment => {
      // Find the student's destination country from their applications
      const studentApp = applications.find(app => app.studentId === payment.studentId);
      const country = studentApp ? studentApp.country : 'Unknown';
      
      revenueMap[country] = (revenueMap[country] || 0) + payment.amount;
    });

    return Object.entries(revenueMap)
      .map(([country, amount]) => ({ country, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, []);

  // 4. Application Status Breakdown
  const statusBreakdown = useMemo(() => {
    const statusMap: Record<string, number> = {};
    applications.forEach(app => {
      statusMap[app.status] = (statusMap[app.status] || 0) + 1;
    });

    return Object.entries(statusMap)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // 5. Student Distribution by Country (Destination)
  const studentDistribution = useMemo(() => {
    const distMap: Record<string, number> = {};
    applications.forEach(app => {
      distMap[app.country] = (distMap[app.country] || 0) + 1;
    });

    return Object.entries(distMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const maxRevenue = Math.max(...revenueByCountry.map(r => r.amount), 1);
  const maxStatus = Math.max(...statusBreakdown.map(s => s.count), 1);
  const maxDist = Math.max(...studentDistribution.map(d => d.count), 1);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Reports & Analytics" 
        subtitle="Performance metrics and business insights." 
      />

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
            <Badge variant="info" className="text-[10px]">Lead Conversion</Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{conversionStats.rate.toFixed(1)}%</p>
          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span className="font-bold text-blue-600 mr-1">{conversionStats.convertedLeads}</span>
            out of {conversionStats.totalLeads} leads converted
          </div>
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full" 
              style={{ width: `${conversionStats.rate}%` }}
            />
          </div>
        </Card>

        <Card className="border-none shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <Badge variant="success" className="text-[10px]">Visa Success</Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{visaStats.rate.toFixed(1)}%</p>
          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span className="font-bold text-green-600 mr-1">{visaStats.approvedCases}</span>
            out of {visaStats.totalCases} cases approved
          </div>
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-green-600 h-full rounded-full" 
              style={{ width: `${visaStats.rate}%` }}
            />
          </div>
        </Card>

        <Card className="border-none shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <Badge variant="info" className="text-[10px]">Total Revenue</Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
          </p>
          <div className="mt-2 flex items-center text-xs text-green-600 font-bold">
            <ArrowUpRight size={12} className="mr-1" />
            +12.5% from last month
          </div>
        </Card>

        <Card className="border-none shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
              <Globe size={20} />
            </div>
            <Badge variant="info" className="text-[10px]">Active Markets</Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{revenueByCountry.length}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
            Countries with active applications
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Country */}
        <Card className="border-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
              Revenue by Country
            </h3>
          </div>
          <div className="space-y-5">
            {revenueByCountry.map((item) => (
              <div key={item.country} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.country}</span>
                  <span className="font-bold text-gray-900 dark:text-white">${item.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(item.amount / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Application Status Breakdown */}
        <Card className="border-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Application Status
            </h3>
          </div>
          <div className="space-y-5">
            {statusBreakdown.map((item) => (
              <div key={item.status} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.status}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{item.count}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(item.count / maxStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Student Distribution by Country */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Globe className="w-5 h-5 mr-2 text-purple-600" />
              Student Distribution (Destination)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {studentDistribution.map((item) => (
              <div key={item.country} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.country}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{item.count} Students</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(item.count / maxDist) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const Badge: React.FC<{ children: React.ReactNode; variant?: 'info' | 'success' | 'warning' | 'error'; className?: string }> = ({ 
  children, 
  variant = 'info',
  className = ''
}) => {
  const variants = {
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    success: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Reports;
