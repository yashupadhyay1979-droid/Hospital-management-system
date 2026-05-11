import { Activity, Users, FileText, TrendingUp, ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useMemo } from 'react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        border: '1px solid #f1f5f9',
        fontSize: '13px',
        minWidth: '140px',
        whiteSpace: 'nowrap'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: index !== payload.length - 1 ? '6px' : '0' }}>
            <span style={{ display: 'flex', alignItems: 'center', color: '#475569', fontWeight: 500 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color, marginRight: '8px' }}></span>
              {entry.name === 'patients' ? 'Outpatient' : 'Admitted'}
            </span>
            <span style={{ fontWeight: 600, color: '#1e293b', marginLeft: '12px' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const fetchDashboardData = async () => {
  const [patients, emr, lab, hl7] = await Promise.allSettled([
    axios.get('http://localhost:8080/api/patients').then(r => r.data),
    axios.get('http://localhost:8080/api/emr').then(r => r.data),
    axios.get('http://localhost:8080/api/lab').then(r => r.data),
    axios.get('http://localhost:8080/api/hl7/messages').then(r => r.data),
  ]);
  return {
    patients: patients.status === 'fulfilled' ? patients.value : [],
    emr: emr.status === 'fulfilled' ? emr.value : [],
    lab: lab.status === 'fulfilled' ? lab.value : [],
    hl7: hl7.status === 'fulfilled' ? hl7.value : [],
  };
};

const STAT_CONFIG = [
  {
    label: 'Total Patients',
    icon: Users,
    link: '/patients',
    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    shadow: 'rgba(99,102,241,.35)',
    bg: '#f0f1ff',
    iconColor: '#6366f1',
    trend: '+4.2%',
  },
  {
    label: 'EMR Records',
    icon: FileText,
    link: '/emr',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
    shadow: 'rgba(236,72,153,.35)',
    bg: '#fff0f7',
    iconColor: '#ec4899',
    trend: '+1.8%',
  },
  {
    label: 'Lab Results',
    icon: Activity,
    link: '/lab',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    shadow: 'rgba(245,158,11,.35)',
    bg: '#fffbeb',
    iconColor: '#f59e0b',
    trend: '+7.1%',
  },
  {
    label: 'HL7 Messages',
    icon: TrendingUp,
    link: '/hl7',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    shadow: 'rgba(16,185,129,.35)',
    bg: '#ecfdf5',
    iconColor: '#10b981',
    trend: '+12.5%',
  },
];

function StatCard({ cfg, value, isLoading }) {
  const Icon = cfg.icon;
  return (
    <Link
      to={cfg.link}
      style={{
        '--stat-shadow': cfg.shadow,
        '--stat-gradient': cfg.gradient,
      }}
      className="stat-card group"
    >
      <div className="stat-card-top">
        <div
          className="stat-card-icon-wrap"
          style={{ background: cfg.bg }}
        >
          <Icon size={22} style={{ color: cfg.iconColor }} />
        </div>
        <span className="stat-trend">
          <ArrowUpRight size={13} />
          {cfg.trend}
        </span>
      </div>
      <div className="stat-card-value">
        {isLoading ? <span className="stat-skeleton" /> : value}
      </div>
      <div className="stat-card-label">{cfg.label}</div>
      <div className="stat-card-arrow">
        <ArrowRight size={16} />
        View All
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    refetchInterval: 10000,
    retry: 1,
  });

  const dynamicChartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateStr: d.toISOString().split('T')[0],
        patients: 0,
        admissions: 0,
      });
    }

    if (!data) return days;

    if (data.patients && Array.isArray(data.patients)) {
      data.patients.forEach(record => {
        if (record.createdAt) {
          const match = days.find(d => d.dateStr === record.createdAt);
          if (match) match.patients += 1;
        }
      });
    }

    if (data.emr && Array.isArray(data.emr)) {
      data.emr.forEach(record => {
        if (record.visitDate) {
          const match = days.find(d => d.dateStr === record.visitDate);
          if (match) match.patients += 1;
        }
      });
    }

    if (data.hl7 && Array.isArray(data.hl7)) {
      data.hl7.forEach(record => {
        if (record.receivedAt) {
          const dateOnly = record.receivedAt.split('T')[0];
          const match = days.find(d => d.dateStr === dateOnly);
          if (match) match.admissions += 1;
        }
      });
    }

    return days;
  }, [data]);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Welcome */}
      <div className="dash-welcome">
        <div>
          <h2 className="dash-welcome-title">
            {greeting}, {user?.name?.split(' ')[0] || 'Doctor'} 👋
          </h2>
          <p className="dash-welcome-sub">
            <Clock size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
            {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            &nbsp;&mdash;&nbsp;Live data from HMS backend
          </p>
        </div>
        <div className="dash-welcome-badge">
          <span className="dash-live-dot" />
          Live
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {STAT_CONFIG.map((cfg, i) => (
          <StatCard
            key={i}
            cfg={cfg}
            value={
              i === 0 ? data?.patients?.length ?? 0
              : i === 1 ? data?.emr?.length ?? 0
              : i === 2 ? data?.lab?.length ?? 0
              : data?.hl7?.length ?? 0
            }
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Chart */}
      <div className="dash-chart-card">
        <div className="dash-chart-header">
          <div>
            <h3 className="dash-chart-title">Patient Influx & Admissions</h3>
            <p className="dash-chart-sub">Weekly trend overview</p>
          </div>
          <div className="dash-chart-legend">
            <span className="legend-dot" style={{ background: '#6366f1' }} /> Outpatient
            <span className="legend-dot" style={{ background: '#10b981', marginLeft: 16 }} /> Admitted
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={dynamicChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gPatients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gAdmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-4} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
            />
            <Area type="monotone" dataKey="patients" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#gPatients)" dot={false} />
            <Area type="monotone" dataKey="admissions" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#gAdmissions)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="dash-quick-row">
        <h3 className="dash-quick-title">Quick Actions</h3>
        <div className="dash-quick-grid">
          {[
            { label: 'Register Patient', icon: '🧑‍⚕️', to: '/patients', color: '#6366f1' },
            { label: 'New EMR Entry', icon: '📋', to: '/emr', color: '#ec4899' },
            { label: 'Add Lab Result', icon: '🔬', to: '/lab', color: '#f59e0b' },
            { label: 'Send HL7 Message', icon: '📡', to: '/hl7', color: '#10b981' },
          ].map((a, i) => (
            <Link key={i} to={a.to} className="quick-action-card">
              <span className="quick-action-emoji">{a.icon}</span>
              <span className="quick-action-label">{a.label}</span>
              <ArrowRight size={14} style={{ color: a.color, marginLeft: 'auto' }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
