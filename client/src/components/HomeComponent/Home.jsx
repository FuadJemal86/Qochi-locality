import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Phone, Mail, Users, Building, Leaf, Star, ArrowRight, Play, Heart, Award, Shield, Wifi, Car, Trees, Instagram, Facebook, Twitter, Youtube, Send, LogIn } from 'lucide-react';

const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showContact, setShowContact] = useState(false);

    const [scrollY, setScrollY] = useState(0);
    const [visibleCards, setVisibleCards] = useState(new Set());

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleCards(prev => new Set(prev).add(entry.target.id));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.fade-in-card').forEach((card) => {
            observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            {/* Floating Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
                    style={{
                        left: '10%',
                        top: '20%',
                        transform: `translateY(${scrollY * 0.1}px)`
                    }}
                />
                <div
                    className="absolute w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
                    style={{
                        right: '10%',
                        bottom: '20%',
                        transform: `translateY(${-scrollY * 0.1}px)`
                    }}
                />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-purple-500/20 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Qochi
                        </div>

                        <div className="hidden md:flex space-x-8 items-center">
                            {['Home', 'Features', 'Gallery'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="text-gray-300 hover:text-white transition-all duration-300 relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all group-hover:w-full"></span>
                                </button>
                            ))}
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="text-gray-300 hover:text-white transition-all duration-300 relative group flex items-center gap-2"
                            >
                                <LogIn size={18} />
                                Login
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all group-hover:w-full"></span>
                            </button>
                            <button
                                onClick={() => setShowContact(true)}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                            >
                                Contact
                            </button>
                        </div>

                        <button
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {isMenuOpen && (
                        <div className="md:hidden mt-4 py-4 border-t border-gray-800">
                            {['Home', 'Features', 'Gallery'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="block w-full text-left py-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    {item}
                                </button>
                            ))}
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="block w-full text-left py-2 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <LogIn size={18} />
                                Login
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="min-h-screen flex items-center justify-center relative">
                <div className="text-center z-10 px-6">
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-300% animate-gradient">
                            Qochi Locality
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-delay">
                        Where modern living meets community spirit in perfect harmony
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
                        <button className="group bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                            <span className="flex items-center gap-2">
                                <Play size={20} className="group-hover:scale-110 transition-transform" />
                                Explore Now
                            </span>
                        </button>
                        <button
                            onClick={() => setShowContact(true)}
                            className="border border-gray-600 px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Learn More
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Why Choose Us
                        </h2>
                        <p className="text-xl text-gray-300">Experience the future of living</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                id: 'feature-1',
                                icon: <Building className="w-12 h-12" />,
                                title: 'Modern Design',
                                desc: 'Contemporary architecture with cutting-edge amenities'
                            },
                            {
                                id: 'feature-2',
                                icon: <Users className="w-12 h-12" />,
                                title: 'Vibrant Community',
                                desc: 'Connect with like-minded neighbors and friends'
                            },
                            {
                                id: 'feature-3',
                                icon: <Leaf className="w-12 h-12" />,
                                title: 'Eco-Friendly',
                                desc: 'Sustainable living with green spaces everywhere'
                            }
                        ].map((feature, index) => (
                            <div
                                key={feature.id}
                                id={feature.id}
                                className={`fade-in-card group bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl border border-gray-700 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 ${visibleCards.has(feature.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className="text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stats Section */}
                    <div className="grid md:grid-cols-4 gap-8 mt-20">
                        {[
                            { id: 'stat-1', number: '500+', label: 'Residents', icon: <Users className="w-8 h-8" /> },
                            { id: 'stat-2', number: '50+', label: 'Amenities', icon: <Building className="w-8 h-8" /> },
                            { id: 'stat-3', number: '15+', label: 'Years', icon: <Award className="w-8 h-8" /> },
                            { id: 'stat-4', number: '98%', label: 'Satisfaction', icon: <Star className="w-8 h-8" /> }
                        ].map((stat, index) => (
                            <div
                                key={stat.id}
                                id={stat.id}
                                className={`fade-in-card text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 ${visibleCards.has(stat.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="text-purple-400 mb-2 flex justify-center">{stat.icon}</div>
                                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                                <div className="text-gray-300">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Amenities
                        </h2>
                        <p className="text-xl text-gray-300">Premium facilities for modern living</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { id: 'amenity-1', icon: <Shield className="w-8 h-8" />, title: '24/7 Security', color: 'from-red-500 to-orange-500' },
                            { id: 'amenity-2', icon: <Wifi className="w-8 h-8" />, title: 'High-Speed WiFi', color: 'from-blue-500 to-cyan-500' },
                            { id: 'amenity-3', icon: <Car className="w-8 h-8" />, title: 'Smart Parking', color: 'from-green-500 to-emerald-500' },
                            { id: 'amenity-4', icon: <Trees className="w-8 h-8" />, title: 'Green Spaces', color: 'from-purple-500 to-pink-500' },
                            { id: 'amenity-5', icon: <Heart className="w-8 h-8" />, title: 'Fitness Center', color: 'from-pink-500 to-rose-500' },
                            { id: 'amenity-6', icon: <Users className="w-8 h-8" />, title: 'Community Hall', color: 'from-indigo-500 to-purple-500' },
                            { id: 'amenity-7', icon: <Building className="w-8 h-8" />, title: 'Co-working Space', color: 'from-yellow-500 to-orange-500' },
                            { id: 'amenity-8', icon: <Star className="w-8 h-8" />, title: 'Premium Services', color: 'from-teal-500 to-blue-500' }
                        ].map((amenity, index) => (
                            <div
                                key={amenity.id}
                                id={amenity.id}
                                className={`fade-in-card group relative overflow-hidden bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-transparent transition-all duration-500 transform hover:scale-105 ${visibleCards.has(amenity.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${amenity.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                <div className="relative z-10 text-center">
                                    <div className={`text-white mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        {amenity.icon}
                                    </div>
                                    <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                                        {amenity.title}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Ready to Join Us?
                    </h2>
                    <p className="text-xl text-gray-300 mb-12">
                        Take the first step towards your dream home
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {[
                            { id: 'contact-1', icon: <MapPin className="w-8 h-8" />, title: 'Visit', info: '123 Qochi Street, Beautiful City' },
                            { id: 'contact-2', icon: <Phone className="w-8 h-8" />, title: 'Call', info: '+1 (555) 123-4567' },
                            { id: 'contact-3', icon: <Mail className="w-8 h-8" />, title: 'Email', info: 'hello@qochi.com' }
                        ].map((contact, index) => (
                            <div
                                key={contact.id}
                                id={contact.id}
                                className={`fade-in-card group bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 ${visibleCards.has(contact.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className="text-purple-400 mb-4 flex justify-center group-hover:scale-110 transition-transform">
                                    {contact.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{contact.title}</h3>
                                <p className="text-gray-300">{contact.info}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowContact(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                        Get in Touch
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                                Qochi
                            </div>
                            <p className="text-gray-400 mb-4">Creating communities where life flourishes.</p>
                            <div className="flex space-x-4">
                                {[
                                    { icon: <Facebook className="w-5 h-5" />, label: 'Facebook' },
                                    { icon: <Instagram className="w-5 h-5" />, label: 'Instagram' },
                                    { icon: <Twitter className="w-5 h-5" />, label: 'Twitter' },
                                    { icon: <Youtube className="w-5 h-5" />, label: 'YouTube' }
                                ].map((social, index) => (
                                    <button
                                        key={index}
                                        className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110"
                                    >
                                        {social.icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                {['Home', 'Features', 'Gallery', 'Contact'].map((link) => (
                                    <li key={link}>
                                        <button
                                            onClick={() => scrollToSection(link.toLowerCase())}
                                            className="hover:text-white transition-colors"
                                        >
                                            {link}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Services</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li className="hover:text-white transition-colors cursor-pointer">Property Management</li>
                                <li className="hover:text-white transition-colors cursor-pointer">Maintenance</li>
                                <li className="hover:text-white transition-colors cursor-pointer">Community Events</li>
                                <li className="hover:text-white transition-colors cursor-pointer">24/7 Support</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Newsletter</h4>
                            <p className="text-gray-400 mb-4">Stay updated with our latest news</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                                />
                                <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-r-lg hover:shadow-lg transition-all">
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>© 2025 Qochi Locality. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Contact Modal */}
            {showContact && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-gray-700 transform transition-all duration-300 scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">Contact Us</h3>
                            <button
                                onClick={() => setShowContact(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                            <textarea
                                rows={4}
                                placeholder="Your Message"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                            />
                            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                .animate-gradient {
                    animation: gradient 3s ease infinite;
                }
                
                .bg-300\\% {
                    background-size: 300% 300%;
                }
                
                .animate-fade-in {
                    animation: fadeIn 1s ease-out;
                }
                
                .animate-fade-in-delay {
                    animation: fadeIn 1s ease-out 0.3s both;
                }
                
                .animate-fade-in-delay-2 {
                    animation: fadeIn 1s ease-out 0.6s both;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Home;