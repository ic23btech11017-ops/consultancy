import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Globe, 
  TrendingUp, 
  Search, 
  Plus, 
  MoreVertical, 
  ExternalLink,
  DollarSign,
  Briefcase,
  X,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { partners as initialPartners, students } from '../data/mockData';

const COUNTRIES = ['UK', 'USA', 'Canada', 'Australia', 'Germany', 'New Zealand', 'Ireland'];

const Partners: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [partners, setPartners] = useState(initialPartners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', country: 'UK', commissionPercentage: 10 });

  const partnersData = useMemo(() => {
    return partners.map(partner => {
      const expectedCommission = partner.assignedStudents.reduce((acc, studentId) => {
        const studentFee = 5000;
        return acc + (studentFee * (partner.commissionPercentage / 100));
      }, 0);

      const status = partner.commissionReceived >= expectedCommission ? 'Settled' : 'Pending';

      return {
        ...partner,
        expectedCommission,
        status
      };
    });
  }, [partners]);

  const filteredPartners = useMemo(() => {
    return partnersData.filter(partner => 
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [partnersData, searchTerm]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Partners" 
          subtitle="Manage overseas partners and commission tracking." 
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm text-sm font-bold w-fit"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card shadowColor="blue" className="flex items-center space-x-4 border-none">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Partners</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{partnersData.length}</p>
          </div>
        </Card>
        <Card shadowColor="indigo" className="flex items-center space-x-4 border-none">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Expected Comm.</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${partnersData.reduce((acc, p) => acc + p.expectedCommission, 0).toLocaleString()}
            </p>
          </div>
        </Card>
        <Card shadowColor="green" className="flex items-center space-x-4 border-none">
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Received</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${partnersData.reduce((acc, p) => acc + p.commissionReceived, 0).toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search partners by name or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-full dark:text-white"
          />
        </div>
      </div>

      {/* Partners Table */}
      <Card className="p-0 overflow-hidden border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Partner Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Country</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comm. %</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Students</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expected</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Received</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredPartners.map((partner) => (
                <tr 
                  key={partner.id} 
                  onClick={() => navigate(`/partners/${partner.id}`)}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200 cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{partner.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{partner.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Globe className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {partner.country}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{partner.commissionPercentage}%</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Briefcase className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {partner.assignedStudents.length} Students
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">${partner.expectedCommission.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">${partner.commissionReceived.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant={partner.status === 'Settled' ? 'success' : 'warning'}>
                      {partner.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="relative w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Partner</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const id = `PRT${String(partners.length + 1).padStart(3, '0')}`;
                setPartners(prev => [...prev, { id, name: newPartner.name, country: newPartner.country, commissionPercentage: newPartner.commissionPercentage, assignedStudents: [], commissionReceived: 0 }]);
                setNewPartner({ name: '', country: 'UK', commissionPercentage: 10 });
                setIsModalOpen(false);
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Partner Name</label>
                <input
                  required
                  type="text"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Global Education Services"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Country</label>
                <select
                  value={newPartner.country}
                  onChange={(e) => setNewPartner(p => ({ ...p, country: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                >
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Commission Percentage (%)</label>
                <input
                  required
                  type="number"
                  min={1}
                  max={100}
                  value={newPartner.commissionPercentage}
                  onChange={(e) => setNewPartner(p => ({ ...p, commissionPercentage: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors">
                  Add Partner
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Partners;
