import React, { useState, useEffect } from 'react';
import BirthApproval from './certificate/BirthApproval';
import MarriageApproval from './certificate/MarriageApproval';
import DivorceApproval from './certificate/DivorceApproval';
import DeathApproval from './certificate/DeathApproval';

function VitalRequest() {
    // State to track which component to display
    const [activeComponent, setActiveComponent] = useState('birth');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayComponent, setDisplayComponent] = useState('birth');

    // Handle component change with transition
    useEffect(() => {
        if (activeComponent !== displayComponent) {
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setDisplayComponent(activeComponent);
                setIsTransitioning(false);
            }, 300); // Match this with CSS transition duration
            return () => clearTimeout(timer);
        }
    }, [activeComponent, displayComponent]);

    // Function to render the active component
    const renderComponent = () => {
        switch (displayComponent) {
            case 'birth':
                return <BirthApproval />;
            case 'marriage':
                return <MarriageApproval />;
            case 'divorce':
                return <DivorceApproval />;
            case 'death':
                return <DeathApproval />;
            default:
                return <BirthApproval />;
        }
    };

    return (
        <div className="p-4">
            {/* Buttons row */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveComponent('birth')}
                    className={`px-4 py-2 rounded-md ${activeComponent === 'birth' ?
                        'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Birth Request
                </button>
                <button
                    onClick={() => setActiveComponent('marriage')}
                    className={`px-4 py-2 rounded-md ${activeComponent === 'marriage' ?
                        'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Marriage Request
                </button>
                <button
                    onClick={() => setActiveComponent('divorce')}
                    className={`px-4 py-2 rounded-md ${activeComponent === 'divorce' ?
                        'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Divorce Request
                </button>
                <button
                    onClick={() => setActiveComponent('death')}
                    className={`px-4 py-2 rounded-md ${activeComponent === 'death' ?
                        'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Death Request
                </button>
            </div>

            {/* Component display area */}
            <div className="p-4">
                <div
                    className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'
                        }`}
                >
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
}

export default VitalRequest;