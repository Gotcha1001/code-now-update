import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import Spinner from '../SpecialSetups/Spinner';
import { getAuth } from 'firebase/auth';
import PaymentForm from '../payments/PayNowButton'; // Ensure this import is correct

export default function Pricing() {
    const [backgroundVideoUrl, setBackgroundVideoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showPayForm, setShowPayForm] = useState(false); // State to control payment form visibility
    const [selectedPackage, setSelectedPackage] = useState({ price: 0, packageName: '' }); // State for selected package

    useEffect(() => {
        const fetchBackgroundVideoUrl = async () => {
            try {
                const docRef = doc(db, 'settings', 'pricing');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.backgroundMediaUrl) {
                        setBackgroundVideoUrl(data.backgroundMediaUrl);
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching background video URL:', err);
                setLoading(false);
            }
        };

        const checkAdmin = () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user && user.email === 'admin@example.com') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        };

        fetchBackgroundVideoUrl();
        checkAdmin();
    }, []);

    const handlePayNowClick = (packageName, price) => {
        setSelectedPackage({ packageName, price });
        setShowPayForm(true); // Show the payment form
    };

    const handleClosePaymentForm = () => {
        setShowPayForm(false); // Hide the payment form
        setSelectedPackage({ price: 0, packageName: '' }); // Clear selected package
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="relative flex flex-col justify-center items-center min-h-screen p-4 overflow-hidden">
            {backgroundVideoUrl && (
                <video
                    src={backgroundVideoUrl}
                    autoPlay
                    loop
                    muted
                    className="absolute object-cover w-full h-full z-0"
                />
            )}
            <div className="relative z-10 w-full max-w-xl p-4">
                <h1 className="text-4xl font-bold text-white font-serif mb-8 text-center hover:bg-black p-3 rounded-md zoom shadow-neon">Pricing</h1>
                <div className="grid grid-cols-1 gap-6 mb-8">
                    {/* Package 1 */}
                    <div className="bg-purple-800 text-white p-6 rounded-lg shadow-neon gradient-background2 transition duration-300 text-center">
                        <h2 className="text-2xl font-semibold mb-2 bg-black rounded-md p-3">Package 1</h2>
                        <p className="text-xl font-bold">2 Pages</p>
                        <p className="text-xl mb-4">1000 Rand</p>
                        <p className="text-white">Perfect for small businesses needing a simple web presence.</p>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-700 transition duration-300"
                            onClick={() => handlePayNowClick('Package 1', 1000)}
                        >
                            {showPayForm && selectedPackage.packageName === 'Package 1' ? 'Cancel' : 'Pay Now'}
                        </button>
                    </div>

                    {/* Package 2 */}
                    <div className="bg-purple-800 text-white p-6 rounded-lg shadow-neon gradient-background2 transition duration-300 text-center">
                        <h2 className="text-2xl font-semibold mb-2 bg-black rounded-md p-3">Package 2</h2>
                        <p className="text-xl font-bold">5 Pages</p>
                        <p className="text-xl mb-4">3000 Rand</p>
                        <p className="text-white">Ideal for growing businesses requiring more content.</p>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-700 transition duration-300"
                            onClick={() => handlePayNowClick('Package 2', 3000)}
                        >
                            {showPayForm && selectedPackage.packageName === 'Package 2' ? 'Cancel' : 'Pay Now'}
                        </button>
                    </div>

                    {/* Package 3 */}
                    <div className="bg-purple-800 text-white p-6 rounded-lg shadow-neon gradient-background2 transition duration-300 text-center">
                        <h2 className="text-2xl font-semibold mb-2 bg-black rounded-md p-3">Package 3</h2>
                        <p className="text-xl font-bold">10 Pages</p>
                        <p className="text-xl mb-4">5000 Rand</p>
                        <p className="text-white">Comprehensive package for large-scale projects.</p>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-700 transition duration-300"
                            onClick={() => handlePayNowClick('Package 3', 5000)}
                        >
                            {showPayForm && selectedPackage.packageName === 'Package 3' ? 'Cancel' : 'Pay Now'}
                        </button>
                    </div>
                </div>

                {showPayForm && (
                    <PaymentForm
                        price={selectedPackage.price}
                        packageName={selectedPackage.packageName}
                        onCancel={handleClosePaymentForm} // Pass handleClosePaymentForm to PaymentForm
                    />
                )}
            </div>
        </div>
    );
}
