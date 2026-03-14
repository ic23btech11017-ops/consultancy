import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Eye, 
  CheckCircle2, 
  X,
  Lock,
} from 'lucide-react';
import { leads as INITIAL_LEADS, LEAD_SOURCES, type LeadSource } from '../data/mockData';

type LeadStatus = 'New' | 'Contacted' | 'Counselling Done' | 'Converted' | 'Dropped';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  interestedCountry: string;
  targetLevel: string;
  assignedCounsellor: string;
  status: LeadStatus;
}

const Leads: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '',
    phone: '',
    email: '',
    source: 'Walk-in',
    interestedCountry: 'UK',
    targetLevel: 'Masters',
    assignedCounsellor: 'Ravi Mehta',
  });

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const lead: Lead = {
      ...newLead as Lead,
      id: Math.random().toString(36).substr(2, 9),
      status: 'New',
    };
    setLeads([lead, ...leads]);
    setIsModalOpen(false);
    setNewLead({
      name: '',
      phone: '',
      email: '',
      source: 'Walk-in',
      interestedCountry: 'UK',
      targetLevel: 'Masters',
      assignedCounsellor: 'Ravi Mehta',
    });
  };

  const handleStatusChange = (e: React.MouseEvent, id: string, newStatus: LeadStatus) => {
    e.stopPropagation();
    setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New': return <Badge variant="info">New</Badge>;
      case 'Contacted': return <Badge variant="warning">Contacted</Badge>;
      case 'Counselling Done': return <Badge variant="info">Counselling Done</Badge>;
      case 'Converted': return <Badge variant="success">Converted</Badge>;
      case 'Dropped': return <Badge variant="error">Dropped</Badge>;
      default: return <Badge variant="info">{status}</Badge>;
    }
  };

  const statuses: LeadStatus[] = ['New', 'Contacted', 'Counselling Done', 'Converted', 'Dropped'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="Leads" 
          subtitle="Manage and track all incoming student enquiries." 
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
          >
            <option value="All">All Sources</option>
            {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-center bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('table')}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'table' 
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <List className="w-4 h-4 mr-2" />
            Table
          </button>
          <button 
            onClick={() => setViewMode('kanban')}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'kanban' 
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Kanban
          </button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'table' ? (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-bottom border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target Level</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Counsellor</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{lead.phone}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{lead.interestedCountry}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{lead.targetLevel}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{lead.assignedCounsellor}</td>
                    <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {lead.status !== 'Converted' && (
                          <button 
                            onClick={(e) => handleStatusChange(e, lead.id, 'Converted')}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            Convert
                          </button>
                        )}
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-all duration-200"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 overflow-x-auto pb-4">
          {statuses.map((status) => (
            <div key={status} className="min-w-[250px] space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  {status}
                  <span className="ml-2 px-2 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">
                    {filteredLeads.filter(l => l.status === status).length}
                  </span>
                </h3>
              </div>
              <div className="space-y-3">
                {filteredLeads.filter(l => l.status === status).map((lead) => (
                  <Card 
                    key={lead.id} 
                    hoverable
                    shadowColor="blue"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="p-4 hover:border-blue-300 dark:hover:border-blue-700"
                  >
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {lead.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lead.interestedCountry} • {lead.targetLevel}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(lead.status)}
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                          {lead.assignedCounsellor.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <Card className="relative w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Lead</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    Lead Source
                    <Lock className="w-3 h-3 text-amber-500" title="Source is immutable after creation" />
                  </label>
                  <select 
                    required
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value as LeadSource })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  >
                    {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Source is locked after creation. Admin correction required to change.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Interested Country</label>
                  <select 
                    value={newLead.interestedCountry}
                    onChange={(e) => setNewLead({ ...newLead, interestedCountry: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  >
                    <option value="UK">UK</option>
                    <option value="USA">USA</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Target Level</label>
                  <select 
                    value={newLead.targetLevel}
                    onChange={(e) => setNewLead({ ...newLead, targetLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  >
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Assigned Counsellor</label>
                  <select 
                    value={newLead.assignedCounsellor}
                    onChange={(e) => setNewLead({ ...newLead, assignedCounsellor: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  >
                    <option value="Ravi Mehta">Ravi Mehta</option>
                    <option value="Anjali Rao">Anjali Rao</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm shadow-sm"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Leads;
