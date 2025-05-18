import React, { useState } from "react";
import {
    User,
    Calendar,
    Phone,
    MapPin,
    Briefcase,
    AlertCircle,
    FileText,
    Camera,
    CheckCircle,
    XCircle,
    Edit,
    Receipt,
    Upload,
    File
} from "lucide-react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import api from "../../../../api";

export default function IDRequest() {
    const { id } = useParams()

    const [formType, setFormType] = useState("New"); // Based on TypeRequest enum: "New", "updated", "Losed"
    const [activeStep, setActiveStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [isGotImageUploading, setIsGotImageUploading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        mothersName: "",
        age: "",
        gender: "MALE",
        occupation: "",
        phoneNumber: "",
        placeOFBirth: "",
        address: "",
        houseNumber: "",
        Nationality: "",
        emergencyContact: "",
        type: "New",
        status: "PENDING"
    });

    // For file upload
    const [imageFile, setImageFile] = useState(null);
    const [fileName, setFileName] = useState("");

    // For got image upload
    const [gotImageFile, setGotImageFile] = useState(null);
    const [gotImageFileName, setGotImageFileName] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        setIsUploading(true);

        setTimeout(() => {
            if (file) {
                setImageFile(file);
                setFileName(file.name);
            }
            setIsUploading(false);
        }, 800);
    };

    const handleGotImageChange = (e) => {
        const file = e.target.files[0];

        setIsGotImageUploading(true);

        setTimeout(() => {
            if (file) {
                setGotImageFile(file);
                setGotImageFileName(file.name);
            }
            setIsGotImageUploading(false);
        }, 800);
    };

    const handleSubmit = async () => {
        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value);
            });

            if (imageFile) {
                submitData.append("image", imageFile);
            }

            if (gotImageFile) {
                submitData.append("gotImage", gotImageFile);
            }

            const response = await api.post(`/user/request-id/${id}`, submitData);

            const { status, message, data } = response.data;

            // Handle different status responses
            if (status === "success") {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: message || "ID Request submitted successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });

                // Reset form fields
                setFormData({
                    fullName: "",
                    mothersName: "",
                    age: "",
                    gender: "MALE",
                    occupation: "",
                    phoneNumber: "",
                    placeOFBirth: "",
                    address: "",
                    houseNumber: "",
                    Nationality: "",
                    emergencyContact: "",
                    type: "New",
                    status: "PENDING"
                });
                setImageFile(null);
                setGotImageFile(null);
                setFileName("");
                setGotImageFileName("");
            } else if (status === "review") {
                Swal.fire({
                    position: "center",
                    icon: "info",
                    title: message || "The data is under review.",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else if (status === "approved") {
                Swal.fire({
                    position: "center",
                    icon: "info",
                    title: message || "The data is already approved.",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else if (status === "rejected") {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: message || "The data was rejected. Please try again.",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else if (status === "expired") {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: message || "The ID expired. Updating request...",
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



    // Determine the form title and color based on the form type
    const formTypeConfig = {
        New: {
            title: "New ID Request",
            color: "blue",
            icon: <FileText size={24} className="text-blue-200" />,
            stepLabel: "Request a new ID"
        },
        updated: {
            title: "Update ID Request",
            color: "green",
            icon: <Edit size={24} className="text-green-200" />,
            stepLabel: "Update existing ID"
        },
        Lose: {
            title: "Lose ID Request",
            color: "red",
            icon: <XCircle size={24} className="text-red-200" />,
            stepLabel: "Request ID Lose"
        }
    };

    const currentConfig = formTypeConfig[formType];

    return (
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {currentConfig.icon}
                    {currentConfig.title}
                </h2>
                <p className="text-blue-100 mt-1">{currentConfig.stepLabel}</p>
            </div>

            {/* Form Type Selection */}
            <div className="p-4 bg-white border-b">
                <div className="grid grid-cols-3 gap-3">
                    {Object.keys(formTypeConfig).map(type => (
                        <div
                            key={type}
                            onClick={() => setFormType(type)}
                            className={`cursor-pointer border rounded-lg px-4 py-3 flex items-center justify-center transition-all duration-200 ${formType === type
                                ? "bg-blue-50 border-blue-400 text-blue-700"
                                : "border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {type === "New" ? (
                                <><FileText size={18} className="mr-2" /> New</>
                            ) : type === "updated" ? (
                                <><Edit size={18} className="mr-2" /> Update</>
                            ) : (
                                <><XCircle size={18} className="mr-2" /> Lose</>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Steps */}
            <div className="flex justify-between px-6 py-3 bg-white border-b">
                {[1, 2, 3].map(step => (
                    <div
                        key={step}
                        onClick={() => setActiveStep(step)}
                        className={`flex items-center cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${activeStep === step ? "bg-blue-100 text-blue-800" : "text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${activeStep === step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                            }`}>
                            {step}
                        </div>
                        <span className="font-medium">
                            {step === 1 ? "Personal Info" : step === 2 ? "Contact Details" : "Photos & Submit"}
                        </span>
                    </div>
                ))}
            </div>

            <div className="p-6 space-y-8">
                {/* Step 1: Personal Information */}
                {activeStep === 1 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <User size={16} className="mr-1 text-blue-500" />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <User size={16} className="mr-1 text-blue-500" />
                                    Mother's Name *
                                </label>
                                <input
                                    type="text"
                                    name="mothersName"
                                    value={formData.mothersName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter mother's name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Calendar size={16} className="mr-1 text-blue-500" />
                                    Age *
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter age"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <User size={16} className="mr-1 text-blue-500" />
                                    Gender *
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin size={16} className="mr-1 text-blue-500" />
                                    Place of Birth *
                                </label>
                                <input
                                    type="text"
                                    name="placeOFBirth"
                                    value={formData.placeOFBirth}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter place of birth"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Briefcase size={16} className="mr-1 text-blue-500" />
                                    Occupation *
                                </label>
                                <input
                                    type="text"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter occupation"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Contact Details */}
                {activeStep === 2 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Phone size={16} className="mr-1 text-blue-500" />
                                    Phone Number *
                                </label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Phone size={16} className="mr-1 text-blue-500" />
                                    Emergency Contact *
                                </label>
                                <input
                                    type="text"
                                    name="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter emergency contact"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <MapPin size={16} className="mr-1 text-blue-500" />
                                Address *
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter full address"
                                rows={3}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin size={16} className="mr-1 text-blue-500" />
                                    House Number *
                                </label>
                                <input
                                    type="text"
                                    name="houseNumber"
                                    value={formData.houseNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter house number"
                                />
                            </div>

                            <div className="relative">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin size={16} className="mr-1 text-blue-500" />
                                    Nationality *
                                </label>
                                <input
                                    type="text"
                                    name="Nationality"
                                    value={formData.Nationality}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter nationality"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Photos and Submit */}
                {activeStep === 3 && (
                    <div className="space-y-6">
                        {/* Photos Upload Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Upload Required Files</h3>

                            {/* Profile Picture */}
                            <div className="mb-6">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <Camera size={16} className="mr-1 text-blue-500" />
                                    Profile Picture *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200">
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="profile-image"
                                        accept="image/*"
                                    />
                                    <label htmlFor="profile-image" className="cursor-pointer">
                                        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                            <Camera size={24} className="text-blue-600" />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {fileName ?
                                                `Selected: ${fileName}` :
                                                'Click to upload profile picture'
                                            }
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Upload a clear face photo for your ID card
                                        </p>
                                    </label>
                                </div>
                            </div>

                            {/* Got Image Upload - Enhanced to accept both image and file types */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <Upload size={16} className="mr-1 text-blue-500" />
                                    Got Image / Document *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200">
                                    <input
                                        type="file"
                                        name="gotImage"
                                        onChange={handleGotImageChange}
                                        className="hidden"
                                        id="got-image"
                                        accept="image/*,.pdf,.doc,.docx,.txt"
                                    />
                                    <label htmlFor="got-image" className="cursor-pointer">
                                        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                                            {isGotImageUploading ? (
                                                <div className="animate-pulse">Uploading...</div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <Upload size={20} className="text-blue-600 mb-1" />
                                                    <div className="flex space-x-2">
                                                        <Camera size={16} className="text-blue-600" />
                                                        <File size={16} className="text-blue-600" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {gotImageFileName ?
                                                `Selected: ${gotImageFileName}` :
                                                'Click to upload proof image or document'
                                            }
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Accepts images, PDF, DOC, or text files
                                        </p>
                                    </label>
                                </div>

                                {/* File Type Info */}
                                <div className="mt-3 flex justify-center">
                                    <div className="flex space-x-4 text-xs text-gray-500">
                                        <span className="flex items-center">
                                            <Camera size={14} className="mr-1 text-blue-500" />
                                            Images
                                        </span>
                                        <span className="flex items-center">
                                            <File size={14} className="mr-1 text-red-500" />
                                            PDF
                                        </span>
                                        <span className="flex items-center">
                                            <File size={14} className="mr-1 text-blue-500" />
                                            DOC
                                        </span>
                                        <span className="flex items-center">
                                            <File size={14} className="mr-1 text-gray-500" />
                                            TXT
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Type Specific Fields */}
                        {formType === "Lose" && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start">
                                    <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-red-800">ID Lose Request</h4>
                                        <p className="text-sm text-red-600 mt-1">
                                            By submitting this form, you are requesting to replace a lost ID associated with this member.
                                            Please upload any required documentation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {formType === "updated" && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start">
                                    <CheckCircle size={20} className="text-green-500 mr-2 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-green-800">ID Update Request</h4>
                                        <p className="text-sm text-green-600 mt-1">
                                            Your request to update the existing ID will be processed. Once approved, a new
                                            ID will be issued with the updated information.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Status Badge for New ID request */}
                        {formType === "New" && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                                <AlertCircle size={16} className="mr-1 text-yellow-600" />
                                <span>PENDING</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation and Submit */}
                <div className="pt-6 flex justify-between items-center border-t border-gray-200">
                    {activeStep > 1 ? (
                        <button
                            onClick={() => setActiveStep(prev => prev - 1)}
                            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
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
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Next
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {formType === "New" ? "Submit Request" : formType === "updated" ? "Update ID" : "Replace Lost ID"}
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