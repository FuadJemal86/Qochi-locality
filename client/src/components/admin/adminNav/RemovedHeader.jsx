import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Info, UserPlus, X, Search, ChevronLeft, ChevronRight, Printer, FileSpreadsheet, RotateCcw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from '../../../../api';
import Swal from 'sweetalert2';

function RemovedHeader() {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedFamilyId, setSelectedFamilyId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [familyHeadsData, setFamilyHeadsData] = useState([]);
    const [familyMembersData, setFamilyMembersData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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
        setShowDetailsModal(true);
    };

    const handleEdit = (id) => {
        // Handle edit logic here
        console.log(`Edit family with ID: ${id}`);
    };

    const handleDelete = (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            })

                .then(async (result) => {
                    if (result.isConfirmed) {
                        const response = await api.put(`/admin/delete-header/${id}`)
                        if (response.data.status) {
                            fetchData()
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                        }
                    }
                })

        } catch (err) {
            console.log(err)
        }
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
        try {
            const result = await api.get('/admin/get-removed-header');
            if (result.data.status) {
                setFamilyHeadsData(result.data.removeHeader);
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.error('Error fetching family headers:', err);
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

                {/* Main table with single structure for header and body */}
                <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden" id='family-header'>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House #</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family Size</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((family) => (
                                        <tr key={family.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="py-4 px-4 whitespace-nowrap">{family.id}</td>
                                            <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">{family.fullName}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{family.contactInfo}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{family.email}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{family.houseNumber}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{family.familysize}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(family.id)}
                                                        className="p-1.5 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors duration-200"
                                                        title="Edit"
                                                    >
                                                        <RotateCcw size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-gray-500">
                                            {familyHeadsData.length === 0 ? "Loading data..." : "No families found matching your search."}
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

export default RemovedHeader;
