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
    IdCard,
    VideotapeIcon,
    File,
    Folder
} from 'lucide-react';

export default function FamilyHeaderNav() {
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


    // Navigation item component with improved focus effects
    const NavItem = ({ icon, label, id, hasDropdown = false, onClick, isActive }) => {
        return (
            <button
                onClick={onClick}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-md transition-all duration-200 ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800'
                    }`}
            >
                <div className="flex items-center">
                    {icon}
                    {(!collapsed || isMobile) && <span className={`ml-3 font-medium ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{label}</span>}
                </div>
                {(!collapsed || isMobile) && hasDropdown && (
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isActive ? 'transform rotate-180' : ''}`} />
                )}
            </button>
        );
    };

    // Dropdown item component
    const DropdownItem = ({ icon, label, id, onClick }) => {
        return (
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setActiveItem(id);
                    if (onClick) onClick();
                }}
                className={`flex items-center px-4 py-2 text-sm rounded-md transition-all duration-200 ${activeItem === id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700'
                    }`}
            >
                {icon}
                <span className="ml-3">{label}</span>
            </a>
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
                            <h1 className="font-medium text-lg text-gray-100">Qochi FH</h1>
                        )}
                    </div>
                    {!isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="p-1 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {sidebarOpen ? <ChevronDown className="h-5 w-5 rotate-90" /> : <ChevronDown className="h-5 w-5 -rotate-90" />}
                        </button>
                    )}
                    {isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="p-1 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <Link to={'/family-head-dashboard/family-members'}>
                                <NavItem
                                    icon={<Home className="h-5 w-5" />}
                                    label="Family Members"
                                    id="family-Members"
                                    isActive={activeItem === 'family-Members'}
                                    onClick={() => {
                                        setActiveItem('family-Members');
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                /></Link>
                        </li>

                        {/* Users Section */}
                        <li>
                            <NavItem
                                icon={<Users className="h-5 w-5" />}
                                label="Members"
                                id="members"
                                hasDropdown={true}
                                isActive={activeDropdown === 'users'}
                                onClick={() => toggleDropdown('users')}
                            />

                            {sidebarOpen && activeDropdown === 'users' && (
                                <ul className="mt-2 pl-6 space-y-2">
                                    <li>
                                        <DropdownItem
                                            icon={<UserX className="h-4 w-4" />}
                                            label="Removed Members"
                                            id="removed-members"
                                            onClick={() => {
                                                if (isMobile) setSidebarOpen(false);
                                            }}
                                        />
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            <Link to={'/family-head-dashboard/rejected-memebrs'}>
                                <NavItem
                                    icon={<UserX className="h-5 w-5" />}
                                    label="Rejected Members"
                                    id="rejected-members"
                                    isActive={activeItem === 'rejected-members'}
                                    onClick={() => {
                                        setActiveItem('rejected-members');
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                />
                            </Link>
                        </li>

                        <li>
                            <Link to={'/family-head-dashboard/id'}>
                                <NavItem
                                    icon={<IdCard className="h-5 w-5" />}
                                    label="Id Request"
                                    id="Id Request"
                                    isActive={activeItem === 'id request'}
                                    onClick={() => {
                                        setActiveItem('id request');
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                />
                            </Link>
                        </li>

                        <li>
                            <Link to={'/family-head-dashboard/vital-event'}>
                                <NavItem
                                    icon={<VideotapeIcon className="h-5 w-5" />}
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
                            <Link to={'/family-head-dashboard/all-document'}>
                                <NavItem
                                    icon={<Folder className="h-5 w-5" />}
                                    label="Documents"
                                    id="Documents"
                                    isActive={activeItem === 'Documents'}
                                    onClick={() => {
                                        setActiveItem('Documents');
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                />
                            </Link>
                        </li>

                        <li>
                            <NavItem
                                icon={<Settings className="h-5 w-5" />}
                                label="Setting"
                                id="Setting"
                                isActive={activeItem === 'Setting'}
                                onClick={() => {
                                    setActiveItem('Setting');
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
                                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 relative">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                            </button>

                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 relative">
                                    <CircleUser className="h-6 w-6" />
                                </button>
                                <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 relative">
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