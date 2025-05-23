import React, { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, UserX, Home, MapPin, TrendingUp, ChevronUp, AlertTriangle, Calendar, FileText } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="stat-card">
        <div className="stat-header">
            <div className="stat-icon" style={{ background: `${color}20`, color: color }}>
                <Icon size={24} />
            </div>
            <div className="stat-trend" style={{ color: trend >= 0 ? '#22c55e' : '#ef4444' }}>
                <ChevronUp size={20} style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none' }} />
                <span>{Math.abs(trend)}%</span>
            </div>
        </div>
        <div className="stat-content">
            <h3>{title}</h3>
            <h2>{value.toLocaleString()}</h2>
        </div>
        <div className="stat-footer">
            <div className="progress-bar" style={{ '--progress': `${Math.abs(trend)}%`, '--color': color }}></div>
        </div>
    </div>
);

const AdminDashbord = () => {
    const [stats, setStats] = useState({
        totalFamilies: 0,
        totalMembers: 0,
        rejectedMembers: 0,
        pendingApplications: 0,
        activeHouseholds: 0,
        registeredProperties: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API calls
        setTimeout(() => {
            setStats({
                totalFamilies: 1247,
                totalMembers: 4893,
                rejectedMembers: 23,
                pendingApplications: 45,
                activeHouseholds: 1224,
                registeredProperties: 1180
            });
            setLoading(false);
        }, 1000);
    }, []);

    const monthlyData = [
        { name: 'Jan', families: 1180, members: 4620, applications: 15 },
        { name: 'Feb', families: 1195, members: 4685, applications: 22 },
        { name: 'Mar', families: 1210, members: 4750, applications: 18 },
        { name: 'Apr', families: 1225, members: 4820, applications: 28 },
        { name: 'May', families: 1240, members: 4870, applications: 35 },
        { name: 'Jun', families: 1247, members: 4893, applications: 45 },
    ];

    const membershipData = [
        { name: 'Approved Members', value: 4870, color: '#22c55e' },
        { name: 'Pending Applications', value: 45, color: '#eab308' },
        { name: 'Rejected Members', value: 23, color: '#ef4444' },
    ];

    const weeklyApplications = [
        { name: 'Mon', applications: 8, rejections: 1 },
        { name: 'Tue', applications: 12, rejections: 2 },
        { name: 'Wed', applications: 15, rejections: 0 },
        { name: 'Thu', applications: 10, rejections: 3 },
        { name: 'Fri', applications: 18, rejections: 1 },
        { name: 'Sat', applications: 6, rejections: 0 },
        { name: 'Sun', applications: 9, rejections: 2 },
    ];

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                <div style={{
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #6366f1',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    return (
        <div style={{
            padding: '24px',
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <style>{`
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 600;
        }
        .stat-content h3 {
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          margin: 0 0 8px 0;
        }
        .stat-content h2 {
          color: #1e293b;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }
        .progress-bar {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          margin-top: 16px;
          position: relative;
          overflow: hidden;
        }
        .progress-bar::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: var(--progress);
          background: var(--color);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .chart-card h3 {
          color: #1e293b;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 20px 0;
        }
      `}</style>

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '200px',
                    height: '200px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    opacity: 0.3
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: '150px',
                    height: '150px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '50%',
                    opacity: 0.5
                }}></div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px'
                        }}>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                padding: '8px',
                                borderRadius: '8px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <MapPin size={24} color="white" />
                            </div>
                            <span style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Admin Portal
                            </span>
                        </div>
                        <h1 style={{
                            fontSize: '36px',
                            fontWeight: '800',
                            margin: '0 0 12px 0',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }}>
                            Qochi Locality Dashboard
                        </h1>
                        <p style={{
                            fontSize: '18px',
                            margin: 0,
                            opacity: 0.9,
                            fontWeight: '400'
                        }}>
                            Comprehensive management hub for resident services and community oversight
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        alignItems: 'flex-end'
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            padding: '12px 20px',
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Calendar size={20} />
                            <span style={{ fontWeight: '500' }}>Last 30 Days</span>
                            <TrendingUp size={20} />
                        </div>
                        <div style={{
                            fontSize: '14px',
                            opacity: 0.8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#22c55e',
                                animation: 'pulse 2s infinite'
                            }}></div>
                            System Status: Active
                        </div>
                    </div>
                </div>
                <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
            }}>
                <StatCard
                    title="Total Families"
                    value={stats.totalFamilies}
                    icon={Home}
                    trend={5.2}
                    color="#6366f1"
                />
                <StatCard
                    title="Total Members"
                    value={stats.totalMembers}
                    icon={Users}
                    trend={8.1}
                    color="#22c55e"
                />
                <StatCard
                    title="Rejected Members"
                    value={stats.rejectedMembers}
                    icon={UserX}
                    trend={-12.5}
                    color="#ef4444"
                />
                <StatCard
                    title="Pending Applications"
                    value={stats.pendingApplications}
                    icon={FileText}
                    trend={23.4}
                    color="#eab308"
                />
                <StatCard
                    title="Active Households"
                    value={stats.activeHouseholds}
                    icon={UserCheck}
                    trend={4.8}
                    color="#8b5cf6"
                />
                <StatCard
                    title="Registered Properties"
                    value={stats.registeredProperties}
                    icon={MapPin}
                    trend={2.1}
                    color="#06b6d4"
                />
            </div>

            {/* Charts Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '24px',
                marginBottom: '24px'
            }}>
                <div className="chart-card">
                    <h3>Locality Growth Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyData}>
                            <defs>
                                <linearGradient id="colorFamilies" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="families"
                                stackId="1"
                                stroke="#6366f1"
                                fill="url(#colorFamilies)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="members"
                                stackId="2"
                                stroke="#22c55e"
                                fill="url(#colorMembers)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Membership Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={membershipData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {membershipData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: '16px' }}>
                        {membershipData.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '8px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: item.color
                                    }}></div>
                                    <span style={{ fontSize: '14px', color: '#64748b' }}>{item.name}</span>
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                                    {item.value.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Weekly Applications Chart */}
            <div className="chart-card">
                <h3>Weekly Application Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyApplications}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="applications"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={{ r: 5, fill: '#22c55e' }}
                            activeDot={{ r: 7, fill: '#22c55e' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="rejections"
                            stroke="#ef4444"
                            strokeWidth={3}
                            dot={{ r: 5, fill: '#ef4444' }}
                            activeDot={{ r: 7, fill: '#ef4444' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminDashbord;