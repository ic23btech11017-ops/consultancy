import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import {
  Megaphone,
  TrendingUp,
  Users,
  Target,
  IndianRupee,
  MousePointerClick,
  Plus,
  X,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  ExternalLink,
  Zap,
  ChevronLeft,
  Globe,
  MapPin,
  UserCheck,
  Building2,
  Layers,
  Monitor,
  CheckCircle2,
} from 'lucide-react';
import { campaigns as INITIAL_CAMPAIGNS, leads, LEAD_SOURCES, CHANNEL_DETAILS, type Campaign, type LeadSource, type CampaignStatus } from '../data/mockData';

const SOURCES = LEAD_SOURCES;

const STATUSES: CampaignStatus[] = ['Active', 'Paused', 'Completed', 'Scheduled'];

const DIGITAL_SOURCES: LeadSource[] = ['Website Form', 'Facebook Ads', 'Google Search', 'Instagram', 'Marketing Lead'];
const OFFLINE_SOURCES: LeadSource[] = ['Walk-in', 'Direct Walk-in', 'Referral', 'Test Prep Referral'];

const COUNTRIES = ['UK', 'USA', 'Canada', 'Australia', 'Germany', 'New Zealand', 'Ireland'];
const LEVELS = ['Bachelors', 'Masters', 'PhD', 'Diploma'];

const SOURCE_COLORS: Record<string, string> = {
  'Facebook Ads': 'bg-blue-500',
  'Google Search': 'bg-red-500',
  'Instagram': 'bg-pink-500',
  'Referral': 'bg-green-500',
  'Walk-in': 'bg-amber-500',
  'Direct Walk-in': 'bg-orange-500',
  'Test Prep Referral': 'bg-purple-500',
  'Marketing Lead': 'bg-cyan-500',
  'Website Form': 'bg-teal-500',
};

const SOURCE_BG: Record<string, string> = {
  'Facebook Ads': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Google Search': 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Instagram': 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Referral': 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Walk-in': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Direct Walk-in': 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Test Prep Referral': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Marketing Lead': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Website Form': 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
};

function getStatusBadge(status: CampaignStatus) {
  switch (status) {
    case 'Active': return <Badge variant="success">Active</Badge>;
    case 'Paused': return <Badge variant="warning">Paused</Badge>;
    case 'Completed': return <Badge variant="info">Completed</Badge>;
    case 'Scheduled': return <Badge variant="indigo">Scheduled</Badge>;
  }
}

function fmt(n: number) {
  return n.toLocaleString('en-IN');
}

