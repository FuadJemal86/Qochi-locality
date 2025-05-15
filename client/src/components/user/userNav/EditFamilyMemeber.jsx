import React, { useState, useEffect } from "react";
import { User, Calendar, Baby, FileCheck, Briefcase, GraduationCap, Heart, Frown, MapPin, Camera, AlertCircle } from "lucide-react";

export default function EditFamilyMemeber() {
    // Simulate fetching existing member data
    const [member, setMember] = useState({
        id: 1,
        fullName: "John Smith",
        birthDate: "1990-06-15",
        type: "PERMANENT",
        relationship: "Son",
        education: "Bachelor's Degree",
        occupation: "Software Engineer",
        status: "ACTIVE",
        birthCertificate: "birth-cert.pdf",
        image: "profile.jpg",
        deathCertificate: "",
        marriageCertificate: "",
        familyId: 1,
        createdAt: "2023-05-10T09:30:00.000Z"
    });

    const [formData, setFormData] = useState({ ...member });
    const [activeStep, setActiveStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [statusChanged, setStatusChanged] = useState(false);
    const [saving, setSaving] = useState(false);

    // Show/hide logic based on member type and status
    const isNewborn = formData.type === "NEWBORN";
    const isDeceased = formData.status === "DECEASED";
    const isMarried = formData.status === "MARRIED";
    const hasLeftLocality = formData.status === "LEFT_LOCALITY";

    // Check if status has changed
    useEffect(() => {
        if (member.status !== formData.status) {
            setStatusChanged(true);
        } else {
            setStatusChanged(false);
        }
    }, [formData.status, member.status]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        setIsUploading(true);

        // Simulate upload delay
        setTimeout(() => {
            setFormData((prev) => ({
                ...prev,
                [name]: e.target.files[0] ? e.target.files[0].name : prev[name]
            }));
            setIsUploading(false);
        }, 800);
    };

    const handleSubmit = () => {
        setSaving(true);

        // Simulate API call
        setTimeout(() => {
            console.log("Member updated:", formData);
            setMember({ ...formData });
            setSaving(false);
            alert("Member updated successfully!");
            setStatusChanged(false);
        }, 1000);
    };

    const statusColors = {
        ACTIVE: { bg: "bg-emerald-100", text: "text-emerald-700", icon: <MapPin size={18} className="text-emerald-600" /> },
        MARRIED: { bg: "bg-rose-100", text: "text-rose-700", icon: <Heart size={18} className="text-rose-600" /> },
        DECEASED: { bg: "bg-gray-100", text: "text-gray-700", icon: <Frown size={18} className="text-gray-600" /> },
        LEFT_LOCALITY: { bg: "bg-amber-100", text: "text-amber-700", icon: <MapPin size={18} className="text-amber-600" /> }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    return (
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <User size={24} className="text-indigo-200" />
                            Edit Member
                        </h2>
                        <p className="text-indigo-100 mt-1">ID: {formData.id}</p>
                    </div>
                    <div className={`${statusColors[formData.status].bg} px-4 py-2 rounded-lg flex items-center`}>
                        {statusColors[formData.status].icon}
                        <span className={`ml-1 font-medium ${statusColors[formData.status].text}`}>
                            {formData.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Member Info Summary */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                        {formData.image ? (
                            <img src="/api/placeholder/48/48" alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                            <User size={24} className="text-indigo-600" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 text-lg">{formData.fullName}</h3>
                        <p className="text-gray-500 text-sm">Member since {formatDate(formData.createdAt)}</p>
                    </div>
                </div>
            </div>

            {/* Steps */}
            <div className="flex justify-between px-6 py-3 bg-white border-b">
                {[1, 2, 3].map(step => (
                    <div
                        key={step}
                        onClick={() => setActiveStep(step)}
                        className={`flex items-center cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${activeStep === step ? "bg-indigo-100 text-indigo-800" : "text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${activeStep === step ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                            }`}>
                            {step}
                        </div>
                        <span className="font-medium">
                            {step === 1 ? "Basic Info" : step === 2 ? "Details" : "Documents"}
                        </span>
                    </div>
                ))}
            </div>

            <div className="p-6 space-y-8">
                {/* Status change alert */}
                {statusChanged && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md flex items-start">
                        <AlertCircle size={20} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-amber-800 font-medium">Status Change Detected</p>
                            <p className="text-amber-700 text-sm mt-1">
                                You're changing this member's status from <span className="font-medium">{member.status.replace('_', ' ')}</span> to <span className="font-medium">{formData.status.replace('_', ' ')}</span>.
                                {isDeceased && " Please provide a death certificate."}
                                {isMarried && " Please provide a marriage certificate."}
                                {hasLeftLocality && " Please provide a reason for leaving."}
                            </p>
                        </div>
                    </div>
                )}

                {activeStep === 1 && (
                    <>
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <User size={16} className="mr-1 text-indigo-500" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Calendar size={16} className="mr-1 text-indigo-500" />
                                        Birth Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <FileCheck size={16} className="mr-1 text-indigo-500" />
                                    Status *
                                </label>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {Object.keys(statusColors).map(status => (
                                        <div
                                            key={status}
                                            onClick={() => setFormData(prev => ({ ...prev, status }))}
                                            className={`cursor-pointer border rounded-lg px-3 py-3 flex flex-col items-center justify-center transition-all duration-200 ${formData.status === status
                                                ? `${statusColors[status].bg} border-${status === 'DECEASED' ? 'gray' : status === 'MARRIED' ? 'rose' : status === 'LEFT_LOCALITY' ? 'amber' : 'emerald'}-400 ${statusColors[status].text}`
                                                : "border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            {status === "ACTIVE" && <MapPin size={20} className={formData.status === status ? "text-emerald-600" : "text-gray-500"} />}
                                            {status === "MARRIED" && <Heart size={20} className={formData.status === status ? "text-rose-600" : "text-gray-500"} />}
                                            {status === "DECEASED" && <Frown size={20} className={formData.status === status ? "text-gray-600" : "text-gray-500"} />}
                                            {status === "LEFT_LOCALITY" && <MapPin size={20} className={formData.status === status ? "text-amber-600" : "text-gray-500"} />}
                                            <span className="text-sm mt-1">{status.replace('_', ' ')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Heart size={16} className="mr-1 text-indigo-500" />
                                    Relationship
                                </label>
                                <input
                                    type="text"
                                    name="relationship"
                                    value={formData.relationship}
                                    onChange={handleChange}
                                    placeholder="e.g., Son, Daughter, Spouse"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>
                    </>
                )}

                {activeStep === 2 && (
                    <>
                        {isDeceased && (
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                        <Frown size={20} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Deceased</h3>
                                        <p className="text-gray-500 text-sm">This member is marked as deceased</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isMarried && (
                            <div className="bg-rose-50 p-5 rounded-xl border border-rose-200 mb-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center mr-3">
                                        <Heart size={20} className="text-rose-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-rose-900">Married</h3>
                                        <p className="text-rose-700 text-sm">This member is marked as married</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {hasLeftLocality && (
                            <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 mb-6">
                                <div className="flex items-center mb-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center mr-3">
                                        <MapPin size={20} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-amber-900">Left Locality</h3>
                                        <p className="text-amber-700 text-sm">This member has left the locality</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-amber-700 mb-1">
                                        Reason for Leaving
                                    </label>
                                    <textarea
                                        name="reasonForLeaving"
                                        rows="3"
                                        className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50"
                                        placeholder="Enter reason for leaving locality"
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <GraduationCap size={16} className="mr-1 text-indigo-500" />
                                        Education
                                    </label>
                                    <input
                                        type="text"
                                        name="education"
                                        value={formData.education}
                                        onChange={handleChange}
                                        disabled={isNewborn}
                                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${isNewborn ? 'bg-gray-100' : ''}`}
                                    />
                                    {isNewborn && (
                                        <p className="text-xs text-gray-500 mt-1">Not applicable for newborns</p>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Briefcase size={16} className="mr-1 text-indigo-500" />
                                        Occupation
                                    </label>
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        disabled={isNewborn}
                                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${isNewborn ? 'bg-gray-100' : ''}`}
                                    />
                                    {isNewborn && (
                                        <p className="text-xs text-gray-500 mt-1">Not applicable for newborns</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeStep === 3 && (
                    <>
                        {/* Profile Image Upload */}
                        <div className="mb-6">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Camera size={16} className="mr-1 text-indigo-500" />
                                Profile Image
                            </label>
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                                    {formData.image ? (
                                        <img src="/api/placeholder/100/100" alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={32} className="text-indigo-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors duration-200">
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="profile-image"
                                        />
                                        <label htmlFor="profile-image" className="cursor-pointer">
                                            <div className="flex items-center justify-center">
                                                <Camera size={20} className="text-indigo-600 mr-2" />
                                                <span className="text-sm text-indigo-600">
                                                    {formData.image ? 'Change photo' : 'Upload photo'}
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Birth Certificate */}
                        <div className="p-5 bg-white rounded-xl border border-gray-200 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <FileCheck size={20} className="text-indigo-600 mr-2" />
                                    <h3 className="font-medium text-gray-800">Birth Certificate</h3>
                                </div>
                                {formData.birthCertificate && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">Verified</span>
                                )}
                            </div>

                            <div className="relative">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors duration-200">
                                    <input
                                        type="file"
                                        name="birthCertificate"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="birth-cert"
                                    />
                                    <label htmlFor="birth-cert" className="cursor-pointer block py-2">
                                        {isUploading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                                                <span className="ml-2 text-indigo-600">Uploading...</span>
                                            </div>
                                        ) : formData.birthCertificate ? (
                                            <div className="flex items-center justify-center text-indigo-600">
                                                <FileCheck size={18} className="mr-1" />
                                                <span>{formData.birthCertificate}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-indigo-600">Upload birth certificate</span>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Marriage Certificate - Only show when status is MARRIED */}
                        {isMarried && (
                            <div className="p-5 bg-rose-50 rounded-xl border border-rose-200 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Heart size={20} className="text-rose-600 mr-2" />
                                        <h3 className="font-medium text-rose-800">Marriage Certificate</h3>
                                    </div>
                                    {statusChanged && !formData.marriageCertificate && (
                                        <span className="px-2 py-1 bg-rose-200 text-rose-800 text-xs rounded-md">Required</span>
                                    )}
                                </div>

                                <div className="relative">
                                    <div className="border-2 border-dashed border-rose-300 rounded-lg p-4 text-center hover:border-rose-500 transition-colors duration-200">
                                        <input
                                            type="file"
                                            name="marriageCertificate"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="marriage-cert"
                                        />
                                        <label htmlFor="marriage-cert" className="cursor-pointer block py-2">
                                            {isUploading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-600"></div>
                                                    <span className="ml-2 text-rose-600">Uploading...</span>
                                                </div>
                                            ) : formData.marriageCertificate ? (
                                                <div className="flex items-center justify-center text-rose-600">
                                                    <FileCheck size={18} className="mr-1" />
                                                    <span>{formData.marriageCertificate}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-rose-600">Upload marriage certificate</span>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Death Certificate - Only show when status is DECEASED */}
                        {isDeceased && (
                            <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <FileCheck size={20} className="text-gray-600 mr-2" />
                                        <h3 className="font-medium text-gray-800">Death Certificate</h3>
                                    </div>
                                    {statusChanged && !formData.deathCertificate && (
                                        <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-md">Required</span>
                                    )}
                                </div>

                                <div className="relative">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-500 transition-colors duration-200">
                                        <input
                                            type="file"
                                            name="deathCertificate"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="death-cert"
                                        />
                                        <label htmlFor="death-cert" className="cursor-pointer block py-2">
                                            {isUploading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                                                    <span className="ml-2 text-gray-600">Uploading...</span>
                                                </div>
                                            ) : formData.deathCertificate ? (
                                                <div className="flex items-center justify-center text-gray-600">
                                                    <FileCheck size={18} className="mr-1" />
                                                    <span>{formData.deathCertificate}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-600">Upload death certificate</span>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Navigation and Update */}
                <div className="pt-6 flex justify-between items-center border-t border-gray-200">
                    {activeStep > 1 ? (
                        <button
                            onClick={() => setActiveStep(prev => prev - 1)}
                            className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors"
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
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Next
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className={`px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-r-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Update Member
                                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}