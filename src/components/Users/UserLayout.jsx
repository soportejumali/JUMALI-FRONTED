import React, { useState } from 'react';
import UserSidebar from './UserSidebar';
import UserHeader from './UserHeader';

const UserLayout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <UserSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
                <UserHeader toggleSidebar={toggleSidebar} />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default UserLayout;