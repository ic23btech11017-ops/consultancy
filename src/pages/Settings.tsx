import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Switch } from '../components/Switch';
import { 
  Save, 
  Plus, 
  X, 
  Users, 
  UserCheck, 
  DollarSign, 
  Clock, 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  Shield
} from 'lucide-react';

const Settings: React.FC = () => {
  // Local state for organization settings
  const [orgName, setOrgName] = useState('Kalnet Solutions');
  const [contactEmail, setContactEmail] = useState('info@kalnetsolutions.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [address, setAddress] = useState('123 Kalnet St, Tech City, CA 94000');

  // Local state for default configurations
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [defaultCommission, setDefaultCommission] = useState(10);
  const [visaStages, setVisaStages] = useState([
    'Documents Verified', 
    'Financial Prepared', 
    'Visa Form Filled', 
    'Appointment Booked', 
    'Interview Done', 
    'Visa Approved'
  ]);
  const [newVisaStage, setNewVisaStage] = useState('');

  // Local state for document requirements
  const [enableFinancialTracking, setEnableFinancialTracking] = useState(true);
  const [enableSopRequired, setEnableSopRequired] = useState(true);
  const [enableLorRequired, setEnableLorRequired] = useState(false);

  const handleSaveOrganization = () => {
    console.log('Saving Organization Settings:', { orgName, contactEmail, phone, address });
    alert('Organization settings saved locally!');
  };

  const handleAddVisaStage = () => {
    if (newVisaStage.trim() && !visaStages.includes(newVisaStage.trim())) {
      setVisaStages([...visaStages, newVisaStage.trim()]);
      setNewVisaStage('');
    }
  };

  const handleRemoveVisaStage = (stageToRemove: string) => {
    setVisaStages(visaStages.filter(stage => stage !== stageToRemove));
  };

  const handleSaveDefaults = () => {
    console.log('Saving Default Configurations:', { defaultCurrency, defaultCommission, visaStages });
    alert('Default configurations saved locally!');
  };

  const handleSaveDocSettings = () => {
    console.log('Saving Document Settings:', { enableFinancialTracking, enableSopRequired, enableLorRequired });
    alert('Document requirements settings saved locally!');
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Settings"
        subtitle="Manage your organization's settings and default configurations."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Settings */} 
        <Card className="border-none shadow-sm flex flex-col">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Organization Settings</h3>
          </div>
          
          <div className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Organization Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <button 
              onClick={handleSaveOrganization}
              className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Organization
            </button>
          </div>
        </Card>

        {/* Default Configurations */} 
        <Card className="border-none shadow-sm flex flex-col">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Default Configuration</h3>
          </div>

          <div className="space-y-6 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Default Currency</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select 
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white appearance-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Default Commission %</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</span>
                  <input 
                    type="number" 
                    value={defaultCommission}
                    onChange={(e) => setDefaultCommission(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block">Default Visa Stages</label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 min-h-[100px]">
                {visaStages.map(stage => (
                  <Badge key={stage} variant="indigo">
                    <div className="flex items-center space-x-1">
                      <span>{stage}</span>
                      <button 
                        onClick={() => handleRemoveVisaStage(stage)} 
                        className="hover:text-red-500 transition-colors ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </Badge>
                ))}
                {visaStages.length === 0 && (
                  <p className="text-xs text-gray-400 italic">No stages defined</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={newVisaStage}
                    onChange={(e) => setNewVisaStage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddVisaStage()}
                    placeholder="Add new visa stage..."
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  />
                </div>
                <button 
                  onClick={handleAddVisaStage}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <button 
              onClick={handleSaveDefaults}
              className="flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Defaults
            </button>
          </div>
        </Card>

        {/* Document Requirements Settings */} 
        <Card className="border-none shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Document Requirements</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Financial Document Tracking</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enable tracking of bank statements and funding docs</p>
              </div>
              <Switch 
                checked={enableFinancialTracking}
                onChange={setEnableFinancialTracking}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">SOP Required</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Statement of Purpose mandatory for all applications</p>
              </div>
              <Switch 
                checked={enableSopRequired}
                onChange={setEnableSopRequired}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">LOR Required</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Letters of Recommendation mandatory for all applications</p>
              </div>
              <Switch 
                checked={enableLorRequired}
                onChange={setEnableLorRequired}
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <button 
              onClick={handleSaveDocSettings}
              className="flex items-center px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Doc Settings
            </button>
          </div>
        </Card>

        {/* User Role Section (Display Only) */} 
        <Card className="border-none shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Roles</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 group transition-all">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-blue-500 shadow-sm mr-4">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Admin</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Full System Access</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 group transition-all">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-emerald-500 shadow-sm mr-4">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Counsellor</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Lead Management</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 group transition-all">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-orange-500 shadow-sm mr-4">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Visa Officer</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Visa Workflow</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 group transition-all">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-purple-500 shadow-sm mr-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Accounts</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Finance & Payments</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
            <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
              User roles are currently read-only. Role management will be available in the next update.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

