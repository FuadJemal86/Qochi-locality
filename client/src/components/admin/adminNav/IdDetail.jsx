import React, { useState, useEffect } from "react";
import { X, Download, User, Calendar, Book, Briefcase, Heart, FileText, Info, Map, Home } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../../api";
import { useNavigate, useParams } from "react-router-dom";

export default function IdDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("info");
    const [showImage, setShowImage] = useState(false);
    const [requestData, setRequestData] = useState({ loading: true });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Show loading state is now handled by the initial state

                const result = await api.get(`/admin/get-id-detail/${id}`);

                if (result.data.status) {
                    setRequestData(result.data.getDetailId);
                    setTimeout(() => {
                        setShowImage(true);
                    }, 300);
                } else {
                    console.log(result.data.message);
                    toast.error("Failed to fetch ID request details");
                    setRequestData({ loading: false });
                }
            } catch (err) {
                console.log(err);
                toast.error("An error occurred while fetching ID request details");
                setRequestData({ loading: false });
            }
        }

        fetchData();

        return () => clearTimeout(2000);
    }, [id]);

    const closeModal = () => {
        navigate('/admin-dashboard/id-request');
    }

    // Loading state
    if (requestData.loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                    <div className="p-8 sm:p-16 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-600"></div>
                        <p className="mt-6 text-gray-600 font-medium">Loading ID request details...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Helper function to get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status?.toUpperCase()) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "APPROVED":
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return "Not available";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    // Function to render the documents tab
    const renderDocuments = () => {
        return (
            <div className="grid grid-cols-1 gap-6">
                <DocumentCard
                    title="ID Request Document"
                    document={requestData?.gotImage ? `http://localhost:3032/uploads/members/${requestData.gotImage}` : null}
                    documentType={requestData?.gotImage?.toLowerCase().endsWith('.pdf') ? "pdf" : "image"}
                />
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full sm:max-w-3xl transform transition-all duration-300 ease-in-out my-0 sm:my-8 max-h-full sm:max-h-[90vh] flex flex-col">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-4 sm:py-6 px-4 sm:px-6 relative flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">ID Request Details</h2>
                        <button
                            onClick={closeModal}
                            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content area with scroll */}
                <div className="flex-grow overflow-y-auto">
                    {/* Profile section with image and name */}
                    <div className="relative">
                        {/* Member image - responsive positioning */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start px-4 sm:px-6 pt-6 pb-2">
                            <div className={`transition-all duration-500 ease-in-out ${showImage ? "opacity-100" : "opacity-0"}`}>
                                {requestData?.image ? (
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        <img
                                            src={`http://localhost:3032/uploads/members/${requestData.image}`}
                                            alt={requestData.fullName || "Applicant"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                                        <User size={40} className="text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Applicant name display - mobile friendly */}
                            <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                                    {requestData?.fullName || "Unknown Applicant"}
                                </h3>
                                <p className="text-gray-500">
                                    {requestData?.type || "ID Request"} • Family Head: {requestData?.familyHead?.fullName || "Unknown"}
                                </p>
                                <div className="mt-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(requestData?.status)}`}>
                                        {requestData?.status || "Unknown Status"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation tabs - scrollable on mobile */}
                        <div className="flex overflow-x-auto border-b mt-4 px-4 sm:px-6 no-scrollbar">
                            <button
                                onClick={() => setActiveTab("info")}
                                className={`px-4 sm:px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${activeTab === "info" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Personal Info
                                {activeTab === "info" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab("documents")}
                                className={`px-4 sm:px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${activeTab === "documents" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Documents
                                {activeTab === "documents" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Tab content */}
                    <div className="p-4 sm:p-6">
                        <div className="space-y-6">
                            {activeTab === "info" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                    <InfoItem
                                        icon={<Calendar className="text-blue-500" size={18} />}
                                        label="Age"
                                        value={requestData?.age || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Info className="text-purple-500" size={18} />}
                                        label="Gender"
                                        value={requestData?.gender || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Heart className="text-pink-500" size={18} />}
                                        label="Mother's Name"
                                        value={requestData?.mothersName || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Briefcase className="text-amber-500" size={18} />}
                                        label="Occupation"
                                        value={requestData?.occupation || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Info className="text-green-500" size={18} />}
                                        label="Phone Number"
                                        value={requestData?.phoneNumber || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Map className="text-indigo-500" size={18} />}
                                        label="Place of Birth"
                                        value={requestData?.placeOFBirth || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Home className="text-blue-500" size={18} />}
                                        label="Address"
                                        value={requestData?.address || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Home className="text-gray-500" size={18} />}
                                        label="House Number"
                                        value={requestData?.houseNumber || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Info className="text-blue-500" size={18} />}
                                        label="Nationality"
                                        value={requestData?.Nationality || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Info className="text-red-500" size={18} />}
                                        label="Emergency Contact"
                                        value={requestData?.emergencyContact || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Calendar className="text-gray-500" size={18} />}
                                        label="Request Date"
                                        value={formatDate(requestData?.createdAt)}
                                    />
                                    <InfoItem
                                        icon={<Info className="text-amber-500" size={18} />}
                                        label="Status"
                                        value={requestData?.status || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Info className="text-amber-500" size={18} />}
                                        label="Type"
                                        value={requestData?.member?.type || "Not available"}
                                    />
                                </div>
                            )}

                            {activeTab === "documents" && renderDocuments()}
                        </div>
                    </div>
                </div>

                {/* Footer with action buttons based on status */}
                <div className="border-t p-4 bg-gray-50 flex justify-between flex-shrink-0">
                    {requestData?.status?.toUpperCase() === "PENDING" ? (
                        <>

                            <div className="flex gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-5 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={closeModal}
                            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors shadow-md ml-auto"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper component for info items
function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-start space-x-3 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors">
            <div className="mt-0.5 flex-shrink-0">{icon}</div>
            <div className="overflow-hidden">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium text-gray-800 break-words">{value}</p>
            </div>
        </div>
    );
}

// Helper component for document cards
function DocumentCard({ title, document, documentType = "unknown" }) {
    // If documentType wasn't explicitly passed, try to determine it
    const isPDF = documentType === "pdf" ||
        (documentType === "unknown" && document?.toLowerCase().endsWith('.pdf') ||
            document?.includes('application/pdf'));

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gray-50 py-3 px-4 border-b">
                <p className="font-medium text-gray-700 flex items-center gap-2">
                    <FileText size={16} className={isPDF ? "text-red-500" : "text-blue-500"} />
                    {title}
                </p>
            </div>

            {document ? (
                <div className="relative h-48 bg-gray-100">
                    {isPDF ? (
                        // PDF document preview
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-20 h-24 bg-red-50 flex flex-col items-center justify-center mb-2 rounded border border-red-100 shadow-sm">
                                <div className="text-red-500 font-bold text-lg mb-1">PDF</div>
                                <FileText size={24} className="text-red-500" />
                            </div>
                            <p className="text-sm text-gray-600">PDF Document</p>
                        </div>
                    ) : (
                        // Image display for non-PDF files
                        <img
                            src={document}
                            alt={title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                // If image fails to load, show a fallback
                                e.target.onerror = null;
                                e.target.parentNode.innerHTML = `
                                    <div class="flex flex-col items-center justify-center h-full">
                                        <div class="w-16 h-20 bg-gray-100 flex items-center justify-center mb-2 rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                <polyline points="10 9 9 9 8 9"></polyline>
                                            </svg>
                                        </div>
                                        <p class="text-sm text-gray-600">Document Preview Unavailable</p>
                                    </div>
                                `;
                            }}
                        />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                        <a
                            href={document}
                            download={title || "document"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-2 py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm font-medium ${isPDF
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-white text-blue-600 hover:bg-blue-50"
                                }`}
                        >
                            <Download size={16} />
                            {isPDF ? "Download PDF" : "View Document"}
                        </a>
                    </div>
                </div>
            ) : (
                <div className="h-48 bg-gray-50 flex flex-col items-center justify-center text-gray-400 p-4">
                    <FileText size={40} className="text-gray-300 mb-2" />
                    <p className="text-center text-gray-500">No document available</p>
                </div>
            )}
        </div>
    );
}