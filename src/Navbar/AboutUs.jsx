import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { auth, db } from "../firebaseConfig/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import Spinner from "../SpecialSetups/Spinner";
import { motion } from "framer-motion";

const AboutUs = () => {
    const adminEmail = "admin@example.com";

    const [backgroundMediaUrl, setBackgroundMediaUrl] = useState("");
    const [mainImageUrl, setMainImageUrl] = useState("");
    const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
    const [showMainImageDialog, setShowMainImageDialog] = useState(false);
    const [newMediaUrl, setNewMediaUrl] = useState("");
    const [isBackgroundVideo, setIsBackgroundVideo] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user.email);
                setIsAdmin(user.email === adminEmail);
            } else {
                setCurrentUser(null);
                setIsAdmin(false);
            }
        });

        const fetchBackgroundMedia = async () => {
            try {
                const docRef = doc(collection(db, "settings"), "about-us");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setBackgroundMediaUrl(data.backgroundMediaUrl || "");
                    setIsBackgroundVideo(data.isBackgroundVideo || false);
                    setMainImageUrl(data.mainImageUrl || "");
                }
            } catch (error) {
                console.error("Error fetching background media:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBackgroundMedia();

        return unsubscribe;
    }, []);

    const handleBackgroundMediaSubmit = async () => {
        const isVideo = newMediaUrl.endsWith(".mp4");
        setBackgroundMediaUrl(newMediaUrl);
        setIsBackgroundVideo(isVideo);
        setShowBackgroundDialog(false);
        setNewMediaUrl("");

        const docRef = doc(collection(db, "settings"), "about-us");
        await setDoc(docRef, { backgroundMediaUrl: newMediaUrl, isBackgroundVideo: isVideo, mainImageUrl });
    };

    const handleMainImageUrlSubmit = async () => {
        setMainImageUrl(newMediaUrl);
        setShowMainImageDialog(false);
        setNewMediaUrl("");

        const docRef = doc(collection(db, "settings"), "about-us");
        await setDoc(docRef, { backgroundMediaUrl, isBackgroundVideo, mainImageUrl: newMediaUrl });
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div
            className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white"
            style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                filter: "brightness(70%)",
            }}
        >
            {isBackgroundVideo ? (
                <video
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    src={backgroundMediaUrl}
                    autoPlay
                    loop
                    muted
                />
            ) : (
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{ backgroundImage: `url(${backgroundMediaUrl})` }}
                />
            )}

            {isAdmin && (
                <div className=" flex items-center justify-center mb-10 z-50">
                    <div className="flex flex-col items-center space-y-2 bg-white p-4 rounded-lg shadow-lg">
                        <button
                            className="rounded bg-purple-600 px-4 py-2 text-white shadow-lg hover:bg-purple-700"
                            onClick={() => setShowBackgroundDialog(true)}
                        >
                            Change Background
                        </button>
                        <button
                            className="rounded bg-purple-600 px-4 py-2 text-white shadow-lg hover:bg-purple-700"
                            onClick={() => setShowMainImageDialog(true)}
                        >
                            Change Main Image
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-10 text-center gradient-text z-10">
                    About Us
                </h1>

                <div className="w-full max-w-lg mb-8 z-10 flex justify-center">
                    <motion.img
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        // style={{
                        //     transformOrigin: "center",

                        // }}
                        src={mainImageUrl}
                        alt="Main"
                        className="rounded-lg shadow-neon"
                        style={{ width: "400px", height: "300px", objectFit: "cover", transformOrigin: "center" }} // Fixed size
                    />
                </div>
            </div>




            <section className="bg-black py-6 md:py-8 z-10 rounded-xl mb-10 neon-purple">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
                        <p className="text-lg text-white">
                            Discover our journey from C# to JavaScript and Next.js, and learn how we can help elevate your small business online.
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 shadow-neon rounded-lg p-1 md:p-5">

                        <div className="md:w-1/2">
                            <div className="bg-black shadow-sky mt-3 mr-3 ml-3 rounded-lg p-6 mb-8">
                                <h2 className="text-3xl font-semibold text-white mb-4">Our Services</h2>
                                <p className="text-base text-white mb-4">
                                    We specialize in crafting custom-made websites for small businesses with responsive designs for all screen sizes. Our services include:
                                </p>
                                <ul className="list-disc pl-5 text-white mb-4">
                                    <li>Responsive designs that look great on any device</li>
                                    <li>Authentication and dynamic content</li>
                                    <li>Video moving backgrounds</li>
                                    <li>Functionality for users to change their homepage background or main image at will</li>
                                    <li>Logo creation</li>
                                    <li>Social media integration</li>
                                    <li>Email functionality</li>
                                    <li>Effective marketing strategies to boost online presence</li>
                                    <li>Excellent communication and accessibility to the business owner</li>
                                </ul>
                                <p className="text-base text-white">
                                    Let us help you make a lasting impression on the web and connect with your audience effectively.
                                </p>
                            </div>
                        </div>

                        <div className="md:w-1/2 ">
                            <div className="bg-black shadow-sky mt-3 ml-3 mr-3 rounded-lg p-12 mb-8 ">
                                <h2 className="text-3xl font-semibold text-white mb-4 ">Our Journey</h2>
                                <p className="text-base text-white mb-4">
                                    My programming journey began with C#, where I developed a strong foundation in object-oriented programming and desktop applications. As technology evolved, so did my skills, leading me to a comprehensive Full Stack Development course. This course expanded my expertise to modern web technologies, including Angular and React, enabling me to build dynamic and interactive web applications.
                                </p>
                                <p className="text-base text-white mb-4">
                                    Today, I work primarily with JavaScript and Next.js, creating efficient and scalable web solutions. My focus is on delivering high-quality websites for small businesses, helping them establish a strong online presence and achieve their marketing goals.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            <Carousel className="mb-8 w-full md:w-3/4 z-10">
                <Carousel.Item>
                    <img
                        className="d-block w-full rounded-lg"
                        src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Slide 1"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-full rounded-lg"
                        src="https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Slide 2"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-full rounded-lg"
                        src="https://images.pexels.com/photos/5935794/pexels-photo-5935794.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Slide 3"
                    />
                </Carousel.Item>
            </Carousel>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 z-10 ">
                <div className="h-64 overflow-hidden rounded-lg shadow-lg">
                    <motion.img
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        style={{
                            transformOrigin: "center",

                        }}
                        className="h-full w-full object-cover"
                        src="https://images.pexels.com/photos/8134609/pexels-photo-8134609.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Artwork 1"
                    />
                </div>
                <div className="h-64 overflow-hidden rounded-lg shadow-lg z-10">
                    <motion.img
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        style={{
                            transformOrigin: "center",

                        }}
                        className="h-full w-full object-cover"
                        src="https://images.pexels.com/photos/4816921/pexels-photo-4816921.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Artwork 2"
                    />
                </div>
                <div className="h-64 overflow-hidden rounded-lg shadow-lg z-10">
                    <motion.img
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        style={{
                            transformOrigin: "center",

                        }}
                        className="h-full w-full object-cover"
                        src="https://images.pexels.com/photos/5380659/pexels-photo-5380659.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Artwork 3"
                    />
                </div>
            </div>

            {showBackgroundDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold">Update Background Media</h2>
                        <input
                            type="text"
                            value={newMediaUrl}
                            onChange={(e) => setNewMediaUrl(e.target.value)}
                            placeholder="Enter image or video URL"
                            className="mb-4 w-full rounded border text-black border-gray-300 p-2"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowBackgroundDialog(false)}
                                className="mr-2 rounded bg-gray-300 px-4 py-2 text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBackgroundMediaSubmit}
                                className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMainImageDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold">Update Main Image</h2>
                        <input
                            type="text"
                            value={newMediaUrl}
                            onChange={(e) => setNewMediaUrl(e.target.value)}
                            placeholder="Enter image URL"
                            className="mb-4 w-full rounded border text-black border-gray-300 p-2"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowMainImageDialog(false)}
                                className="mr-2 rounded bg-gray-300 px-4 py-2 text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleMainImageUrlSubmit}
                                className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutUs;
