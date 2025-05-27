import React, { useState } from 'react';
import {
    User,
    Phone,
    Mail,
    Lock,
    Home,
    Users,
    Upload,
    Save,
    X,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Eye,
    EyeOff,
    Building
} from 'lucide-react';
import api from '../../../../api';
import Swal from 'sweetalert2';

const AddFamilyHeader = () => {
    // Form data state - exact same structure as EditMember
    const [formData, setFormData] = useState({
        fullName: '',
        contactInfo: '',
        email: '',
        password: '',
        houseNumber: '',
        familysize: '',
        type: ''
    });

    // UI states - exact same as EditMember
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [image, setImage] = useState(null);

    // Handle input changes - EXACT same as EditMember
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Validation - same structure as EditMember
    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.contactInfo.trim()) {
            newErrors.contactInfo = "Contact information is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!formData.houseNumber.trim()) {
            newErrors.houseNumber = "House number is required";
        }

        if (!formData.familysize.trim()) {
            newErrors.familysize = "Family size is required";
        }

        if (!formData.type) {
            newErrors.type = "Home type is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit handler - EXACT same pattern as EditMember
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            let result;

            if (image) {
                // Use FormData only when image is present
                const submitData = new FormData();
                submitData.append('fullName', formData.fullName);
                submitData.append('contactInfo', formData.contactInfo);
                submitData.append('email', formData.email);
                submitData.append('password', formData.password);
                submitData.append('houseNumber', formData.houseNumber);
                submitData.append('familysize', formData.familysize);
                submitData.append('type', formData.type);
                submitData.append('image', image);

                result = await api.post('/admin/add-family-header', submitData);
            } else {
                // Send JSON data when no image (like EditMember)
                result = await api.post('/admin/add-family-header', {
                    fullName: formData.fullName,
                    contactInfo: formData.contactInfo,
                    email: formData.email,
                    password: formData.password,
                    houseNumber: formData.houseNumber,
                    familysize: formData.familysize,
                    type: formData.type
                });
            }

            // Handle success
            setSuccess(true);

            // Reset form
            setFormData({
                fullName: '',
                contactInfo: '',
                email: '',
                password: '',
                houseNumber: '',
                familysize: '',
                type: ''
            });
            setPreviewImage(null);
            setImage(null);
            setErrors({});

            Swal.fire({
                icon: 'success',
                title: 'Family Head Added!',
                text: 'The family head was successfully added.',
                timer: 3000,
                showConfirmButton: false
            });

            setTimeout(() => {
                setSuccess(false);
            }, 5000);

            console.log("Family head added successfully:", result.data.message);

        } catch (error) {
            console.error("Error adding family head:", error);

            // Handle specific error cases like EditMember
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || "Failed to add family head";
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: "Image must be smaller than 2MB" }));
                return;
            }

            setImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear any previous image errors
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: "" }));
            }
        }
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({
            ...prev,
            password: password
        }));
    };

    const removeImage = () => {
        setImage(null);
        setPreviewImage(null);
        if (errors.image) {
            setErrors(prev => ({ ...prev, image: "" }));
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            contactInfo: '',
            email: '',
            password: '',
            houseNumber: '',
            familysize: '',
            type: ''
        });
        setPreviewImage(null);
        setImage(null);
        setErrors({});
        setSuccess(false);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <User size={20} className="mr-2" /> Add New Family Head
                        </h2>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="m-6 bg-green-50 border-l-4 border-green-500 p-4 flex items-start">
                            <CheckCircle2 size={20} className="text-green-500 mr-3 mt-0.5" />
                            <div>
                                <h3 className="text-green-800 font-medium">Success!</h3>
                                <p className="text-green-700 text-sm">The family head has been successfully added to the system.</p>
                            </div>
                        </div>
                    )}

                    {/* Error message for submission */}
                    {errors.submit && (
                        <div className="m-6 p-4 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-red-700 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    {/* Form - EXACT same structure as EditMember */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Information - Same grid as EditMember */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <User size={16} className="mr-1 text-blue-500" />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                    placeholder="Enter full name"
                                />
                                {errors.fullName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <Phone size={16} className="mr-1 text-blue-500" />
                                    Contact Number *
                                </label>
                                <input
                                    type="text"
                                    name="contactInfo"
                                    value={formData.contactInfo}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.contactInfo ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                    placeholder="+1 (555) 123-4567"
                                />
                                {errors.contactInfo && (
                                    <p className="mt-1 text-sm text-red-600">{errors.contactInfo}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Mail size={16} className="mr-1 text-blue-500" />
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                    }`}
                                placeholder="john.smith@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="relative">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Lock size={16} className="mr-1 text-blue-500" />
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-12 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                <button
                                    type="button"
                                    onClick={generatePassword}
                                    className="absolute right-1 top-1 bottom-1 px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded hover:bg-gray-200"
                                >
                                    Generate
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <Home size={16} className="mr-1 text-blue-500" />
                                    House Number *
                                </label>
                                <input
                                    type="text"
                                    name="houseNumber"
                                    value={formData.houseNumber}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.houseNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                    placeholder="123"
                                />
                                {errors.houseNumber && (
                                    <p className="mt-1 text-sm text-red-600">{errors.houseNumber}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <Users size={16} className="mr-1 text-blue-500" />
                                    Family Size *
                                </label>
                                <input
                                    type="text"
                                    name="familysize"
                                    value={formData.familysize}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.familysize ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                    placeholder="4"
                                />
                                {errors.familysize && (
                                    <p className="mt-1 text-sm text-red-600">{errors.familysize}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Building size={16} className="mr-1 text-blue-500" />
                                Home Type *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white ${errors.type ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                    }`}
                            >
                                <option value="">Select Home Type</option>
                                <option value="Private">Private</option>
                                <option value="Rental">Rental</option>
                                <option value="PublicHousing">Public Housing</option>
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                            )}
                        </div>

                        {/* Profile Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Image
                            </label>
                            <div className="flex items-center space-x-6">
                                <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border border-gray-200 relative group">
                                    {previewImage ? (
                                        <>
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} className="text-gray-600" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-400">
                                            <User size={32} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm flex items-center transition duration-200">
                                        <Upload size={16} className="mr-2" /> Upload Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        JPG, PNG or GIF, Max 2MB
                                    </p>
                                    {errors.image && (
                                        <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons - Same as EditMember */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
                            >
                                <X size={18} className="mr-1" />
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} className="mr-1" />
                                        Save Family Head
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

export default AddFamilyHeader;