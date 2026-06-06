import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import { getAuth } from 'firebase/auth';
import Spinner from '../SpecialSetups/Spinner'; // Adjust the path if needed

export default function Testimony() {
    const [backgroundVideoUrl, setBackgroundVideoUrl] = useState('');
    const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchBackgroundVideoUrl = async () => {
            try {
                const docRef = doc(db, 'settings', 'testimony'); // Updated to 'testimony'
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

        const checkAdminStatus = async () => {
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
        checkAdminStatus();
    }, []);

    const openBackgroundDialog = () => {
        setShowBackgroundDialog(true);
    };

    const closeBackgroundDialog = () => {
        setShowBackgroundDialog(false);
    };

    const changeBackgroundVideo = async () => {
        try {
            const docRef = doc(db, 'settings', 'testimony'); // Updated to 'testimony'
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
                <h1 className="text-4xl font-bold text-white font-serif mb-8 text-center p-4 hover:bg-black rounded-md zoom shadow-teal">Testimony</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-black text-white p-6 rounded-lg max-w-md mx-auto flex-1 shadow-neon">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">Where I Started</h2>
                        <p>
                            I started my career, after 5 years of Stuyding Jazz and Popular music at Howard Campus KZN, I got my Honors Degree and started my carreer as a music teacher in a primary school, where I worked for 15 years. I loved teaching music to children and watching them grow, but I always felt a pull towards technology.
                        </p>
                    </div>

                    <div className="bg-black text-white p-6 rounded-lg  max-w-md mx-auto flex-1 shadow-neon">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">Changing Careers Due to COVID-19</h2>
                        <p>
                            Due to the COVID-19 pandemic, I decided to explore programming as a hobby. I began with C++ and quickly found a new passion. The ability to create something from nothing with code fascinated me.
                        </p>
                    </div>

                    <div className="bg-black text-white p-6 rounded-lg shadow-neon max-w-md mx-auto flex-1">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">Taking the Jump to Full-Time Study</h2>
                        <p>
                            I took the leap and enrolled in a bootcamp to study programming full-time. I started with C# and Angular, then moved to a Full Stack Development course. The journey was tough but incredibly rewarding.
                        </p>
                    </div>

                    <div className="bg-black text-white p-6 rounded-lg shadow-neon max-w-md mx-auto flex-1">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">Transitioning to JavaScript and React</h2>
                        <p>
                            After completing the bootcamp, I transitioned to JavaScript and React. Each day, I faced new challenges and learned something new, but my passion for coding kept me motivated.
                        </p>
                    </div>

                    <div className="bg-black text-white p-6 rounded-lg shadow-neon max-w-md mx-auto flex-1">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">Freelancing and Helping Small Businesses</h2>
                        <p>
                            Now, I am freelancing and creating websites for small businesses. I love helping them promote their products and services online. The journey has been rough but fruitful, and I am still learning every day.
                        </p>
                    </div>
                    <div className="bg-black text-white p-6 rounded-lg shadow-neon max-w-md mx-auto flex-1">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">The Road Ahead is Great</h2>
                        <p>
                            I have so much more to learn, and learning shall always be a part of my future. Each new day is a gift to learn something new, and there are countless possibilities. The life of a programmer is a never-ending, evolving journey of embracing all the new technologies, methods, and ways of coding. I am dedicated to this beautiful new career.
                        </p>
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
