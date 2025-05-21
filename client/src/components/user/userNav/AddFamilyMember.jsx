import React, { useState } from "react";
import { User, Calendar, Baby, FileCheck, Briefcase, GraduationCap, Heart, Frown, MapPin, Camera, Home, Users } from "lucide-react";
import api from "../../../../api";
import toast, { Toaster } from "react-hot-toast";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Added WhoMember enum
const WhoMember = {
    Header: "Header",
    Wife: "Wife",
    Child: "Child"
};

export default function AddFamilyMember() {
    const MySwal = withReactContent(Swal);
    const [formData, setFormData] = useState({
        fullName: "",
        birthDate: "",
        type: "PERMANENT",
        relationship: "",
        education: "",
        occupation: "",
        status: "ACTIVE",
        memberType: "Member", // Default value to match backend expectation
        whoMember: "", // Added whoMember field (optional)
    });

    // Store file objects separately
    const [fileData, setFileData] = useState({
        birthCertificate: null,
        image: null,
        deathCertificate: null,
        marriageCertificate: null,
        memberTypeImage: null, // For rental agreement
    });

    // Store file names for display purposes
    const [fileNames, setFileNames] = useState({
        birthCertificate: "",
        image: "",
        deathCertificate: "",
        marriageCertificate: "",
        memberTypeImage: "",
    });

    const [activeStep, setActiveStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);

    // Show/hide logic based on member type and status
    const isNewborn = formData.type === "NEWBORN";
    const isDeceased = formData.status === "DECEASED";
    const isMarried = formData.status === "MARRIED";
    const isRental = formData.memberType === "Rental";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];

        setIsUploading(true);

        // Simulate upload delay (in real app, this could be removed)
        setTimeout(() => {
            if (file) {
                // Store the file object for submission
                setFileData(prev => ({
                    ...prev,
                    [name]: file
                }));

                // Store the filename for display
                setFileNames(prev => ({
                    ...prev,
                    [name]: file.name
                }));
            }
            setIsUploading(false);
        }, 800);
    };

    const handleSubmit = async () => {
        const { fullName, birthDate, relationship } = formData;

        if (!fullName || !birthDate || !relationship) {
            toast.error('Please fill the required input fields!');
            return;
        }

        // Validate rental agreement document if member type is rental
        if (isRental && !fileData.memberTypeImage) {
            toast.error('Please upload the rental agreement document!');
            return;
        }

        try {
            // Create FormData object for multipart/form-data submission
            const submitData = new FormData();

            // Add all form fields
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value);
            });

            // Add all files
            Object.entries(fileData).forEach(([key, file]) => {
                if (file) {
                    submitData.append(key, file);
                }
            });

            // Send the form data to the server
            const result = await api.post('/user/add-members', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Family member has been added successfully",
                    showConfirmButton: false,
                    timer: 1500
                });

                // Reset form after successful submission
                setFormData({
                    fullName: "",
                    birthDate: "",
                    type: "PERMANENT",
                    relationship: "",
                    education: "",
                    occupation: "",
                    status: "ACTIVE",
                    memberType: "Member",
                    whoMember: "", // Reset whoMember field
                });

                setFileData({
                    birthCertificate: null,
                    image: null,
                    deathCertificate: null,
                    marriageCertificate: null,
                    memberTypeImage: null,
                });

                setFileNames({
                    birthCertificate: "",
                    image: "",
                    deathCertificate: "",
                    marriageCertificate: "",
                    memberTypeImage: "",
                });

                setActiveStep(1);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "An error occurred");
        }
    };

    const statusColors = {
        ACTIVE: { bg: "bg-emerald-100", text: "text-emerald-700", icon: <MapPin size={18} className="text-emerald-600" /> },
        MARRIED: { bg: "bg-rose-100", text: "text-rose-700", icon: <Heart size={18} className="text-rose-600" /> },
        DECEASED: { bg: "bg-gray-100", text: "text-gray-700", icon: <Frown size={18} className="text-gray-600" /> },
        LEFT_LOCALITY: { bg: "bg-amber-100", text: "text-amber-700", icon: <MapPin size={18} className="text-amber-600" /> }
    };

    const memberTypeColors = {
        Member: { bg: "bg-blue-100", text: "text-blue-700", icon: <User size={18} className="text-blue-600" /> },
        Rental: { bg: "bg-purple-100", text: "text-purple-700", icon: <Home size={18} className="text-purple-600" /> }
    };

    const whoMemberColors = {
        [WhoMember.Header]: { bg: "bg-indigo-100", text: "text-indigo-700", icon: <User size={18} className="text-indigo-600" /> },
        [WhoMember.Wife]: { bg: "bg-pink-100", text: "text-pink-700", icon: <Heart size={18} className="text-pink-600" /> },
        [WhoMember.Child]: { bg: "bg-cyan-100", text: "text-cyan-700", icon: <Baby size={18} className="text-cyan-600" /> }
    };

    return (
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <Toaster position="top-center" reverseOrder={false} />

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <User size={24} className="text-blue-200" />
                    Add Family Member
                </h2>
                <p className="text-blue-100 mt-1">Enter new member details</p>
            </div>

            {/* Steps */}
            <div className="flex justify-between px-6 py-3 bg-white border-b">
                {[1, 2, 3].map(step => (
                    <div
                        key={step}
                        onClick={() => setActiveStep(step)}
                        className={`flex items-center cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${activeStep === step ? "bg-blue-100 text-blue-800" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${activeStep === step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                            {step}
                        </div>
                        <span className="font-medium">
                            {step === 1 ? "Basic Info" : step === 2 ? "Details" : "Documents"}
                        </span>
                    </div>
                ))}
            </div>

            <div className="p-6 space-y-8">
                {activeStep === 1 && (
                    <>
                        {/* Basic Information Section */}
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
                                        <Calendar size={16} className="mr-1 text-blue-500" />
                                        Birth Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Baby size={16} className="mr-1 text-blue-500" />
                                        Member Type *
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["PERMANENT", "NEWBORN"].map(type => (
                                            <div
                                                key={type}
                                                onClick={() => setFormData(prev => ({ ...prev, type }))}
                                                className={`cursor-pointer border rounded-lg px-4 py-3 flex items-center justify-center transition-all duration-200 ${formData.type === type
                                                    ? "bg-blue-50 border-blue-400 text-blue-700"
                                                    : "border-gray-200 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {type === "NEWBORN" ? (
                                                    <><Baby size={18} className="mr-2" /> Newborn</>
                                                ) : (
                                                    <><User size={18} className="mr-2" /> Permanent</>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <FileCheck size={16} className="mr-1 text-blue-500" />
                                        Status *
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                                    >
                                        {Object.keys(statusColors).map(status => (
                                            <option key={status} value={status}>
                                                {status.replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Added Who Member Field */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Users size={16} className="mr-1 text-blue-500" />
                                    Member Role (Optional)
                                </label>
                                <select
                                    name="whoMember"
                                    value={formData.whoMember}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                                >
                                    <option value="">Select Role (Optional)</option>
                                    {Object.values(WhoMember).map(role => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Heart size={16} className="mr-1 text-blue-500" />
                                    Relationship *
                                </label>
                                <input
                                    type="text"
                                    name="relationship"
                                    value={formData.relationship}
                                    onChange={handleChange}
                                    placeholder="e.g., Son, Daughter, Spouse"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Home size={16} className="mr-1 text-blue-500" />
                                    Residence Type
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Member", "Rental"].map(resType => (
                                        <div
                                            key={resType}
                                            onClick={() => setFormData(prev => ({ ...prev, memberType: resType }))}
                                            className={`cursor-pointer border rounded-lg px-4 py-3 flex items-center justify-center transition-all duration-200 ${formData.memberType === resType
                                                ? `${memberTypeColors[resType].bg} border-${resType === "Member" ? "blue" : "purple"}-400 ${memberTypeColors[resType].text}`
                                                : "border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            {resType === "Member" ? (
                                                <><User size={18} className="mr-2" /> Regular Member</>
                                            ) : (
                                                <><Home size={18} className="mr-2" /> Rental</>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeStep === 2 && (
                    <>
                        {/* Status Badge */}
                        <div className="flex flex-wrap gap-2">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full ${statusColors[formData.status].bg} ${statusColors[formData.status].text} text-sm font-medium`}>
                                {statusColors[formData.status].icon}
                                <span className="ml-1">{formData.status.replace('_', ' ')}</span>
                            </div>

                            <div className={`inline-flex items-center px-3 py-1 rounded-full ${memberTypeColors[formData.memberType].bg} ${memberTypeColors[formData.memberType].text} text-sm font-medium`}>
                                {memberTypeColors[formData.memberType].icon}
                                <span className="ml-1">{formData.memberType}</span>
                            </div>

                            {/* Added Who Member Badge (only if selected) */}
                            {formData.whoMember && (
                                <div className={`inline-flex items-center px-3 py-1 rounded-full ${whoMemberColors[formData.whoMember].bg} ${whoMemberColors[formData.whoMember].text} text-sm font-medium`}>
                                    {whoMemberColors[formData.whoMember].icon}
                                    <span className="ml-1">{formData.whoMember}</span>
                                </div>
                            )}
                        </div>

                        {!isNewborn && (
                            <div className="space-y-6 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                            <GraduationCap size={16} className="mr-1 text-blue-500" />
                                            Education
                                        </label>
                                        <input
                                            type="text"
                                            name="education"
                                            value={formData.education}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Highest education level"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                            <Briefcase size={16} className="mr-1 text-blue-500" />
                                            Occupation
                                        </label>
                                        <input
                                            type="text"
                                            name="occupation"
                                            value={formData.occupation}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Current occupation"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {isNewborn && (
                            <div className="mt-4 p-6 bg-blue-50 rounded-xl border border-blue-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16">
                                    <div className="absolute transform rotate-45 bg-blue-500 text-white text-xs py-1 right-[-40px] top-[20px] w-[170px] text-center">
                                        NEWBORN
                                    </div>
                                </div>
                                <div className="flex items-center mb-4">
                                    <Baby size={24} className="text-blue-600 mr-2" />
                                    <h3 className="font-medium text-blue-800 text-lg">Newborn Information</h3>
                                </div>
                                <p className="text-blue-600 text-sm mb-2">Education and occupation fields are not required for newborns.</p>
                            </div>
                        )}

                        {isRental && (
                            <div className="mt-4 p-6 bg-purple-50 rounded-xl border border-purple-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16">
                                    <div className="absolute transform rotate-45 bg-purple-500 text-white text-xs py-1 right-[-40px] top-[20px] w-[170px] text-center">
                                        RENTAL
                                    </div>
                                </div>
                                <div className="flex items-center mb-4">
                                    <Home size={24} className="text-purple-600 mr-2" />
                                    <h3 className="font-medium text-purple-800 text-lg">Rental Information</h3>
                                </div>
                                <p className="text-purple-600 text-sm mb-2">You'll need to upload a rental agreement document in the Documents step.</p>
                            </div>
                        )}
                    </>
                )}

                {activeStep === 3 && (
                    <>
                        {/* Profile Image Upload */}
                        <div className="mb-6">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Camera size={16} className="mr-1 text-blue-500" />
                                Profile Image
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
                                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                        <Camera size={24} className="text-blue-600" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {fileNames.image ?
                                            `Selected: ${fileNames.image}` :
                                            'Click to upload profile image'
                                        }
                                    </p>
                                </label>
                            </div>
                        </div>

                        {/* Conditional Document Fields */}
                        <div className="space-y-6">
                            {isRental && (
                                <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                                    <div className="flex items-center mb-4">
                                        <FileCheck size={22} className="text-purple-600 mr-2" />
                                        <h3 className="font-medium text-purple-800 text-lg">Rental Agreement Document *</h3>
                                    </div>
                                    <div className="relative">
                                        <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center hover:border-purple-500 transition-colors duration-200">
                                            <input
                                                type="file"
                                                name="memberTypeImage"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="rental-agreement"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                            <label htmlFor="rental-agreement" className="cursor-pointer block py-2">
                                                {isUploading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                                                        <span className="ml-2 text-purple-600">Uploading...</span>
                                                    </div>
                                                ) : fileNames.memberTypeImage ? (
                                                    <div className="flex items-center justify-center text-purple-600">
                                                        <FileCheck size={18} className="mr-1" />
                                                        <span>{fileNames.memberTypeImage}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-purple-600">Upload rental agreement document</span>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isNewborn && (
                                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="flex items-center mb-4">
                                        <FileCheck size={22} className="text-blue-600 mr-2" />
                                        <h3 className="font-medium text-blue-800 text-lg">Document(pdf)</h3>
                                    </div>
                                    <div className="relative">
                                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors duration-200">
                                            <input
                                                type="file"
                                                name="birthCertificate"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="birth-cert"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                            <label htmlFor="birth-cert" className="cursor-pointer block py-2">
                                                {isUploading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                                        <span className="ml-2 text-blue-600">Uploading...</span>
                                                    </div>
                                                ) : fileNames.birthCertificate ? (
                                                    <div className="flex items-center justify-center text-blue-600">
                                                        <FileCheck size={18} className="mr-1" />
                                                        <span>{fileNames.birthCertificate}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-blue-600">Upload Pdf</span>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isMarried && (
                                <div className="p-6 bg-rose-50 rounded-xl border border-rose-200">
                                    <div className="flex items-center mb-4">
                                        <Heart size={22} className="text-rose-600 mr-2" />
                                        <h3 className="font-medium text-rose-800 text-lg">Marriage Certificate</h3>
                                    </div>
                                    <div className="relative">
                                        <div className="border-2 border-dashed border-rose-300 rounded-lg p-4 text-center hover:border-rose-500 transition-colors duration-200">
                                            <input
                                                type="file"
                                                name="marriageCertificate"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="marriage-cert"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                            <label htmlFor="marriage-cert" className="cursor-pointer block py-2">
                                                {isUploading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-600"></div>
                                                        <span className="ml-2 text-rose-600">Uploading...</span>
                                                    </div>
                                                ) : fileNames.marriageCertificate ? (
                                                    <div className="flex items-center justify-center text-rose-600">
                                                        <FileCheck size={18} className="mr-1" />
                                                        <span>{fileNames.marriageCertificate}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-rose-600">Upload marriage certificate</span>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isDeceased && (
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center mb-4">
                                        <FileCheck size={22} className="text-gray-600 mr-2" />
                                        <h3 className="font-medium text-gray-800 text-lg">Death Certificate</h3>
                                    </div>
                                    <div className="relative">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-500 transition-colors duration-200">
                                            <input
                                                type="file"
                                                name="deathCertificate"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="death-cert"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                            <label htmlFor="death-cert" className="cursor-pointer block py-2">
                                                {isUploading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                                                        <span className="ml-2 text-gray-600">Uploading...</span>
                                                    </div>
                                                ) : fileNames.deathCertificate ? (
                                                    <div className="flex items-center justify-center text-gray-600">
                                                        <FileCheck size={18} className="mr-1" />
                                                        <span>{fileNames.deathCertificate}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-600">Upload death certificate</span>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
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
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Add Member
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