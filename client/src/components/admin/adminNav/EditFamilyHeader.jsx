import React, { useState, useRef, useEffect } from 'react';
import {
    User,
    Phone,
    Mail,
    Home,
    Users,
    Save,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Building,
    ArrowLeft
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api from '../../../../api';
import Swal from 'sweetalert2';

const EditFamilyHeader = ({ familyData, onSave, onCancel }) => {
    // Form refs
    const formRef = useRef(null);

    // Get ID from URL params
    const { id } = useParams();

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Initialize form with existing data
    useEffect(() => {
        if (familyData && formRef.current) {
            const form = formRef.current;
            form.fullName.value = familyData.fullName || '';
            form.contactInfo.value = familyData.contactInfo || '';
            form.email.value = familyData.email || '';
            form.houseNumber.value = familyData.houseNumber || '';
            form.familysize.value = familyData.familysize || '';
            form.type.value = familyData.type || '';
        }
    }, [familyData]);

    const validateForm = () => {
        if (!formRef.current) return false;

        const form = formRef.current;
        const newErrors = {};

        // Get values from form
        const fullName = form.fullName.value.trim();
        const contactInfo = form.contactInfo.value.trim();
        const email = form.email.value.trim();
        const houseNumber = form.houseNumber.value.trim();
        const familySize = form.familysize.value.trim();
        const type = form.type.value;

        // Basic validation
        if (!fullName) newErrors.fullName = "Full name is required";
        if (!contactInfo) newErrors.contactInfo = "Contact information is required";

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!houseNumber) newErrors.houseNumber = "House number is required";
        if (!familySize) newErrors.familySize = "Family size is required";
        if (!type) newErrors.type = "Home type is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);

            // Get form data directly from form elements
            const form = formRef.current;
            const updateData = {
                fullName: form.fullName.value.trim(),
                contactInfo: form.contactInfo.value.trim(),
                email: form.email.value.trim(),
                houseNumber: form.houseNumber.value.trim(),
                familysize: form.familysize.value.trim(),
                type: form.type.value
            };

            try {
                const response = await api.put(`/admin/edit-header/${id}`, updateData);

                if (response.data.status) {
                    setLoading(false);
                    setSuccess(true);

                    // SweetAlert2 success notification
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated Successfully!',
                        text: 'The family head information has been updated.',
                        timer: 3000,
                        showConfirmButton: false
                    });

                    // Call the onSave callback with updated data
                    if (onSave) {
                        onSave({ id: parseInt(id), ...updateData });
                    }

                    setTimeout(() => {
                        setSuccess(false);
                    }, 5000);
                } else {
                    setLoading(false);

                    // SweetAlert2 warning notification
                    Swal.fire({
                        icon: 'warning',
                        title: 'Update Failed',
                        text: response.data.message
                    });
                }
            } catch (error) {
                console.error("Error updating family head:", error);
                setLoading(false);

                // SweetAlert2 error notification
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: error.response?.data?.message || 'Failed to update family head. Please try again.'
                });
            }
        }
    };

    // Clear error when input field is focused
    const handleFocus = (name) => {
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Input Field component
    const InputField = ({ name, label, type = "text", icon, placeholder, required = false }) => {
        return (
            <div className="mb-4">
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                    <input
                        type={type}
                        id={name}
                        name={name}
                        onFocus={() => handleFocus(name)}
                        className={`pl-10 w-full rounded-lg border ${errors[name] ? 'border-red-300 ring-1 ring-red-500' : 'border-gray-200'
                            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-2.5 text-gray-900 outline-none transition-all duration-200`}
                        placeholder={placeholder}
                    />
                </div>
                {errors[name] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" /> {errors[name]}
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <User size={20} className="mr-2" /> Edit Family Head
                            </h2>
                            {onCancel && (
                                <button
                                    onClick={onCancel}
                                    className="text-white hover:text-gray-200 flex items-center text-sm"
                                >
                                    <ArrowLeft size={16} className="mr-1" /> Back
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="m-6 bg-green-50 border-l-4 border-green-500 p-4 flex items-start">
                            <CheckCircle2 size={20} className="text-green-500 mr-3 mt-0.5" />
                            <div>
                                <h3 className="text-green-800 font-medium">Updated Successfully!</h3>
                                <p className="text-green-700 text-sm">The family head information has been updated.</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="p-6">
                            <div className="max-w-2xl mx-auto space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        name="fullName"
                                        label="Full Name"
                                        icon={<User size={18} />}
                                        placeholder="header"
                                        required
                                    />

                                    <InputField
                                        name="contactInfo"
                                        label="Contact Number"
                                        icon={<Phone size={18} />}
                                        placeholder="+1 (555) 123-4567"
                                        required
                                    />
                                </div>

                                <InputField
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    icon={<Mail size={18} />}
                                    placeholder="header.@example.com"
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        name="houseNumber"
                                        label="House Number"
                                        icon={<Home size={18} />}
                                        placeholder="123"
                                        required
                                    />

                                    <InputField
                                        name="familysize"
                                        label="Family Size"
                                        icon={<Users size={18} />}
                                        placeholder="4"
                                        required
                                    />
                                </div>

                                {/* Home Type Select Field */}
                                <div className="mb-4">
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                        Home Type <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Building size={18} />
                                        </div>
                                        <select
                                            id="type"
                                            name="type"
                                            onFocus={() => handleFocus("type")}
                                            className={`pl-10 w-full rounded-lg border ${errors.type ? 'border-red-300 ring-1 ring-red-500' : 'border-gray-200'
                                                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-2.5 text-gray-900 outline-none`}
                                        >
                                            <option value="">Select Home Type</option>
                                            <option value="Private">Private</option>
                                            <option value="Rental">Rental</option>
                                            <option value="PublicHousing">Public Housing</option>
                                        </select>
                                    </div>
                                    {errors.type && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle size={14} className="mr-1" /> {errors.type}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-gray-200">
                            <Link to={'/admin-dashboard/family-headers'}
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center transition-colors ${loading ? "opacity-70 cursor-wait" : ""
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
                                        Update Family Head
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditFamilyHeader;