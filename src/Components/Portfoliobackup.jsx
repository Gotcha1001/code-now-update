import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import Spinner from '../SpecialSetups/Spinner'; // Adjust the path if needed
import '../CustomCss/portfolio.css'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { motion } from "framer-motion";
import MotionWrapperDelay from '../Components/MotionWrapperDelay';


export default function Portfolio() {
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



                    <a href="https://reflect-private-journal.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 1</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Digital Journal App</p>
                        <p className="mt-2 text-center">Using Next JS 15 and Clerk Authentication, and SHADCN for components, Filtering, Rich Text Editor, with Collections for your Categories, then you can add your entries, add Video Urls, Images, Utilizing a API to generate images based on your mood you select, with amazing slide in animations using Framer Motion</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    height: "200px", width: "200px"
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/777.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />

                        </div>
                    </a>
                    <a href="https://workflow-jira-clone.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 2</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Jira Clone WorkFlow App</p>
                        <p className="mt-2 text-center">Using Next JS 15 and Clerk Authentication, and SHADCN for components, Filtering, Creating Projects and Sprints and setting start and end dates of the task, and priority settings, with admin rights to only alter them , with amazing animations and functionality</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    height: "200px", width: "200px"
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/tomatoes2.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />

                        </div>
                    </a>
                    <a href="https://gig-restaurant.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 3</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Gigify a App where bands can upload their profile and a seperate profile option for Restaurants or Gig Providers to upload their profiles , and the idea is for Gig Providers to scout out bands for gigs and for bands to get amazing profiles they can setup to be found to get those juicy gigs...</p>
                        <p className="mt-2 text-center">Using Next JS 15 and Clerk Authentication, and SHADCN for components, Ability for both parties to view the available bands and available Gig Providers to send their profiles to see their abilities and performances</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    height: "200px", width: "200px"
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/tomatoe1.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />

                        </div>
                    </a>

                    <a href="https://social-media-art.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 4</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Social Cloud App</p>
                        <p className="mt-2 text-center">Using Next JS 15 and Clerk Authentication, and SHADCN for components, A mini version of Facebook, with the ability to create posts, other users can comment like, Search for Users, Add Stories, cool animations and Rad UI annimations, Using Server Actions and the latest coding technology</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    height: "200px", width: "200px"
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/444.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />

                        </div>
                    </a>

                    <a href="https://finance-track-wine.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 5</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Finance Tracker</p>
                        <p className="mt-2 text-center">Using Next JS 15 and Clerk Authentication, and SHADCN for components, this one is a masterpiece of mathematical equations and has such a functionality that everybody can use in their daily lives, to save money and keep track of all their expenses and also print out their expenses at any time for reference</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    height: "200px", width: "200px"
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/tes.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />

                        </div>
                    </a>
                    <a href="https://sonny-ecommerce.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 6</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Ecommerce Site SHOPNOW</p>
                        <p className="mt-2 text-center">Using Next JS 15 and Clerk Authentication, and STRIPE, coupons, and amazing search functionality and for the owner of the website , an amazing new technology called STUDIO , to add products, alter the whole website so easily and live as well...... AMAZING SANITY for the backend that makes it fun and so easy </p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    height: "200px", width: "200px"
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/ecommerce%20sony.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />

                        </div>
                    </a>
                    <a href="https://instagram-fun-mauve.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 7</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Instagram Clone with a twist</p>
                        <p className="mt-2 text-center">Instagram fun... </p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    height: "200px", width: "200px"
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/444.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />

                        </div>
                    </a>
                    <a href="https://multistore-dawid-map.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 8</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Multistore Ad App</p>
                        <p className="mt-2 text-center">Login and Create any ad you wish wish a location of your product, where the users can search products under their area through Google Maps, Post ads, edit, delete with beautiful filtering in price, location and categories</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    height: "200px", width: "200px"
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/er2.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />

                        </div>
                    </a>
                    <a href="https://video-subtitles.onrender.com/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 9</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Video Captions App</p>
                        <p className="mt-2 text-center">Upload a video and apply captions to the speech and alter the colors and font size and download it for your usage</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    height: "200px", width: "200px"
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/ffffffrrrrr.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />

                        </div>
                    </a>
                    <a href="https://tastyfood-ordering-app-frontend.onrender.com/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 10</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Muti Retaurant App</p>
                        <p className="mt-2 text-center">Authentication with Auth0, Create a Restaurant, add Products, and Delivery Fees, and Stripe Payment</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    height: "200px", width: "200px"
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/gggggggggg.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />

                        </div>
                    </a>
                    <a href="https://exercise-one.pages.dev/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 11</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Exercise  App</p>
                        <p className="mt-2 text-center">Very simple application with mainly UI functionality but utilizing Framer Motion with all its annimations beuatifully</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    height: "200px", width: "200px"
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/11111.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />

                        </div>
                    </a>

                    <a href="https://car-demo-rbo1.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 12</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Rent A Car Demo Project</p>
                        <p className="mt-2 text-center">A nice Demo Project to view various Cars, consuming a API with multiple search functionlity and details of each car in the Modal POPUPS......</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/13.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>


                    <a href="https://ecommerce-4-nextjs-front1.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 13</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Ecommerce Website Supreme</p>
                        <p className="mt-2 text-center">My greatest Website so far,  With online payments with Stripe, Authentication,  Add to cart functionality, Awesome animations, Subtotals, Search functionality, Categories, A whole new App for the Owner of the Website, ADMIN , To alter products, categories, upload images, See the Stats of their daily, monthly , weekly sales, and more.... add other Admin users , Delete ... etc...</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/Images-2-Slimming/blob/main/e1.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>


                    <a href="https://food-ordering-pizza-six.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 14</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Pizza Ordering Website</p>
                        <p className="mt-2 text-center">A legit Website with online payments with STRIPE, Admin functionality to add categories and menu items , with extra sizes and toppings, viewing your orders, Profile for both admin and normal users.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/POP2.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>

                    <a href="https://cakes-order.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 15</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Cakes Ordering Website</p>
                        <p className="mt-2 text-center">A legit Website with online payments with STRIPE, Most tasty Cakes ordered and delivered to your door, with custom orders.... Admin functionality to add categories and menu items , with extra sizes and toppings, viewing your orders, Profile for both admin and normal users.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/POP1.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>


                    <a href="https://client-flax-nine.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 16</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Ecommerce Website</p>
                        <p className="mt-2 text-center">A legit Website with online payments with Payfast, emails sent as Receipts of any purchases, add to cart functionality, subtotals, search functionality, categories, upload new products, alter them , delete them, its amazing and very neat, perfect for small business.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/Images-2-Slimming/blob/main/111.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>

                    <a href="https://slimming-products-code.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 17</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Slimming Product Website</p>
                        <p className="mt-2 text-center">A website selling Slimming products and Cancer Mediation, with amazing References and descriptions with online ordering and amazing online presence, and communication with the ability to make Online Purchases .</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/Images-2-Slimming/blob/main/101.jpg?raw=true'
                                alt="WesleyTech Shop"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>



                    <a href="https://cancer-friends.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 18</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Cancer Friends</p>
                        <p className="mt-2 text-center">A social media platform for cancer patients to communicate and support each other.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/PorfolioCancerFriends1.jpg?raw=true'
                                alt="Cancer Friends"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>





                    <a href="https://josh-art-site.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 19</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Art business for a friend I made.</p>
                        <p className="mt-2 text-center">Helping small businesses get recognized with a professional platform.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/PorfolioStoneArt2.jpg?raw=true'
                                alt="Art Business"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>

                    <a href="https://piano-app-lessons-business.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 20</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Piano Lessons and Tutorials Site.</p>
                        <p className="mt-2 text-center">Helping people learn the Piano with online teach yourself, tutorials, Just beginning.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/111.jpg?raw=true'
                                alt="Art Business"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>

                    <a href="https://laughter-now.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 21</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Site I made for a friend who specializes in Laughter Coaching.</p>
                        <p className="mt-2 text-center">Helping small businesses get recognized with a professional platform.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/code1Laugh.jpg?raw=true'
                                alt="Art Business"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>

                    <a href="https://suncat-app.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 22</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Site I made for a friend who owns and runs a Warehouse that previously never had any online Marketing.</p>
                        <p className="mt-2 text-center">Helping small businesses get recognized with a professional platform.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/cWarehouse.jpg?raw=true'
                                alt="Art Business"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>


                    <a href="https://secret-blogpost.web.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 23</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Secret Diary I made for fun.</p>
                        <p className="mt-2 text-center">Document your life in a user-friendly manner without anyone finding your personal diary.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/PorfolioSecretDiary3.jpg?raw=true'
                                alt="Secret Diary"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>


                    <a href="https://recipe-app-acd06.web.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 24</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Store your recipes for traveling.</p>
                        <p className="mt-2 text-center">A fun way to store your secret recipes or share them with the world, great for traveling.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/PorfolioYourRecipe4.jpg?raw=true'
                                alt="Recipe App"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>


                    <a href="https://church-vite-app-new-firebase-file.vercel.app/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 25</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Website I made for my church, full first proper FULL STACK WEBSITE.</p>
                        <p className="mt-2 text-center">A full-stack app for my dad's church to display daily scripture posts and videos, and allows users to contact the minister or church with ease.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/PorfolioChurchApp5.jpg?raw=true'
                                alt="Church App"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>

                    <a href="https://gotcha1001.github.io/Zordiac/index.html" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 26</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Website I made for a daily random reading with over a 1000 quotes.</p>
                        <p className="mt-2 text-center">One of my earliest projects I made with plain simple HTML and some JavaScript code in the early days, But I like it.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/PorfolioZordiacApp6.jpg?raw=true'
                                alt="Zordiac App"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>


                    <a href="https://gotcha1001.github.io/Random-Scripture/index.html" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 27</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Website I made for a daily random scripture from the Bible and selected random scripture of a topic of choice.</p>
                        <p className="mt-2 text-center">One of my earliest projects I made with plain simple HTML and some JavaScript code in the early days, But I like it as well.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/PorfolioDailyVerse7.jpg?raw=true'
                                alt="Daily Scripture"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>


                    <a href="https://gotcha1001.github.io/PianoNoClick/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 28</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">Website I made as a game for piano music lovers in the early days.</p>
                        <p className="mt-2 text-center">One of my earliest projects I made with plain simple HTML and some JavaScript code in the early days, But I like it as well.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/PorfolioPianoGameApp8.jpg?raw=true'
                                alt="Piano Game"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>


                    <a href="https://gotcha1001.github.io/RiddleAPIHTML/ " target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 28</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">One of my early projects consuming a API with Daily Riddles.</p>
                        <p className="mt-2 text-center">A fun little app that displays daily riddles for the whole family to contemplate on.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/PorfolioDailyRiddle9.jpg?raw=true'
                                alt="Portfolio"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>


                    <a href="https://gotcha1001.github.io/sex2/index.html" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 30</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">One the early simple HTML Javascraipt projects, Sex App.</p>
                        <p className="mt-2 text-center">A App that is build to boost well being as a human and improve your sex life.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/PorfolioSexApp10.jpg?raw=true '
                                alt="JavaScript Form"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>





                    <a href="https://gotcha1001.github.io/Foodapp/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 31</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">A random Food App that calculates what you should cook for the comming week .</p>
                        <p className="mt-2 text-center">A fun App that I designed long ago , also a good example of perseverence, as this is such a novice App.</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/PorfolioWhatToCook12.jpg?raw=true'
                                alt="Interactive Map"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>
                    <a href="https://gotcha1001.github.io/CvResponsive/" target="_blank" rel="noopener noreferrer" className="block p-6 gradient-background2 text-white rounded-lg shadow-neon opacity-90 hover:opacity-100 hover:bg-purple-600 transition duration-300">
                        <h2 className="text-xl font-semibold text-center">Project 32</h2>
                        <p className="mt-2 shadow-teal rounded-lg p-1 text-center">A total begginer project with my CV and responsiveness</p>
                        <p className="mt-2 text-center">I am proud that this was my CV created long ago and how far I have come with design</p>
                        <div className="mb-8 flex justify-center items-center mt-5">
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    transformOrigin: "center",
                                    width: "200px",
                                    height: "200px",
                                }}
                                src='https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/PorfolioCV11.jpg?raw=true'
                                alt="Interactive Map"
                                className="object-cover rounded-lg"

                            />
                        </div>
                    </a>
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
