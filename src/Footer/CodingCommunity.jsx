import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase'; // Adjust the path if needed
import Spinner from '../SpecialSetups/Spinner'; // Adjust the path if needed
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function CodingCommunity() {
    const [backgroundVideoUrl, setBackgroundVideoUrl] = useState('');
    const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false); // State to check admin status

    useEffect(() => {

        // Initialize Firebase Auth
        const auth = getAuth();

        // Check if the user is authenticated and if their email matches the admin email
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAdmin(user.email === 'admin@example.com');
            } else {
                setIsAdmin(false);
            }
        });

        const fetchBackgroundVideoUrl = async () => {
            try {
                const docRef = doc(db, 'settings', 'coding-community'); // Updated to 'coding-community'
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

        fetchBackgroundVideoUrl();
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const openBackgroundDialog = () => {
        setShowBackgroundDialog(true);
    };

    const closeBackgroundDialog = () => {
        setShowBackgroundDialog(false);
    };

    const changeBackgroundVideo = async () => {
        try {
            const docRef = doc(db, 'settings', 'coding-community'); // Updated to 'coding-community'
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

    const communityLinks = [
        { title: 'Daily Dev Blog: General Programming Communities to Join', url: 'https://daily.dev/blog/general-programming-communities-to-join' },
        { title: 'Code Institute: What\'s the Coding Community Like?', url: 'https://codeinstitute.net/global/blog/whats-the-coding-community-like/' },
        { title: 'DEV Community', url: 'https://dev.to/' },
        { title: 'Boot Dev Blog: Best Coding Communities', url: 'https://blog.boot.dev/misc/best-coding-communities/' },
        { title: 'Arc Dev: Online Developer Communities', url: 'https://arc.dev/talent-blog/online-developer-communities/' },
        { title: 'Stack Overflow', url: 'https://stackoverflow.com/' },
        { title: 'FreeCodeCamp: Best Developer Communities to Be Part of in 2020', url: 'https://www.freecodecamp.org/news/best-developer-communities-to-be-part-of-in-2020/' },
        { title: 'Coding for Community', url: 'https://codingforcommunity.org/' },
        { title: 'Codedamn: Best Online Coding Communities to Join', url: 'https://codedamn.com/news/programming/best-online-coding-communities-to-join' },
        { title: 'Reddit: r/programming', url: 'https://www.reddit.com/r/programming/' },
    ];

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
                <h1 className="text-4xl font-bold text-white font-serif mb-8 text-center bg-black bg-opacity-50 p-8 rounded-md shadow-lg">
                    Coding Community
                </h1>
                <div className="flex justify-center mt-8">
                    {isAdmin && (
                        <button
                            className="px-4 py-2 bg-indigo-800 text-white rounded-md hover:bg-green-600 transition duration-300"
                            onClick={openBackgroundDialog}
                        >
                            Change Background Video
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                    {communityLinks.map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="block p-6 max-w-sm rounded-lg border border-black neon-emerald hover:bg-black transition duration-300 zoom">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{link.title}</h5>
                        </a>
                    ))}
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
