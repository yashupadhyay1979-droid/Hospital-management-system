import { Activity, Users, FileText, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';

const chartData = [
  { name: 'Mon', patients: 40, admissions: 24 },
  { name: 'Tue', patients: 30, admissions: 13 },
  { name: 'Wed', patients: 45, admissions: 28 },
  { name: 'Thu', patients: 50, admissions: 39 },
  { name: 'Fri', patients: 65, admissions: 48 },
  { name: 'Sat', patients: 40, admissions: 38 },
  { name: 'Sun', patients: 35, admissions: 43 },
];

const fetchDashboardData = async () => {
  const [patients, emr, lab, hl7] = await Promise.all([
    axios.get('http://localhost:8080/api/patients').then(res => res.data),
    axios.get('http://localhost:8080/api/emr').then(res => res.data),
    axios.get('http://localhost:8080/api/lab').then(res => res.data),
    axios.get('http://localhost:8080/api/hl7/messages').then(res => res.data)
  ]);
  return { patients, emr, lab, hl7 };
};

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    refetchInterval: 10000 // Refresh every 10s
  });

  const stats = [
    { label: 'Total Patients', value: isLoading ? '...' : data?.patients?.length || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', link: '/patients' },
    { label: 'EMR Records', value: isLoading ? '...' : data?.emr?.length || 0, icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50', link: '/emr' },
    { label: 'Lab Results', value: isLoading ? '...' : data?.lab?.length || 0, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50', link: '/lab' },
    { label: 'HL7 Messages', value: isLoading ? '...' : data?.hl7?.length || 0, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', link: '/hl7' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Live overview of hospital operations directly from the database.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link to={stat.link} key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-all hover:-translate-y-1 block group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <ArrowRight className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </div>
            <div>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Patient Influx & Admissions</h3>
          <div className="flex items-center gap-2 text-sm text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
            <TrendingUp size={16} />
            <span className="font-medium">+12.5% vs last week</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#aa3bff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#aa3bff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
              <Area type="monotone" dataKey="admissions" stroke="#aa3bff" strokeWidth={3} fillOpacity={1} fill="url(#colorAdmissions)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
