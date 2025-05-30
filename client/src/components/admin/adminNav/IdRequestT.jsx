import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Info, UserPlus, X, Search, ChevronLeft, ChevronRight, Printer, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from '../../../../api';
import toast, { Toaster } from 'react-hot-toast';

function IdRequestT() {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailMemberData, setDetailMemberData] = useState({});
    const [selectedFamilyId, setSelectedFamilyId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [familyHeadsData, setFamilyHeadsData] = useState([]);
    const [familyMembersData, setFamilyMembersData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [statusState, setStatusState] = useState({
        status: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 5;

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            APPROVED: "bg-green-100 text-green-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            REJECTED: "bg-red-100 text-red-800",
            EXPIRED: "bg-red-100 text-red-800"
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

    const handleViewDetails = async (id) => {
        setSelectedFamilyId(id);
        try {
            // Fetch family members data for the selected family
            const response = await api.get(`/admin/get-family-members/${id}`);
            if (response.data.status) {
                setFamilyMembersData(prevData => ({
                    ...prevData,
                    [id]: response.data.familyMembers
                }));
            }
        } catch (err) {
            console.error('Error fetching family members:', err);
            setFamilyMembersData(prevData => ({
                ...prevData,
                [id]: []
            }));
        }
    };



    const handleEdit = (id) => {
        // Handle edit logic here
        console.log(`Edit family with ID: ${id}`);
    };

    const handleDelete = (id) => {
        // Handle delete logic here
        console.log(`Delete family with ID: ${id}`);
    };

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
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await api.get('/admin/get-id-request');
            if (result.data.status) {
                setFamilyHeadsData(result.data.getIdRequest);
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.error('Error fetching family headers:', err);
        } finally {
            setIsLoading(false);
        }
    };



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

    const getMemberDetailData = async (id) => {
        navigator(`/get-detail-member/${id}`)
    };

    const handleApproval = async (value, id) => {
        try {
            const result = await api.put(`/admin/id-approval/${id}`, {
                ...statusState,
                status: value
            });

            if (result.data.status) {
                toast.success(result.data.message);
                fetchData();
            } else {
                console.log(result.data.message);
                toast.error(result.data.message || "Failed to update status");
            }
        } catch (err) {
            console.log(err);
            toast.error("An error occurred while updating status");
        }
    };



    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
                <div className="flex justify-end mb-4 gap-2">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Printer size={16} /> Print
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                    >
                        <FileSpreadsheet size={16} /> Export
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
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head Name</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="9" className="py-8 text-center text-gray-500">
                                            <div className="flex justify-center items-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                <span className="ml-3">Loading data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : familyHeadsData.length > 0 ? (
                                    familyHeadsData.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            {/* ID */}
                                            <td className="py-4 px-4 whitespace-nowrap">{request.id}</td>

                                            {/* Full Name */}
                                            <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">{request.fullName || "No Name"}</td>

                                            {/* Head Name */}
                                            <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">{request.familyHead?.fullName || "No Head Name"}</td>

                                            {/* Occupation */}
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{request.occupation || "No Occupation"}</td>

                                            {/* Phone Number */}
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{request.phoneNumber || "No Phone Number"}</td>

                                            {/* Type */}
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{request.type || "No Type"}</td>

                                            {/* status */}
                                            <td>
                                                <select
                                                    value={request.status || "PENDING"}
                                                    onChange={e => handleApproval(e.target.value, request.id)}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium outline-none ${getStatusBadgeColor(request.status)}`}
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="APPROVED">APPROVED</option>
                                                    <option value="REJECTED">REJECTED</option>
                                                    <option value="EXPIRED">EXPIRED</option>
                                                </select>
                                            </td>

                                            {/* Created At */}
                                            <td className="p-3 text-sm text-gray-500">
                                                {request.createdAt
                                                    ? new Date(request.createdAt).toLocaleDateString("en-GB", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    }).replace(/ /g, ".")
                                                    : "No Created Date"}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/admin-dashboard/get-detail-id/${request.memberId}`}
                                                        className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                                                        title="View Details"
                                                    >
                                                        <Info size={18} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="py-8 text-center text-gray-500">
                                            No data available.
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

export default IdRequestT;