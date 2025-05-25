import React, { useState, useEffect } from "react";
import { X, User, Search, FileText } from "lucide-react";
import api from "../../../../api";
import { useNavigate, useParams } from "react-router-dom";

export default function MemberDetail() {
    const { id } = useParams()
    const navigator = useNavigate()
    const [requestData, setRequestData] = useState({ loading: true });
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [approvalFilter, setApprovalFilter] = useState("ALL");


    useEffect(() => {
        const fetchData = async () => {
            try {
                setRequestData({ loading: true });

                const response = await api.get(`/admin/detail-member/${id}`);

                if (response.data.status) {
                    setRequestData({
                        loading: false,
                        familyMembers: response.data.familyMembers || []
                    });
                } else {
                    console.error(response.data.message);
                    setRequestData({ loading: false, familyMembers: [] });
                }
            } catch (err) {
                console.error(err);
                setRequestData({ loading: false, familyMembers: [] });
            }
        };

        fetchData();
    }, [id]);

    const closeModal = () => {
        navigator('/admin-dashboard/family-headers')

    };

    // Helper function to get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status?.toUpperCase()) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "APPROVED":
                return "bg-green-100 text-green-800 border-green-200";
            case "REJECTED":
                return "bg-red-100 text-red-800 border-red-200";
            case "ACTIVE":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "DECEASED":
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "bg-blue-100 text-blue-800 border-blue-200";
        }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return "Not available";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    // Filter members based on search and filters
    const filteredMembers = requestData?.familyMembers?.filter(member => {
        const matchesSearch = member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.memberType?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || member.status === statusFilter;
        const matchesApproval = approvalFilter === "ALL" || member.isApproved === approvalFilter;

        return matchesSearch && matchesStatus && matchesApproval;
    }) || [];

    // Loading state
    if (requestData.loading) {
        return (
            <div className="fixed inset-0 bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                    <div className="p-8 sm:p-16 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-600"></div>
                        <p className="mt-6 text-gray-600 font-medium">Loading family members...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full sm:max-w-6xl transform transition-all duration-300 ease-in-out my-0 sm:my-8 h-full sm:h-[95vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-4 sm:py-6 px-4 sm:px-6 relative flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Family Members</h2>
                        <button
                            onClick={closeModal}
                            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="p-4 sm:p-6 border-b bg-gray-50 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, occupation, or type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="ALL">All Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="DECEASED">Deceased</option>
                            </select>

                            <select
                                value={approvalFilter}
                                onChange={(e) => setApprovalFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="ALL">All Approval</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredMembers.length} of {requestData?.familyMembers?.length || 0} members
                    </div>
                </div>

                {/* Scrollable Table Container */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Member</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Birth Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Relationship</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Education</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Occupation</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Member Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Who Member</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    {member.image ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={`http://localhost:3032/uploads/members/${member.image}`}
                                                            alt={member.fullName}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className={`h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ${member.image ? 'hidden' : ''}`}>
                                                        <User size={16} className="text-gray-500" />
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">{member.fullName}</div>
                                                    <div className="text-sm text-gray-500">ID: {member.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(member.birthDate)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.relationship || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.education || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.occupation || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {member.memberType || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.whoMember || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(member.status)}`}>
                                                {member.status || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredMembers.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-2">
                                    <User size={48} className="mx-auto" />
                                </div>
                                <p className="text-gray-500">No members found matching your criteria</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-gray-50 flex justify-end flex-shrink-0">
                    <button
                        onClick={closeModal}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors shadow-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}