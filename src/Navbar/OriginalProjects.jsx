import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import Spinner from '../SpecialSetups/Spinner'; // Adjust the path if needed
import '../CustomCss/portfolio.css'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { motion } from "framer-motion";
import MotionWrapperDelay from '../Components/MotionWrapperDelay';

import FeatureMotionWrapper from "../Components/FeatureMotionWrapper"
import originalProjects from '../lib/originalProjects';


export default function OriginalProjects() {
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

        // Fetch the background video URL
        const fetchBackgroundVideoUrl = async () => {
            try {
                const docRef = doc(db, 'settings', 'portfolio');
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

        // Play audio when the component mounts
        // const audioUrl = 'https://raw.githubusercontent.com/Gotcha1001/Audio-For-Websites/main/Stairway%20to%20Heaven.wav';
        // const audio = new Audio(audioUrl);


        // audio.loop = true;

        // audio.play();


        // return () => {
        //     audio.pause();
        //     audio.currentTime = 0;
        //     unsubscribe(); 
        // };
    }, []);


    const openBackgroundDialog = () => {
        setShowBackgroundDialog(true);
    };

    const closeBackgroundDialog = () => {
        setShowBackgroundDialog(false);
    };

    const changeBackgroundVideo = async () => {
        try {
            const docRef = doc(db, 'settings', 'portfolio');
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
            <div className="relative z-10 w-full">
                <MotionWrapperDelay
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    variants={{
                        hidden: { opacity: 0, x: -100 },
                        visible: { opacity: 1, x: 0 },
                    }}
                >
                    <h1 className="text-4xl font-bold text-white font-serif mb-8 text-center hover:bg-black rounded-md zoom shadow-neon p-4">My Portfolio</h1></MotionWrapperDelay>
                <p className="text-white text-center mb-8">These are my projects and apps I have built. Click on the projects to view their beauty and functionality:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">



                    {originalProjects.map((project, index) => (
                        <FeatureMotionWrapper key={index} index={index}>
                            <a
                                href={project.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300"
                            >
                                <h2 className="text-xl font-semibold text-center">{`Project ${index + 1}`}</h2>
                                <p className="mt-2 shadow-teal rounded-lg p-1 text-center">{project.shortDescription}</p>
                                <p className="mt-2 text-center">{project.longDescription}</p>
                                <div className="mb-8 flex justify-center items-center mt-5">
                                    <motion.img
                                        whileHover={{ scale: 1.2 }}
                                        transition={{ type: "spring", stiffness: 500 }}
                                        style={{
                                            transformOrigin: "center",
                                            height: "200px", width: "200px"
                                        }}
                                        src={project.imageUrl}
                                        alt={project.alt}
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                            </a>
                        </FeatureMotionWrapper>
                    ))}

                </div>
                <div className='flex justify-center mt-8'>
                    {isAdmin && (
                        <button
                            className="px-4 py-2 bg-indigo-800 text-white rounded-md hover:bg-green-600 transition duration-300"
                            onClick={openBackgroundDialog}
                        >
                            Change Background Video
                        </button>
                    )}</div>

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
