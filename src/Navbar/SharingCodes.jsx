import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase'; // Adjust the path if needed
import Spinner from '../SpecialSetups/Spinner'; // Adjust the path if needed
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../CustomCss/sharingcode.css';

export default function SharingCode() {
    const [backgroundVideoUrl, setBackgroundVideoUrl] = useState('');
    const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [codeShares, setCodeShares] = useState([]);
    const [sharesLoading, setSharesLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false); // New state for admin check
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [sharesPerPage] = useState(5); // Number of shares per page

    const auth = getAuth();

    useEffect(() => {
        const fetchBackgroundVideoUrl = async () => {
            try {
                const docRef = doc(db, 'settings', 'sharing-code');
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




        const fetchCodeShares = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'sharing-code'));
                const sharesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date.toDate(), // Convert Firestore Timestamp to Date
                }));
                console.log('Shares Data:', sharesData); // Debugging line
                setCodeShares(sharesData.filter(share => share.isApproved));
                console.log('Filtered Shares Data:', sharesData.filter(share => share.isApproved));
            } catch (err) {
                console.error('Error fetching code shares:', err);
            } finally {
                setSharesLoading(false);
            }
        };

        // Check if the current user is an admin
        const checkAdmin = (user) => {
            if (user && user.email === 'admin@example.com') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, checkAdmin);

        fetchBackgroundVideoUrl();
        fetchCodeShares();

        return () => unsubscribe(); // Clean up the listener on component unmount
    }, [auth]);

    useEffect(() => {
        console.log("Scrolling to top due to page change:", currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const openBackgroundDialog = () => {
        setShowBackgroundDialog(true);
    };

    const closeBackgroundDialog = () => {
        setShowBackgroundDialog(false);
    };

    const changeBackgroundVideo = async () => {
        try {
            const docRef = doc(db, 'settings', 'sharing-code');
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    backgroundMediaUrl: newVideoUrl,
                    isBackgroundVideo: true
                });
            } else {
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

    const incrementLikes = async (id, currentLikes) => {
        try {
            // Safeguard against undefined likes
            const updatedLikes = (currentLikes || 0) + 1;

            const docRef = doc(db, 'sharing-code', id);
            await updateDoc(docRef, {
                likes: updatedLikes
            });
            setCodeShares(prevShares => prevShares.map(share =>
                share.id === id ? { ...share, likes: updatedLikes } : share
            ));
        } catch (err) {
            console.error('Error updating likes:', err);
        }
    };

    // Pagination logic
    const indexOfLastShare = currentPage * sharesPerPage;
    const indexOfFirstShare = indexOfLastShare - sharesPerPage;
    const currentShares = codeShares.slice(indexOfFirstShare, indexOfLastShare);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(codeShares.length / sharesPerPage)));
    const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

    if (loading || sharesLoading) {
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
                <h1 className="text-4xl font-bold text-white font-serif mb-8 text-center rounded-md zoom">Sharing Code</h1>
                {isAdmin && ( // Conditionally render the button based on isAdmin state
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

            <div className="p-4 w-full max-w-3xl mx-auto mt-8 relative z-10">
                <ul>
                    {console.log('Rendering Shares:', currentShares)}
                    {currentShares.length ? (
                        currentShares.map(share => (
                            <li key={share.id} className="mb-4 p-4 gradient-background2 text-white rounded shadow">
                                <h3 className="text-xl font-bold mb-4">Title: {share.title || 'No Title'}</h3>
                                <p className='shadow-neon m-3 p-2 rounded-md pre-wrap'>{share.content || 'No Content'}</p>
                                <p className="text-sm mt-5 text-white">Posted by: {share.userName || 'Unknown'}</p>
                                {share.picUrl ? (
                                    <img src={share.picUrl} alt="Code Related" className="my-2 rounded max-w-full h-auto" />
                                ) : (
                                    <p>No Image</p>
                                )}
                                <div className="mt-2 flex items-center">
                                    <button
                                        className="px-3 py-1 bg-blue-500 shadow-sky zoom text-white rounded-md mr-2"
                                        onClick={() => incrementLikes(share.id, share.likes)}
                                    >
                                        Like
                                    </button>
                                    <p>{share.likes} Likes</p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-white">No code shares available.</p>
                    )}
                </ul>

                {/* Pagination controls */}
                <Pagination
                    sharesPerPage={sharesPerPage}
                    totalShares={codeShares.length}
                    paginate={paginate}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}

// Pagination component
const Pagination = ({ sharesPerPage, totalShares, paginate, nextPage, prevPage, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalShares / sharesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-center mt-8">
            <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-teal-600 ml-2 text-white rounded-md hover:bg-teal-700 transition duration-300 disabled:opacity-50"
            >
                Previous
            </button>
            {pageNumbers.length > 0 && (
                <button
                    className={`px-4 py-2 bg-white ml-2 rounded-md text-black ${pageNumbers.length === 1 ? 'opacity-50' : ''} rounded-t hover:bg-teal-600 transition duration-300`}
                    onClick={() => paginate(currentPage)}
                >
                    {currentPage}
                </button>
            )}
            <button
                onClick={nextPage}
                disabled={currentPage === pageNumbers.length}
                className="px-4 py-2 ml-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-300 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