function fmtINR(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

const Marketing: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'All'>('All');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'channels'>('overview');
  const [selectedSource, setSelectedSource] = useState<LeadSource | null>(null);

  const emptyForm = {
    name: '',
    source: 'Facebook Ads' as LeadSource,
    status: 'Scheduled' as CampaignStatus,
    startDate: '',
    endDate: '',
    budget: '',
    targetCountry: '',
    targetLevel: '',
    description: '',
  };
  const [form, setForm] = useState(emptyForm);

  // ── KPI Aggregates ──
  const kpis = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter(c => c.status === 'Active').length;
    const totalLeads = campaigns.reduce((s, c) => s + c.leadsGenerated, 0);
    const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
    const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
    const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
    const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
    const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
    const avgConvRate = totalLeads > 0 ? Math.round((totalConversions / totalLeads) * 100) : 0;
    const avgCPL = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0;
    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

    return { total, active, totalLeads, totalConversions, totalBudget, totalSpend, totalImpressions, totalClicks, avgConvRate, avgCPL, ctr };
  }, [campaigns]);

  // ── Lead Source Distribution ──
  const sourceDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => {
      counts[l.source] = (counts[l.source] || 0) + 1;
    });
    const total = leads.length;
    return SOURCES
      .filter(s => counts[s])
      .map(s => ({ source: s, count: counts[s] || 0, pct: Math.round(((counts[s] || 0) / total) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // ── Best Performing Campaigns (by conversion rate) ──
  const topCampaigns = useMemo(() =>
    [...campaigns]
      .filter(c => c.leadsGenerated > 0)
      .map(c => ({ ...c, convRate: Math.round((c.conversions / c.leadsGenerated) * 100) }))
      .sort((a, b) => b.convRate - a.convRate)
      .slice(0, 5),
    [campaigns]
  );

  // ── Monthly Lead Trend (simulated buckets from mock data) ──
  const monthlyTrend = useMemo(() => {
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const values = [32, 58, 75, 120, 145, 115];
    const conversions = [12, 22, 30, 48, 60, 45];
    const max = Math.max(...values);
    return months.map((m, i) => ({ month: m, leads: values[i], conversions: conversions[i], max }));
  }, []);

  // ── Filtered Campaigns ──
  const filtered = useMemo(() =>
    campaigns.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchSource = sourceFilter === 'All' || c.source === sourceFilter;
      return matchSearch && matchStatus && matchSource;
    }),
    [campaigns, searchQuery, statusFilter, sourceFilter]
  );

  // ── Per-source stats from leads ──
  const sourceStats = useMemo(() => {
    const stats: Record<string, { total: number; converted: number; lost: number }> = {};
    leads.forEach(l => {
      if (!stats[l.source]) stats[l.source] = { total: 0, converted: 0, lost: 0 };
      stats[l.source].total++;
      if (l.status === 'Converted') stats[l.source].converted++;
      if (l.status === 'Lost') stats[l.source].lost++;
    });
    return stats;
  }, []);

  // ── Campaign count per source ──
  const campaignsBySource = useMemo(() => {
    const map: Record<string, { total: number; active: number }> = {};
    campaigns.forEach(c => {
      if (!map[c.source]) map[c.source] = { total: 0, active: 0 };
      map[c.source].total++;
      if (c.status === 'Active') map[c.source].active++;
    });
    return map;
  }, [campaigns]);

  // ── Leads for selected source ──
  const sourceLeads = useMemo(() =>
    selectedSource ? leads.filter(l => l.source === selectedSource) : [],
    [selectedSource]
  );

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: Campaign = {
      id: `CMP${String(campaigns.length + 1).padStart(3, '0')}`,
      name: form.name,
      source: form.source,
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      budget: Number(form.budget),
      spend: 0,
      impressions: 0,
      clicks: 0,
      leadsGenerated: 0,
      conversions: 0,
      targetCountry: form.targetCountry || undefined,
      targetLevel: form.targetLevel || undefined,
      description: form.description || undefined,
    };
    setCampaigns([newCampaign, ...campaigns]);
    setIsModalOpen(false);
    setForm(emptyForm);
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Website':      return { color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-400',   icon: Monitor };
      case 'Paid Digital': return { color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',   icon: MousePointerClick };
      case 'Organic':      return { color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20 dark:text-pink-400',   icon: BarChart2 };
      case 'Offline':      return { color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400', icon: Building2 };
      case 'Partner Portal': return { color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 dark:text-cyan-400', icon: Globe };
      default:             return { color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400', icon: UserCheck };
    }
  };

  const renderChannelCard = (source: LeadSource) => {
    const stats = sourceStats[source] || { total: 0, converted: 0, lost: 0 };
    const winRate = (stats.converted + stats.lost) > 0 ? Math.round((stats.converted / (stats.converted + stats.lost)) * 100) : 0;
    const ch = CHANNEL_DETAILS[source];
    const cmp = campaignsBySource[source] || { total: 0, active: 0 };
    const activePlacements = ch.placements.filter(p => p.status === 'Active').length;
    const { color: typeColor, icon: TypeIcon } = getTypeStyle(ch.type);
    const qualityColor = ch.avgLeadQuality === 'High' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' : ch.avgLeadQuality === 'Medium' ? 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400' : 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
    return (
      <button key={source} onClick={() => setSelectedSource(source)} className="text-left group">
        <Card className="p-5 h-full hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SOURCE_BG[source] || 'bg-gray-100 text-gray-600'}`}>{source}</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${typeColor}`}>
              <TypeIcon className="w-3 h-3" />{ch.type}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 my-3">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Leads</p>
            </div>
            <div className="text-center border-x border-gray-100 dark:border-gray-700">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.converted}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Converted</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{winRate}%</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Win Rate</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{activePlacements} placements</span>
              <span className="flex items-center gap-1"><Megaphone className="w-3 h-3" />{cmp.total} campaigns</span>
            </div>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${qualityColor}`}>{ch.avgLeadQuality} quality</span>
          </div>
        </Card>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <PageHeader
          title="Marketing & Lead Integration"
          subtitle="Track campaigns, lead sources, conversion rates, and ROI across all channels."
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
        {(['overview', 'campaigns', 'channels'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedSource(null); }}
            className={`px-5 py-3 text-sm font-medium capitalize transition-colors duration-200 border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'campaigns' ? 'Campaigns' : 'Channels & Sources'}
          </button>
        ))}
      </div>

      {/* ═══════════════ OVERVIEW TAB ═══════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {[
              { label: 'Total Campaigns', value: kpis.total, icon: Megaphone, color: 'blue', sub: `${kpis.active} active` },
              { label: 'Total Leads', value: fmt(kpis.totalLeads), icon: Users, color: 'indigo', sub: 'all channels' },
              { label: 'Conversions', value: fmt(kpis.totalConversions), icon: Target, color: 'emerald', sub: `${kpis.avgConvRate}% conv. rate` },
              { label: 'Total Spend', value: fmtINR(kpis.totalSpend), icon: IndianRupee, color: 'amber', sub: `Budget: ${fmtINR(kpis.totalBudget)}` },
              { label: 'Avg. CPL', value: fmtINR(kpis.avgCPL), icon: TrendingUp, color: 'rose', sub: 'cost per lead' },
              { label: 'Click-Through Rate', value: `${kpis.ctr}%`, icon: MousePointerClick, color: 'purple', sub: `${fmt(kpis.totalClicks)} clicks` },
            ].map(kpi => {
              const colorMap: Record<string, string> = {
                blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
                emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
                amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
                rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
                purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
              };
              return (
                <Card key={kpi.label} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{kpi.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{kpi.sub}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${colorMap[kpi.color]}`}>
                      <kpi.icon className="w-4 h-4" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Digital Lead Channels — Live Integration */}
          <div className="border border-dashed border-blue-200 dark:border-blue-700 rounded-xl p-4 bg-blue-50/40 dark:bg-blue-900/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Digital Lead Channels — Live</h3>
                <span className="text-xs text-gray-400 dark:text-gray-500">Leads entering CRM from digital marketing presence</span>
              </div>
              <button
                onClick={() => setActiveTab('channels')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                All channels <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {DIGITAL_SOURCES.map(source => {
                const stats = sourceStats[source] || { total: 0, converted: 0, lost: 0 };
                const winRate = (stats.converted + stats.lost) > 0 ? Math.round((stats.converted / (stats.converted + stats.lost)) * 100) : 0;
                const ch = CHANNEL_DETAILS[source];
                const activePlacements = ch.placements.filter(p => p.status === 'Active').length;
                return (
                  <div
                    key={source}
                    className="bg-white dark:bg-gray-800 rounded-xl p-3.5 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-sm cursor-pointer transition-all"
                    onClick={() => { setActiveTab('channels'); setSelectedSource(source); }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${SOURCE_BG[source] || 'bg-gray-100 text-gray-600'}`}>{source}</span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" />Live
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">incoming leads</p>
                    <div className="flex items-center justify-between text-xs border-t border-gray-100 dark:border-gray-700 pt-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">{winRate}% win rate</span>
                      <span className="text-gray-400 dark:text-gray-500">{activePlacements} placements</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead Trend + Source Breakdown */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Monthly Lead Trend */}
            <Card className="xl:col-span-2 p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Monthly Lead & Conversion Trend</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Oct 2025 – Mar 2026</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>Leads</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>Conversions</span>
                </div>
              </div>
              <div className="flex items-end gap-3 h-44">
                {monthlyTrend.map(m => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-1" style={{ height: '140px' }}>
                      <div
                        className="flex-1 bg-blue-500/80 dark:bg-blue-500/70 rounded-t-sm transition-all duration-300 hover:bg-blue-600 cursor-default"
                        style={{ height: `${(m.leads / m.max) * 100}%` }}
                        title={`Leads: ${m.leads}`}
                      />
                      <div
                        className="flex-1 bg-emerald-400/80 dark:bg-emerald-500/70 rounded-t-sm transition-all duration-300 hover:bg-emerald-500 cursor-default"
                        style={{ height: `${(m.conversions / m.max) * 100}%` }}
                        title={`Conversions: ${m.conversions}`}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{m.month}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Lead Source Distribution */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Lead Source Breakdown</h3>
              <div className="space-y-3">
                {sourceDistribution.map(({ source, count, pct }) => (
                  <div key={source}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SOURCE_BG[source] || 'bg-gray-100 text-gray-600'}`}>{source}</span>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{count} <span className="text-gray-400 dark:text-gray-500 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${SOURCE_COLORS[source] || 'bg-gray-400'} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Top Performing Campaigns */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Top Performing Campaigns
              </h3>
              <button
                onClick={() => setActiveTab('campaigns')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View all <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                    <th className="pb-3 pr-4">Campaign</th>
                    <th className="pb-3 pr-4">Channel</th>
                    <th className="pb-3 pr-4 text-right">Leads</th>
                    <th className="pb-3 pr-4 text-right">Conversions</th>
                    <th className="pb-3 pr-4 text-right">Conv. Rate</th>
                    <th className="pb-3 text-right">Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {topCampaigns.map((c, i) => (
                    <tr key={c.id} className="text-sm">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">{i + 1}</span>
                          <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SOURCE_BG[c.source] || 'bg-gray-100 text-gray-600'}`}>{c.source}</span>
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-700 dark:text-gray-300">{fmt(c.leadsGenerated)}</td>
                      <td className="py-3 pr-4 text-right text-gray-700 dark:text-gray-300">{fmt(c.conversions)}</td>
                      <td className="py-3 pr-4 text-right">
                        <span className={`font-semibold ${c.convRate >= 50 ? 'text-emerald-600 dark:text-emerald-400' : c.convRate >= 30 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {c.convRate}%
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-700 dark:text-gray-300">{fmtINR(c.spend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════ CAMPAIGNS TAB ═══════════════ */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
              >
                <option value="All">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
              >
                <option value="All">All Channels</option>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Campaign Table */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    {['Campaign', 'Channel', 'Status', 'Period', 'Budget / Spend', 'Leads', 'Conversions', 'Conv. %', 'CPL', 'CTR'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.length === 0 && (
                    <tr><td colSpan={10} className="px-5 py-10 text-center text-sm text-gray-400 dark:text-gray-500">No campaigns match your filters.</td></tr>
                  )}
                  {filtered.map(c => {
                    const convRate = c.leadsGenerated > 0 ? Math.round((c.conversions / c.leadsGenerated) * 100) : 0;
                    const cpl = c.leadsGenerated > 0 ? Math.round(c.spend / c.leadsGenerated) : 0;
                    const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : '–';
                    const budgetUsed = c.budget > 0 ? Math.round((c.spend / c.budget) * 100) : 0;
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-4 max-w-[220px]">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{c.name}</p>
                          {c.targetCountry && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{c.targetCountry}{c.targetLevel ? ` · ${c.targetLevel}` : ''}</p>}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${SOURCE_BG[c.source] || 'bg-gray-100 text-gray-600'}`}>{c.source}</span>
                        </td>
                        <td className="px-5 py-4">{getStatusBadge(c.status)}</td>
                        <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {c.startDate} →<br />{c.endDate}
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm text-gray-900 dark:text-white font-medium">{fmtINR(c.spend)} <span className="text-gray-400 dark:text-gray-500 font-normal text-xs">/ {fmtINR(c.budget)}</span></div>
                          <div className="w-24 bg-gray-100 dark:bg-gray-800 rounded-full h-1 mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${budgetUsed > 90 ? 'bg-rose-500' : budgetUsed > 60 ? 'bg-amber-400' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{fmt(c.leadsGenerated)}</td>
                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{fmt(c.conversions)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 text-sm font-semibold">
                            {convRate >= 50
                              ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                              : <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />}
                            <span className={convRate >= 50 ? 'text-emerald-600 dark:text-emerald-400' : convRate >= 30 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}>{convRate}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{cpl > 0 ? fmtINR(cpl) : '–'}</td>
                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{ctr}{ctr !== '–' ? '%' : ''}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════ CHANNELS & SOURCES TAB ═══════════════ */}
      {activeTab === 'channels' && !selectedSource && (
        <div className="space-y-6">
          {/* Digital Channels */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Digital Channels</h3>
              <span className="text-xs text-gray-400 dark:text-gray-500">— Website, Paid Ads & Social Media</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 ml-6">Click any channel to see placements, incoming leads, and full performance breakdown</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {DIGITAL_SOURCES.map(renderChannelCard)}
            </div>
          </div>
          {/* Offline & Referral Channels */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Offline & Referral Channels</h3>
              <span className="text-xs text-gray-400 dark:text-gray-500">— Walk-in, Events & Referrals</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {OFFLINE_SOURCES.map(renderChannelCard)}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ CHANNEL DETAIL VIEW ═══════════════ */}
      {activeTab === 'channels' && selectedSource && (() => {
        const ch = CHANNEL_DETAILS[selectedSource];
        const stats = sourceStats[selectedSource] || { total: 0, converted: 0, lost: 0 };
        const winRate = (stats.converted + stats.lost) > 0 ? Math.round((stats.converted / (stats.converted + stats.lost)) * 100) : 0;
        const cmp = campaignsBySource[selectedSource] || { total: 0, active: 0 };
        const activePlacements = ch.placements.filter(p => p.status === 'Active').length;
        const sourceCampaigns = campaigns.filter(c => c.source === selectedSource);
        const { color: typeColor } = getTypeStyle(ch.type);
        return (
          <div className="space-y-5">
            {/* Back + Header */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedSource(null)}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> All Channels
              </button>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${SOURCE_BG[selectedSource] || 'bg-gray-100 text-gray-600'}`}>{selectedSource}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColor}`}>{ch.type}</span>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {[
                { label: 'Total Leads', value: stats.total, color: 'blue' },
                { label: 'Converted', value: stats.converted, color: 'emerald' },
                { label: 'Lost', value: stats.lost, color: 'rose' },
                { label: 'Win Rate', value: `${winRate}%`, color: 'indigo' },
                { label: 'Campaigns', value: cmp.total, color: 'amber' },
                { label: 'Active Placements', value: activePlacements, color: 'purple' },
              ].map(k => {
                const colorMap: Record<string, string> = {
                  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
                  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
                  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
                  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
                  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                };
                return (
                  <Card key={k.label} className={`p-4 border-l-4 ${k.color === 'blue' ? 'border-blue-500' : k.color === 'emerald' ? 'border-emerald-500' : k.color === 'rose' ? 'border-rose-500' : k.color === 'indigo' ? 'border-indigo-500' : k.color === 'amber' ? 'border-amber-500' : 'border-purple-500'}`}>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{k.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{k.value}</p>
                  </Card>
                );
              })}
            </div>

            {/* Description + Placements + Leads */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
              {/* Left: Info + Placements */}
              <div className="xl:col-span-2 space-y-4">
                {/* Description card */}
                <Card className="p-5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">About This Channel</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{ch.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5"><Target className="w-3 h-3" /> Target Audience</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{ch.targetAudience}</p>
                  </div>
                </Card>

                {/* Placements card */}
                <Card className="p-5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-500" /> Placements & Pages
                  </h3>
                  <div className="space-y-2.5">
                    {ch.placements.map((p, i) => (
                      <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            {ch.type === 'Offline' ? <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> : <Globe className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.name}</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 ml-5">{p.format}</p>
                          {p.url && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 ml-5 mt-0.5 flex items-center gap-1 truncate">
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />{p.url}
                            </p>
                          )}
                        </div>
                        <span className={`ml-3 text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${p.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Active Campaigns for this source */}
                {sourceCampaigns.length > 0 && (
                  <Card className="p-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-blue-500" /> Campaigns using this channel
                    </h3>
                    <div className="space-y-2">
                      {sourceCampaigns.map(c => {
                        const convRate = c.leadsGenerated > 0 ? Math.round((c.conversions / c.leadsGenerated) * 100) : 0;
                        return (
                          <div key={c.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/40">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{c.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{c.startDate} → {c.endDate}</p>
                            </div>
                            <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                              <div className="text-right">
                                <p className="text-xs font-semibold text-gray-900 dark:text-white">{c.leadsGenerated}</p>
                                <p className="text-[10px] text-gray-400">leads</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{convRate}%</p>
                                <p className="text-[10px] text-gray-400">conv.</p>
                              </div>
                              {getStatusBadge(c.status)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}
              </div>

              {/* Right: Incoming Leads Table */}
              <div className="xl:col-span-3">
                <Card className="p-0 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Incoming Leads from {selectedSource}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sourceLeads.length} lead{sourceLeads.length !== 1 ? 's' : ''} total</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${SOURCE_BG[selectedSource] || 'bg-gray-100 text-gray-600'}`}>{selectedSource}</span>
                  </div>
                  {sourceLeads.length === 0 ? (
                    <div className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No leads recorded for this source yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                            {['Name', 'Country', 'Level', 'Stage', 'Counsellor'].map(h => (
                              <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {sourceLeads.map(lead => (
                            <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                              <td className="px-5 py-3.5">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{lead.email}</p>
                              </td>
                              <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300">{lead.interestedCountry || '–'}</td>
                              <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300">{lead.targetLevel}</td>
                              <td className="px-5 py-3.5">
                                <Badge variant={lead.status === 'Converted' ? 'success' : lead.status === 'Lost' ? 'error' : 'info'}>
                                  {lead.status}
                                </Badge>
                              </td>
                              <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300">{lead.assignedCounsellor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══════════════ ADD CAMPAIGN MODAL ═══════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <Card className="relative w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Campaign</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCampaign} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Campaign Name *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Fall 2026 Instagram Reels"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Channel / Source *</label>
                  <select
                    value={form.source}
                    onChange={e => setForm({ ...form, source: e.target.value as LeadSource })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                  >
                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as CampaignStatus })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Start Date *</label>
                  <input
                    required
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">End Date *</label>
                  <input
                    required
                    type="date"
                    value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Budget (₹) *</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.budget}
                  onChange={e => setForm({ ...form, budget: e.target.value })}
                  placeholder="e.g. 50000"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Target Country</label>
                  <select
                    value={form.targetCountry}
                    onChange={e => setForm({ ...form, targetCountry: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                  >
                    <option value="">Any</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Target Level</label>
                  <select
                    value={form.targetLevel}
                    onChange={e => setForm({ ...form, targetLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                  >
                    <option value="">Any</option>
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief campaign description…"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Marketing;
