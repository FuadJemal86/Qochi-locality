import React, { useState } from "react";
import {
    User,
    Calendar,
    MapPin,
    AlertCircle,
    FileText,
    Upload,
    File,
    Skull,
    Users,
    Flag,
    Home,
    BookOpen,
    Clock
} from "lucide-react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import api from "../../../../api";

export default function Death() {
    const { id } = useParams();
    const [activeStep, setActiveStep] = useState(1);
    const [isDocUploading, setIsDocUploading] = useState(false);

    // Form data structure for death certificate
    const [formData, setFormData] = useState({
        // Deceased information
        fullName: "",
        dateOfBirth: "",
        nationality: "",

        // Death details
        placeOfDeath: "",
        dateOfDeath: "",

        status: "PENDING"
    });

    // For document upload
    const [documentFile, setDocumentFile] = useState(null);
    const [documentFileName, setDocumentFileName] = useState("");

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle document file upload
    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        setIsDocUploading(true);

        setTimeout(() => {
            if (file) {
                setDocumentFile(file);
                setDocumentFileName(file.name);
            }
            setIsDocUploading(false);
        }, 800);
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value);
            });

            if (documentFile) {
                submitData.append("document", documentFile);
            }

            const response = await api.post(`/user/request-death-certificate/${id}`, submitData);

            const { status, message, data } = response.data;

            // Handle different status responses
            if (status === "success") {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: message || "Death Certificate Request submitted successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });

                // Reset form fields
                setFormData({
                    fullName: "",
                    dateOfBirth: "",
                    nationality: "",
                    placeOfDeath: "",
                    dateOfDeath: "",
                    status: "PENDING"
                });
                setDocumentFile(null);
                setDocumentFileName("");
            } else if (status === "review") {
                Swal.fire({
                    position: "center",
                    icon: "info",
                    title: message || "The request is under review.",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else if (status === "approved") {
                Swal.fire({
                    position: "center",
                    icon: "info",
                    title: message || "The request is already approved.",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else if (status === "rejected") {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: message || "The request was rejected. Please try again.",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: message || "Something went wrong!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || "Something went wrong!",
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Skull size={24} className="text-gray-300" />
                    Death Certificate Request
                </h2>
                <p className="text-gray-300 mt-1">Request an official death certificate</p>
            </div>

            {/* Steps */}
            <div className="flex justify-between px-6 py-3 bg-white border-b">
                {[1, 2].map(step => (
                    <div
                        key={step}
                        onClick={() => setActiveStep(step)}
                        className={`flex items-center cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${activeStep === step ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${activeStep === step ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-600"
                            }`}>
                            {step}
                        </div>
                        <span className="font-medium">
                            {step === 1 ? "Deceased Info" : "Document & Submit"}
                        </span>
                    </div>
                ))}
            </div>

            <div className="p-6 space-y-8">
                {/* Step 1: Deceased Information */}
                {activeStep === 1 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center mb-4">
                            <User size={20} className="mr-2 text-gray-600" />
                            Deceased Person Information
                        </h3>

                        <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg mb-6">
                            <div className="flex items-start">
                                <AlertCircle size={20} className="text-gray-600 mr-2 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-gray-800">Personal Information</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Please provide accurate details about the deceased person.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <User size={16} className="mr-1 text-gray-500" />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter full name of deceased"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Calendar size={16} className="mr-1 text-gray-500" />
                                    Date of Birth *
                                </label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <Flag size={16} className="mr-1 text-gray-500" />
                                Nationality *
                            </label>
                            <input
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter nationality"
                            />
                        </div>

                        <h3 className="text-lg font-medium text-gray-800 flex items-center mt-8 mb-4">
                            <Skull size={20} className="mr-2 text-gray-600" />
                            Death Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin size={16} className="mr-1 text-gray-500" />
                                    Place of Death *
                                </label>
                                <input
                                    type="text"
                                    name="placeOfDeath"
                                    value={formData.placeOfDeath}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter place of death"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Calendar size={16} className="mr-1 text-gray-500" />
                                    Date of Death *
                                </label>
                                <input
                                    type="date"
                                    name="dateOfDeath"
                                    value={formData.dateOfDeath}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Document Upload and Submit */}
                {activeStep === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center mb-4">
                            <File size={20} className="mr-2 text-gray-600" />
                            Supporting Document
                        </h3>

                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                            <div className="flex items-start">
                                <AlertCircle size={20} className="text-yellow-600 mr-2 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-yellow-800">Required Documentation</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Please upload any supporting documents such as medical death certificate,
                                        hospital records, or other proof of death.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Document Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-500 transition-colors duration-200">
                            <input
                                type="file"
                                name="document"
                                onChange={handleDocumentChange}
                                className="hidden"
                                id="death-document"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <label htmlFor="death-document" className="cursor-pointer">
                                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                                    {isDocUploading ? (
                                        <div className="animate-pulse">Uploading...</div>
                                    ) : (
                                        <Upload size={28} className="text-gray-600" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">
                                    {documentFileName ?
                                        `Selected: ${documentFileName}` :
                                        'Click to upload supporting document'
                                    }
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Accepts PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 5MB)
                                </p>
                            </label>
                        </div>

                        {/* File Type Info */}
                        <div className="mt-3 flex justify-center">
                            <div className="flex space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                    <File size={14} className="mr-1 text-red-500" />
                                    PDF
                                </span>
                                <span className="flex items-center">
                                    <File size={14} className="mr-1 text-blue-500" />
                                    DOC
                                </span>
                                <span className="flex items-center">
                                    <File size={14} className="mr-1 text-green-500" />
                                    Images
                                </span>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-6">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                                <Clock size={16} className="mr-1 text-yellow-600" />
                                <span>PENDING</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation and Submit */}
                <div className="pt-6 flex justify-between items-center border-t border-gray-200">
                    {activeStep > 1 ? (
                        <button
                            onClick={() => setActiveStep(prev => prev - 1)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium flex items-center transition-colors"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {activeStep < 2 ? (
                        <button
                            onClick={() => setActiveStep(prev => prev + 1)}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Next
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Submit Request
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}