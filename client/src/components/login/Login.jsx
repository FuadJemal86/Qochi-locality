import React, { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import banner from '../../images/Qochi.avif'
import api from '../../../api'

function Login() {
    const navigate = useNavigate()
    const [userCredentials, setUserCredentials] = useState({
        email: "",
        password: "",
        role: "admin" // Default role selection
    })

    // Remove the overflow: hidden effect that was preventing scrolling
    // We don't need the useEffect that was blocking scrolling

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { email, password, role } = userCredentials

        if (!email || !password) {
            return toast.error('Please fill all fields!')
        }

        try {
            // Using the role to determine the endpoint
            const endpoint = role === "admin" ? '/admin/login' : '/user/login'
            const result = await api.post(endpoint, {
                email,
                password
            })

            if (result.data.loginStatus) {
                // Navigate to appropriate dashboard based on role
                navigate(role === "admin" ? '/admin-dashboard' : '/family-head-dashboard')
            } else {
                toast.error(result.data.message || 'Login failed!')
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || 'An error occurred')
        }
    }

    return (
        // Add min-h-screen to ensure the container is at least the height of the viewport
        // Changed fixed height to min-height to allow scrolling
        <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Left section - Login Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-16">
                <div className="w-full max-w-md mx-auto">
                    <div className="flex items-center justify-center mb-10">
                        <div className="ml-4">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Qochi Locality
                            </span>
                            <p className="text-gray-500 text-sm">Community Management Portal</p>
                        </div>
                    </div>

                    {/* Login Form Container */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        {/* Welcome Text */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800">User Login</h1>
                            <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div
                                        className={`cursor-pointer border rounded-md p-3 flex items-center justify-center ${userCredentials.role === 'admin' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                        onClick={() => setUserCredentials({ ...userCredentials, role: 'admin' })}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-4 h-4 rounded-full border ${userCredentials.role === 'admin' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                                                {userCredentials.role === 'admin' && (
                                                    <div className="w-2 h-2 bg-white rounded-full m-auto"></div>
                                                )}
                                            </div>
                                            <span className="ml-2 font-medium text-gray-700">Admin</span>
                                        </div>
                                    </div>
                                    <div
                                        className={`cursor-pointer border rounded-md p-3 flex items-center justify-center ${userCredentials.role === 'family-head' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                        onClick={() => setUserCredentials({ ...userCredentials, role: 'family-head' })}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-4 h-4 rounded-full border ${userCredentials.role === 'family-head' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                                                {userCredentials.role === 'family-head' && (
                                                    <div className="w-2 h-2 bg-white rounded-full m-auto"></div>
                                                )}
                                            </div>
                                            <span className="ml-2 font-medium text-gray-700">Family Head</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="email@qochi.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onChange={e => setUserCredentials({ ...userCredentials, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <a href="#" className="text-xs text-blue-600 hover:text-blue-500">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onChange={e => setUserCredentials({ ...userCredentials, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">Remember me</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition duration-200 font-medium"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-xs text-gray-500">
                                By signing in, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/" className="text-blue-600 hover:underline">Privacy Policy</a>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            to home ? <Link to={'/'} className="font-medium text-blue-600 hover:text-blue-500">Home</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right section - Banner Image */}
            <div className="hidden md:block md:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: `url(${banner})` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-900/80"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center p-12">
                    <div className="max-w-lg text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">Qochi Locality Portal</h2>
                        <p className="text-xl text-gray-200 mb-8">A vibrant community in the heart of the coastal region, known for its cultural diversity and strong community bonds.</p>

                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg mb-8">
                            <p className="text-white text-lg mb-4">Qochi has been a self-governed locality since 2018, featuring award-winning community programs and resident-led initiatives. Our community takes pride in sustainable living practices and regular cultural celebrations that bring everyone together.</p>

                            <p className="text-white text-lg">This portal serves as the digital heart of our community, connecting families, facilitating service requests, and keeping everyone informed of local news and events.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-white">
                                <div className="font-bold text-3xl mb-1">450+</div>
                                <div className="text-sm text-gray-200">Families</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-white">
                                <div className="font-bold text-3xl mb-1">12</div>
                                <div className="text-sm text-gray-200">Services</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login