import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import {
  Plus,
  Search,
  X,
  Phone,
  Globe,
  GraduationCap,
  UserCheck,
  BookOpen,
  StickyNote,
  ArrowRight,
  Users,
  CheckCircle2,
  XCircle,
  Filter,
  ChevronDown,
  MessageSquare,
  Send,
  TrendingUp,
  FileText,
  MapPin,
} from 'lucide-react';
import { leads as INITIAL_LEADS, applications as APPS_DATA, type PipelineStage, type PipelineLead, LEAD_SOURCES } from '../data/mockData';

const PIPELINE_STAGES: PipelineStage[] = [
  'New Inquiry',
  'Initial Counseling',
  'Destination Selection',
  'Course Shortlisting',
  'University Selection',
  'Application Preparation',
  'Application Started',
  'Converted',
  'Lost',
];

const STAGE_COLORS: Record<PipelineStage, { bg: string; text: string; border: string; dot: string }> = {
  'New Inquiry': { bg: 'bg-sky-50 dark:bg-sky-900/10', text: 'text-sky-700 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800', dot: 'bg-sky-500' },
  'Initial Counseling': { bg: 'bg-amber-50 dark:bg-amber-900/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  'Destination Selection': { bg: 'bg-teal-50 dark:bg-teal-900/10', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800', dot: 'bg-teal-500' },
  'Course Shortlisting': { bg: 'bg-violet-50 dark:bg-violet-900/10', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800', dot: 'bg-violet-500' },
  'University Selection': { bg: 'bg-indigo-50 dark:bg-indigo-900/10', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', dot: 'bg-indigo-500' },
  'Application Preparation': { bg: 'bg-cyan-50 dark:bg-cyan-900/10', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800', dot: 'bg-cyan-500' },
  'Application Started': { bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' },
  'Converted': { bg: 'bg-emerald-50 dark:bg-emerald-900/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  'Lost': { bg: 'bg-red-50 dark:bg-red-900/10', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800', dot: 'bg-red-500' },
};

const COUNSELORS = ['Ravi Mehta', 'Anjali Rao'];
const COUNTRIES = ['Australia', 'United Kingdom', 'Canada', 'United States', 'New Zealand', 'Germany'];
const LEVELS = ['Bachelors', 'Masters', 'PhD', 'Diploma'];

const CounselingPipeline: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<PipelineLead[]>(INITIAL_LEADS);
  const [applications, setApplications] = useState(APPS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCountry, setFilterCountry] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterTestStatus, setFilterTestStatus] = useState('All');
  const [filterCounselor, setFilterCounselor] = useState('All');
  const [filterSource, setFilterSource] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<PipelineLead | null>(null);
  const [moveTarget, setMoveTarget] = useState<PipelineStage>('New Inquiry');
  const [newNote, setNewNote] = useState('');
  const [assignTarget, setAssignTarget] = useState('');
  const [destinationTarget, setDestinationTarget] = useState('');

  // Add Lead form state
  const [newLead, setNewLead] = useState({
    name: '', phone: '', email: '',
    source: 'Walk-in' as PipelineLead['source'],
    interestedCountry: '', targetLevel: 'Masters',
    assignedCounsellor: 'Ravi Mehta',
  });

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = filterCountry === 'All' || lead.interestedCountry === filterCountry;
      const matchesLevel = filterLevel === 'All' || lead.targetLevel === filterLevel;
      const matchesTest = filterTestStatus === 'All' || lead.testStatus === filterTestStatus;
      const matchesCounselor = filterCounselor === 'All' || lead.assignedCounsellor === filterCounselor;
      const matchesSource = filterSource === 'All' || lead.source === filterSource;
      return matchesSearch && matchesCountry && matchesLevel && matchesTest && matchesCounselor && matchesSource;
    });
  }, [leads, searchQuery, filterCountry, filterLevel, filterTestStatus, filterCounselor, filterSource]);

  // Metrics
  const metrics = useMemo(() => {
    const activeStages: PipelineStage[] = ['New Inquiry', 'Initial Counseling', 'Destination Selection', 'Course Shortlisting', 'University Selection', 'Application Preparation', 'Application Started'];
    const counselingStages: PipelineStage[] = ['Initial Counseling', 'Destination Selection', 'Course Shortlisting', 'University Selection', 'Application Preparation'];
    const total = leads.length;
    const converted = leads.filter(l => l.status === 'Converted').length;
    const lost = leads.filter(l => l.status === 'Lost').length;
    const closed = converted + lost;
    return {
      totalActive: leads.filter(l => activeStages.includes(l.status)).length,
      inCounseling: leads.filter(l => counselingStages.includes(l.status)).length,
      awaitingTestPrep: leads.filter(l => (l.testStatus === 'Enrolled' || l.testStatus === 'Not Taken') && l.status !== 'Lost' && l.status !== 'Converted').length,
      appStarted: leads.filter(l => l.status === 'Application Started').length,
      conversionRate: closed > 0 ? Math.round((converted / closed) * 100) : 0,
    };
  }, [leads]);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: PipelineLead = {
      ...newLead,
      id: String(leads.length + 1 + Math.floor(Math.random() * 100)),
      status: 'New Inquiry',
      testStatus: 'Not Taken',
    };
    setLeads([entry, ...leads]);
    setIsAddModalOpen(false);
    setNewLead({ name: '', phone: '', email: '', source: 'Walk-in', interestedCountry: '', targetLevel: 'Masters', assignedCounsellor: 'Ravi Mehta' });
  };

  const handleMoveStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    // Auto-create application when moving to "Application Started"
    if (moveTarget === 'Application Started' && selectedLead.status !== 'Application Started') {
      const alreadyHasApp = applications.some(a => a.studentId === selectedLead.studentId && selectedLead.studentId);
      if (!alreadyHasApp) {
        const newApp = {
          id: `APP${String(applications.length + 1).padStart(3, '0')}`,
          studentId: selectedLead.studentId || selectedLead.id,
          university: 'To Be Assigned',
          course: selectedLead.preferredCourses?.[0] || 'To Be Assigned',
          country: selectedLead.interestedCountry || 'To Be Assigned',
          intake: selectedLead.intakeTarget || 'Fall 2026',
          status: 'Draft',
        };
        setApplications([...applications, newApp]);
      }
    }

    setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: moveTarget } : l));
    setIsMoveModalOpen(false);
    setSelectedLead(null);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;
    setLeads(leads.map(l => l.id === selectedLead.id ? {
      ...l,
      counselorNotes: [newNote.trim(), ...(l.counselorNotes || [])],
    } : l));
    setIsNoteModalOpen(false);
    setNewNote('');
    setSelectedLead(null);
  };

  const handleAssignCounselor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, assignedCounsellor: assignTarget } : l));
    setIsAssignModalOpen(false);
    setSelectedLead(null);
  };

  const handleAssignDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, interestedCountry: destinationTarget } : l));
    setIsDestinationModalOpen(false);
    setSelectedLead(null);
  };

  const handleEnrollTestPrep = (lead: PipelineLead) => {
    setLeads(leads.map(l => l.id === lead.id ? { ...l, testStatus: 'Enrolled' } : l));
    navigate('/test-preparation');
  };

  const handleStartApplication = (lead: PipelineLead) => {
    // Auto-create application record
    const alreadyHasApp = applications.some(a => a.studentId === lead.studentId && lead.studentId);
    if (!alreadyHasApp) {
      const newApp = {
        id: `APP${String(applications.length + 1).padStart(3, '0')}`,
        studentId: lead.studentId || lead.id,
        university: 'To Be Assigned',
        course: lead.preferredCourses?.[0] || 'To Be Assigned',
        country: lead.interestedCountry || 'To Be Assigned',
        intake: lead.intakeTarget || 'Fall 2026',
        status: 'Draft',
      };
      setApplications([...applications, newApp]);
    }
    setLeads(leads.map(l => l.id === lead.id ? { ...l, status: 'Application Started' } : l));
  };

  const openMoveModal = (e: React.MouseEvent, lead: PipelineLead) => {
    e.stopPropagation();
    setSelectedLead(lead);
    setMoveTarget(lead.status);
    setIsMoveModalOpen(true);
  };

  const openNoteModal = (e: React.MouseEvent, lead: PipelineLead) => {
    e.stopPropagation();
    setSelectedLead(lead);
    setNewNote('');
    setIsNoteModalOpen(true);
  };

  const openAssignModal = (e: React.MouseEvent, lead: PipelineLead) => {
    e.stopPropagation();
    setSelectedLead(lead);
    setAssignTarget(lead.assignedCounsellor);
    setIsAssignModalOpen(true);
  };

  const openDestinationModal = (e: React.MouseEvent, lead: PipelineLead) => {
    e.stopPropagation();
    setSelectedLead(lead);
    setDestinationTarget(lead.interestedCountry || '');
    setIsDestinationModalOpen(true);
  };

  const getTestBadge = (lead: PipelineLead) => {
    switch (lead.testStatus) {
      case 'Not Taken': return <Badge variant="error">No Test</Badge>;
      case 'Enrolled': return <Badge variant="warning">{lead.testType || 'Test'}: Enrolled</Badge>;
      case 'Score Available': return <Badge variant="success">{lead.testType}: {lead.testScore}</Badge>;
    }
  };

  const handleCardClick = (lead: PipelineLead) => {
    if (lead.studentId) {
      navigate(`/students/${lead.studentId}`);
    } else {
      navigate(`/counseling/${lead.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader
          title="Counseling Pipeline"
          subtitle="Study Abroad Counseling Division — Track students from inquiry to conversion."
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card shadowColor="blue" className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 mx-auto mb-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalActive}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active Leads</div>
        </Card>
        <Card shadowColor="violet" className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/20 mx-auto mb-2">
            <MessageSquare className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.inCounseling}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">In Counseling</div>
        </Card>
        <Card shadowColor="amber" className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 mx-auto mb-2">
            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.awaitingTestPrep}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Awaiting Test Prep</div>
        </Card>
        <Card shadowColor="blue" className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 mx-auto mb-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.appStarted}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Applications Started</div>
        </Card>
        <Card shadowColor="emerald" className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 mx-auto mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.conversionRate}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Conversion Rate</div>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Destination</label>
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white"
              >
                <option value="All">All Destinations</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Study Level</label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white"
              >
                <option value="All">All Levels</option>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Test Status</label>
              <select
                value={filterTestStatus}
                onChange={(e) => setFilterTestStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white"
              >
                <option value="All">All Statuses</option>
                <option value="Not Taken">Not Taken</option>
                <option value="Enrolled">Enrolled</option>
                <option value="Score Available">Score Available</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Counselor</label>
              <select
                value={filterCounselor}
                onChange={(e) => setFilterCounselor(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white"
              >
                <option value="All">All Counselors</option>
                {COUNSELORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Lead Source</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white"
              >
                <option value="All">All Sources</option>
                {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Kanban Pipeline */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2">
        {PIPELINE_STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter(l => l.status === stage);
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
                  {stageLeads.length}
                </span>
              </div>

              {/* Column Body */}
              <div className="flex-1 space-y-3 p-2.5 bg-gray-50/50 dark:bg-gray-900/30 border-x border-b border-gray-100 dark:border-gray-800 rounded-b-xl min-h-[200px]">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => handleCardClick(lead)}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3.5 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 cursor-pointer group"
                  >
                    {/* Name & Counselor Avatar */}
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {lead.name}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{lead.phone}</span>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2"
                        title={lead.assignedCounsellor}
                      >
                        {lead.assignedCounsellor.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>

                    {/* Destination & Level */}
                    <div className="space-y-1.5 mb-2.5">
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                        <MapPin className="w-3 h-3 mr-1.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{lead.interestedCountry || 'Not Selected'}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                        <GraduationCap className="w-3 h-3 mr-1.5 text-gray-400 flex-shrink-0" />
                        {lead.targetLevel}
                      </div>
                    </div>

                    {/* Test Status Badge */}
                    <div className="mb-2">{getTestBadge(lead)}</div>

                    {/* Source Badge */}
                    <div className="mb-2.5">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {lead.source}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-50 dark:border-gray-700/50">
                      <button
                        onClick={(e) => openMoveModal(e, lead)}
                        className="flex items-center px-2 py-1 text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-md transition-colors"
                      >
                        <ArrowRight className="w-3 h-3 mr-0.5" />Move
                      </button>
                      <button
                        onClick={(e) => openAssignModal(e, lead)}
                        className="flex items-center px-2 py-1 text-[10px] font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <UserCheck className="w-3 h-3 mr-0.5" />Assign
                      </button>
                      <button
                        onClick={(e) => openNoteModal(e, lead)}
                        className="flex items-center px-2 py-1 text-[10px] font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-md transition-colors"
                      >
                        <StickyNote className="w-3 h-3 mr-0.5" />Note
                      </button>
                      {!lead.interestedCountry && lead.status !== 'Lost' && lead.status !== 'Converted' && (
                        <button
                          onClick={(e) => openDestinationModal(e, lead)}
                          className="flex items-center px-2 py-1 text-[10px] font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-md transition-colors"
                        >
                          <Globe className="w-3 h-3 mr-0.5" />Destination
                        </button>
                      )}
                      {lead.testStatus === 'Not Taken' && lead.status !== 'Lost' && lead.status !== 'Converted' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEnrollTestPrep(lead); }}
                          className="flex items-center px-2 py-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-md transition-colors"
                        >
                          <BookOpen className="w-3 h-3 mr-0.5" />Test Prep
                        </button>
                      )}
                      {(lead.status === 'Application Preparation' || lead.status === 'University Selection') && lead.testStatus === 'Score Available' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStartApplication(lead); }}
                          className="flex items-center px-2 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-md transition-colors"
                        >
                          <Send className="w-3 h-3 mr-0.5" />Apply
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">No leads in this stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <Card className="relative w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Lead</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input required value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" placeholder="Full name" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input required value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" placeholder="+91 00000 00000" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input required type="email" value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" placeholder="email@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Source</label>
                  <select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                    {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Target Level</label>
                  <select value={newLead.targetLevel} onChange={e => setNewLead({ ...newLead, targetLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Counselor</label>
                <select value={newLead.assignedCounsellor} onChange={e => setNewLead({ ...newLead, assignedCounsellor: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                  {COUNSELORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Add Lead</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MOVE STAGE MODAL */}
      {isMoveModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMoveModalOpen(false)} />
          <Card className="relative w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Move Stage</h3>
              <button onClick={() => setIsMoveModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Moving <span className="font-semibold text-gray-900 dark:text-white">{selectedLead.name}</span> from <Badge variant="info">{selectedLead.status}</Badge></p>
            <form onSubmit={handleMoveStage} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">New Stage</label>
                <select required value={moveTarget} onChange={e => setMoveTarget(e.target.value as PipelineStage)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                  {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {moveTarget === 'Application Started' && selectedLead.status !== 'Application Started' && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center"><FileText className="w-3 h-3 mr-1.5" />An application record will be auto-created in the Applications module.</p>
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsMoveModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Move</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ADD NOTE MODAL */}
      {isNoteModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsNoteModalOpen(false)} />
          <Card className="relative w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Counseling Notes</h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Notes for <span className="font-semibold text-gray-900 dark:text-white">{selectedLead.name}</span></p>
            {selectedLead.counselorNotes && selectedLead.counselorNotes.length > 0 && (
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {selectedLead.counselorNotes.map((note, i) => (
                  <div key={i} className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                    {note}
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleAddNote} className="space-y-4">
              <textarea
                required
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add a counseling note..."
                className="w-full h-24 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white resize-none"
              />
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setIsNoteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Save Note</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ASSIGN COUNSELOR MODAL */}
      {isAssignModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAssignModalOpen(false)} />
          <Card className="relative w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Assign Counselor</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAssignCounselor} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Counselor for {selectedLead.name}</label>
                <select required value={assignTarget} onChange={e => setAssignTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                  {COUNSELORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Assign</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ASSIGN DESTINATION MODAL */}
      {isDestinationModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDestinationModalOpen(false)} />
          <Card className="relative w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Set Destination</h3>
              <button onClick={() => setIsDestinationModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAssignDestination} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Destination for {selectedLead.name}</label>
                <select required value={destinationTarget} onChange={e => setDestinationTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white">
                  <option value="">Select a destination...</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsDestinationModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Set Destination</button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CounselingPipeline;
