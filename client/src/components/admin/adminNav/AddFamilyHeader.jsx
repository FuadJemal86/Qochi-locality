import React, { useState, useRef } from 'react';
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
    // Form refs
    const formRef = useRef(null);
    const imageInputRef = useRef(null);

    // Basic states for UI management
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [image, setImage] = useState(null);

    const validateForm = () => {
        if (!formRef.current) return false;

        const form = formRef.current;
        const newErrors = {};

        // Get values from form
        const fullName = form.fullName.value.trim();
        const contactInfo = form.contactInfo.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
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

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
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

            const formData = new FormData(formRef.current);

            if (image) {
                formData.append('image', image);
            }

            try {
                const response = await api.post('/admin/add-family-header', formData);

                if (response.data.status) {
                    setLoading(false);
                    setSuccess(true);
                    formRef.current.reset();
                    setPreviewImage(null);
                    setImage(null);

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
                } else {
                    setLoading(false);
                    Swal.fire({
                        icon: 'warning',
                        title: 'Failed',
                        text: response.data.message
                    });
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: error.response.data.message || 'Failed to add family head. Please try again.'
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("Image must be smaller than 2MB");
                return;
            }

            setImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (formRef.current) {
            formRef.current.password.value = password;
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreviewImage(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
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
                        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                        id={name}
                        name={name}
                        onFocus={() => handleFocus(name)}
                        className={`pl-10 ${name === 'password' ? 'pr-10' : ''} w-full rounded-lg border ${errors[name] ? 'border-red-300 ring-1 ring-red-500' : 'border-gray-200'
                            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-2.5 text-gray-900 outline-none transition-all duration-200`}
                        placeholder={placeholder}
                    />
                    {name === 'password' && (
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex="-1"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
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

                    {/* Form */}
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left Column - Personal Info */}
                                <div className="md:col-span-2 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            name="fullName"
                                            label="Full Name"
                                            icon={<User size={18} />}
                                            placeholder="John Smith"
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
                                        placeholder="john.smith@example.com"
                                        required
                                    />

                                    <div className="relative">
                                        <InputField
                                            name="password"
                                            label="Password"
                                            type="password"
                                            icon={<Lock size={18} />}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={generatePassword}
                                            className="absolute right-0 top-7 -mt-1 mr-12 px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded hover:bg-gray-200"
                                            tabIndex="-1"
                                        >
                                            Generate
                                        </button>
                                    </div>

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
                                                    } shadow-sm p-2.5`}
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

                                {/* Right Column - Profile Image */}
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Image
                                    </label>
                                    <div className="flex flex-col items-center">
                                        <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden border border-gray-200 mb-3 relative group">
                                            {previewImage ? (
                                                <>
                                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={16} className="text-gray-600" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-gray-400">
                                                    <User size={48} />
                                                </div>
                                            )}
                                        </div>
                                        <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm flex items-center transition duration-200">
                                            <Upload size={16} className="mr-2" /> Upload Photo
                                            <input
                                                ref={imageInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            JPG, PNG or GIF, Max 2MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-gray-200">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center ${loading ? "opacity-70 cursor-wait" : ""
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
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
