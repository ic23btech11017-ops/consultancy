import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  CreditCard,
  Receipt,
  Handshake,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  X,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  ChevronDown,
  Send,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import {
  testPrepFees as initialTestPrepFees,
  serviceFees as initialServiceFees,
  paymentRecords as initialPaymentRecords,
  commissions as initialCommissions,
  partners,
} from '../data/mockData';
import type { TestPrepFee, ServiceFee, PaymentRecord, PaymentMode } from '../data/mockData';

// ── Helpers ──
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
const TODAY = '2026-03-12';

const MODE_COLORS: Record<PaymentMode, string> = {
  'Cash':           'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  'UPI':            'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  'Bank Transfer':  'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  'Card':           'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
  'Online Gateway': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
};
const MODES: PaymentMode[] = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Online Gateway'];
const BRANCHES = ['Hyderabad', 'Kolkata', 'Delhi'];

type FinanceTab = 'overview' | 'payments' | 'history' | 'commission';
type PaySubTab = 'testprep' | 'service';

const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');
  const [paySubTab, setPaySubTab] = useState<PaySubTab>('testprep');

  const [tpFees, setTpFees] = useState<TestPrepFee[]>(initialTestPrepFees);
  const [sfFees, setSfFees] = useState<ServiceFee[]>(initialServiceFees);
  const [records, setRecords] = useState<PaymentRecord[]>(initialPaymentRecords);
  const [commissions, setCommissions] = useState(initialCommissions);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [feeTypeFilter, setFeeTypeFilter] = useState('All');
  const [commStatusFilter, setCommStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const [recordTarget, setRecordTarget] = useState<{ type: 'testprep' | 'service'; id: string } | null>(null);
  const [modalAmount, setModalAmount] = useState('');
  const [modalMode, setModalMode] = useState<PaymentMode>('Bank Transfer');
  const [modalRef, setModalRef] = useState('');
  const [modalNotes, setModalNotes] = useState('');

  const switchTab = (tab: FinanceTab) => {
    setActiveTab(tab);
    setSearch('');
    setStatusFilter('All');
    setBranchFilter('All');
    setModeFilter('All');
    setFeeTypeFilter('All');
    setCommStatusFilter('All');
    setShowFilters(false);
  };

  const overview = useMemo(() => {
    const tpExpected  = tpFees.reduce((s, f) => s + f.courseFee, 0);
    const tpCollected = tpFees.reduce((s, f) => s + f.amountPaid, 0);
    const sfExpected  = sfFees.reduce((s, f) => s + f.serviceFee, 0);
    const sfCollected = sfFees.reduce((s, f) => s + f.amountPaid, 0);
    const totalExpected  = tpExpected + sfExpected;
    const totalCollected = tpCollected + sfCollected;
    const totalPending   = totalExpected - totalCollected;
    const todayCollection = records.filter(r => r.date === TODAY).reduce((s, r) => s + r.amount, 0);
    const commPending  = commissions.filter(c => c.status !== 'Received').reduce((s, c) => s + c.expectedAmount, 0);
    const commReceived = commissions.filter(c => c.status === 'Received').reduce((s, c) => s + c.expectedAmount, 0);
    const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

    const byBranch: Record<string, { tpCollected: number; sfCollected: number; tpPending: number; sfPending: number }> = {};
    BRANCHES.forEach(b => { byBranch[b] = { tpCollected: 0, sfCollected: 0, tpPending: 0, sfPending: 0 }; });
    tpFees.forEach(f => { if (byBranch[f.branch]) { byBranch[f.branch].tpCollected += f.amountPaid; byBranch[f.branch].tpPending += f.pendingAmount; } });
    sfFees.forEach(f => { if (byBranch[f.branch]) { byBranch[f.branch].sfCollected += f.amountPaid; byBranch[f.branch].sfPending += f.pendingAmount; } });

    return { tpExpected, tpCollected, sfExpected, sfCollected, totalExpected, totalCollected, totalPending, todayCollection, commPending, commReceived, collectionRate, byBranch };
  }, [tpFees, sfFees, records, commissions]);

  const filteredRecords = useMemo(() => {
    return records
      .filter(r => {
        const matchSearch = r.studentName.toLowerCase().includes(search.toLowerCase()) || r.referenceNumber.toLowerCase().includes(search.toLowerCase());
        const matchMode = modeFilter === 'All' || r.paymentMode === modeFilter;
        const matchType = feeTypeFilter === 'All' || r.feeType === feeTypeFilter;
        return matchSearch && matchMode && matchType;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [records, search, modeFilter, feeTypeFilter]);

  const openRecordModal = (type: 'testprep' | 'service', id: string) => {
    setRecordTarget({ type, id });
    setModalAmount('');
    setModalMode('Bank Transfer');
    setModalRef('');
    setModalNotes('');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordTarget) return;
    const amt = Number(modalAmount);
    if (amt <= 0) return;

    const newRecord: PaymentRecord = {
      id: `PR${Date.now()}`,
      studentId: '',
      studentName: '',
      date: TODAY,
      amount: amt,
      paymentMode: modalMode,
      referenceNumber: modalRef || `REF-${Date.now()}`,
      feeType: recordTarget.type === 'testprep' ? 'Test Prep' : 'Service Fee',
      notes: modalNotes || undefined,
    };

    if (recordTarget.type === 'testprep') {
      setTpFees(prev => prev.map(f => {
        if (f.id !== recordTarget.id) return f;
        const newPaid    = f.amountPaid + amt;
        const newPending = Math.max(0, f.pendingAmount - amt);
        const status = newPending === 0 ? 'Paid' : 'Partial';
        newRecord.studentId   = f.studentId;
        newRecord.studentName = f.studentName;
        return { ...f, amountPaid: newPaid, pendingAmount: newPending, paymentStatus: status };
      }));
    } else {
      setSfFees(prev => prev.map(f => {
        if (f.id !== recordTarget.id) return f;
        const newPaid    = f.amountPaid + amt;
        const newPending = Math.max(0, f.pendingAmount - amt);
        const status = newPending === 0 ? 'Paid' : 'Partial';
        newRecord.studentId   = f.studentId;
        newRecord.studentName = f.studentName;
        return { ...f, amountPaid: newPaid, pendingAmount: newPending, paymentStatus: status };
      }));
    }

    setRecords(prev => [newRecord, ...prev]);
    setRecordTarget(null);
  };

  const handleCommStatus = (id: string, newStatus: 'Requested' | 'Received') => {
    setCommissions(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const filteredTpFees = useMemo(() => tpFees.filter(f => {
    const matchSearch  = f.studentName.toLowerCase().includes(search.toLowerCase());
    const matchStatus  = statusFilter === 'All' || f.paymentStatus === statusFilter;
    const matchBranch  = branchFilter === 'All' || f.branch === branchFilter;
    return matchSearch && matchStatus && matchBranch;
  }), [tpFees, search, statusFilter, branchFilter]);

  const filteredSfFees = useMemo(() => sfFees.filter(f => {
    const matchSearch  = f.studentName.toLowerCase().includes(search.toLowerCase());
    const matchStatus  = statusFilter === 'All' || f.paymentStatus === statusFilter;
    const matchBranch  = branchFilter === 'All' || f.branch === branchFilter;
    return matchSearch && matchStatus && matchBranch;
  }), [sfFees, search, statusFilter, branchFilter]);

  const filteredCommissions = useMemo(() => commissions.filter(c => {
    const matchSearch = c.studentName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = commStatusFilter === 'All' || c.status === commStatusFilter;
    return matchSearch && matchStatus;
  }), [commissions, search, commStatusFilter]);

  const feeStatusBadge = (s: string) => {
    if (s === 'Paid') return <Badge variant="success">Paid</Badge>;
    if (s === 'Partial') return <Badge variant="warning">Partial</Badge>;
    if (s === 'Refunded') return <Badge variant="info">Refunded</Badge>;
    return <Badge variant="error">Unpaid</Badge>;
  };

  const tabs: { key: FinanceTab; label: string; icon: React.ElementType }[] = [
    { key: 'overview',   label: 'Overview',         icon: IndianRupee },
    { key: 'payments',   label: 'Student Payments', icon: CreditCard  },
    { key: 'history',    label: 'Payment History',  icon: Receipt     },
    { key: 'commission', label: 'Commissions',      icon: Handshake   },
  ];

  const targetFee = recordTarget
    ? recordTarget.type === 'testprep'
      ? tpFees.find(f => f.id === recordTarget.id)
      : sfFees.find(f => f.id === recordTarget.id)
    : null;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Finance Management"
        subtitle="Track test prep fees, service fees, payment history, and partner commissions."
      />

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              activeTab === key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Expected',      value: fmt(overview.totalExpected),   icon: IndianRupee,  color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-100 dark:bg-blue-900/20' },
              { label: 'Total Collected',     value: fmt(overview.totalCollected),  icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
              { label: 'Total Pending',       value: fmt(overview.totalPending),    icon: Clock,        color: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-100 dark:bg-amber-900/20' },
              { label: "Today's Collection",  value: fmt(overview.todayCollection), icon: TrendingUp,   color: 'text-violet-600 dark:text-violet-400',  bg: 'bg-violet-100 dark:bg-violet-900/20' },
              { label: 'Commission Pending',  value: fmt(overview.commPending),     icon: AlertCircle,  color: 'text-rose-600 dark:text-rose-400',      bg: 'bg-rose-100 dark:bg-rose-900/20' },
              { label: 'Commission Received', value: fmt(overview.commReceived),    icon: Send,         color: 'text-teal-600 dark:text-teal-400',      bg: 'bg-teal-100 dark:bg-teal-900/20' },
            ].map((kpi, i) => (
              <Card key={i} className="p-4 text-center border-none shadow-sm">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${kpi.bg} mx-auto mb-2`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wider leading-tight">{kpi.label}</p>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Overall Collection Progress</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{fmt(overview.totalCollected)} collected of {fmt(overview.totalExpected)} expected</p>
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{overview.collectionRate.toFixed(1)}%</p>
            </div>
            <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${overview.collectionRate}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Test Prep: {fmt(overview.tpCollected)} / {fmt(overview.tpExpected)}</span>
              <span>Service Fees: {fmt(overview.sfCollected)} / {fmt(overview.sfExpected)}</span>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden border-none shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Revenue by Branch</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    {['Branch', 'Test Prep Collected', 'Service Fee Collected', 'Total Collected', 'Total Pending'].map(h => (
                      <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {BRANCHES.map(branch => {
                    const b = overview.byBranch[branch];
                    return (
                      <tr key={branch} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{branch}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{fmt(b.tpCollected)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{fmt(b.sfCollected)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmt(b.tpCollected + b.sfCollected)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-amber-600 dark:text-amber-400">{fmt(b.tpPending + b.sfPending)}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50 dark:bg-gray-900/50 font-bold border-t-2 border-gray-200 dark:border-gray-700">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">Total</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{fmt(overview.tpCollected)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{fmt(overview.sfCollected)}</td>
                    <td className="px-6 py-4 text-sm text-emerald-600 dark:text-emerald-400">{fmt(overview.totalCollected)}</td>
                    <td className="px-6 py-4 text-sm text-amber-600 dark:text-amber-400">{fmt(overview.totalPending)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* STUDENT PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {([['testprep', 'Test Prep Fees'], ['service', 'Service Fees']] as [PaySubTab, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPaySubTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  paySubTab === key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {label} ({key === 'testprep' ? tpFees.length : sfFees.length})
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${showFilters ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Filter className="w-4 h-4 mr-2" />Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Payment Status</label>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                    <option value="All">All Statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Branch</label>
                  <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                    <option value="All">All Branches</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {paySubTab === 'testprep' && (
            <Card className="p-0 overflow-hidden border-none shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                      {['Student', 'Branch', 'Test', 'Course Fee', 'Paid', 'Pending', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredTpFees.map(f => (
                      <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-4">
                          <Link to={`/students/${f.studentId}`} className="group">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{f.studentName}</p>
                            <p className="text-xs text-gray-400">{f.studentId}</p>
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{f.branch}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${f.testType === 'IELTS' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : f.testType === 'PTE' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>{f.testType}</span>
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">{fmt(f.courseFee)}</td>
                        <td className="px-5 py-4"><span className="flex items-center text-sm text-emerald-600 font-medium"><ArrowUpRight className="w-3 h-3 mr-1" />{fmt(f.amountPaid)}</span></td>
                        <td className="px-5 py-4"><span className="flex items-center text-sm text-amber-600 font-medium"><ArrowDownRight className="w-3 h-3 mr-1" />{fmt(f.pendingAmount)}</span></td>
                        <td className="px-5 py-4">{feeStatusBadge(f.paymentStatus)}</td>
                        <td className="px-5 py-4">
                          {f.paymentStatus !== 'Paid' && f.paymentStatus !== 'Refunded' && (
                            <button onClick={() => openRecordModal('testprep', f.id)} className="flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                              <Plus className="w-3 h-3 mr-1" />Record
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {paySubTab === 'service' && (
            <Card className="p-0 overflow-hidden border-none shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                      {['Student', 'Branch', 'Service Fee', 'Paid', 'Pending', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredSfFees.map(f => (
                      <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-4">
                          <Link to={`/students/${f.studentId}`} className="group">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{f.studentName}</p>
                            <p className="text-xs text-gray-400">{f.studentId}</p>
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{f.branch}</td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">{fmt(f.serviceFee)}</td>
                        <td className="px-5 py-4"><span className="flex items-center text-sm text-emerald-600 font-medium"><ArrowUpRight className="w-3 h-3 mr-1" />{fmt(f.amountPaid)}</span></td>
                        <td className="px-5 py-4"><span className="flex items-center text-sm text-amber-600 font-medium"><ArrowDownRight className="w-3 h-3 mr-1" />{fmt(f.pendingAmount)}</span></td>
                        <td className="px-5 py-4">{feeStatusBadge(f.paymentStatus)}</td>
                        <td className="px-5 py-4">
                          {f.paymentStatus !== 'Paid' && f.paymentStatus !== 'Refunded' && (
                            <button onClick={() => openRecordModal('service', f.id)} className="flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                              <Plus className="w-3 h-3 mr-1" />Record
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* PAYMENT HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-5 py-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-bold text-gray-900 dark:text-white">{filteredRecords.length}</span> transactions</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Total: {fmt(filteredRecords.reduce((s, r) => s + r.amount, 0))}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search student or reference..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${showFilters ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Filter className="w-4 h-4 mr-2" />Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Payment Mode</label>
                  <select value={modeFilter} onChange={e => setModeFilter(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                    <option value="All">All Modes</option>
                    {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Fee Type</label>
                  <select value={feeTypeFilter} onChange={e => setFeeTypeFilter(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                    <option value="All">All Types</option>
                    <option value="Test Prep">Test Prep</option>
                    <option value="Service Fee">Service Fee</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <Card className="p-0 overflow-hidden border-none shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    {['Date', 'Student', 'Amount', 'Mode', 'Reference', 'Type', 'Notes'].map(h => (
                      <th key={h} className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredRecords.map(r => (
                    <tr key={r.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${r.date === TODAY ? 'bg-emerald-50/40 dark:bg-emerald-900/10' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">{r.date}</span>
                          {r.date === TODAY && <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold rounded uppercase tracking-wider">Today</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Link to={`/students/${r.studentId}`} className="group">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{r.studentName}</p>
                          <p className="text-xs text-gray-400">{r.studentId}</p>
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-900 dark:text-white">{fmt(r.amount)}</td>
                      <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${MODE_COLORS[r.paymentMode]}`}>{r.paymentMode}</span></td>
                      <td className="px-5 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{r.referenceNumber}</td>
                      <td className="px-5 py-4"><Badge variant={r.feeType === 'Test Prep' ? 'info' : 'indigo'}>{r.feeType}</Badge></td>
                      <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400 max-w-[160px] truncate">{r.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* COMMISSION TRACKING */}
      {activeTab === 'commission' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partners.map(p => {
              const pComms = commissions.filter(c => c.partnerId === p.id);
              const received = pComms.filter(c => c.status === 'Received').reduce((s, c) => s + c.expectedAmount, 0);
              const pending  = pComms.filter(c => c.status !== 'Received').reduce((s, c) => s + c.expectedAmount, 0);
              return (
                <Card key={p.id} className="border-none shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{p.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{p.country} · {p.commissionPercentage}%</p>
                    </div>
                    <Badge variant="info">{pComms.length} deals</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Received</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{fmt(received)}</p>
                    </div>
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{fmt(pending)}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white" />
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg">
                <Filter className="w-4 h-4 text-gray-400" />
                <select value={commStatusFilter} onChange={e => setCommStatusFilter(e.target.value)} className="bg-transparent text-sm focus:outline-none dark:text-white cursor-pointer">
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Requested">Requested</option>
                  <option value="Received">Received</option>
                </select>
              </div>
            </div>
          </div>

          <Card className="p-0 overflow-hidden border-none shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    {['Student', 'University', 'Partner', 'Rate', 'Commission', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredCommissions.map(c => {
                    const partner = partners.find(p => p.id === c.partnerId);
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-4">
                          <Link to={`/students/${c.studentId}`} className="group">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{c.studentName}</p>
                            <p className="text-xs text-gray-400">{c.studentId}</p>
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{c.university}</td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{partner?.name || c.partnerId}</td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">{c.commissionRate}%</td>
                        <td className="px-5 py-4 text-sm font-bold text-indigo-600 dark:text-indigo-400">{fmt(c.expectedAmount)}</td>
                        <td className="px-5 py-4">
                          <Badge variant={c.status === 'Received' ? 'success' : c.status === 'Requested' ? 'info' : 'warning'}>{c.status}</Badge>
                        </td>
                        <td className="px-5 py-4">
                          {c.status === 'Pending' && (
                            <button onClick={() => handleCommStatus(c.id, 'Requested')} className="flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                              <Send className="w-3 h-3 mr-1" />Mark Requested
                            </button>
                          )}
                          {c.status === 'Requested' && (
                            <button onClick={() => handleCommStatus(c.id, 'Received')} className="flex items-center px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
                              <CheckCircle2 className="w-3 h-3 mr-1" />Mark Received
                            </button>
                          )}
                          {c.status === 'Received' && (
                            <span className="text-xs text-gray-400 font-medium">Settled</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {recordTarget && targetFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setRecordTarget(null)} />
          <Card className="relative w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Record Payment</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{targetFee.studentName} · Pending: {fmt((targetFee as any).pendingAmount)}</p>
              </div>
              <button onClick={() => setRecordTarget(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount (₹) *</label>
                <input required type="number" min="1" max={(targetFee as any).pendingAmount} value={modalAmount} onChange={e => setModalAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white" placeholder="Enter amount" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Mode</label>
                  <select value={modalMode} onChange={e => setModalMode(e.target.value as PaymentMode)} className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white">
                    {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reference No.</label>
                  <input type="text" value={modalRef} onChange={e => setModalRef(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white" placeholder="TXN / UPI ref" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notes (optional)</label>
                <input type="text" value={modalNotes} onChange={e => setModalNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white" placeholder="e.g. Second instalment" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setRecordTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">Save Payment</button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Finance;
