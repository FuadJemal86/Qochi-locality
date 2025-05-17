import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash, Info, UserPlus, X, Search, ChevronLeft, ChevronRight, Printer, FileSpreadsheet, LucideFileQuestion } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from '../../../../api';

function IdTable() {
    const navigate = useNavigate()
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedFamilyId, setSelectedFamilyId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [familyHeadsData, setFamilyHeadsData] = useState([]);
    const [familyMembersData, setFamilyMembersData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            APPROVED: "bg-green-100 text-green-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            REJECTED: "bg-red-100 text-red-800",
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    // Filter data based on search term
    const filteredData = familyHeadsData.filter(family =>
        family.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (family.houseNumber && family.houseNumber.includes(searchTerm))
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
                const result = await api.get('/user/get-member-id');
                if (result.data.status) {
                    setFamilyHeadsData(result.data.familyMembers);
                } else {
                    console.log(result.data.message);
                }
            } catch (err) {
                console.error('Error fetching family headers:', err);
            }
        };
        fetchData();
    }, []);

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
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <Printer />
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        <FileSpreadsheet />
                    </button>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Id Request</h1>

                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search families..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
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
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id Request</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((family) => (
                                        <tr key={family.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="py-4 px-4 whitespace-nowrap">{family.id}</td>
                                            <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">{family.fullName}</td>
                                            <td className="p-3 text-sm text-gray-500">
                                                {new Date(family.birthDate).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                }).replace(' ', '.')}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{family.relationship}</td>
                                            <td className="p-3 text-sm text-gray-500">
                                                {new Date(family.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                }).replace(' ', '.')}
                                            </td>
                                            <td>
                                                {family.idRequests && family.idRequests.length > 0 ? (
                                                    family.idRequests.map((request, index) => (
                                                        <span
                                                            key={index}
                                                            className={`px-2 py-1 rounded-full text-xs font-medium outline-none ${getStatusBadgeColor(request.status)} mb-1`}
                                                        >
                                                            {request.status}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium text-gray-500 bg-gray-100">No Requests</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleIdRequest(family.id)}
                                                        className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                                                        title="View Details"
                                                    >
                                                        <LucideFileQuestion size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-gray-500">
                                            {familyHeadsData.length === 0 ? "No families found matching" : "No families found matching your search."}
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {filteredData.length > itemsPerPage && (
                    <div className="flex justify-between items-center mt-4 px-2">
                        <span className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
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

export default IdTable;
