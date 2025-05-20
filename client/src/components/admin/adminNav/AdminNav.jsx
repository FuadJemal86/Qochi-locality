import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    Bell,
    Settings,
    User,
    ChevronDown,
    Menu,
    X,
    Users,
    Home,
    PieChart,
    BarChart,
    Calendar,
    FileText,
    UserPlus,
    UserX,
    UserCheck,
    HelpCircle,
    LogOut,
    CircleUser,
    ArrowRight,
    ArrowLeft,
    Settings2,
    IdCard,
    Videotape
} from 'lucide-react';

export default function AdminNav() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeItem, setActiveItem] = useState('dashboard');
    const [isMobile, setIsMobile] = useState(false);

    // Check for mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            // Auto-hide sidebar on mobile
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        // Initial check
        checkMobile();

        // Add resize listener
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        setCollapsed(!collapsed);
    };

    // Toggle dropdown menus
    const toggleDropdown = (menu) => {
        if (activeDropdown === menu) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(menu);
        }
    };


    // Navigation item component with improved click-only focus handling
    const NavItem = ({ icon, label, id, hasDropdown = false, onClick, isActive }) => {
        return (
            <button
                onClick={onClick}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-md transition-all duration-200 ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white focus:outline-none'
                    }`}
            >
                <div className="flex items-center">
                    {icon}
                    {(!collapsed || isMobile) && <span className={`ml-3 font-medium ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{label}</span>}
                </div>
                {hasDropdown && (!collapsed || isMobile) && (
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === id ? 'rotate-180' : ''}`} />
                )}
            </button>
        );
    };

    // Submenu item component
    const SubMenuItem = ({ icon, label, id, onClick, isActive }) => {
        return (
            <button
                onClick={onClick}
                className={`flex items-center w-full pl-12 pr-4 py-2 rounded-md transition-all duration-200 ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white focus:outline-none'
                    }`}
            >
                <div className="flex items-center">
                    {icon}
                    {(!collapsed || isMobile) && <span className={`ml-3 font-medium ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{label}</span>}
                </div>
            </button>
        );
    };

    return (
        <div className="flex flex-col h-screen lg:flex-row min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`bg-gray-900 shadow-lg z-20 fixed inset-y-0 left-0 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                } ${isMobile ? 'w-64' : sidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500 text-white rounded-lg h-10 w-10 flex items-center justify-center">
                            <span className="font-bold text-xl">Q</span>
                        </div>
                        {(!collapsed || isMobile) && (
                            <h1 className="font-medium text-lg text-gray-100">Qochi Admin</h1>
                        )}
                    </div>
                    {!isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="p-1 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none"
                        >
                            {sidebarOpen ? <ChevronDown className="h-5 w-5 rotate-90" /> : <ChevronDown className="h-5 w-5 -rotate-90" />}
                        </button>
                    )}
                    {isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="p-1 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Sidebar Content */}
                <div className="py-4">
                    <ul className="space-y-2 px-2">
                        {/* Dashboard */}
                        <li>
                            <NavItem
                                icon={<Home className="h-5 w-5" />}
                                label="Dashboard"
                                id="dashboard"
                                isActive={activeItem === 'dashboard'}
                                onClick={() => {
                                    setActiveItem('dashboard');
                                    if (isMobile) setSidebarOpen(false);
                                }}
                            />
                        </li>

                        <li>
                            <Link to={'/admin-dashboard/family-headers'}>
                                <NavItem
                                    icon={<Home className="h-5 w-5" />}
                                    label="Family Headers"
                                    id="family-headers"
                                    isActive={activeItem === 'family-headers'}
                                    onClick={() => {
                                        setActiveItem('family-headers');
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                />
                            </Link>
                        </li>

                        {/* Members - with dropdown for sub-items */}
                        <li>
                            <div>
                                <NavItem
                                    icon={<Users className="h-5 w-5" />}
                                    label="Members"
                                    id="members"
                                    hasDropdown={true}
                                    isActive={['members', 'new-members', 'removed-members', 'rejected-members'].includes(activeItem)}
                                    onClick={() => {
                                        toggleDropdown('members');
                                    }}
                                />

                                {/* Members Dropdown */}
                                {(activeDropdown === 'members' && (!collapsed || isMobile)) && (
                                    <div className="mt-1 space-y-1">
                                        <Link to={'/admin-dashboard/family-members'}>
                                            <SubMenuItem
                                                icon={<UserCheck className="h-4 w-4" />}
                                                label="All Members"
                                                id="all-members"
                                                isActive={activeItem === 'members'}
                                                onClick={() => {
                                                    setActiveItem('members');
                                                    if (isMobile) setSidebarOpen(false);
                                                }}
                                            />
                                        </Link>

                                        <Link to={'/admin-dashboard/new-members'}>
                                            <SubMenuItem
                                                icon={<UserPlus className="h-4 w-4" />}
                                                label="New Members"
                                                id="new-members"
                                                isActive={activeItem === 'new-members'}
                                                onClick={() => {
                                                    setActiveItem('new-members');
                                                    if (isMobile) setSidebarOpen(false);
                                                }}
                                            />
                                        </Link>

                                        <Link to={'/admin-dashboard/removed-members'}>
                                            <SubMenuItem
                                                icon={<UserX className="h-4 w-4" />}
                                                label="Removed Members"
                                                id="removed-members"
                                                isActive={activeItem === 'removed-members'}
                                                onClick={() => {
                                                    setActiveItem('removed-members');
                                                    if (isMobile) setSidebarOpen(false);
                                                }}
                                            />
                                        </Link>

                                        <Link to={'/admin-dashboard/rejected-family-member'}>
                                            <SubMenuItem
                                                icon={<UserX className="h-4 w-4" />}
                                                label="Rejected Members"
                                                id="rejected-members"
                                                isActive={activeItem === 'rejected-members'}
                                                onClick={() => {
                                                    setActiveItem('rejected-members');
                                                    if (isMobile) setSidebarOpen(false);
                                                }}
                                            />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </li>

                        <li>
                            <Link to={'/admin-dashboard/id-request'}>
                                <NavItem
                                    icon={<IdCard className="h-5 w-5" />}
                                    label="Id Request"
                                    id="id Request"
                                    isActive={activeItem === 'id Request'}
                                    onClick={() => {
                                        setActiveItem('id Request');
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                />
                            </Link>
                        </li>

                        <li>
                            <Link to={'/admin-dashboard/vital-event'}>
                                <NavItem
                                    icon={<Videotape className="h-5 w-5" />}
                                    label="Vital Event"
                                    id="Vital Event"
                                    isActive={activeItem === 'Vital Event'}
                                    onClick={() => {
                                        setActiveItem('Vital Event');
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                />
                            </Link>
                        </li>

                        <li>
                            <NavItem
                                icon={<Settings className="h-5 w-5" />}
                                label="Setting"
                                id="setting"
                                isActive={activeItem === 'setting'}
                                onClick={() => {
                                    setActiveItem('setting');
                                    if (isMobile) setSidebarOpen(false);
                                }}
                            />
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col ${isMobile ? '0' : (sidebarOpen ? 'md:ml-64' : 'md:ml-20')} transition-all duration-300`}>
                {/* Header */}
                <header className="bg-white shadow-sm h-16 flex items-center z-10 sticky top-0">
                    <div className="flex items-center justify-between w-full px-6">
                        <div className="flex items-center">
                            {isMobile && (
                                <button
                                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
                                    onClick={toggleSidebar}
                                >
                                    {sidebarOpen ? <X className="h-6 w-6" /> : <ArrowRight className="h-6 w-6" />}
                                </button>
                            )}
                            <h1 className="text-lg font-medium text-gray-800 ml-2">
                                {activeItem.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h1>
                        </div>

                        {/* Header Right */}
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                            </button>

                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative">
                                    <CircleUser className="h-6 w-6" />
                                </button>
                                <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative">
                                    <Settings className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}