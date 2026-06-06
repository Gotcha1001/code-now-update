import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase'; // Adjust the path if needed
import Spinner from '../SpecialSetups/Spinner'; // Adjust the path if needed
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function CodingBlogs() {
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
                const docRef = doc(db, 'settings', 'coding-blogs'); // Updated to 'coding-blogs'
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
            const docRef = doc(db, 'settings', 'coding-blogs'); // Updated to 'coding-blogs'
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

    const blogLinks = [
        { url: "https://blog.codingblocks.com/", name: "Coding Blocks Blog" },
        { url: "https://dev.to/stealc/top-programming-blogs-to-read-in-2024-3hf2", name: "Top Programming Blogs 2024" },
        { url: "https://blog.bit.ai/programming-blogs-and-websites/", name: "Bit.ai Programming Blogs" },
        { url: "https://feedly.com/i/top/programming-blogs", name: "Feedly Top Programming Blogs" },
        { url: "https://medium.com/the-pandadoc-tech-blog/blogs-every-developer-should-read-in-2022-19d5eda9e566", name: "Pandadoc Tech Blog" },
        { url: "https://coding.blog/", name: "Coding.blog" },
        { url: "https://codeblog.jonskeet.uk/", name: "Jon Skeet's Coding Blog" },
        { url: "https://coder.com/blog", name: "Coder Blog" },
        { url: "https://bloggingidol.com/best-programming-blogs/", name: "Best Programming Blogs" },
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
                <h1 className="text-4xl font-bold text-white font-serif mb-8 text-center hover:bg-black rounded-md zoom">Coding Blogs</h1>
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
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-11">
                    {blogLinks.map((blog, index) => (
                        <div key={index} className="block p-6 max-w-sm rounded-lg border border-black neon-emerald hover:bg-black transition duration-300 zoom">
                            <a href={blog.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-white hover:underline">
                                {blog.name}
                            </a>
                        </div>
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