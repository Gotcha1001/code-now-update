import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    auth,
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signOut,
} from "../firebaseConfig/firebase";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { collection, addDoc } from "firebase/firestore"; // Add these imports
import { db } from "../firebaseConfig/firebase"; // Ensure you import your Firestore instance
import '../CustomCss/reCAPTCHA.css'; // Ensure your styles are imported

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false); // New state for checkbox
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();

        if (!firstName || !lastName || !gender || !dateOfBirth || !email || !password || !confirmPassword) {
            alert("Please enter all fields");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email address");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!termsAccepted) { // Check if terms are accepted
            alert("Please accept the terms and conditions");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`,
            });

            // Save user details to Firestore
            const userRef = collection(db, "users");
            await addDoc(userRef, {
                uid: user.uid,
                firstName,
                lastName,
            });



            // Add user to MailerLite
            await axios.post(
                'https://connect.mailerlite.com/api/subscribers',
                {
                    email: email,
                    fields: {
                        name: `${firstName} ${lastName}`,
                        gender: gender,
                        dateOfBirth: dateOfBirth,
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

            await sendEmailVerification(user);


            setFirstName("");
            setLastName("");
            setGender("");
            setDateOfBirth("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setTermsAccepted(false); // Reset checkbox state
            setErrorMessage("");

            alert("Registered successfully. Please verify your email.");

            // Sign out the user after registration
            await signOut(auth);

            // Redirect to login page after registration
            navigate("/login");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                alert("Email is already registered");
            } else {
                setErrorMessage("Error registering user: " + error.message);
            }
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleCheckboxChange = (e) => {
        setTermsAccepted(e.target.checked);
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-r from-black via-teal-500 to-purple-900">
            <div className="register-form w-full max-w-md rounded-lg bg-black p-8 text-center shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-white">Register</h2>
                {errorMessage && <p className="mb-4 text-sm text-red-500">{errorMessage}</p>}
                <form onSubmit={handleRegister} autoComplete="off">
                    <div className="mb-4 text-left">
                        <label htmlFor="first-name" className="mb-2 block text-sm font-medium text-white">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="first-name"
                            name="first-name"
                            className="w-full rounded-md border border-gray-300 p-2"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label htmlFor="last-name" className="mb-2 block text-sm font-medium text-white">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="last-name"
                            name="last-name"
                            className="w-full rounded-md border border-gray-300 p-2"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label htmlFor="gender" className="mb-2 block text-sm font-medium text-white">
                            Gender
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center text-white">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    className="mr-2"
                                    checked={gender === "male"}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                />
                                Male
                            </label>
                            <label className="flex items-center text-white">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    className="mr-2"
                                    checked={gender === "female"}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                />
                                Female
                            </label>
                            <label className="flex items-center text-white">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="other"
                                    className="mr-2"
                                    checked={gender === "other"}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                />
                                Other
                            </label>
                        </div>
                    </div>
                    <div className="mb-4 text-left">
                        <label htmlFor="date-of-birth" className="mb-2 block text-sm font-medium text-white">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            id="date-of-birth"
                            name="date-of-birth"
                            className="w-full rounded-md border border-gray-300 p-2"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
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
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-white">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="w-full rounded-md border border-gray-300 p-2"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-2 text-gray-400"
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4 text-left">
                        <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-white">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-password"
                                name="confirm-password"
                                className="w-full rounded-md border border-gray-300 p-2"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-2 text-gray-400"
                                onClick={toggleShowConfirmPassword}
                            >
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="flex items-center text-white">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={termsAccepted}
                                onChange={handleCheckboxChange}
                                required
                            />
                            I accept the <a href="/terms" className="text-blue-500 underline">terms and conditions</a>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-white">
                    Already have an account? <a href="/login" className="text-blue-500 underline">Login</a>
                </p>
            </div>
        </div>
    );
}


