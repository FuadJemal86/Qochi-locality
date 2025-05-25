import React, { useState, useEffect } from "react";
import { User, Calendar, Baby, FileCheck, Briefcase, GraduationCap, Heart, Frown, MapPin, Home, Users, Edit3, Save, X } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../../../../api";

// WhoMember enum
const WhoMember = {
    Header: "Header",
    Wife: "Wife",
    Child: "Child",
    Other: "Other"
};

export default function EditMember({ initialData, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        fullName: "",
        birthDate: "",
        type: "PERMANENT",
        relationship: "",
        education: "",
        occupation: "",
        status: "ACTIVE",
        memberType: "Member",
        whoMember: "",
    });
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Initialize form with existing data
    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || "",
                birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : "",
                type: initialData.type || "PERMANENT",
                relationship: initialData.relationship || "",
                education: initialData.education || "",
                occupation: initialData.occupation || "",
                status: initialData.status || "ACTIVE",
                memberType: initialData.memberType || "Member",
                whoMember: initialData.whoMember || "",
            });
        }
    }, [initialData]);

    // Show/hide logic based on member type and status
    const isNewborn = formData.type === "NEWBORN";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.birthDate) {
            newErrors.birthDate = "Birth date is required";
        }

        if (!formData.relationship.trim()) {
            newErrors.relationship = "Relationship is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Send the form data in the request body
            const result = await api.put(`/admin/edit-member/${id}`, {
                fullName: formData.fullName,
                birthDate: formData.birthDate,
                type: formData.type,
                relationship: formData.relationship,
                education: formData.education,
                occupation: formData.occupation,
                status: formData.status,
                memberType: formData.memberType,
                whoMember: formData.whoMember || null
            });

            // Call the onSave callback with the updated data from the response
            if (onSave && result.data) {
                onSave(result.data.member);
            }

            // Show success message (optional)
            console.log("Member updated successfully:", result.data.message);

        } catch (error) {
            console.error("Error updating member:", error);

            // Handle specific error cases
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || "Failed to update member";
                setErrors({ submit: errorMessage });
            } else if (error.request) {
                // Request was made but no response received
                setErrors({ submit: "Network error. Please check your connection." });
            } else {
                setErrors({ submit: "An unexpected error occurred" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const statusColors = {
        ACTIVE: { bg: "bg-emerald-100", text: "text-emerald-700" },
        MARRIED: { bg: "bg-rose-100", text: "text-rose-700" },
        DECEASED: { bg: "bg-gray-100", text: "text-gray-700" },
        LEFT_LOCALITY: { bg: "bg-amber-100", text: "text-amber-700" }
    };

    const memberTypeColors = {
        Member: { bg: "bg-blue-100", text: "text-blue-700" },
        Rental: { bg: "bg-purple-100", text: "text-purple-700" }
    };

    const whoMemberColors = {
        [WhoMember.Header]: { bg: "bg-indigo-100", text: "text-indigo-700" },
        [WhoMember.Wife]: { bg: "bg-pink-100", text: "text-pink-700" },
        [WhoMember.Child]: { bg: "bg-cyan-100", text: "text-cyan-700" },
        [WhoMember.Other]: { bg: "bg-gray-100", text: "text-gray-700" }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Edit3 size={24} className="text-green-200" />
                    Edit Family Member
                </h2>
                <p className="text-green-100 mt-1">Update member information</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full ${statusColors[formData.status].bg} ${statusColors[formData.status].text} text-sm font-medium`}>
                        <span>{formData.status.replace('_', ' ')}</span>
                    </div>

                    <div className={`inline-flex items-center px-3 py-1 rounded-full ${memberTypeColors[formData.memberType].bg} ${memberTypeColors[formData.memberType].text} text-sm font-medium`}>
                        <span>{formData.memberType}</span>
                    </div>

                    {formData.whoMember && (
                        <div className={`inline-flex items-center px-3 py-1 rounded-full ${whoMemberColors[formData.whoMember].bg} ${whoMemberColors[formData.whoMember].text} text-sm font-medium`}>
                            <span>{formData.whoMember}</span>
                        </div>
                    )}
                </div>

                {/* Error message for submission */}
                {errors.submit && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-red-700 text-sm">{errors.submit}</p>
                    </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <User size={16} className="mr-1 text-green-500" />
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                }`}
                            placeholder="Enter full name"
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Calendar size={16} className="mr-1 text-green-500" />
                            Birth Date *
                        </label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.birthDate ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                }`}
                        />
                        {errors.birthDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Baby size={16} className="mr-1 text-green-500" />
                            Member Type *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {["PERMANENT", "NEWBORN"].map(type => (
                                <div
                                    key={type}
                                    onClick={() => setFormData(prev => ({ ...prev, type }))}
                                    className={`cursor-pointer border rounded-lg px-4 py-3 flex items-center justify-center transition-all duration-200 ${formData.type === type
                                        ? "bg-green-50 border-green-400 text-green-700"
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
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <FileCheck size={16} className="mr-1 text-green-500" />
                            Status *
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="MARRIED">Married</option>
                            <option value="DECEASED">Deceased</option>
                            <option value="LEFT_LOCALITY">Left Locality</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Heart size={16} className="mr-1 text-green-500" />
                        Relationship *
                    </label>
                    <input
                        type="text"
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                        placeholder="e.g., Son, Daughter, Spouse"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.relationship ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                    />
                    {errors.relationship && (
                        <p className="mt-1 text-sm text-red-600">{errors.relationship}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Home size={16} className="mr-1 text-green-500" />
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

                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Users size={16} className="mr-1 text-green-500" />
                            Member Role (Optional)
                        </label>
                        <select
                            name="whoMember"
                            value={formData.whoMember}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                        >
                            <option value="">Select Role (Optional)</option>
                            {Object.values(WhoMember).map(role => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Education and Occupation - Hidden for newborns */}
                {!isNewborn && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <GraduationCap size={16} className="mr-1 text-green-500" />
                                Education
                            </label>
                            <input
                                type="text"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                placeholder="Highest education level"
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Briefcase size={16} className="mr-1 text-green-500" />
                                Occupation
                            </label>
                            <input
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                placeholder="Current occupation"
                            />
                        </div>
                    </div>
                )}

                {/* Newborn Notice */}
                {isNewborn && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center">
                            <Baby size={20} className="text-blue-600 mr-2" />
                            <p className="text-blue-700 text-sm font-medium">
                                Education and occupation fields are not required for newborns.
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
                        >
                            <X size={18} className="mr-1" />
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-1" />
                                Update Member
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}