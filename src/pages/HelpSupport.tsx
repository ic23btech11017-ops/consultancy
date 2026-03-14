import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card, type ShadowColor } from '../components/Card';
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Phone,
  Send,
  CheckCircle2,
  BookOpen,
  FileText,
  Video,
  LifeBuoy,
  ExternalLink,
  Search,
} from 'lucide-react';

const FAQS = [
  {
    q: 'How do I add a new student to the system?',
    a: 'Go to the Students page and click "Add Student" in the top right corner. Fill in the required details — name, contact information, branch, and assigned counselor — then save. The student will appear in the list immediately.',
  },
  {
    q: 'How do I convert a walk-in enquiry into a test prep student?',
    a: 'In the Test Preparation page, under the Walk-in Enquiries tab, find the entry and click "Convert to Student". The system will automatically match them to an available batch based on their interested test and branch.',
  },
  {
    q: 'How do I record a payment in Finance?',
    a: 'Navigate to the Finance page and click "Add Transaction". Select the student, enter the amount, payment method, and type (fee, visa, etc.), then submit. The ledger and outstanding balances update instantly.',
  },
  {
    q: 'How do I move a lead through the counseling pipeline?',
    a: 'Open the Counseling Pipeline page, find the lead\'s card, and click the "Move Stage" button. Select the target stage in the dialog and confirm. The card will move to the new column immediately.',
  },
  {
    q: 'How do I assign a university application to a student?',
    a: 'Go to the Applications page, click "New Application", select the student, fill in the university and course details, and set the initial status. You can then track document uploads and update the status as it progresses.',
  },
  {
    q: 'Can I change the branch or batch for a test prep student?',
    a: 'Yes. In the Test Preparation page under the Students tab, click "Change Batch" on the student\'s row. Select a new batch from the dropdown and the student will be moved. Trainer and dates update automatically.',
  },
  {
    q: 'How do I generate a report?',
    a: 'Go to the Reports page where you can filter by date range, branch, and category. Click "Export" to download the data as a CSV or PDF. Scheduled reports can be configured in Settings.',
  },
  {
    q: 'How do I add a partner university?',
    a: 'Navigate to the Partners page and click "Add Partner". Enter the university or agency details, including the commission structure and contact information, then save.',
  },
];

const RESOURCES = [
  { icon: BookOpen, label: 'User Manual', sub: 'Full documentation PDF', color: 'blue' },
  { icon: Video, label: 'Video Tutorials', sub: 'Step-by-step walkthroughs', color: 'purple' },
  { icon: FileText, label: 'Release Notes', sub: 'What\'s new in each version', color: 'emerald' },
  { icon: LifeBuoy, label: 'Community Forum', sub: 'Ask & answer questions', color: 'amber' },
];

const HelpSupport: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const filteredFaqs = FAQS.filter(
    f => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName(''); setEmail(''); setSubject(''); setMessage('');
    setTimeout(() => setSent(false), 3500);
  };

  const inputCls = 'w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all duration-200';
  const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Help & Support" subtitle="Find answers to common questions or get in touch with our support team." />

      {/* Quick contact chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Mail, label: 'Email Support', value: 'support@kalnet.in', color: 'blue' },
          { icon: Phone, label: 'Phone Support', value: '+91 98765 00001', color: 'emerald' },
          { icon: MessageSquare, label: 'Live Chat', value: 'Available Mon–Fri, 9am–6pm', color: 'indigo' },
        ].map(item => (
          <Card key={item.label} shadowColor={item.color as ShadowColor} className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${item.color}-100 dark:bg-${item.color}-900/20 flex-shrink-0`}>
              <item.icon className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FAQs */}
        <div className="lg:col-span-2 space-y-4">
          <Card shadowColor="blue">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={faqSearch}
                onChange={e => setFaqSearch(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredFaqs.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">No matching questions found.</p>
              )}
              {filteredFaqs.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-3.5 text-left gap-4 group"
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {faq.q}
                    </span>
                    {openFaq === i
                      ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <p className="pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-0 pr-6">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Resources */}
          <Card shadowColor="purple">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <div className="space-y-2">
              {RESOURCES.map(r => (
                <button
                  key={r.label}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${r.color}-100 dark:bg-${r.color}-900/20 flex-shrink-0`}>
                    <r.icon className={`w-4 h-4 text-${r.color}-600 dark:text-${r.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{r.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{r.sub}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </Card>

          {/* Contact form */}
          <Card shadowColor="emerald">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Submit a Ticket</h3>
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                <p className="text-sm font-medium text-gray-800 dark:text-white">Ticket submitted!</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className={labelCls}>Your Name</label>
                  <input required value={name} onChange={e => setName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Subject</label>
                  <input required value={subject} onChange={e => setSubject(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Message</label>
                  <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={4} className={inputCls} />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                  <Send className="w-4 h-4" />Send Message
                </button>
              </form>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
