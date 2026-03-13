import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import {
  ArrowLeft,
  CheckCircle2,
  User,
  Activity,
  StickyNote,
  Phone,
  Mail,
  Globe,
  GraduationCap,
  UserCheck,
  Save,
  Clock,
  Plus,
  AlertCircle,
  Trash2,
  Edit3,
  PhoneCall,
  MessageSquare,
  CalendarCheck,
  ArrowRight,
  XCircle,
  BookOpen,
  Target,
  DollarSign,
  Calendar,
  Lock,
  ShieldAlert,
} from 'lucide-react';
import { leads as LEADS_DATA, type PipelineStage, type PipelineLead, LEAD_SOURCES } from '../data/mockData';

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

interface Note {
  id: string;
  text: string;
  date: string;
  user: string;
}

interface ActivityEvent {
  id: string;
  type: 'created' | 'contacted' | 'counselling' | 'destination' | 'shortlisted' | 'university' | 'preparation' | 'application' | 'converted' | 'lost' | 'follow-up' | 'note';
  title: string;
  description: string;
  date: string;
}

const generateActivities = (lead: PipelineLead): ActivityEvent[] => {
  const stageIndex = PIPELINE_STAGES.indexOf(lead.status);
  const events: ActivityEvent[] = [
    { id: '1', type: 'created', title: 'Lead Created', description: `Lead captured via ${lead.source}`, date: '2026-02-20 09:00 AM' },
  ];

  if (stageIndex >= 1) {
    events.push({ id: '2', type: 'contacted', title: 'Initial Counseling Started', description: `${lead.assignedCounsellor} conducted first counseling session`, date: '2026-02-22 11:30 AM' });
  }
  if (stageIndex >= 2) {
    events.push({ id: '2b', type: 'destination', title: 'Destination Selected', description: `Preferred destination set to ${lead.interestedCountry || 'TBD'}`, date: '2026-02-23 03:00 PM' });
  }
  if (stageIndex >= 3) {
    events.push({ id: '3', type: 'shortlisted', title: 'Courses Shortlisted', description: `Shortlisted ${lead.preferredCourses?.length || 0} courses for ${lead.interestedCountry || 'selected destination'}`, date: '2026-02-25 02:00 PM' });
  }
  if (stageIndex >= 4) {
    events.push({ id: '4', type: 'university', title: 'Universities Selected', description: `Target universities finalized for ${lead.targetLevel} in ${lead.interestedCountry || 'selected destination'}`, date: '2026-02-28 10:00 AM' });
  }
  if (stageIndex >= 5) {
    events.push({ id: '4b', type: 'preparation', title: 'Application Preparation', description: 'Documents and application materials being prepared', date: '2026-03-01 11:00 AM' });
  }
  if (stageIndex >= 6) {
    events.push({ id: '5', type: 'application', title: 'Application Started', description: 'Application process initiated with selected universities', date: '2026-03-02 09:00 AM' });
  }
  if (lead.status === 'Converted') {
    events.push({ id: '6', type: 'converted', title: 'Converted to Student', description: 'Lead successfully converted and student record created', date: '2026-03-05 10:00 AM' });
  }
  if (lead.status === 'Lost') {
    events.push({ id: '7', type: 'lost', title: 'Lead Lost', description: 'Lead did not proceed after follow-ups', date: '2026-03-05 04:00 PM' });
  }
  if (stageIndex === 0) {
    events.push({ id: '8', type: 'follow-up', title: 'Follow-up Pending', description: 'Awaiting first counseling session', date: '' });
  }
  return events;
};

const generateNotes = (lead: PipelineLead): Note[] => {
  const notes: Note[] = [];
  if (lead.counselorNotes) {
    lead.counselorNotes.forEach((note, i) => {
      notes.push({ id: String(i + 1), text: note, date: `2026-02-${20 + i} 10:00 AM`, user: lead.assignedCounsellor });
    });
  }
  if (notes.length === 0) {
    notes.push({ id: '1', text: `New lead interested in ${lead.targetLevel} programs in ${lead.interestedCountry}.`, date: '2026-02-20 10:00 AM', user: lead.assignedCounsellor });
  }
  return notes;
};

const LeadProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [adminCorrectionOpen, setAdminCorrectionOpen] = useState(false);
  const [correctedSource, setCorrectedSource] = useState<string>('');

  const lead = LEADS_DATA.find(l => l.id === id);
  const [status, setStatus] = useState<PipelineStage>(lead?.status || 'New Inquiry');
  const [displaySource, setDisplaySource] = useState(lead?.source || '');
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Note[]>(lead ? generateNotes(lead) : []);

  const activities = useMemo(() => lead ? generateActivities(lead) : [], [lead]);

  const handleAdminCorrectionSubmit = () => {
    if (correctedSource && correctedSource !== displaySource) {
      setDisplaySource(correctedSource as typeof lead.source);
    }
    setAdminCorrectionOpen(false);
  };

  if (!lead) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate('/counseling')} className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Pipeline
        </button>
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lead Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">The lead with ID {id} could not be found.</p>
          <button onClick={() => navigate('/counseling')} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all">Return to Pipeline</button>
        </Card>
      </div>
    );
  }

  const handleStatusChange = (newStatus: PipelineStage) => setStatus(newStatus);
  const currentStageIndex = PIPELINE_STAGES.indexOf(status);

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    setNotes([{ id: Math.random().toString(36).substr(2, 9), text: noteText, date: new Date().toLocaleString(), user: 'Admin' }, ...notes]);
    setNoteText('');
  };

  const handleDeleteNote = (noteId: string) => setNotes(notes.filter(n => n.id !== noteId));

  const getStatusBadge = (s: PipelineStage) => {
    const map: Record<PipelineStage, 'info' | 'warning' | 'success' | 'error'> = {
      'New Inquiry': 'info',
      'Initial Counseling': 'warning',
      'Destination Selection': 'info',
      'Course Shortlisting': 'info',
      'University Selection': 'info',
      'Application Preparation': 'warning',
      'Application Started': 'warning',
      'Converted': 'success',
      'Lost': 'error',
    };
    return <Badge variant={map[s]}>{s}</Badge>;
  };

  const getTestBadge = () => {
    switch (lead.testStatus) {
      case 'Not Taken': return <Badge variant="error">No Test</Badge>;
      case 'Enrolled': return <Badge variant="warning">{lead.testType || 'Test'}: Enrolled</Badge>;
      case 'Score Available': return <Badge variant="success">{lead.testType}: {lead.testScore}</Badge>;
    }
  };

  const getActivityIcon = (type: ActivityEvent['type']) => {
    const map: Record<string, React.ReactNode> = {
      created: <Plus className="w-5 h-5" />,
      contacted: <PhoneCall className="w-5 h-5" />,
      counselling: <MessageSquare className="w-5 h-5" />,
      destination: <Globe className="w-5 h-5" />,
      shortlisted: <BookOpen className="w-5 h-5" />,
      university: <GraduationCap className="w-5 h-5" />,
      preparation: <CalendarCheck className="w-5 h-5" />,
      application: <CalendarCheck className="w-5 h-5" />,
      converted: <CheckCircle2 className="w-5 h-5" />,
      lost: <XCircle className="w-5 h-5" />,
      'follow-up': <Clock className="w-5 h-5" />,
      note: <StickyNote className="w-5 h-5" />,
    };
    return map[type];
  };

  const getActivityColor = (type: ActivityEvent['type']) => {
    const map: Record<string, string> = {
      created: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      contacted: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      counselling: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      destination: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
      shortlisted: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
      university: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
      preparation: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
      application: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      converted: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      lost: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      'follow-up': 'bg-gray-50 dark:bg-gray-700 text-gray-400',
      note: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    };
    return map[type];
  };

  const tabs = [
    { name: 'Overview', icon: User },
    { name: 'Activity', icon: Activity },
    { name: 'Notes', icon: StickyNote },
  ];

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/counseling')} className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Pipeline
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">
            {lead.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h1>
              <div className="relative group/status">
                <select value={status} onChange={(e) => handleStatusChange(e.target.value as PipelineStage)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                  {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {getStatusBadge(status)}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lead ID: {lead.id} • Source: {lead.source} • {lead.assignedCounsellor}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status !== 'Converted' && status !== 'Lost' && (
            <button onClick={() => handleStatusChange('Converted')} className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Convert to Student
            </button>
          )}
          <button className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium">
            <Edit3 className="w-4 h-4 mr-2" /> Edit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 dark:border-gray-800">
        {tabs.map((tab) => (
          <button key={tab.name} onClick={() => setActiveTab(tab.name)}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-[2px] ${
              activeTab === tab.name ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}>
            <tab.icon className="w-4 h-4 mr-2" /> {tab.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Info */}
            <Card className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Basic Information</h3>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: 'Phone', value: lead.phone },
                  { icon: Mail, label: 'Email', value: lead.email },
                  { icon: Globe, label: 'Destination', value: lead.interestedCountry || 'Not Selected' },
                  { icon: GraduationCap, label: 'Target Level', value: lead.targetLevel },
                  { icon: UserCheck, label: 'Counsellor', value: lead.assignedCounsellor },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center text-sm">
                    <Icon className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400 w-32">{label}:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{value}</span>
                  </div>
                ))}

                {/* Source — immutable with admin correction */}
                <div className="flex items-start text-sm">
                  <Globe className="w-4 h-4 mr-3 text-gray-400 mt-0.5" />
                  <span className="text-gray-500 dark:text-gray-400 w-32">Source:</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {displaySource}
                      </span>
                      <Lock className="w-3 h-3 text-amber-500" title="Source is immutable" />
                    </div>
                    <button
                      onClick={() => { setCorrectedSource(displaySource); setAdminCorrectionOpen(true); }}
                      className="mt-1.5 text-[10px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3 h-3" /> Admin correction
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pipeline Stages */}
            <Card className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Pipeline Progress</h3>
              <div className="space-y-3">
                {PIPELINE_STAGES.filter(s => s !== 'Lost').map((stage, index) => {
                  const isCompleted = index < currentStageIndex || (status === 'Converted' && index <= PIPELINE_STAGES.indexOf('Converted'));
                  const isCurrent = stage === status;
                  return (
                    <div key={stage} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className={`text-sm font-medium flex-1 ${isCompleted ? 'text-green-600 dark:text-green-400' : isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>{stage}</span>
                      {isCurrent && <Badge variant="info">Current</Badge>}
                    </div>
                  );
                })}
                {status === 'Lost' && (
                  <div className="flex items-center gap-3 mt-2 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">Lead Lost</span>
                  </div>
                )}
              </div>
              {status !== 'Converted' && status !== 'Lost' && currentStageIndex < PIPELINE_STAGES.indexOf('Converted') && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={() => handleStatusChange(PIPELINE_STAGES[currentStageIndex + 1])}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200">
                    <ArrowRight className="w-4 h-4 mr-2" /> Move to {PIPELINE_STAGES[currentStageIndex + 1]}
                  </button>
                </div>
              )}
            </Card>

            {/* Details Panel */}
            <div className="space-y-4">
              {/* Test Status */}
              <Card className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Test Status</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                  {getTestBadge()}
                </div>
              </Card>

              {/* Preferences */}
              <Card className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Preferences</h3>
                <div className="space-y-3">
                  {lead.preferredCourses && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center mb-1.5"><Target className="w-3 h-3 mr-1" />Preferred Courses</span>
                      <div className="flex flex-wrap gap-1.5">
                        {lead.preferredCourses.map(c => <span key={c} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">{c}</span>)}
                      </div>
                    </div>
                  )}
                  {lead.budgetRange && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center"><DollarSign className="w-3 h-3 mr-1" />Budget:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{lead.budgetRange}</span>
                    </div>
                  )}
                  {lead.intakeTarget && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center"><Calendar className="w-3 h-3 mr-1" />Intake:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{lead.intakeTarget}</span>
                    </div>
                  )}
                  {lead.academicGoals && (
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center mb-1"><Target className="w-3 h-3 mr-1" />Academic Goals:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{lead.academicGoals}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{notes.length}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Notes</div>
                </Card>
                <Card className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{activities.length}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Activities</div>
                </Card>
              </div>

              {status === 'Converted' && (
                <Card className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 flex flex-col items-center justify-center p-6 text-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400 mb-3" />
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-100">Successfully Converted</h4>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">This lead is now a student.</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'Activity' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Activity Timeline</h3>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-100 dark:before:via-gray-700 before:to-transparent">
              {activities.map((event) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-start md:space-x-10">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ring-8 ring-white dark:ring-gray-800 z-10 ${getActivityColor(event.type)}`}>
                    {getActivityIcon(event.type)}
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{event.description}</p>
                    {event.date && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center"><Clock className="w-3 h-3 mr-1" />{event.date}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* NOTES TAB */}
        {activeTab === 'Notes' && (
          <div className="space-y-6 max-w-3xl">
            <Card className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Note</h3>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Type your note here..."
                className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white resize-none" />
              <div className="flex justify-end">
                <button onClick={handleSaveNote} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm shadow-sm">
                  <Save className="w-4 h-4 mr-2" /> Save Note
                </button>
              </div>
            </Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-2">Timeline Notes</h3>
              {notes.length > 0 ? notes.map((note) => (
                <Card key={note.id} className="p-5 relative group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">{note.user[0]}</div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{note.user}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center"><Clock className="w-3 h-3 mr-1" />{note.date}</div>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteNote(note.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">{note.text}</p>
                </Card>
              )) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">No notes recorded yet.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Admin Source Correction Modal */}
      {adminCorrectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAdminCorrectionOpen(false)} />
          <Card className="relative w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Admin Source Correction</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">This action is audited and irreversible.</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Current Source</p>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{displaySource}</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Corrected Source</label>
                <select
                  value={correctedSource}
                  onChange={e => setCorrectedSource(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white"
                >
                  {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg px-3 py-2">
                Source corrections are logged for audit purposes. Only perform this if the original source was recorded in error.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 mt-5">
              <button onClick={() => setAdminCorrectionOpen(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={handleAdminCorrectionSubmit}
                disabled={!correctedSource || correctedSource === displaySource}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                Apply Correction
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LeadProfile;
