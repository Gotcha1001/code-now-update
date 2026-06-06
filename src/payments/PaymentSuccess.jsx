import React from 'react';
import { useLocation } from 'react-router-dom';

const SuccessPage = () => {
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const packageName = searchParams.get('item_name') || 'Unknown';
    const amount = searchParams.get('amount') || '0.00';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black to-white">
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Successful Payment</h1>
                <p className="text-lg text-gray-700 mb-8">
                    Thank you for your payment
                </p>
                <div className="w-64 h-64 mx-auto mb-8">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdr1DMONakU9MUecTXVHg290MknEaXlFRhrA&s"
                        alt="Success"
                        className="object-cover w-full h-full rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
