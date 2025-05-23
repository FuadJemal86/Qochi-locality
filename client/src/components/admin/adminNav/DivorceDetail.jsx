import React, { useState, useEffect } from "react";
import { X, Download, User, Calendar, Book, Briefcase, Heart, GraduationCap, FileText, Info, Map, Home, Upload, Check, AlertCircle, Scale } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../../api";
import { useNavigate, useParams } from "react-router-dom";

export default function DivorceDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("info");
    const [showImage, setShowImage] = useState(false);
    const [detailDivorceData, setDetailDivorceData] = useState({});
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await api.get(`/admin/get-divorce-detail/${id}`);

                if (result.data.status) {
                    setDetailDivorceData(result.data.getDetailDivorce);
                    setTimeout(() => {
                        setShowImage(true);
                    }, 300);
                } else {
                    console.log(result.data.message);
                    toast.error("Failed to fetch divorce certificate details");
                }
            } catch (err) {
                console.log(err);
                toast.error("An error occurred while fetching divorce certificate details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => clearTimeout(2000);
    }, [id]);

    // Handle file change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            // Create preview for image files
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFilePreview(e.target.result);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setFilePreview(null);
            }
        }
    };

    // Handle file submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error("Please select a file to upload");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("document", file);
            formData.append("id", id);

            const result = await api.post('/admin/update-divorce-document', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (result.data.status) {
                toast.success("Document uploaded successfully");

                const updatedData = await api.get(`/admin/get-divorce-detail/${id}`);
                if (updatedData.data.status) {
                    setDetailDivorceData(updatedData.data.getDetailDivorce);
                }
                setFile(null);
                setFilePreview(null);
            } else {
                toast.error(result.data.message || "Failed to upload document");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while uploading the document");
        } finally {
            setUploading(false);
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

    // Loading state
    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                    <div className="p-8 sm:p-16 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-orange-600"></div>
                        <p className="mt-6 text-gray-600 font-medium">Loading divorce certificate details...</p>
                    </div>
                </div>
            </div>
        );
    }

    const closeModal = () => {
        navigate('/admin-dashboard/vital-event');
    };

    // Display document if available
    const renderDocument = () => {
        const documentUrl = detailDivorceData?.documentFile ?
            `http://localhost:3032/uploads/members/${detailDivorceData.documentFile}` : null;

        const isPDF = documentUrl && documentUrl.toLowerCase().endsWith('.pdf');

        return (
            <div className="grid grid-cols-1 gap-6">
                <DocumentCard
                    title="Divorce Certificate Document"
                    document={documentUrl}
                    documentType={isPDF ? "pdf" : "image"}
                />
            </div>
        );
    };

    // Render status badge
    const getStatusBadge = (status) => {
        if (!status) return null;

        const statusUpperCase = status.toUpperCase();
        let badgeClass = "";

        switch (statusUpperCase) {
            case "APPROVED":
                badgeClass = "bg-green-100 text-green-800";
                break;
            case "REJECTED":
                badgeClass = "bg-red-100 text-red-800";
                break;
            case "PENDING":
                badgeClass = "bg-yellow-100 text-yellow-800";
                break;
            default:
                badgeClass = "bg-blue-100 text-blue-800";
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm overflow-y-auto">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="bg-white rounded-xl shadow-2xl w-full sm:max-w-3xl transform transition-all duration-300 ease-in-out my-0 sm:my-8 max-h-full sm:max-h-[90vh] flex flex-col">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-4 sm:py-6 px-4 sm:px-6 relative flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Divorce Certificate Details</h2>
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
                    {/* Header section with status */}
                    <div className="relative">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start px-4 sm:px-6 pt-6 pb-2">
                            <div className={`transition-all duration-500 ease-in-out ${showImage ? "opacity-100" : "opacity-0"}`}>
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-lg">
                                    <Scale size={40} className="text-orange-600" />
                                </div>
                            </div>

                            <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                                    {detailDivorceData?.firstSpouseFullName && detailDivorceData?.secondSpouseFullName
                                        ? `${detailDivorceData.firstSpouseFullName} & ${detailDivorceData.secondSpouseFullName}`
                                        : "Divorce Certificate"}
                                </h3>
                                <p className="text-gray-500">
                                    Divorce Certificate
                                </p>
                                <div className="mt-1">
                                    {getStatusBadge(detailDivorceData?.status)}
                                </div>
                            </div>
                        </div>

                        {/* Navigation tabs */}
                        <div className="flex overflow-x-auto border-b mt-4 px-4 sm:px-6 no-scrollbar">
                            <button
                                onClick={() => setActiveTab("info")}
                                className={`px-4 sm:px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${activeTab === "info" ? "text-orange-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Divorce Info
                                {activeTab === "info" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600"></span>
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab("documents")}
                                className={`px-4 sm:px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${activeTab === "documents" ? "text-orange-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Documents
                                {activeTab === "documents" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600"></span>
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab("upload")}
                                className={`px-4 sm:px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${activeTab === "upload" ? "text-orange-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Upload Document
                                {activeTab === "upload" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600"></span>
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
                                        icon={<User className="text-blue-500" size={18} />}
                                        label="First Spouse Full Name"
                                        value={detailDivorceData?.firstSpouseFullName || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Calendar className="text-blue-400" size={18} />}
                                        label="First Spouse Birth Date"
                                        value={detailDivorceData?.firstSpouseBirthDate ? formatDate(detailDivorceData.firstSpouseBirthDate) : "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Map className="text-blue-300" size={18} />}
                                        label="First Spouse Nationality"
                                        value={detailDivorceData?.firstSpouseNationality || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Map className="text-blue-600" size={18} />}
                                        label="First Spouse Place of Birth"
                                        value={detailDivorceData?.firstSpousePlaceOfBirth || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<User className="text-pink-500" size={18} />}
                                        label="Second Spouse Full Name"
                                        value={detailDivorceData?.secondSpouseFullName || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Calendar className="text-pink-400" size={18} />}
                                        label="Second Spouse Birth Date"
                                        value={detailDivorceData?.secondSpouseBirthDate ? formatDate(detailDivorceData.secondSpouseBirthDate) : "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Map className="text-pink-300" size={18} />}
                                        label="Second Spouse Nationality"
                                        value={detailDivorceData?.secondSpouseNationality || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Map className="text-pink-600" size={18} />}
                                        label="Second Spouse Place of Birth"
                                        value={detailDivorceData?.secondSpousePlaceOfBirth || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Calendar className="text-orange-500" size={18} />}
                                        label="Date of Divorce"
                                        value={detailDivorceData?.dateOfDivorce ? formatDate(detailDivorceData.dateOfDivorce) : "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Map className="text-orange-400" size={18} />}
                                        label="Place of Divorce"
                                        value={detailDivorceData?.placeOfDivorce || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Map className="text-green-500" size={18} />}
                                        label="Country Authority"
                                        value={detailDivorceData?.countryAuthority || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<FileText className="text-purple-500" size={18} />}
                                        label="Case Number"
                                        value={detailDivorceData?.caseNumber || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<User className="text-green-500" size={18} />}
                                        label="Family Head"
                                        value={detailDivorceData?.familyHead?.fullName || "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Calendar className="text-gray-500" size={18} />}
                                        label="Submission Date"
                                        value={detailDivorceData?.createdAt ? formatDate(detailDivorceData.createdAt) : "Not available"}
                                    />
                                    <InfoItem
                                        icon={<Calendar className="text-gray-400" size={18} />}
                                        label="Last Updated"
                                        value={detailDivorceData?.updatedAt ? formatDate(detailDivorceData.updatedAt) : "Not available"}
                                    />
                                    <InfoItem
                                        icon={<AlertCircle className="text-amber-500" size={18} />}
                                        label="Status"
                                        value={detailDivorceData?.status || "Not available"}
                                    />
                                </div>
                            )}

                            {activeTab === "documents" && renderDocument()}

                            {activeTab === "upload" && (
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Divorce Certificate Document</h3>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Document File (PDF or Image)
                                            </label>

                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-center">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="document-upload"
                                                    disabled={uploading}
                                                />

                                                <label htmlFor="document-upload" className="cursor-pointer">
                                                    {!file ? (
                                                        <div className="space-y-2">
                                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                            <p className="text-gray-600">Click to upload or drag and drop</p>
                                                            <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 10MB)</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {filePreview ? (
                                                                <img src={filePreview} alt="Preview" className="mx-auto h-32 object-contain" />
                                                            ) : (
                                                                <div className="mx-auto h-16 w-16 bg-orange-50 rounded-lg flex items-center justify-center">
                                                                    <FileText className="h-8 w-8 text-orange-500" />
                                                                </div>
                                                            )}
                                                            <p className="text-sm text-gray-600 font-medium">{file.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                                                            </p>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={!file || uploading}
                                                className={`px-4 py-2 rounded-md flex items-center gap-2 ${!file || uploading
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "bg-orange-600 text-white hover:bg-orange-700"
                                                    }`}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                                        <span>Uploading...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={18} />
                                                        <span>Upload Document</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-gray-50 flex justify-end flex-shrink-0">
                    <button
                        onClick={closeModal}
                        className="px-5 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg transition-colors shadow-md"
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
        <div className="flex items-start space-x-3 py-2 px-3 rounded-lg hover:bg-orange-50 transition-colors">
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
    const isPDF = documentType === "pdf" ||
        (documentType === "unknown" && document?.toLowerCase().endsWith('.pdf'));

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gray-50 py-3 px-4 border-b">
                <p className="font-medium text-gray-700 flex items-center gap-2">
                    <FileText size={16} className={isPDF ? "text-orange-600" : "text-orange-600"} />
                    {title}
                </p>
            </div>

            {document ? (
                <div className="relative h-48 bg-gray-100">
                    {isPDF ? (
                        // PDF document preview
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-20 h-24 bg-orange-50 flex flex-col items-center justify-center mb-2 rounded border border-orange-200 shadow-sm">
                                <div className="text-orange-600 font-bold text-lg mb-1">PDF</div>
                                <FileText size={24} className="text-orange-600" />
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
                                ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                                : "bg-white text-orange-700 hover:bg-orange-50"
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