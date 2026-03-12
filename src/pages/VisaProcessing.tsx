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

const STAGE_COLORS: Record<string, string> = {
  'Documents Verified': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  'Financial Prepared': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Visa Form Filled': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Appointment Booked': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Interview Done': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Visa Approved': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Visa Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
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
    { label: 'Total Cases', value: visaCases.length, icon: ClipboardCheck, color: 'text-blue-600' },
    { label: 'Approved', value: visaCases.filter(s => s.visaResult === 'Approved').length, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Rejected', value: visaCases.filter(s => s.visaResult === 'Rejected').length, icon: XCircle, color: 'text-red-600' },
    { label: 'Upcoming', value: upcomingAppointments.length, icon: Calendar, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Visa Processing Board" 
        subtitle="Manage student visa applications and track interview schedules." 
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="flex items-center space-x-4 border-none shadow-sm">
            <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
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
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-blue-500 transition-all group"
                onClick={() => navigate(`/students/${appt.studentId}`)}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{appt.studentName}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center mt-1 uppercase tracking-wider">
                    <MapPin size={10} className="mr-1" /> {appt.country}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{appt.appointmentDate}</p>
                  <p className="text-[9px] text-gray-400 uppercase font-bold mt-0.5">Interview</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search student name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <Filter size={14} className="text-gray-400" />
            <select 
              className="bg-transparent text-sm focus:outline-none dark:text-white cursor-pointer"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
            >
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <CheckCircle2 size={14} className="text-gray-400" />
            <select 
              className="bg-transparent text-sm focus:outline-none dark:text-white cursor-pointer"
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
      </div>

      {/* Kanban Board */}
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {STAGES.map(stage => {
          const stageStudents = filteredCases.filter(s => s.currentStage === stage);
          return (
            <div key={stage} className="flex-shrink-0 w-80">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-gray-700 dark:text-gray-300 text-xs flex items-center uppercase tracking-widest">
                  {stage}
                  <span className="ml-2 px-2 py-0.5 text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {stageStudents.length}
                  </span>
                </h3>
              </div>
              
              <div className="space-y-4 min-h-[600px] bg-gray-100/30 dark:bg-gray-900/40 rounded-2xl p-3 border border-gray-200/50 dark:border-gray-800/50">
                {stageStudents.map(studentCase => {
                  const today = new Date('2026-03-12');
                  const apptDate = studentCase.appointmentDate ? new Date(studentCase.appointmentDate) : null;
                  const isUpcoming = apptDate && (
                    (apptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 7 &&
                    (apptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) >= 0
                  );
                  
                  // Urgency Border Logic
                  let borderClass = 'border-transparent';
                  if (studentCase.visaResult === 'Approved') borderClass = 'border-green-500';
                  else if (studentCase.visaResult === 'Rejected') borderClass = 'border-red-500';
                  else if (isUpcoming) borderClass = 'border-l-4 border-yellow-400';

                  return (
                    <Card 
                      key={studentCase.id} 
                      hoverable
                      className={`p-4 hover:shadow-lg transition-all border ${borderClass} bg-white dark:bg-gray-800`}
                      onClick={() => navigate(`/students/${studentCase.studentId}`)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {studentCase.studentName}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-tighter">ID: {studentCase.studentId}</p>
                        </div>
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <select
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                            onChange={(e) => handleMoveStage(studentCase.id, e.target.value)}
                            value={studentCase.currentStage}
                          >
                            {STAGES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                            <ArrowRightLeft size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                          <MapPin size={14} className="mr-2 text-gray-400" />
                          {studentCase.country}
                        </div>
                        
                        {studentCase.appointmentDate && (
                          <div className={`flex items-center text-xs p-2 rounded-lg ${isUpcoming ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400'}`}>
                            <Calendar size={14} className="mr-2" />
                            <span className="font-bold">{studentCase.appointmentDate}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${STAGE_COLORS[stage]}`}>
                            {stage}
                          </span>
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {stageStudents.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl opacity-30">
                    <ClipboardCheck size={24} className="text-gray-300 mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Empty Stage</p>
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
