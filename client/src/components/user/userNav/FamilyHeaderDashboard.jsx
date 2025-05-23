import React, { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Users, UserCheck, UserX, User, Shield, Heart, TrendingUp, ChevronUp, AlertTriangle, Calendar, Award } from 'lucide-react';
import api from '../../../../api';

const StatCard = ({ title, value, icon: Icon, trend, color, subtitle }) => (
    <div className="family-stat-card" style={{ '--card-color': color }}>
        <div className="card-glow"></div>
        <div className="stat-header">
            <div className="stat-icon-wrapper">
                <div className="stat-icon">
                    <Icon size={28} />
                </div>
                <div className="icon-bg"></div>
            </div>
            <div className="stat-trend" style={{ color: trend >= 0 ? '#10b981' : '#f59e0b' }}>
                <ChevronUp size={18} style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none' }} />
                <span>{Math.abs(trend)}%</span>
            </div>
        </div>
        <div className="stat-content">
            <h3>{title}</h3>
            <h2>{value?.toLocaleString() || '0'}</h2>
            {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        </div>
        <div className="stat-footer">
            <div className="progress-indicator">
                <div className="progress-fill" style={{ width: `${Math.min(Math.abs(trend), 100)}%` }}></div>
            </div>
        </div>
    </div>
);

const FamilyHeaderDashboard = () => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        rejectedMembers: 0,
        activeMembers: 0,
        pendingMembers: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFamilyStats = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch family-specific stats
                const [
                    totalMemberRes,
                    rejectedMemberRes,
                    activeMemberRes,
                    pendingMemberRes
                ] = await Promise.all([
                    api.get('/user/get-total-members'),
                    api.get('/user/get-rejected-members'),
                    api.get('/user/get-active-members'),
                    api.get('/user/get-pending-members')
                ]);

                setStats({
                    totalMembers: totalMemberRes.data?.totalMember || 0,
                    rejectedMembers: rejectedMemberRes.data?.totalRejectedMember || 0,
                    activeMembers: activeMemberRes.data?.totalActiveMember || 0,
                    pendingMembers: pendingMemberRes.data?.totalPendingMember || 0
                });

            } catch (err) {
                console.error('Error fetching family stats:', err);
                setError(err.message);
                // Fallback to demo data
                setStats({
                    totalMembers: 12,
                    rejectedMembers: 1,
                    activeMembers: 10,
                    pendingMembers: 1
                });
            } finally {
                setLoading(false);
            }
        };

        fetchFamilyStats();
    }, []);

    // Generate chart data based on stats
    const monthlyMemberData = [
        { name: 'Jan', active: Math.max(0, stats.activeMembers - 3), pending: Math.max(0, stats.pendingMembers), rejected: Math.max(0, stats.rejectedMembers - 1) },
        { name: 'Feb', active: Math.max(0, stats.activeMembers - 2), pending: Math.max(0, stats.pendingMembers + 1), rejected: Math.max(0, stats.rejectedMembers) },
        { name: 'Mar', active: Math.max(0, stats.activeMembers - 1), pending: Math.max(0, stats.pendingMembers), rejected: Math.max(0, stats.rejectedMembers) },
        { name: 'Apr', active: Math.max(0, stats.activeMembers), pending: Math.max(0, stats.pendingMembers + 2), rejected: Math.max(0, stats.rejectedMembers + 1) },
        { name: 'May', active: Math.max(0, stats.activeMembers + 1), pending: Math.max(0, stats.pendingMembers - 1), rejected: Math.max(0, stats.rejectedMembers) },
        { name: 'Jun', active: stats.activeMembers, pending: stats.pendingMembers, rejected: stats.rejectedMembers },
    ];

    const memberStatusData = [
        { name: 'Active Members', value: stats.activeMembers, color: '#10b981' },
        { name: 'Pending Members', value: stats.pendingMembers, color: '#f59e0b' },
        { name: 'Rejected Members', value: stats.rejectedMembers, color: '#ef4444' },
    ];

    const weeklyActivityData = [
        { name: 'Mon', newMembers: Math.floor(stats.activeMembers / 10), applications: Math.floor(stats.pendingMembers / 3) },
        { name: 'Tue', newMembers: Math.floor(stats.activeMembers / 8), applications: Math.floor(stats.pendingMembers / 2) },
        { name: 'Wed', newMembers: Math.floor(stats.activeMembers / 12), applications: Math.floor(stats.pendingMembers / 4) },
        { name: 'Thu', newMembers: Math.floor(stats.activeMembers / 6), applications: Math.floor(stats.pendingMembers / 2) + 1 },
        { name: 'Fri', newMembers: Math.floor(stats.activeMembers / 9), applications: Math.floor(stats.pendingMembers / 3) },
        { name: 'Sat', newMembers: Math.floor(stats.activeMembers / 15), applications: Math.floor(stats.pendingMembers / 5) },
        { name: 'Sun', newMembers: Math.floor(stats.activeMembers / 11), applications: Math.floor(stats.pendingMembers / 4) },
    ];

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                gap: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}>
                <div style={{
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '4px solid white',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <div>Loading family dashboard...</div>
                <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                gap: '20px',
                color: '#ef4444',
                background: '#fef2f2',
                padding: '20px'
            }}>
                <AlertTriangle size={48} />
                <div>Failed to load family dashboard</div>
                <div style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', maxWidth: '400px' }}>
                    {error}
                </div>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '12px 24px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500'
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div style={{
            padding: '24px',
            minHeight: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <style>{`
        .family-stat-card {
          background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(99, 102, 241, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .family-stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--card-color), transparent, var(--card-color));
          opacity: 0.8;
        }
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .stat-icon-wrapper {
          position: relative;
        }
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-color);
          color: white;
          position: relative;
          z-index: 2;
        }
        .icon-bg {
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: var(--card-color);
          opacity: 0.2;
          border-radius: 20px;
          z-index: 1;
        }
        .stat-trend {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 700;
          padding: 8px 12px;
          border-radius: 12px;
          background: rgba(16, 185, 129, 0.1);
        }
        .stat-content h3 {
          color: #64748b;
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 12px 0;
          letter-spacing: 0.5px;
        }
        .stat-content h2 {
          color: #1e293b;
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 8px 0;
        }
        .stat-subtitle {
          color: #94a3b8;
          font-size: 13px;
          margin: 0;
          font-weight: 500;
        }
        .progress-indicator {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          margin-top: 20px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--card-color), rgba(var(--card-color), 0.7));
          border-radius: 3px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .family-chart-card {
          background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%);
          border-radius: 20px;
          padding: 28px;
          border: 1px solid rgba(16, 185, 129, 0.1);
          position: relative;
          overflow: hidden;
        }
        .family-chart-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #10b981, #06d6a0, #10b981);
        }
        .family-chart-card h3 {
          color: #1e293b;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 24px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chart-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #10b981, #06d6a0);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
      `}</style>

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                borderRadius: '24px',
                padding: '40px',
                marginBottom: '32px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '-80px',
                    left: '-80px',
                    width: '250px',
                    height: '250px',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
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
                            gap: '12px',
                            marginBottom: '12px'
                        }}>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.25)',
                                padding: '12px',
                                borderRadius: '16px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <Users size={28} color="white" />
                            </div>
                            <span style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                padding: '8px 16px',
                                borderRadius: '24px',
                                fontSize: '13px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Family Portal
                            </span>
                        </div>
                        <h1 style={{
                            fontSize: '42px',
                            fontWeight: '900',
                            margin: '0 0 16px 0',
                            background: 'linear-gradient(45deg, #ffffff, #e0f2fe)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            Family Management Hub
                        </h1>
                        <p style={{
                            fontSize: '18px',
                            margin: 0,
                            opacity: 0.95,
                            fontWeight: '500',
                            lineHeight: '1.6'
                        }}>
                            Monitor and manage your family members, track applications, and oversee household activities
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        alignItems: 'flex-end'
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '16px 24px',
                            borderRadius: '16px',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <Heart size={24} />
                            <span style={{ fontWeight: '600', fontSize: '16px' }}>Family Care</span>
                            <Award size={24} />
                        </div>
                        <div style={{
                            fontSize: '14px',
                            opacity: 0.9,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#fbbf24',
                                animation: 'glow 2s infinite alternate'
                            }}></div>
                            Live Family Data
                        </div>
                    </div>
                </div>
                <style>{`
          @keyframes glow {
            from { box-shadow: 0 0 5px #fbbf24; }
            to { box-shadow: 0 0 20px #fbbf24, 0 0 30px #fbbf24; }
          }
        `}</style>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
            }}>
                <StatCard
                    title="Total Family Members"
                    value={stats.totalMembers}
                    icon={Users}
                    trend={12.5}
                    color="#10b981"
                    subtitle="Including all family members"
                />
                <StatCard
                    title="Active Members"
                    value={stats.activeMembers}
                    icon={UserCheck}
                    trend={8.3}
                    color="#06d6a0"
                    subtitle="Currently verified members"
                />
                <StatCard
                    title="Pending Applications"
                    value={stats.pendingMembers}
                    icon={User}
                    trend={25.0}
                    color="#f59e0b"
                    subtitle="Awaiting approval"
                />
                <StatCard
                    title="Rejected Members"
                    value={stats.rejectedMembers}
                    icon={UserX}
                    trend={-15.2}
                    color="#ef4444"
                    subtitle="Applications declined"
                />
            </div>

            {/* Charts Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr',
                gap: '28px',
                marginBottom: '28px'
            }}>
                <div className="family-chart-card">
                    <h3>
                        <div className="chart-icon">
                            <TrendingUp size={18} />
                        </div>
                        Family Growth Timeline
                    </h3>
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={monthlyMemberData}>
                            <defs>
                                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="active"
                                stackId="1"
                                stroke="#10b981"
                                fill="url(#colorActive)"
                                strokeWidth={3}
                            />
                            <Area
                                type="monotone"
                                dataKey="pending"
                                stackId="2"
                                stroke="#f59e0b"
                                fill="url(#colorPending)"
                                strokeWidth={3}
                            />
                            <Area
                                type="monotone"
                                dataKey="rejected"
                                stackId="3"
                                stroke="#ef4444"
                                fill="url(#colorRejected)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="family-chart-card">
                    <h3>
                        <div className="chart-icon">
                            <Shield size={18} />
                        </div>
                        Member Status
                    </h3>
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie
                                data={memberStatusData}
                                cx="50%"
                                cy="45%"
                                innerRadius={50}
                                outerRadius={90}
                                paddingAngle={8}
                                dataKey="value"
                            >
                                {memberStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: '20px' }}>
                        {memberStatusData.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '12px',
                                padding: '8px 0'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '14px',
                                        height: '14px',
                                        borderRadius: '50%',
                                        background: item.color,
                                        boxShadow: `0 2px 8px ${item.color}40`
                                    }}></div>
                                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{item.name}</span>
                                </div>
                                <span style={{
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: '#1e293b',
                                    background: `${item.color}15`,
                                    padding: '4px 8px',
                                    borderRadius: '6px'
                                }}>
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Weekly Activity Chart */}
            <div className="family-chart-card">
                <h3>
                    <div className="chart-icon">
                        <Calendar size={18} />
                    </div>
                    Weekly Family Activity
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyActivityData} barGap={10}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                            }}
                        />
                        <Bar
                            dataKey="newMembers"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                            name="New Members"
                        />
                        <Bar
                            dataKey="applications"
                            fill="#f59e0b"
                            radius={[4, 4, 0, 0]}
                            name="Applications"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FamilyHeaderDashboard;