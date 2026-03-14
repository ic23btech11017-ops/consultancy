import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { students, applications as MOCK_APPLICATIONS } from '../data/mockData';

type ApplicationStatus = 'Draft' | 'Submitted' | 'Offer Received' | 'Rejected' | 'Accepted';

interface Application {
  id: string;
  studentId: string;
  studentName: string;
  university: string;
  course: string;
  country: string;
  intake: string;
  status: ApplicationStatus;
}

const INITIAL_APPLICATIONS: Application[] = MOCK_APPLICATIONS.map(app => ({
  ...app,
  studentName: students.find(s => s.id === app.studentId)?.name || 'Unknown Student',
  status: app.status as ApplicationStatus
}));

const STATUS_VARIANTS: Record<ApplicationStatus, 'success' | 'warning' | 'error' | 'info'> = {
  'Draft': 'info', // Using info for gray-ish blue as Badge.tsx doesn't have 'secondary'
  'Submitted': 'info',
  'Offer Received': 'success',
  'Rejected': 'error',
  'Accepted': 'success',
};

// Custom Badge colors for Draft since Badge.tsx is limited
const getBadgeVariant = (status: ApplicationStatus): 'success' | 'warning' | 'error' | 'info' => {
  switch (status) {
    case 'Accepted':
    case 'Offer Received':
      return 'success';
    case 'Rejected':
      return 'error';
    case 'Submitted':
      return 'info';
    case 'Draft':
    default:
      return 'info'; // Default to info, we can override color in className if needed
  }
};

const Applications: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [intakeFilter, setIntakeFilter] = useState('');

  // New Application Form State
  const [newApp, setNewApp] = useState<Partial<Application>>({
    status: 'Draft',
    intake: 'Fall 2026',
  });

  const stats = useMemo(() => {
    return {
      total: applications.length,
      offers: applications.filter(a => a.status === 'Offer Received').length,
      rejected: applications.filter(a => a.status === 'Rejected').length,
      accepted: applications.filter(a => a.status === 'Accepted').length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter ? app.status === statusFilter : true;
      const matchesCountry = countryFilter ? app.country === countryFilter : true;
      const matchesIntake = intakeFilter ? app.intake === intakeFilter : true;
      return matchesSearch && matchesStatus && matchesCountry && matchesIntake;
    });
  }, [applications, searchQuery, statusFilter, countryFilter, intakeFilter]);

  const countries = useMemo(() => Array.from(new Set(applications.map(a => a.country))), [applications]);
  const intakes = useMemo(() => Array.from(new Set(applications.map(a => a.intake))), [applications]);

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const application: Application = {
      id: `APP${String(applications.length + 1).padStart(3, '0')}`,
      studentId: `STU${String(applications.length + 1).padStart(3, '0')}`, // Mock student ID
      studentName: newApp.studentName || '',
      university: newApp.university || '',
      course: newApp.course || '',
      country: newApp.country || '',
      intake: newApp.intake || '',
      status: (newApp.status as ApplicationStatus) || 'Draft',
    };
    setApplications([application, ...applications]);
    setIsModalOpen(false);
    setNewApp({ status: 'Draft', intake: 'Fall 2024' });
  };

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    setApplications(apps => apps.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="Applications" 
          subtitle="Monitor and manage all student applications." 
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Application
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          hoverable
          shadowColor="indigo"
          onClick={() => setStatusFilter('')}
          className={`p-4 ${!statusFilter ? 'ring-2 ring-indigo-500 border-transparent' : ''}`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Applications</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card 
          hoverable
          shadowColor="green"
          onClick={() => setStatusFilter('Offer Received')}
          className={`p-4 border-l-4 border-l-green-500 ${statusFilter === 'Offer Received' ? 'ring-2 ring-green-500 border-transparent' : ''}`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Offer Received</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.offers}</p>
        </Card>
        <Card 
          hoverable
          shadowColor="red"
          onClick={() => setStatusFilter('Rejected')}
          className={`p-4 border-l-4 border-l-red-500 ${statusFilter === 'Rejected' ? 'ring-2 ring-red-500 border-transparent' : ''}`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.rejected}</p>
        </Card>
        <Card 
          hoverable
          shadowColor="indigo"
          onClick={() => setStatusFilter('Accepted')}
          className={`p-4 border-l-4 border-l-indigo-500 ${statusFilter === 'Accepted' ? 'ring-2 ring-indigo-500 border-transparent' : ''}`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Accepted</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.accepted}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Offer Received">Offer Received</option>
            <option value="Rejected">Rejected</option>
            <option value="Accepted">Accepted</option>
          </select>
          <select 
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="">All Countries</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            value={intakeFilter}
            onChange={(e) => setIntakeFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="">All Intakes</option>
            {intakes.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-bottom border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">University</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Intake</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredApplications.map((app) => (
                <tr 
                  key={app.id} 
                  onClick={() => navigate(`/students/${app.studentId}`)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 group">
                      {app.studentName}
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{app.university}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{app.course}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{app.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{app.intake}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all
                        ${app.status === 'Draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : ''}
                        ${app.status === 'Submitted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${app.status === 'Offer Received' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                        ${app.status === 'Accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${app.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                      `}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Offer Received">Offer Received</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Accepted">Accepted</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredApplications.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No applications found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Application</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddApplication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Name</label>
                <input 
                  required
                  type="text"
                  value={newApp.studentName || ''}
                  onChange={(e) => setNewApp({ ...newApp, studentName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter student name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">University</label>
                  <input 
                    required
                    type="text"
                    value={newApp.university || ''}
                    onChange={(e) => setNewApp({ ...newApp, university: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Harvard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
                  <input 
                    required
                    type="text"
                    value={newApp.course || ''}
                    onChange={(e) => setNewApp({ ...newApp, course: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. MBA"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                  <input 
                    required
                    type="text"
                    value={newApp.country || ''}
                    onChange={(e) => setNewApp({ ...newApp, country: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. USA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Intake</label>
                  <select 
                    value={newApp.intake || ''}
                    onChange={(e) => setNewApp({ ...newApp, intake: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Spring 2024">Spring 2024</option>
                    <option value="Winter 2024">Winter 2024</option>
                    <option value="Fall 2025">Fall 2025</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select 
                  value={newApp.status || 'Draft'}
                  onChange={(e) => setNewApp({ ...newApp, status: e.target.value as ApplicationStatus })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Offer Received">Offer Received</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Accepted">Accepted</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Save Application
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Applications;
