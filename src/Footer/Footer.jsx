
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../CustomCss/footer.css'

const Footer = () => {
    const playClickSound = () => {
        const clickSound = new Audio("/Put.mp3");
        clickSound.play();
    };

    return (
        <footer className="footer bg-gray-200 py-4">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
                <ul className="footer-links flex flex-wrap sm:flex-row sm:justify-center">
                    <li className="mb-4 sm:mb-0">
                        <NavLink
                            to="/data-protection"
                            onClick={playClickSound}
                            className={({ isActive }) =>
                                isActive ? "active-footer-link text-gray-900 block" : "text-gray-700 hover:text-gray-900 block"
                            }
                        >
                            Data Protection
                        </NavLink>
                    </li>
                    <li className="mb-4 sm:mb-0">
                        <NavLink
                            to="/testimony"
                            onClick={playClickSound}
                            className={({ isActive }) =>
                                isActive ? "active-footer-link text-gray-900 block" : "text-gray-700 hover:text-gray-900 block"
                            }
                        >
                            Testimony
                        </NavLink>
                    </li>
                    <li className="mb-4 sm:mb-0">
                        <NavLink
                            to="/pdf-form"
                            onClick={playClickSound}
                            className={({ isActive }) =>
                                isActive ? "active-footer-link text-gray-900 block" : "text-gray-700 hover:text-gray-900 block"
                            }
                        >
                            PDF Form
                        </NavLink>
                    </li>





                    <li className="mb-4 sm:mb-0">
                        <NavLink
                            to="coding-blogs"
                            onClick={playClickSound}
                            className={({ isActive }) =>
                                isActive ? "active-footer-link text-gray-900 block" : "text-gray-700 hover:text-gray-900 block"
                            }
                        >
                            Coding Blogs
                        </NavLink>
                    </li>
                    <li className="mb-4 sm:mb-0">
                        <NavLink
                            to="coding-community"
                            onClick={playClickSound}
                            className={({ isActive }) =>
                                isActive ? "active-footer-link text-gray-900 block" : "text-gray-700 hover:text-gray-900 block"
                            }
                        >
                            Coding Community
                        </NavLink>
                    </li>
                </ul>

                {/* Company Logo */}
                <Link to="/" className="text-2xl font-bold mb-4 md:mb-0 zoom horizontal-spin" onClick={playClickSound}>
                    <img
                        src="/CodeNowNavbarLogo.png"
                        alt="Logo"
                        className="navbar-logo"
                    />
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
