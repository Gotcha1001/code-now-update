import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase'; // Adjust the path if needed
import { auth } from '../firebaseConfig/firebase'; // Adjust the path if needed, and ensure you have Firebase Auth initialized
import Spinner from '../SpecialSetups/Spinner'; // Adjust the path if needed

export default function CodingTips() {
    const [backgroundVideoUrl, setBackgroundVideoUrl] = useState('');
    const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchBackgroundVideoUrl = async () => {
            try {
                const docRef = doc(db, 'settings', 'coding-tips'); // Updated to 'coding-tips'
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

        const fetchUserEmail = () => {
            const user = auth.currentUser;
            if (user) {
                setUserEmail(user.email);
            }
        };

        fetchBackgroundVideoUrl();
        fetchUserEmail();
    }, []);

    const openBackgroundDialog = () => {
        setShowBackgroundDialog(true);
    };

    const closeBackgroundDialog = () => {
        setShowBackgroundDialog(false);
    };

    const changeBackgroundVideo = async () => {
        try {
            const docRef = doc(db, 'settings', 'coding-tips'); // Updated to 'coding-tips'
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
                <h1 className="text-4xl font-bold text-white font-serif mb-8 text-center hover:bg-black rounded-md zoom">
                    Coding Tips
                </h1>

                {/* Tips on Coding */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg sunset-gradient-background shadow-sunset">
                        <h2 className="text-xl font-semibold mb-4">Master the Basics</h2>
                        <p className="text-gray-700">
                            Focus on mastering fundamental concepts such as data structures, algorithms, and basic programming principles.
                            Understanding these core concepts is crucial for writing efficient and effective code.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sunset sunset-gradient-background">
                        <h2 className="text-xl font-semibold mb-4">Expand Your Knowledge</h2>
                        <p className="text-gray-700">
                            Explore different programming languages and technologies. Read about best practices and study coding standards.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sunset sunset-gradient-background">
                        <h2 className="text-xl font-semibold mb-4">Work on Projects</h2>
                        <p className="text-gray-700">
                            Apply your skills to real-world projects and contribute to open-source. This helps you understand how to tackle real-world problems.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sunset sunset-gradient-background">
                        <h2 className="text-xl font-semibold mb-4">Refine Your Problem-Solving Skills</h2>
                        <p className="text-gray-700">
                            Engage in problem-solving activities and review your solutions to improve your analytical thinking and problem-solving abilities.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sunset sunset-gradient-background">
                        <h2 className="text-xl font-semibold mb-4">Learn from Others</h2>
                        <p className="text-gray-700">
                            Study code written by experienced developers, seek feedback, and learn from their practices and techniques.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sunset sunset-gradient-background">
                        <h2 className="text-xl font-semibold mb-4">Stay Updated with Technology</h2>
                        <p className="text-gray-700">
                            Follow industry trends, experiment with new tools, and stay current with the latest technologies and frameworks.
                        </p>
                    </div>
                </div>

                <div className="flex justify-center">
                    {userEmail === 'admin@example.com' && (
                        <button
                            className="px-4 py-2 bg-indigo-800 text-white rounded-md hover:bg-green-600 transition duration-300 mt-8"
                            onClick={openBackgroundDialog}
                        >
                            Change Background Video
                        </button>
                    )}
                </div>
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
                            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                            onClick={closeBackgroundDialog}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
