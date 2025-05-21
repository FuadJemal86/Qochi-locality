import React, { useState, useEffect } from 'react';
import Death from './Death';
import Marriage from './Marriage';
import Divorce from './Divorce';
import { FileText, BookX, Heart, Scissors } from 'lucide-react';

function ForParent() {
    const [activeForm, setActiveForm] = useState('marriage');
    const [displayForm, setDisplayForm] = useState('marriage');
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Handle form change with transition
    useEffect(() => {
        if (activeForm !== displayForm) {
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setDisplayForm(activeForm);
                setIsTransitioning(false);
            }, 300); // Match this with CSS transition duration
            return () => clearTimeout(timer);
        }
    }, [activeForm, displayForm]);

    // Form rendering based on active selection
    const renderForm = () => {
        switch (displayForm) {
            case 'death':
                return <Death />;
            case 'marriage':
                return <Marriage />;
            case 'divorce':
                return <Divorce />;
            default:
                return <Marriage />;
        }
    };

    // Button style helper function
    const getButtonStyle = (formType) => {
        return activeForm === formType
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300";
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Certificate Management</h1>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">

                <button
                    onClick={() => setActiveForm('death')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${getButtonStyle('death')}`}
                >
                    <BookX size={18} />
                    <span>Death Certificate</span>
                </button>

                <button
                    onClick={() => setActiveForm('marriage')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${getButtonStyle('marriage')}`}
                >
                    <Heart size={18} />
                    <span>Marriage Certificate</span>
                </button>

                <button
                    onClick={() => setActiveForm('divorce')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${getButtonStyle('divorce')}`}
                >
                    <Scissors size={18} />
                    <span>Divorce Certificate</span>
                </button>
            </div>

            {/* Card container for the form with transition effect */}
            <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                <div
                    className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                        }`}
                >
                    {renderForm()}
                </div>
            </div>
        </div>
    );
}

export default ForParent;