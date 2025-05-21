import React, { useState, useEffect } from "react";
import { X, Download, User, Calendar, Book, Briefcase, Heart, GraduationCap, FileText, Info, Map, Home } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../../api";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailMember({ }) {
    const navigator = useNavigate()
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState("info");
    const [showImage, setShowImage] = useState(false);
    const [detailMemberData, setDetailMemberData] = useState({});

    useEffect(() => {
        // Animation to reveal the modal content
        const fetchData = async () => {
            try {
                // Show loading state
                setDetailMemberData({ loading: true });

                const result = await api.get(`/admin/get-detail-member/${id}`);

                if (result.data.status) {
                    setDetailMemberData(result.data.getDetailMember);
                    // Set timeout for the image to appear after data is loaded
                    setTimeout(() => {
                        setShowImage(true);
                    }, 300);
                } else {
                    console.log(result.data.message);
                    toast.error("Failed to fetch member details");
                    setDetailMemberData({});
                }
            } catch (err) {
                console.log(err);
                toast.error("An error occurred while fetching member details");
                setDetailMemberData({});
            }
        }

        fetchData()

        return () => clearTimeout(2000);
    }, []);

    // Helper function to format date
    const formatModalDate = (dateString) => {
        if (!dateString) return "Not available";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    // Loading state
    if (detailMemberData.loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                    <div className="p-8 sm:p-16 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-600"></div>
                        <p className="mt-6 text-gray-600 font-medium">Loading member details...</p>
                    </div>
                </div>
            </div>
        );
    }

    const closeModal = () => {
        navigator('/admin-dashboard/family-members')
    }

    // Renders appropriate document based on status
    const renderDocuments = () => {
        const status = detailMemberData?.status?.toUpperCase();

        // Function to determine document type
        const getDocumentType = (url) => {
            if (!url) return "unknown";
            const lowercaseUrl = url.toLowerCase();
            if (lowercaseUrl.endsWith('.pdf') || lowercaseUrl.includes('application/pdf')) {
                return "pdf";
            } else if (
                lowercaseUrl.endsWith('.jpg') ||
                lowercaseUrl.endsWith('.jpeg') ||
                lowercaseUrl.endsWith('.png') ||
                lowercaseUrl.endsWith('.gif')
            ) {
                return "image";
            }
            return "unknown";
        };

        // Check document types
        const birthCertType = getDocumentType(detailMemberData?.birthCertificate);
        const deathCertType = getDocumentType(detailMemberData?.deathCertificate);

        if (status === "ACTIVE" || status === "MARRIED" || status === "LEFT-LOCALITY") {
            // Only show birth certificate for ACTIVE, MARRIED, LEFT-LOCALITY
            return (
                <div className="grid grid-cols-1 gap-6">
                    <DocumentCard
                        title="Birth Certificate"
                        document={`http://localhost:3032/uploads/members/${detailMemberData?.birthCertificate}`}
                        documentType={birthCertType}
                    />
                </div>
            );
        } else if (status === "DECEASED") {
            // Show both birth and death certificate for DECEASED
            return (
                <div className="grid grid-cols-1 gap-6">
                    <DocumentCard
                        title="Birth Certificate"
                        document={`http://localhost:3032/uploads/members/${detailMemberData?.birthCertificate}`}
                        documentType={birthCertType}
                    />
                    <DocumentCard
                        title="Death Certificate"
                        document={`http://localhost:3032/uploads/members/${detailMemberData?.deathCertificate}`}
                        documentType={deathCertType}
                    />
                </div>
            );
        } else {
            // Default view if status is not specified
            return (
                <div className="grid grid-cols-1 gap-6">
                    <DocumentCard
                        title="Birth Certificate"
                        document={detailMemberData?.birthCertificate}
                        documentType={birthCertType}
                    />
                    {deathCertType !== "unknown" && (
                        <DocumentCard
                            title="Death Certificate"
                            document={detailMemberData?.deathCertificate}
                            documentType={deathCertType}
                        />
                    )}
                </div>
            );
        }
    }

    // Render locality information
    const renderLocality = () => {
        return (
            <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-800 mb-3 flex items-center gap-2">
                        <Map className="text-blue-600" size={20} />
                        Locality Information
                    </h3>
                    <div className="grid grid-cols-1 gap-y-6">
                        <InfoItem
                            icon={<Home className="text-green-500" size={18} />}
                            label="Current Locality"
                            value={detailMemberData?.currentLocality || "Not available"}
                        />
                        <InfoItem
                            icon={<Calendar className="text-blue-500" size={18} />}
                            label="Date Left"
                            value={detailMemberData?.dateLeft ? formatModalDate(detailMemberData.dateLeft) : "Not available"}
                        />
                        <InfoItem
                            icon={<Info className="text-amber-500" size={18} />}
                            label="Reason for Leaving"
                            value={detailMemberData?.reasonForLeaving || "Not available"}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full sm:max-w-3xl transform transition-all duration-300 ease-in-out my-0 sm:my-8 max-h-full sm:max-h-[90vh] flex flex-col">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-4 sm:py-6 px-4 sm:px-6 relative flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Member Profile</h2>
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
                                {detailMemberData?.image ? (
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        <img
                                            src={`http://localhost:3032/uploads/members/${detailMemberData.image}`}
                                            alt={detailMemberData.fullName || "Member"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                                        <User size={40} className="text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Member name display - mobile friendly */}
                            <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                                    {detailMemberData?.fullName || "Unknown Member"}
                                </h3>
                                <p className="text-gray-500">
                                    {detailMemberData?.type || "Member"}
                                    {detailMemberData?.relationship ? ` • ${detailMemberData.relationship}` : ""}
                                </p>
                                <div className="mt-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${detailMemberData?.status?.toUpperCase() === "ACTIVE" ? "bg-green-100 text-green-800" :
                                        detailMemberData?.status?.toUpperCase() === "DECEASED" ? "bg-gray-100 text-gray-800" :
                                            detailMemberData?.status?.toUpperCase() === "MARRIED" ? "bg-pink-100 text-pink-800" :
                                                detailMemberData?.status?.toUpperCase() === "LEFT-LOCALITY" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-blue-100 text-blue-800"
                                        }`}>
                                        {detailMemberData?.status || "Unknown Status"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation tabs - scrollable on mobile */}
                        <div className="flex overflow-x-auto border-b mt-4 px-4 sm:px-6 no-scrollbar">
                            <button
                                onClick={() => setActiveTab("info")}
                                className={`px-4 sm:px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${activeTab === "info" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Personal Info
                                {activeTab === "info" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab("documents")}
                                className={`px-4 sm:px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${activeTab === "documents" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Documents
                                {activeTab === "documents" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                                )}
                            </button>

                            {(detailMemberData?.status?.toUpperCase() === "LEFT-LOCALITY") && (
                                <button
                                    onClick={() => setActiveTab("locality")}
                                    className={`px-4 sm:px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${activeTab === "locality" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Locality
                                    {activeTab === "locality" && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tab content */}
                    <div className="p-4 sm:p-6">
                        <div className="space-y-6">
                            {activeTab === "info" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                    <InfoItem
                                        icon={<Calendar className="text-blue-500" size={18} />}
                                        label="Birth Date"
                                        value={detailMemberData?.birthDate ? formatModalDate(detailMemberData.birthDate) : "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Heart className="text-pink-500" size={18} />}
                                        label="Relationship"
                                        value={detailMemberData?.relationship || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<GraduationCap className="text-green-500" size={18} />}
                                        label="Education"
                                        value={detailMemberData?.education || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Briefcase className="text-amber-500" size={18} />}
                                        label="Occupation"
                                        value={detailMemberData?.occupation || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Book className="text-purple-500" size={18} />}
                                        label="Type"
                                        value={detailMemberData?.type || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Info className="text-amber-500" size={18} />}
                                        label="Status"
                                        value={detailMemberData?.status || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Info className="text-amber-500" size={18} />}
                                        label="Member Type"
                                        value={detailMemberData?.memberType || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Info className="text-amber-500" size={18} />}
                                        label="Who is member"
                                        value={detailMemberData?.whoMember || "Not available"}
                                    />

                                    {detailMemberData?.status?.toUpperCase() === "DECEASED" && (
                                        <InfoItem
                                            icon={<Calendar className="text-gray-500" size={18} />}
                                            label="Date of Death"
                                            value={detailMemberData?.dateOfDeath ? formatModalDate(detailMemberData.dateOfDeath) : "Not available"}
                                        />
                                    )}
                                </div>
                            )}

                            {activeTab === "documents" && renderDocuments()}

                            {activeTab === "locality" && renderLocality()}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-gray-50 flex justify-end flex-shrink-0">
                    <button
                        onClick={closeModal}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors shadow-md"
                    >
                        Close
                    </button>
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