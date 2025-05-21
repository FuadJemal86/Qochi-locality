import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash, Info, UserPlus, X, Search, ChevronLeft, ChevronRight, Printer, FileSpreadsheet, User, LucideFileQuestion, Heart } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from '../../../../api';

function VitalEvent() {
    const navigate = useNavigate()
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [familyHeadsData, setFamilyHeadsData] = useState([]);
    const [familyMembersData, setFamilyMembersData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [showForYou, setShowForYou] = useState(false);
    const itemsPerPage = 5;

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            APPROVED: "bg-green-100 text-green-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            REJECTED: "bg-red-100 text-red-800",
            ACTIVE: "bg-blue-100 text-blue-800",
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    // Filter data based on search term
    const filteredData = familyHeadsData.filter(family =>
        family.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.relationship?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.memberType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // For You filter functionality
    const forYouData = showForYou
        ? filteredData.filter(member =>
            (member.birthCertificates && member.birthCertificates.length > 0 && member.birthCertificates[0].status === 'PENDING') ||
            (member.deathCertificates && member.deathCertificates.length > 0 && member.deathCertificates[0].status === 'PENDING') ||
            (member.divorceCertificate && member.divorceCertificate.length > 0 && member.divorceCertificate[0].status === 'PENDING') ||
            (member.marriageCertificates && member.marriageCertificates.length > 0 && member.marriageCertificates[0].status === 'PENDING')
        )
        : filteredData;

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = forYouData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(forYouData.length / itemsPerPage);

    const handleIdRequest = (id) => {
        navigate(`/family-head-dashboard/id-request/${id}`)
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/user/get-vital-event');
                if (result.data.status) {
                    if (result.data.vitalEvent && result.data.vitalEvent.members) {
                        setFamilyHeadsData(result.data.vitalEvent.members);
                    } else {
                        console.log('No members data found');
                    }
                } else {
                    console.log(result.data.message);
                }
            } catch (err) {
                console.error('Error fetching family headers:', err);
            }
        };
        fetchData();
    }, []);

    // Reset to first page when toggling For You mode
    useEffect(() => {
        setCurrentPage(1);
    }, [showForYou]);

    // print the customer table
    const handlePrint = () => {
        const printContent = document.getElementById("family-header");
        const WindowPrt = window.open('', '', 'width=900,height=650');
        WindowPrt.document.write(`
                <html>
                    <head>
                        <title>Family Headers</title>
                        <style>
                            body { font-family: Arial; padding: 20px; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { padding: 8px; border: 1px solid #ccc; }
                            th { background: #f0f0f0; }
                        </style>
                    </head>
                    <body>${printContent.innerHTML}</body>
                </html>
            `);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
    };

    //  export Excel file
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(familyHeadsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Families");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Families.xlsx");
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
                <div className="flex justify-end mb-4 gap-2">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                        <Printer size={20} />

                    </button>
                    <button
                        onClick={exportToExcel}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                    >
                        <FileSpreadsheet size={20} />
                    </button>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Vital Events</h1>

                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                        <Link
                            to={'/family-head-dashboard/for-header'}
                            onClick={() => setShowForYou(!showForYou)}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${showForYou
                                ? "bg-purple-600 text-white hover:bg-purple-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <Heart size={18} className={showForYou ? "text-white" : "text-purple-500"} />
                            <span>For You</span>
                        </Link>
                    </div>
                </div>

                {/* Main table with single structure for header and body */}
                <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden" id='family-header'>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relation</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Type</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vital Events</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((member) => (
                                        <tr
                                            key={member.id}
                                            className={`hover:bg-gray-50 transition-colors duration-150 ${selectedMember?.id === member.id ? 'bg-blue-50' : ''}`}
                                        >
                                            <td className="py-4 px-4 whitespace-nowrap">{member.id}</td>
                                            <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">{member.fullName}</td>
                                            <td className="p-3 text-sm text-gray-500">
                                                {new Date(member.birthDate).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{member.relationship || 'N/A'}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{member.memberType || 'N/A'}</td>
                                            <td className="py-4 px-4 whitespace-nowrap space-y-1 text-sm">
                                                <div>
                                                    <span className="font-semibold text-gray-600">Birth:</span>{' '}
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.birthCertificates && member.birthCertificates.length > 0
                                                        ? getStatusBadgeColor(member.birthCertificates[0].status)
                                                        : "bg-gray-100 text-gray-500"
                                                        }`}>
                                                        {member.birthCertificates && member.birthCertificates.length > 0
                                                            ? member.birthCertificates[0].status
                                                            : "Not Required"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-600">Death:</span>{' '}
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.deathCertificates && member.deathCertificates.length > 0
                                                        ? getStatusBadgeColor(member.deathCertificates[0].status)
                                                        : "bg-gray-100 text-gray-500"
                                                        }`}>
                                                        {member.deathCertificates && member.deathCertificates.length > 0
                                                            ? member.deathCertificates[0].status
                                                            : "Not Required"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-600">Divorce:</span>{' '}
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.divorceCertificate && member.divorceCertificate.length > 0
                                                        ? getStatusBadgeColor(member.divorceCertificate[0].status)
                                                        : "bg-gray-100 text-gray-500"
                                                        }`}>
                                                        {member.divorceCertificate && member.divorceCertificate.length > 0
                                                            ? member.divorceCertificate[0].status
                                                            : "Not Required"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-600">Marriage:</span>{' '}
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.marriageCertificates && member.marriageCertificates.length > 0
                                                        ? getStatusBadgeColor(member.marriageCertificates[0].status)
                                                        : "bg-gray-100 text-gray-500"
                                                        }`}>
                                                        {member.marriageCertificates && member.marriageCertificates.length > 0
                                                            ? member.marriageCertificates[0].status
                                                            : "Not Required"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/family-head-dashboard/certificate/${member.id}`}
                                                        onClick={() => handleIdRequest(member.id)}
                                                        className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                                                        title="Request ID"
                                                    >
                                                        <LucideFileQuestion size={18} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-gray-500">
                                            {showForYou ? 'No pending vital events found' : 'No family members found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Pagination */}
                {forYouData.length > itemsPerPage && (
                    <div className="flex justify-between items-center mt-4 px-2">
                        <span className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, forYouData.length)} of {forYouData.length} entries
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VitalEvent;