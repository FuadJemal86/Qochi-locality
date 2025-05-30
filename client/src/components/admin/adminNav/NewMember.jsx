import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Info, UserPlus, X, Search, ChevronLeft, ChevronRight, Printer, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from '../../../../api';
import toast, { Toaster } from 'react-hot-toast';

function NewMember() {
    const [searchTerm, setSearchTerm] = useState('');
    const [familyNewMembersData, setFamilyNewMembersData] = useState([]);
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
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    // Filter data based on search term
    const filteredData = familyNewMembersData.filter(member =>
        member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.relationship?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.education?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleEdit = (id) => {
        // Handle edit logic here
        console.log(`Edit member with ID: ${id}`);
    };

    const handleDelete = (id) => {
        // Handle delete logic here
        console.log(`Delete member with ID: ${id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No Date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await api.get('/admin/get-new-member');
            if (result.data.status) {
                setFamilyNewMembersData(result.data.familyNewMembers);
            } else {
                console.log(result.data.message);
                toast.error(result.data.message || "Failed to fetch data");
            }
        } catch (err) {
            console.error('Error fetching new members:', err);
            toast.error("Error fetching data");
        } finally {
            setIsLoading(false);
        }
    };

    // print the customer table
    const handlePrint = () => {
        const printContent = document.getElementById("new-members-table");
        const WindowPrt = window.open('', '', 'width=900,height=650');
        WindowPrt.document.write(`
                <html>
                    <head>
                        <title>New Family Members</title>
                        <style>
                            body { font-family: Arial; padding: 20px; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { padding: 8px; border: 1px solid #ccc; text-align: left; }
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
        const exportData = familyNewMembersData.map(member => ({
            ID: member.id,
            'Full Name': member.fullName,
            'Birth Date': formatDate(member.birthDate),
            Relationship: member.relationship,
            Education: member.education,
            Occupation: member.occupation,
            'Member Type': member.memberType,
            'Who Member': member.whoMember,
            Status: member.isApproved,
            'Created At': formatDate(member.createdAt)
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "New Members");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "New_Members.xlsx");
    };

    const handleApproval = async (value, id) => {
        try {
            const result = await api.put(`/admin/member-approval/${id}`, {
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
                    <h1 className="text-2xl font-bold text-gray-800">New Family Members</h1>

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
                    </div>
                </div>

                {/* Main table */}
                <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden" id='new-members-table'>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relationship</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Type</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="10" className="py-8 text-center text-gray-500">
                                            <div className="flex justify-center items-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                <span className="ml-3">Loading data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentItems.length > 0 ? (
                                    currentItems.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            {/* Member ID */}
                                            <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {member.id}
                                            </td>

                                            {/* Full Name */}
                                            <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">
                                                {member.fullName || "No Name"}
                                            </td>

                                            {/* Birth Date */}
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(member.birthDate)}
                                            </td>

                                            {/* Relationship */}
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                                {member.relationship || "No Relationship"}
                                            </td>

                                            {/* Education */}
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                                {member.education || "No Education"}
                                            </td>

                                            {/* Occupation */}
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                                {member.occupation || "No Occupation"}
                                            </td>

                                            {/* Member Type */}
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                    {member.memberType || "No Type"}
                                                </span>
                                            </td>

                                            {/* Created At */}
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(member.createdAt)}
                                            </td>

                                            {/* Approval Status */}
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <select
                                                    value={member.isApproved || "PENDING"}
                                                    onChange={e => handleApproval(e.target.value, member.id)}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium outline-none border-0 ${getStatusBadgeColor(member.isApproved)}`}
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="APPROVED">APPROVED</option>
                                                    <option value="REJECTED">REJECTED</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="py-8 text-center text-gray-500">
                                            {familyNewMembersData.length === 0 ? "No data available." : "No members found matching your search."}
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

export default NewMember;