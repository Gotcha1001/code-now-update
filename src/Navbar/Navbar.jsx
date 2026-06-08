import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import '../CustomCss/navbar.css'

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
    const adminDropdownRef = useRef(null);
    const clickSoundRef = useRef(null);
    const navigate = useNavigate();
    const adminEmail = "admin@example.com";

    //added state for userName and surname to fetch
    const [userDetails, setUserDetails] = useState(null);


    //drop down menu code share state
    const [isCodeShareDropdownOpen, setIsCodeShareDropdownOpen] = useState(false);
    const codeShareDropdownRef = useRef(null);


    useEffect(() => {
        clickSoundRef.current = new Audio("/Put.mp3");

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                if (currentUser.providerData[0].providerId === 'google.com') {
                    setUserDetails({
                        firstName: currentUser.displayName,
                        lastName: ''
                    });
                } else {
                    try {
                        const usersRef = collection(db, 'users');
                        const q = query(usersRef, where('uid', '==', currentUser.uid));
                        const querySnapshot = await getDocs(q);
                        if (!querySnapshot.empty) {
                            const userDoc = querySnapshot.docs[0].data();
                            setUserDetails(userDoc);
                        } else {
                            console.log("No such document!");
                            setUserDetails(null);
                        }
                    } catch (error) {
                        console.error("Error fetching user details:", error);
                        setUserDetails(null);
                    }
                }
            } else {
                setUser(null);
                setUserDetails(null);
            }
        });

        return () => unsubscribe();
    }, []);


    const playClickSound = () => {
        clickSoundRef.current.play();
    };

    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/"); // Redirect to the home page after logout
        } catch (error) {
            console.error(error);
        }
    };

    const toggleAdminDropdown = () => {
        setIsAdminDropdownOpen(!isAdminDropdownOpen);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
                setIsAdminDropdownOpen(false);
            }
            if (codeShareDropdownRef.current && !codeShareDropdownRef.current.contains(event.target)) {
                setIsCodeShareDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleCodeShareDropdown = () => { setIsCodeShareDropdownOpen(!isCodeShareDropdownOpen); };

    const handleLinkClick = () => {
        playClickSound();
        setIsMenuOpen(false);
    };


    return (
        <nav className="navbar bg-gray-800 text-white py-4">
            <div className="container mx-auto flex flex-col md:flex-row md:justify-between items-center">
                {/* Logo Container */}
                <div className="flex items-center justify-center w-full md:w-auto">
                    <Link to="/" className="text-2xl font-bold zoom horizontal-spin mx-auto" onClick={playClickSound}>
                        <img
                            src="/CodeNowNavbarLogo.png"
                            alt="Logo"
                            className="navbar-logo"
                        />
                    </Link>
                </div>

                {/* Burger Menu Button */}
                <button
                    className="block md:hidden"
                    onClick={toggleMenu}
                >
                    <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                {/* Menu Items */}
                <div
                    className={`flex-col md:flex md:flex-row md:items-center md:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} md:block`}
                >
                    <ul className="navbar-links flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                        <li className="md:mr-4 my-2 md:my-0 p-2 rounded-lg">
                            <NavLink to="original-projects" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                Original Projects
                            </NavLink>
                        </li>
                        {/* Replace the Portfolio link */}
                        <li className="md:mr-4 my-2 md:my-0 p-2 rounded-lg">
                            <NavLink to="tutorials" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                Tutorials
                            </NavLink>
                        </li>

                        {/* Add the new Original Projects link */}

                        <li className="md:mr-4 my-2 md:my-0  p-2  rounded-lg">
                            <NavLink to="about-us" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                About us
                            </NavLink>
                        </li>
                        <li className="md:mr-4 my-2 md:my-0  p-2  rounded-lg">
                            <NavLink to="cv" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                CV
                            </NavLink>
                        </li>
                        <li className="md:mr-4 my-2 md:my-0">
                            <NavLink to="contact-us" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                Contact Us
                            </NavLink>
                        </li>
                        {/* <li className="md:mr-4 my-2 md:my-0">
                            <NavLink to="pdf-form" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                PDF Form
                            </NavLink>
                        </li> */}
                        <li className="md:mr-4 my-2 md:my-0 shadow-blue p-2  rounded-lg">
                            <NavLink to="pricing" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                Pricing
                            </NavLink>
                        </li>
                        <li className="md:mr-4 my-2 md:my-0 shadow-blue p-2  rounded-lg">
                            <NavLink to="modern-coding" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                Modern Coding
                            </NavLink>
                        </li>
                        <li className="md:mr-4 my-2 md:my-0 shadow-blue p-2  rounded-lg">
                            <NavLink to="code-tips" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                Coding Tips
                            </NavLink>
                        </li>

                        {/* <li className="md:mr-4 my-2 md:my-0">
                                    <NavLink to="website-design-form" onClick={playClickSound} className={({ isActive }) =>
                                        isActive ? "active-link" : ""
                                    }>
                                        Website Form
                                    </NavLink>
                                </li> */}

                        {/* <li className="md:mr-4 my-2 md:my-0">
                            <NavLink to="about-us" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                About Us
                            </NavLink>
                        </li> */}
                        {/* <li className="md:mr-4 my-2 md:my-0">
                            <NavLink to="cv" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                CV
                            </NavLink>
                        </li> */}
                        {/* <li className="md:mr-4 my-2 md:my-0">
                            <NavLink to="testimony" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                Testimony
                            </NavLink>
                        </li> */}
                        <li className="md:mr-4 my-2 md:my-0">
                            <NavLink to="coding-videos" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                Coding Videos
                            </NavLink>
                        </li>
                        <div className="relative navbar-element" ref={codeShareDropdownRef}>
                            <button onClick={toggleCodeShareDropdown} className="bg-black rounded-md p-1 hover:text-blue-500 ">
                                Code Sharing
                            </button>
                            {isCodeShareDropdownOpen && (
                                <ul className="absolute bg-gray-800 text-white rounded mt-2 shadow-lg" >
                                    <li>
                                        <NavLink
                                            to="sharing-code"
                                            className={({ isActive }) =>
                                                isActive ? "active-link text-white block px-4 py-2" : "text-white block px-4 py-2"
                                            }
                                            onClick={handleLinkClick}
                                        >
                                            Sharing Code
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="submit-code-share"
                                            className={({ isActive }) =>
                                                isActive ? "active-link text-white block px-4 py-2" : "text-white block px-4 py-2"
                                            }
                                            onClick={handleLinkClick}
                                        >
                                            Submit Code Sharing
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </div>


                        {/* <li className="md:mr-4 my-2 md:my-0">
                            <NavLink to="code-tips" onClick={handleLinkClick} className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }>
                                Code Tips
                            </NavLink>
                        </li> */}
                        {user ? (
                            <>
                                {user.email === adminEmail && (
                                    <div className="relative navbar-element" ref={adminDropdownRef}>
                                        <button onClick={toggleAdminDropdown} className="bg-black rounded-md p-1 hover:text-blue-500">
                                            Admin Actions
                                        </button>
                                        {isAdminDropdownOpen && (
                                            <ul className="absolute bg-gray-800 text-white rounded mt-2 shadow-lg" >
                                                <li>
                                                    <NavLink
                                                        to="video-upload"
                                                        className={({ isActive }) =>
                                                            isActive ? "active-link text-white block px-4 py-2" : "text-white block px-4 py-2"
                                                        }
                                                        onClick={handleLinkClick}
                                                    >
                                                        Video Upload
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="video-alter"
                                                        className={({ isActive }) =>
                                                            isActive ? "active-link text-white block px-4 py-2" : "text-white block px-4 py-2"
                                                        }
                                                        onClick={handleLinkClick}
                                                    >
                                                        Video Alter
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="admin-approve-codeshare"
                                                        className={({ isActive }) =>
                                                            isActive ? "active-link text-white block px-4 py-2" : "text-white block px-4 py-2"
                                                        }
                                                        onClick={handleLinkClick}
                                                    >
                                                        Approve Code Share
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                )}




                                {userDetails && (
                                    <li className="mb-0 ">
                                        {userDetails.firstName ? (
                                            <span className="welcome-message text-teal-500 font-bold animate-pulse  rounded-full p-1">
                                                Welcome {userDetails.firstName} {userDetails.lastName}
                                            </span>
                                        ) : (
                                            <span className="welcome-message text-teal-500  rounded-full p-2">
                                                Welcome {user.email}
                                            </span>
                                        )}
                                    </li>
                                )}


                                <li className="md:mr-4 my-2 md:my-0 shadow-sky p-2 rounded-md">
                                    <button onClick={logout} className="text-white hover:text-blue-500">
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="md:mr-4 my-2 md:my-0">
                                    <NavLink
                                        to="register"
                                        onClick={handleLinkClick}
                                        className="text-now font-bold hover:text-blue-500"
                                        activeClassName="active-link"
                                    >
                                        Register
                                    </NavLink>
                                </li>
                                <li className="md:mr-4 my-2 md:my-0">
                                    <NavLink
                                        to="login"
                                        onClick={handleLinkClick}
                                        className="text-now font-bold hover:text-blue-500"
                                        activeClassName="active-link"
                                    >
                                        Login
                                    </NavLink>
                                </li>

                            </>
                        )}
                    </ul>

                </div>
                {/* Social Icons */}
                <div className="flex flex-col md:flex-row md:justify-between items-center">
                    {/* Other content */}

                    {/* Social Icons */}
                    <div className="flex flex-wrap justify-center md:justify-end space-x-2 mt-4 md:mt-0">
                        <a
                            href="https://www.facebook.com/profile.php?id=61563719426651"
                            className="text-blue-600 hover:text-blue-800 animate-bounce"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaFacebook size={40} />
                        </a>
                        <a
                            href="https://www.instagram.com/codenow101?igsh=MWsyMWs1ZGRwYzc2cg=="
                            className="text-pink-600 hover:text-pink-800 animate-bounce"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaInstagram size={40} />
                        </a>
                        <a
                            href="https://wa.me/27780077368"
                            className="text-green-500 hover:text-green-700 animate-bounce"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaWhatsapp size={40} />
                        </a>
                    </div>
                </div>



            </div>

        </nav>
    );

};

export default Navbar;