import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import Spinner from '../SpecialSetups/Spinner'; // Adjust the path if needed
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import DownloadPDFButton from '../Navbar/PDFForm'; // Adjust the path if needed

export default function ContactUs() {
    const [backgroundVideoUrl, setBackgroundVideoUrl] = useState('');
    const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchBackgroundVideoUrl = async () => {
            try {
                const docRef = doc(db, 'settings', 'contact-us');
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

        const checkAdmin = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user && user.email === 'admin@example.com') {
                    setIsAdmin(true);
                }
            } catch (err) {
                console.error('Error checking admin status:', err);
            }
        };

        fetchBackgroundVideoUrl();
        checkAdmin();
    }, []);

    const openBackgroundDialog = () => {
        setShowBackgroundDialog(true);
    };

    const closeBackgroundDialog = () => {
        setShowBackgroundDialog(false);
    };

    const changeBackgroundVideo = async () => {
        try {
            const docRef = doc(db, 'settings', 'contact-us');
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                // If the document does not exist, create it
                await setDoc(docRef, {
                    backgroundMediaUrl: newVideoUrl,
                    isBackgroundVideo: true
                });
            } else {
                // If the document exists, update it
                await updateDoc(docRef, {
                    backgroundMediaUrl: newVideoUrl,
                    isBackgroundVideo: true
                });
            }
            setBackgroundVideoUrl(newVideoUrl);
            setNewVideoUrl('');
            closeBackgroundDialog();
        } catch (err) {
            console.error('Error updating background video URL:', err);
        }
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
            <div className="relative z-10 w-full p-4">
                <h1 className="text-4xl font-bold text-white font-serif mb-8 text-center hover:bg-black rounded-md zoom">Contact Us</h1>
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 mb-8 justify-center items-center">
                    <div className="bg-purple-800 text-white p-6 rounded-lg gradient-background2 transition duration-300 shadow-sunset col-span-1 lg:col-span-1 max-w-md mx-auto">
                        <h2 className="text-2xl font-semibold mb-2 text-center zoom bg-black p-3 rounded-lg">Contact Information</h2>
                        <p className="text-xl mb-4">Email: <a href="mailto:WesleyOlivier443@gmail.com" className="text-blue-400 hover:underline">CodeNow101@gmail.com</a></p>
                        <p className="text-xl mb-4">Phone: <a href="tel:+2780077368" className="text-blue-400 hover:underline">+27 80077368</a></p>
                        <p className="text-xl mb-4">Address: 110 Manfred Drive, Park Hill, Durban North</p>
                    </div>

                    <div className="bg-purple-800 text-white p-6 rounded-lg shadow-sunset gradient-background2 transition duration-300 col-span-1 lg:col-span-1 max-w-md mx-auto">
                        <h2 className="text-2xl font-semibold mb-2 text-center zoom bg-black p-3 rounded-lg">Banking Details</h2>
                        <p className="text-xl mb-4">Bank: Standard Bank</p>
                        <p className="text-xl mb-4">Account Number: 251884783</p>
                        <p className="text-xl mb-4">Account Holder: MR WW OLIVIER</p>
                        <p className="text-xl mb-4">Branch Code: 051001</p>
                        <p className="text-xl mb-4">SWIFT Code: SBZAZAJJ</p>
                    </div>

                    <div className="bg-purple-800 text-white p-6 rounded-lg shadow-sunset hover:bg-purple-600 transition duration-300 col-span-1 lg:col-span-2 max-w-lg mx-auto">
                        <h2 className="text-2xl font-semibold  text-center zoom mb-3">Follow Us</h2>
                        <div className="flex justify-center space-x-4">
                            <a
                                href="https://www.facebook.com/profile.php?id=61563719426651"
                                className="text-blue-600 hover:text-blue-800 animate-bounce"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaFacebook size={40} />
                            </a>
                            <a
                                href="https://www.instagram.com/codenow101?igsh=MWsyMWs1ZGRwYzc2cg=="
                                className="text-pink-600 hover:text-pink-800 animate-bounce"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaInstagram size={40} />
                            </a>
                            <a
                                href="https://wa.me/27780077368"
                                className="text-green-500 hover:text-green-700 animate-bounce"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaWhatsapp size={40} />
                            </a>
                        </div>
                    </div>
                    <div className="col-span-1 lg:col-span-2 text-center max-w-lg mx-auto">
                        <DownloadPDFButton />
                    </div>

                </div>
                {isAdmin && (
                    <div className="flex justify-center mt-8">
                        <button
                            className="px-4 py-2 bg-indigo-800 text-white rounded-md hover:bg-green-600 transition duration-300"
                            onClick={openBackgroundDialog}
                        >
                            Change Background Video
                        </button>
                    </div>
                )}
            </div>

            {showBackgroundDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Change Background Video</h2>
                        <input
                            type="text"
                            placeholder="Enter video URL"
                            value={newVideoUrl}
                            onChange={(e) => setNewVideoUrl(e.target.value)}
                            className="border border-gray-300 p-2 rounded-md w-full mb-4"
                        />
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md mr-4 hover:bg-blue-600"
                            onClick={changeBackgroundVideo}
                        >
                            Change Video
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                            onClick={closeBackgroundDialog}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

}
