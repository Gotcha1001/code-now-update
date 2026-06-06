import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import VideoEmbed from '../SpecialSetups/VideoEmbeded';
import Spinner from '../SpecialSetups/Spinner';
import Pagination from '../SpecialSetups/Pagination';
import { getAuth } from 'firebase/auth';

const VideoDisplay = () => {
    const [videos, setVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [videosPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [backgroundVideoUrl, setBackgroundVideoUrl] = useState('');
    const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'videos'));
                const videoList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    let date;
                    if (data.date && data.date.toDate) {
                        date = data.date.toDate();
                    } else if (data.date) {
                        date = new Date(data.date * 1000);
                    }
                    return {
                        id: doc.id,
                        ...data,
                        date
                    };
                });

                videoList.sort((a, b) => b.date - a.date);

                setVideos(videoList);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching videos:', err);
                setError('Failed to load videos.');
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email);
        }
    }, []);

    useEffect(() => {
        const fetchBackgroundVideoUrl = async () => {
            try {
                const docRef = doc(db, 'settings', 'coding-videos');
                const docSnap = await getDoc(docRef); // Use getDoc to fetch the document
                if (docSnap.exists()) {
                    setBackgroundVideoUrl(docSnap.data().backgroundMediaUrl);
                }
            } catch (err) {
                console.error('Error fetching background video URL:', err);
            }
        };

        fetchBackgroundVideoUrl();
    }, []);

    const incrementLikes = async (videoId, currentLikes) => {
        try {
            const videoRef = doc(db, 'videos', videoId);
            const updatedLikes = Number(currentLikes) + 1;
            await updateDoc(videoRef, {
                likes: updatedLikes
            });
            setVideos(videos.map(video =>
                video.id === videoId ? { ...video, likes: updatedLikes } : video
            ));
        } catch (err) {
            console.error('Error incrementing likes:', err);
        }
    };

    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        setCurrentPage((prevPage) => {
            const next = Math.min(prevPage + 1, Math.ceil(videos.length / videosPerPage));
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
            return next;
        });
    };
    const prevPage = () => {
        setCurrentPage((prevPage) => {
            const prev = Math.max(prevPage - 1, 1);
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
            return prev;
        });
    };

    const openBackgroundDialog = () => {
        setShowBackgroundDialog(true);
    };

    const closeBackgroundDialog = () => {
        setShowBackgroundDialog(false);
    };

    const changeBackgroundVideo = async () => {
        try {
            const docRef = doc(db, 'settings', 'coding-videos');
            await updateDoc(docRef, {
                backgroundMediaUrl: newVideoUrl
            });
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

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="relative flex flex-col justify-center items-center min-h-screen p-4 overflow-hidden">
            {backgroundVideoUrl && (
                <video
                    src={backgroundVideoUrl}
                    autoPlay
                    loop
                    muted
                    className="absolute  object-cover w-full h-full z-0"
                />
            )}
            <div className="relative z-10 w-full">
                <h1 className="text-4xl font-bold text-white font-serif mb-8 text-center hover:bg-black rounded-md zoom">Coding Tips and Videos</h1>
                {userEmail === 'admin@example.com' ? (
                    <div className="flex justify-center mb-4">
                        <button
                            className="px-4 py-2 bg-indigo-800 text-white rounded-md hover:bg-green-600 transition duration-300"
                            onClick={openBackgroundDialog}
                        >
                            Change Background
                        </button>
                    </div>
                ) : (
                    <p className="text-white text-center mb-4">Learn to code step by step</p>
                )}

                {currentVideos.map((video) => (
                    <div
                        key={video.id}
                        className="card-content mb-8 gradient- p-4 rounded-lg mx-auto w-full lg:w-2/3 bg-black mt-4 shadow-teal"
                    >
                        <h2 className="text-2xl font-bold text-white">{video.title}</h2>
                        <p className="text-lg text-gray-300 mb-1">Posted By: {video.postedBy}</p>
                        <p className="text-lg text-gray-300 mb-1">Date: {formatDate(video.date)}</p>
                        <div className="w-full max-w-full overflow-hidden rounded-lg mx-auto">
                            <VideoEmbed videoUrl={video.videoUrl} />
                        </div>
                        <p className="text-gray-300 mt-4 mb-3">Content: {video.content}</p>
                        <div className="flex items-center">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                                onClick={() => incrementLikes(video.id, video.likes)}
                            >
                                Likes {video.likes}
                            </button>
                        </div>
                    </div>
                ))}
                <Pagination
                    postsPerPage={videosPerPage}
                    totalPosts={videos.length}
                    currentPage={currentPage}
                    nextPage={nextPage}
                    prevPage={prevPage}
                />
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
};

// Helper function to format date as "day, month, year"
const formatDate = (date) => {
    if (!date) return ''; // Handle case where date is null or undefined
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date instanceof Date ? date.toLocaleDateString(undefined, options) : ''; // Format Date object
};

export default VideoDisplay;
