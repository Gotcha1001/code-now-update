import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase'; // Adjust the path if needed
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { motion } from "framer-motion";

export default function Certificates() {
    const [isAdmin, setIsAdmin] = useState(true); // Assuming admin is logged in
    const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        // Fetch the current video URL from Firestore
        const fetchVideoUrl = async () => {
            const docRef = doc(db, 'settings', 'certificates');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setVideoUrl(docSnap.data().url);
            } else {
                console.log('No such document!');
            }
        };

        fetchVideoUrl();
    }, []);

    const openBackgroundDialog = () => setShowBackgroundDialog(true);
    const closeBackgroundDialog = () => setShowBackgroundDialog(false);

    const changeBackgroundVideo = async () => {
        const docRef = doc(db, 'settings', 'certificates');
        await setDoc(docRef, { url: newVideoUrl });
        setVideoUrl(newVideoUrl);
        closeBackgroundDialog();
    };

    return (
        <div className="relative bg-black text-white min-h-screen flex flex-col items-center p-6">
            {videoUrl && (
                <video
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    src={videoUrl}
                ></video>
            )}
            <div className="relative z-10">
                <h1 className="text-4xl font-bold text-purple-400 mb-6 text-center zoom">My Programming Certificates</h1>

                <p className="text-lg mb-6 font-serif animate-bounce text-center">Udemy certificates:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 w-full max-w-6xl">

                    <motion.img
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        style={{
                            transformOrigin: "center",

                        }}
                        src="https://github.com/Gotcha1001/Images-2-Slimming/blob/main/React%20Cert.jpg?raw=true"
                        alt="Certificate 1"
                        className="rounded-lg border-4 border-purple-600 shadow-neon"
                    />
                    <motion.img
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        style={{
                            transformOrigin: "center",

                        }}
                        src="https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/CertificatesFullStack.jpg?raw=true"
                        alt="Certificate 1"
                        className="rounded-lg border-4 border-purple-600 shadow-neon"
                    />
                    <motion.img
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        style={{
                            transformOrigin: "center",

                        }}
                        src="https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/CertificatesC%23Fundamentals.jpg?raw=true"
                        alt="Certificate 2"
                        className="rounded-lg border-4 border-purple-600 shadow-neon"
                    />
                    <motion.img
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        style={{
                            transformOrigin: "center",

                        }}
                        src="https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/CertificatesC%23Intermediate.jpg?raw=true"
                        alt="Certificate 3"
                        className="rounded-lg border-4 border-purple-600 shadow-neon"
                    />
                    <motion.img
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        style={{
                            transformOrigin: "center",

                        }}
                        src="https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/CertificatesC%23Advanced.jpg?raw=true"
                        alt="Certificate 4"
                        className="rounded-lg border-4 border-purple-600 shadow-neon"
                    />
                    <motion.img
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        style={{
                            transformOrigin: "center",

                        }}
                        src="https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/CertificatesC%23DatingApp.jpg?raw=true"
                        alt="Certificate 5"
                        className="rounded-lg border-4 border-purple-600 shadow-neon"
                    />
                    <motion.img
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        style={{
                            transformOrigin: "center",

                        }}
                        src="https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/CertificatesC%23ECommerce.jpg?raw=true"
                        alt="Certificate 6"
                        className="rounded-lg border-4 border-purple-600 shadow-neon"
                    />
                </div>

                {isAdmin && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={openBackgroundDialog}
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                        >
                            Change Background Video
                        </button>
                    </div>
                )}

                {showBackgroundDialog && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg text-black shadow-lg max-w-md mx-auto">
                            <h2 className="text-lg font-semibold mb-4">Change Background Video</h2>
                            <input
                                type="text"
                                value={newVideoUrl}
                                onChange={(e) => setNewVideoUrl(e.target.value)}
                                placeholder="Enter new video URL"
                                className="w-full p-2 border rounded-lg mb-4"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={closeBackgroundDialog}
                                    className="bg-gray-300 py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={changeBackgroundVideo}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
