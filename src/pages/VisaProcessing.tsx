import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  ArrowRightLeft,
  MapPin,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { visaCases as MOCK_VISA_CASES } from '../data/mockData';

interface VisaCase {
  id: string;
  studentId: string;
  studentName: string;
  country: string;
  currentStage: string;
  appointmentDate?: string;
  visaResult?: string;
}

const STAGES = [
  'Documents Verified',
  'Financial Prepared',
  'Visa Form Filled',
  'Appointment Booked',
  'Interview Done',
  'Visa Approved',
  'Visa Rejected'
];

const STAGE_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Documents Verified': { bg: 'bg-slate-100 dark:bg-slate-800/50', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700', dot: 'bg-slate-400' },
  'Financial Prepared': { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-400' },
  'Visa Form Filled': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-400' },
  'Appointment Booked': { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800', dot: 'bg-violet-500' },
  'Interview Done': { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', dot: 'bg-indigo-400' },
  'Visa Approved': { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  'Visa Rejected': { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800', dot: 'bg-red-400' },
};

const VisaProcessing: React.FC = () => {
  const navigate = useNavigate();
  
  // Load from localStorage or mock data for persistence across sessions
  const [visaCases, setVisaCases] = useState<VisaCase[]>(() => {
    const saved = localStorage.getItem('kalnet_visa_cases');
    return saved ? JSON.parse(saved) : MOCK_VISA_CASES;
  });

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [resultFilter, setResultFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Persist changes to simulate a real operational board
  useEffect(() => {
    localStorage.setItem('kalnet_visa_cases', JSON.stringify(visaCases));
  }, [visaCases]);

  const handleMoveStage = (caseId: string, newStage: string) => {
    setVisaCases(prev => prev.map(c => {
      if (c.id === caseId) {
        let visaResult = c.visaResult;
        if (newStage === 'Visa Approved') visaResult = 'Approved';
        else if (newStage === 'Visa Rejected') visaResult = 'Rejected';
        else visaResult = 'Pending';
        
        return { ...c, currentStage: newStage, visaResult };
      }
      return c;
    }));
  };

  // Filtered cases based on user input
  const filteredCases = useMemo(() => {
    return visaCases.filter(c => {
      const matchesSearch = c.studentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = countryFilter === 'All' || c.country === countryFilter;
      const matchesResult = resultFilter === 'All' || (c.visaResult || 'Pending') === resultFilter;
      return matchesSearch && matchesCountry && matchesResult;
    });
  }, [visaCases, searchQuery, countryFilter, resultFilter]);

  // Upcoming appointments (Next 7 days from current date)
  const upcomingAppointments = useMemo(() => {
    const today = new Date('2026-03-12');
    const nextWeek = new Date('2026-03-12');
    nextWeek.setDate(today.getDate() + 7);
    
    return visaCases.filter(c => {
      if (!c.appointmentDate) return false;
      const apptDate = new Date(c.appointmentDate);
      return apptDate >= today && apptDate <= nextWeek;
    }).sort((a, b) => new Date(a.appointmentDate!).getTime() - new Date(b.appointmentDate!).getTime());
  }, [visaCases]);

  const countries = useMemo(() => {
    return ['All', ...new Set(visaCases.map(c => c.country))];
  }, [visaCases]);

  const stats = [
    { label: 'Total Cases', value: visaCases.length, icon: ClipboardCheck, color: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Approved', value: visaCases.filter(s => s.visaResult === 'Approved').length, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { label: 'Rejected', value: visaCases.filter(s => s.visaResult === 'Rejected').length, icon: XCircle, color: 'text-red-600 dark:text-red-400', iconBg: 'bg-red-100 dark:bg-red-900/20' },
    { label: 'Upcoming Interviews', value: upcomingAppointments.length, icon: Calendar, color: 'text-violet-600 dark:text-violet-400', iconBg: 'bg-violet-100 dark:bg-violet-900/20' },
  ];

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Visa Processing Board" 
        subtitle="Manage student visa applications and track interview schedules." 
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-4 text-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.iconBg} mx-auto mb-2`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Upcoming Interviews Card */}
      {upcomingAppointments.length > 0 && (
        <Card className="border-l-4 border-yellow-400 overflow-hidden bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle size={18} className="text-yellow-500" />
              <h3 className="font-bold text-gray-900 dark:text-white">Upcoming Interviews (Next 7 Days)</h3>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {upcomingAppointments.length} scheduled
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAppointments.map(appt => (
              <div 
                key={appt.id} 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-sm transition-all duration-200 group"
                onClick={() => navigate(`/students/${appt.studentId}`)}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">{appt.studentName}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center mt-1 uppercase tracking-wider">
                    <MapPin size={10} className="mr-1" /> {appt.country}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{appt.appointmentDate}</p>
                  <p className="text-[9px] text-gray-400 uppercase font-bold mt-0.5">Interview</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters Row */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search student name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              showFilters
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Destination Country</label>
              <select 
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Visa Result</label>
              <select 
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white"
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
              >
                <option value="All">All Results</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-6 -mx-2 px-2">
        {STAGES.map(stage => {
          const stageStudents = filteredCases.filter(s => s.currentStage === stage);
          const colors = STAGE_COLORS[stage];
          return (
            <div key={stage} className="min-w-[260px] max-w-[290px] flex-shrink-0 flex flex-col">
              {/* Column Header */}
              <div className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl border ${colors.border} ${colors.bg}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  <h3 className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>{stage}</h3>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                  {stageStudents.length}
                </span>
              </div>

              {/* Column Body */}
              <div className="flex-1 space-y-3 p-2.5 bg-gray-50/50 dark:bg-gray-900/30 border-x border-b border-gray-100 dark:border-gray-800 rounded-b-xl min-h-[200px]">
                {stageStudents.map(studentCase => {
                  const today = new Date('2026-03-12');
                  const apptDate = studentCase.appointmentDate ? new Date(studentCase.appointmentDate) : null;
                  const isUpcoming = apptDate && (
                    (apptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 7 &&
                    (apptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) >= 0
                  );

                  return (
                    <div
                      key={studentCase.id}
                      onClick={() => navigate(`/students/${studentCase.studentId}`)}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3.5 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 cursor-pointer group"
                    >
                      {/* Name & Move Button */}
                      <div className="flex items-start justify-between mb-2.5">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                            {studentCase.studentName}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5 tracking-tight">ID: {studentCase.studentId}</p>
                        </div>
                        <div className="relative flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                          <select
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                            onChange={(e) => handleMoveStage(studentCase.id, e.target.value)}
                            value={studentCase.currentStage}
                          >
                            {STAGES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                            <ArrowRightLeft size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Country */}
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mb-2">
                        <MapPin className="w-3 h-3 mr-1.5 text-gray-400 flex-shrink-0" />
                        {studentCase.country}
                      </div>

                      {/* Appointment date */}
                      {studentCase.appointmentDate && (
                        <div className={`flex items-center text-xs p-2 rounded-lg mb-2 ${isUpcoming ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400'}`}>
                          <Calendar className="w-3 h-3 mr-1.5 flex-shrink-0" />
                          <span className="font-semibold">{studentCase.appointmentDate}</span>
                          {isUpcoming && <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Soon</span>}
                        </div>
                      )}

                      {/* Footer: Stage badge & arrow */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${colors.bg} ${colors.text}`}>
                          {stage}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors duration-200" />
                      </div>
                    </div>
                  );
                })}

                {stageStudents.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                      <ClipboardCheck className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">No cases in this stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisaProcessing;
