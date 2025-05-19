import React, { useState } from "react";
import {
    User,
    Calendar,
    MapPin,
    AlertCircle,
    FileText,
    Upload,
    File,
    Heart,
    Users,
    Flag,
    Home,
    BookOpen,
    Clock
} from "lucide-react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import api from "../../../../api";

export default function Marriage() {
    const { id } = useParams();
    const [activeStep, setActiveStep] = useState(1);
    const [isDocUploading, setIsDocUploading] = useState(false);

    // Form data structure for marriage certificate
    const [formData, setFormData] = useState({
        // Wife information
        wifeFullName: "",
        wifeId: "",

        // Husband information
        husbandFullName: "",
        husbandId: "",

        // Marriage details
        dateOfMarriage: "",

        // Location details
        placeOfMarriage: "",
        country: "",
        region: "",
        cityAdministration: "",
        zone: "",
        city: "",
        subCity: "",
        woreda: "",

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

            const response = await api.post(`/user/request-marriage-certificate/${id}`, submitData);

            const { status, message, data } = response.data;

            // Handle different status responses
            if (status === "success") {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: message || "Marriage Certificate Request submitted successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });

                // Reset form fields
                setFormData({
                    wifeFullName: "",
                    wifeId: "",
                    husbandFullName: "",
                    husbandId: "",
                    dateOfMarriage: "",
                    placeOfMarriage: "",
                    country: "",
                    region: "",
                    cityAdministration: "",
                    zone: "",
                    city: "",
                    subCity: "",
                    woreda: "",
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
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Heart size={24} className="text-pink-200" />
                    Marriage Certificate Request
                </h2>
                <p className="text-purple-100 mt-1">Request an official marriage certificate</p>
            </div>

            {/* Steps */}
            <div className="flex justify-between px-6 py-3 bg-white border-b">
                {[1, 2, 3].map(step => (
                    <div
                        key={step}
                        onClick={() => setActiveStep(step)}
                        className={`flex items-center cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${activeStep === step ? "bg-pink-100 text-pink-800" : "text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${activeStep === step ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-600"
                            }`}>
                            {step}
                        </div>
                        <span className="font-medium">
                            {step === 1 ? "Spouse Info" : step === 2 ? "Marriage Details" : "Document & Submit"}
                        </span>
                    </div>
                ))}
            </div>

            <div className="p-6 space-y-8">
                {/* Step 1: Spouse Information */}
                {activeStep === 1 && (
                    <div className="space-y-6">
                        <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg mb-6">
                            <div className="flex items-start">
                                <AlertCircle size={20} className="text-pink-500 mr-2 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-pink-800">Wife's Information</h4>
                                    <p className="text-sm text-pink-600 mt-1">
                                        Please provide accurate details about the wife.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <User size={16} className="mr-1 text-pink-500" />
                                    Wife's Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="wifeFullName"
                                    value={formData.wifeFullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter wife's full name"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <BookOpen size={16} className="mr-1 text-pink-500" />
                                    Wife's ID Number *
                                </label>
                                <input
                                    type="text"
                                    name="wifeId"
                                    value={formData.wifeId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter wife's ID number"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg my-6">
                            <div className="flex items-start">
                                <AlertCircle size={20} className="text-blue-500 mr-2 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-blue-800">Husband's Information</h4>
                                    <p className="text-sm text-blue-600 mt-1">
                                        Please provide accurate details about the husband.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <User size={16} className="mr-1 text-blue-500" />
                                    Husband's Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="husbandFullName"
                                    value={formData.husbandFullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter husband's full name"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <BookOpen size={16} className="mr-1 text-blue-500" />
                                    Husband's ID Number *
                                </label>
                                <input
                                    type="text"
                                    name="husbandId"
                                    value={formData.husbandId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter husband's ID number"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Marriage Details */}
                {activeStep === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center mb-4">
                            <Heart size={20} className="mr-2 text-pink-600" />
                            Marriage Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Calendar size={16} className="mr-1 text-pink-500" />
                                    Date of Marriage *
                                </label>
                                <input
                                    type="date"
                                    name="dateOfMarriage"
                                    value={formData.dateOfMarriage}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin size={16} className="mr-1 text-pink-500" />
                                    Place of Marriage *
                                </label>
                                <input
                                    type="text"
                                    name="placeOfMarriage"
                                    value={formData.placeOfMarriage}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter place of marriage"
                                />
                            </div>
                        </div>

                        <h3 className="text-lg font-medium text-gray-800 flex items-center mt-8 mb-4">
                            <Home size={20} className="mr-2 text-pink-600" />
                            Marriage Location Details
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin size={16} className="mr-1 text-pink-500" />
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter country"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin size={16} className="mr-1 text-pink-500" />
                                    Region *
                                </label>
                                <input
                                    type="text"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter region"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin size={16} className="mr-1 text-pink-500" />
                                    City Administration
                                </label>
                                <input
                                    type="text"
                                    name="cityAdministration"
                                    value={formData.cityAdministration}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter city administration"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin size={16} className="mr-1 text-pink-500" />
                                    Zone *
                                </label>
                                <input
                                    type="text"
                                    name="zone"
                                    value={formData.zone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter zone"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin size={16} className="mr-1 text-pink-500" />
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter city"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin size={16} className="mr-1 text-pink-500" />
                                    Sub City
                                </label>
                                <input
                                    type="text"
                                    name="subCity"
                                    value={formData.subCity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter sub city"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin size={16} className="mr-1 text-pink-500" />
                                    Woreda *
                                </label>
                                <input
                                    type="text"
                                    name="woreda"
                                    value={formData.woreda}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter woreda"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Document Upload and Submit */}
                {activeStep === 3 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center mb-4">
                            <File size={20} className="mr-2 text-pink-600" />
                            Supporting Document
                        </h3>

                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                            <div className="flex items-start">
                                <AlertCircle size={20} className="text-yellow-600 mr-2 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-yellow-800">Required Documentation</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Please upload any supporting documents such as marriage contract,
                                        religious marriage certificate, or other proof of marriage.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Document Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-500 transition-colors duration-200">
                            <input
                                type="file"
                                name="document"
                                onChange={handleDocumentChange}
                                className="hidden"
                                id="marriage-document"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <label htmlFor="marriage-document" className="cursor-pointer">
                                <div className="mx-auto w-20 h-20 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                                    {isDocUploading ? (
                                        <div className="animate-pulse">Uploading...</div>
                                    ) : (
                                        <Upload size={28} className="text-pink-600" />
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
                            className="px-4 py-2 text-pink-600 hover:text-pink-800 font-medium flex items-center transition-colors"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {activeStep < 3 ? (
                        <button
                            onClick={() => setActiveStep(prev => prev + 1)}
                            className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Next
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200"
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