
// Login.jsx
import React, { useEffect, useState } from "react";
import {
    auth,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
} from "../firebaseConfig/firebase";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'; // Import Axios

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                navigate("/");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Bypass email verification for admin@example.com
            if (email !== "admin@example.com" && !user.emailVerified) {
                await signOut(auth);
                alert("Please verify your email before trying to log in.");
                return;
            }

            // Redirect to home page after successful login
            navigate("/");
        } catch (error) {
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                alert("Incorrect email or password. Please try again or register.");
            } else {
                alert("Error logging in user: Please check your password");
            }
        }
    };

    const googleProvider = new GoogleAuthProvider();
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            console.log("Google Sign-In successful:", user);

            // Send user email to MailerLite
            const response = await axios.post(
                'https://connect.mailerlite.com/api/subscribers',
                {
                    email: user.email,
                    fields: {
                        name: user.displayName,
                    },
                    groups: ["128641737161704712"], // Group ID as a string
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZmMxNTA4ZjYyNjg2NTYwZGVkODBlOGIxZjYxMzY1NTc5ZWQ3NTJmMDYyYjI4NzA5NzlhNDVkMzY3MTNiZGM1Nzc2OWZjNzdmMDhjZjE2ZTIiLCJpYXQiOjE3MjI5NjU4MTguMjg2ODA2LCJuYmYiOjE3MjI5NjU4MTguMjg2ODA3LCJleHAiOjQ4Nzg2Mzk0MTguMjg0MzY0LCJzdWIiOiIxMDU4MDM5Iiwic2NvcGVzIjpbXX0.C7f3Ees3buuF7Kz348u_psytcUspR2nUoAkj1E2Lnw5OoSs-YFvn0sPtzhIty13s8wKZ7uAxP4CjgYWvDlxyfIL-UZg91bdJykkSi8q2B0DAqMPHKfa5oy4ACQZbTTTxQUfAvgrqWwF-02ORpGeFrG8-rSNzKiK7ItkYbbxZpjawj9XjwXWkk6so1tFD-0AlaaQyekKRNYk9DEerx9EzdGv0w6ckn2IjYc5DcnP9DXZDKRm9LA0VwVJNNFMjV3Jr-n236I7z2GJ7Yc6kLzot_Vg_QahnSYkAvslt7iTeh6GBJBaRtRLhb5HOVeM3sQIR-KfELew5_Qs8PtmAWFmJFYnF5aCVXMyELQTtmANyI5E_cOElmw7rcYJIiyaxUxCIXewsUCCmvsI2a07P4t_saqK7uYD1Cv0b_nsQeI9Qllt_-bDjzSbZKNACcL4tivIh_daaURZ2bucXnCeObePwDfEkjyv-_i_VAyc-194njCTEdJfhp4tFP2ktr4sOeznk8KtNEYj3mZ0naGtdF2yq6tZaisVccDz7W1TL-wD4mPsGF_hE6v4ZXwCSJX_p5BWlVyTNJzy1Vv4xSv-wdDMsmVTwt0-P9iSECNUgLqkHRdU2oqOi1wAlryH26pFsYhvmJHaTtxgtUZJlEcibLaE5On11DQwZ1HIX0GK0XJW9A5U'
                    }
                }
            );

            console.log("MailerLite response:", response);

            navigate("/");
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setEmail(""); // Clear email field
            setPassword(""); // Clear password field
            setErrorMessage(""); // Clear error message
            setUser(null); // Reset user state
            navigate("/"); // Redirect to home page after logout
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // Clear form fields when the user state changes
        setEmail("");
        setPassword("");
    }, [user]);

    // Function to capitalize each word in the user's name
    const capitalizeName = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-r from-black via-red-500 to-yellow-600">
            {user ? (
                <div className="text-center">
                    <h2 className="mb-4 text-xl font-bold text-white">
                        Welcome, {user.displayName ? capitalizeName(user.displayName) : user.email}
                    </h2>
                    <button
                        className="rounded-sm bg-teal-500 px-6 py-3 text-lg text-teal-100 hover:bg-teal-700"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="login-form w-full max-w-md rounded-lg bg-black p-8 text-center shadow-lg">
                    <h2 className="mb-6 text-2xl font-bold text-white">Login</h2>
                    {errorMessage && (
                        <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
                    )}
                    <form onSubmit={handleLogin} autoComplete="off">
                        <div className="mb-4 text-left">
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-white"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full rounded-md border border-gray-300 p-2"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4 text-left">
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-white"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full rounded-md border border-gray-300 p-2"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full cursor-pointer rounded-md bg-gray-800 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-gray-900"
                        >
                            Login
                        </button>
                    </form>
                    <div className="mt-4">
                        <button
                            className="cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-teal-700"
                            onClick={signInWithGoogle}
                        >
                            Login with Google
                        </button>
                    </div>
                    <div className="mt-4">
                        <Link
                            to="/reset-password"
                            className="text-sm text-teal-500 transition duration-300 ease-in-out hover:text-yellow-500"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;

