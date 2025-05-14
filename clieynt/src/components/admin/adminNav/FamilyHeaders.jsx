import React, { useState } from 'react';
import { Edit, Trash, Info, UserPlus, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Sample data to display in the table
const familyHeadsData = [
    {
        id: 1,
        fullName: "John Smith",
        contactInfo: "+1-555-123-4567",
        email: "john.smith@example.com",
        houseNumber: "123",
        familysize: "5"
    }

];

// Sample member data for the details modal
const familyMembersData = {
    1: [
        { id: 1, fullName: "Emma Smith", birthDate: "1995-05-15", relationship: "Daughter", education: "College", occupation: "Software Engineer" },
        { id: 2, fullName: "Michael Smith", birthDate: "1990-03-22", relationship: "Son", education: "University", occupation: "Doctor" },
        { id: 3, fullName: "Lisa Smith", birthDate: "1970-09-10", relationship: "Wife", education: "Masters", occupation: "Teacher" }
    ]
}

function FamilyHeaders() {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedFamilyId, setSelectedFamilyId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Form input states
    const [formInputs, setFormInputs] = useState({
        fullName: '',
        contactInfo: '',
        email: '',
        password: '',
        houseNumber: '',
        familySize: ''
    });

    // Filter data based on search term
    const filteredData = familyHeadsData.filter(family =>
        family.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.houseNumber.includes(searchTerm)
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleViewDetails = (id) => {
        setSelectedFamilyId(id);
        setShowDetailsModal(true);
    };

    const handleEdit = (id) => {
        // Handle edit logic here
        console.log(`Edit family with ID: ${id}`);
    };

    const handleDelete = (id) => {
        // Handle delete logic here
        console.log(`Delete family with ID: ${id}`);
    };

    const handleAddFamily = () => {
        setShowAddModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormInputs({
            ...formInputs,
            [name]: value
        });
    };

    const handleSaveFamily = () => {
        // Logic to save the new family
        console.log('Adding new family');
        setShowAddModal(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Family Headers</h1>

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

                        <button
                            onClick={handleAddFamily}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors duration-200"
                        >
                            <UserPlus size={18} />
                            <span>Add Family</span>
                        </button>
                    </div>
                </div>

                {/* Main table with horizontal scroll for mobile */}
                <div className="border border-gray-200 rounded-lg shadow-sm">
                    <div className="overflow-hidden">
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
                            <tbody className="bg-white divide-y divide-gray-200 overflow-x-auto">
                                {currentItems.map((family) => (
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
                                                    onClick={() => handleViewDetails(family.id)}
                                                    className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                                                    title="View Details"
                                                >
                                                    <Info size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(family.id)}
                                                    className="p-1.5 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors duration-200"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(family.id)}
                                                    className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                                                    title="Delete"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentItems.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-gray-500">
                                            No families found matching your search.
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

            {/* Details Modal */}
            {showDetailsModal && selectedFamilyId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
                        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">
                                Family Members - {familyHeadsData.find(f => f.id === selectedFamilyId)?.fullName}
                            </h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-4 md:p-6">
                            <div className="rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Date</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relationship</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 overflow-x-auto">
                                        {familyMembersData[selectedFamilyId]?.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="py-4 px-4 whitespace-nowrap">{member.id}</td>
                                                <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">{member.fullName}</td>
                                                <td className="py-4 px-4 whitespace-nowrap text-gray-700">{formatDate(member.birthDate)}</td>
                                                <td className="py-4 px-4 whitespace-nowrap text-gray-700">{member.relationship}</td>
                                                <td className="py-4 px-4 whitespace-nowrap text-gray-700">{member.education}</td>
                                                <td className="py-4 px-4 whitespace-nowrap text-gray-700">{member.occupation}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FamilyHeaders;