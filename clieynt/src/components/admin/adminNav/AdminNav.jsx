import React, { useState } from 'react'
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
    SettingsIcon,
    CircleUser
} from 'lucide-react';

export default function AdminNav() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

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

    // Sample data for dashboard
    const stats = [
        { title: "Total Users", value: "1,254", change: "+12%" },
        { title: "Active Members", value: "867", change: "+5%" },
        { title: "Pending Approvals", value: "24", change: "-8%" },
        { title: "New Today", value: "16", change: "+25%" },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`bg-gray-900 shadow-md z-20 fixed inset-y-0 left-0 transition-all duration-300  ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500 text-white rounded-lg h-10 w-10 flex items-center justify-center">
                            <span className="font-bold text-xl">A</span>
                        </div>
                        {!collapsed && (
                            <h1 className="font-medium text-lg text-gray-100">Qochi Admin</h1>
                        )}
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
                    >
                        {sidebarOpen ? <ChevronDown className="h-5 w-5 rotate-90" /> : <ChevronDown className="h-5 w-5 -rotate-90" />}
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className="py-4 ">
                    <ul className="space-y-2 px-2 ">
                        {/* Dashboard */}
                        <li>
                            <a href="#" className="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-md">
                                <Home className="h-5 w-5" />
                                {sidebarOpen && <span className="ml-3">Dashboard</span>}
                            </a>
                        </li>

                        {/* Users Section */}
                        <li>
                            <button
                                onClick={() => toggleDropdown('users')}
                                className="flex items-center justify-between w-full px-4 py-2 text-white hover:bg-gray-800 rounded-md"
                            >
                                <div className="flex items-center">
                                    <Users className="h-5 w-5" />
                                    {sidebarOpen && <span className="ml-3">Users</span>}
                                </div>
                                {sidebarOpen && <ChevronDown className={`h-4 w-4 ${activeDropdown === 'users' ? 'transform rotate-180' : ''}`} />}
                            </button>

                            {sidebarOpen && activeDropdown === 'users' && (
                                <ul className="mt-1 pl-6 space-y-1">
                                    <li>
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-md">
                                            <UserCheck className="h-4 w-4" />
                                            <span className="ml-3">Active Users</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-md">
                                            <UserX className="h-4 w-4" />
                                            <span className="ml-3">Rejected Users</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-md">
                                            <UserX className="h-4 w-4" />
                                            <span className="ml-3">Removed Users</span>
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Reports Section */}
                        <li>
                            <button
                                onClick={() => toggleDropdown('reports')}
                                className="flex items-center justify-between w-full px-4 py-2 text-white hover:bg-gray-800 rounded-md"
                            >
                                <div className="flex items-center">
                                    <UserPlus className="h-5 w-5" />
                                    {sidebarOpen && <span className="ml-3">Add user</span>}
                                </div>
                            </button>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
                {/* Header */}
                <header className="bg-white shadow-sm h-16 flex items-center z-10">
                    <div className="flex items-center justify-between w-full px-6">
                        <div className="flex items-center">
                            <button
                                className="md:hidden mr-4 p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
                                onClick={toggleSidebar}
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <h1 className="text-lg font-medium text-gray-800"><Menu /></h1>
                        </div>

                        {/* Header Right */}
                        <div className="flex items-center space-x-4">
                            <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                            </button>

                            <div className="flex items-center gap-3">
                                <span className="p-1 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative"><CircleUser /></span>
                                <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative"><SettingsIcon /></button>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        </div>
    );
}