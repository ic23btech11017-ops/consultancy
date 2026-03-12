import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Eye, 
  Plus, 
  X,
  TrendingUp,
  CreditCard,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { payments as initialPayments, students } from '../data/mockData';

// Mock Commissions Data
const initialCommissions = [
  { id: 'COM001', studentId: 'ST001', studentName: 'Rahul Kumar', university: 'University of Toronto', commissionRate: 10, expectedAmount: 1500, status: 'Received' },
  { id: 'COM002', studentId: 'ST003', studentName: 'Vikram Singh', university: 'Arizona State University', commissionRate: 12, expectedAmount: 2400, status: 'Pending' },
  { id: 'COM003', studentId: 'ST004', studentName: 'Priya Patel', university: 'University of Oxford', commissionRate: 8, expectedAmount: 3200, status: 'Pending' },
];

const Finance: React.FC = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);

  // New Payment Form State
  const [newPayment, setNewPayment] = useState({
    amount: '',
    mode: 'Bank Transfer',
    status: 'Paid',
    description: 'Consultancy Fee'
  });

  // Group payments by student
  const studentPayments = useMemo(() => {
    const grouped = students.map(student => {
      const studentTrans = payments.filter(p => p.studentId === student.id);
      const paidAmount = studentTrans.filter(p => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0);
      const pendingAmount = studentTrans.filter(p => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0);
      
      // For mock purposes, let's assume a total fee if none exists, or use the sum
      // If a student has no payments, we'll give them a default total fee to show "Unpaid"
      const totalFee = studentTrans.length > 0 ? (paidAmount + pendingAmount) : 5000;
      
      let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
      if (totalFee > 0) {
        if (paidAmount === totalFee && totalFee > 0) status = 'Paid';
        else if (paidAmount > 0) status = 'Partial';
      }

      return {
        ...student,
        totalFee,
        paidAmount,
        pendingAmount,
        paymentStatus: status,
        transactions: studentTrans
      };
    });

    return grouped.filter(sp => {
      const matchesSearch = sp.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || sp.paymentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  // Summary Stats
  const stats = useMemo(() => {
    const totalServiceFees = payments.reduce((acc, p) => acc + p.amount, 0);
    const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0);
    const totalPending = payments.filter(p => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0);
    const expectedCommission = initialCommissions.reduce((acc, c) => acc + c.expectedAmount, 0);

    return [
      { label: 'Total Service Fees', value: `$${totalServiceFees.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
      { label: 'Revenue Collected', value: `$${totalRevenue.toLocaleString()}`, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
      { label: 'Pending Amount', value: `$${totalPending.toLocaleString()}`, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
      { label: 'Commission Expected', value: `$${expectedCommission.toLocaleString()}`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    ];
  }, [payments]);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const payment = {
      id: `PAY${Date.now()}`,
      studentId: selectedStudentId,
      amount: Number(newPayment.amount),
      status: newPayment.status,
      date: new Date().toISOString().split('T')[0],
      description: newPayment.description
    };

    setPayments([...payments, payment]);
    setIsAddPaymentModalOpen(false);
    setNewPayment({ amount: '', mode: 'Bank Transfer', status: 'Paid', description: 'Consultancy Fee' });
  };

  const selectedStudent = studentPayments.find(s => s.id === selectedStudentId);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Finance Management" 
        subtitle="Track student payments, revenue, and university commissions." 
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card 
            key={idx} 
            hoverable
            onClick={() => {
              if (stat.label === 'Revenue Collected') setStatusFilter('Paid');
              else if (stat.label === 'Pending Amount') setStatusFilter('Unpaid');
              else setStatusFilter('All');
            }}
            className={`flex items-center space-x-4 border-none shadow-sm ${
              (stat.label === 'Revenue Collected' && statusFilter === 'Paid') || 
              (stat.label === 'Pending Amount' && statusFilter === 'Unpaid') ||
              (stat.label === 'Total Service Fees' && statusFilter === 'All')
                ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters & Payments Table */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
            Student Payments
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-full sm:w-64 dark:text-white"
              />
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm focus:outline-none dark:text-white cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>

        <Card className="p-0 overflow-hidden border-none shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Fee</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paid Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {studentPayments.map((sp) => (
                  <tr 
                    key={sp.id} 
                    onClick={() => {
                      setSelectedStudentId(sp.id);
                      setIsHistoryModalOpen(true);
                    }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <Link to={`/students/${sp.id}`} className="group">
                        <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{sp.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{sp.id}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">${sp.totalFee.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-green-600 font-medium">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        ${sp.paidAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-yellow-600 font-medium">
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                        ${sp.pendingAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={sp.paymentStatus === 'Paid' ? 'success' : sp.paymentStatus === 'Partial' ? 'warning' : 'error'}>
                        {sp.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedStudentId(sp.id);
                          setIsHistoryModalOpen(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        View Payments
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Commission Tracking Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
          Commission Tracking
        </h2>
        <Card className="p-0 overflow-hidden border-none shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">University</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comm. %</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expected Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {initialCommissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{comm.studentName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{comm.studentId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{comm.university}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{comm.commissionRate}%</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">${comm.expectedAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant={comm.status === 'Received' ? 'success' : 'warning'}>
                        {comm.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Payment History Modal */}
      {isHistoryModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsHistoryModalOpen(false)}></div>
          <Card className="relative w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment History</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedStudent.name} ({selectedStudent.id})</p>
              </div>
              <button 
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex space-x-8">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Paid</p>
                    <p className="text-lg font-bold text-green-600">${selectedStudent.paidAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Pending</p>
                    <p className="text-lg font-bold text-yellow-600">${selectedStudent.pendingAmount.toLocaleString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddPaymentModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment
                </button>
              </div>

              <div className="overflow-hidden border border-gray-100 dark:border-gray-800 rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Mode</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {selectedStudent.transactions.length > 0 ? (
                      selectedStudent.transactions.map((t) => (
                        <tr key={t.id} className="text-sm">
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t.date}</td>
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">${t.amount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Bank Transfer</td>
                          <td className="px-4 py-3">
                            <Badge variant={t.status === 'Paid' ? 'success' : 'warning'}>
                              {t.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 italic">
                          No payment records found for this student.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Payment Modal */}
      {isAddPaymentModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddPaymentModalOpen(false)}></div>
          <Card className="relative w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Record New Payment</h3>
              <button onClick={() => setIsAddPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount ($)</label>
                <input 
                  required
                  type="number" 
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Mode</label>
                  <select 
                    value={newPayment.mode}
                    onChange={(e) => setNewPayment({ ...newPayment, mode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white cursor-pointer"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</label>
                  <select 
                    value={newPayment.status}
                    onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white cursor-pointer"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</label>
                <input 
                  type="text" 
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                  placeholder="e.g. Consultancy Fee"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddPaymentModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md text-sm font-bold"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Finance;

