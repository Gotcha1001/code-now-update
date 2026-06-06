// src/components/WebsiteDesignForm.jsx
import React, { useState } from 'react';
import logo from '/codenow1.jpg'; // Import your logo image

const WebsiteDesignForm = () => {
    // State to manage page selection
    const [selectedPages, setSelectedPages] = useState([]);

    const handlePageChange = (event) => {
        const value = event.target.value;
        setSelectedPages(prev =>
            prev.includes(value) ? prev.filter(page => page !== value) : [...prev, value]
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-100 shadow-lg rounded-lg">
            <div className="flex items-center justify-center mb-8">
                <img src={logo} alt="Logo" className="h-24 w-auto" />
            </div>

            <h2 className="text-3xl font-bold text-purple-800 mb-6">Website Design Requirements Form</h2>

            <form
                id="websiteDesignForm"
                method="POST"
                action="https://formspree.io/f/your-form-id"
                className="space-y-6"
            >
                {/* Website Information Section */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-purple-700 mb-4">Website Information:</h3>

                    <div>
                        <label htmlFor="designStyle" className="block text-lg font-medium text-gray-800">Design Style:</label>
                        <textarea
                            id="designStyle"
                            name="designStyle"
                            rows="3"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                            required
                        ></textarea>
                    </div>

                    <div className="mt-4">
                        <label className="block text-lg font-medium text-gray-800">Images:</label>
                        <div className="flex items-center mt-2">
                            <input
                                type="radio"
                                id="imagesYes"
                                name="imagesProvided"
                                value="Yes"
                                className="mr-2"
                                required
                            />
                            <label htmlFor="imagesYes" className="mr-4">Yes, I have images.</label>

                            <input
                                type="radio"
                                id="imagesNo"
                                name="imagesProvided"
                                value="No"
                                className="mr-2"
                                required
                            />
                            <label htmlFor="imagesNo">No, I need you to source images.</label>
                        </div>
                        <textarea
                            id="imagesDetails"
                            name="imagesDetails"
                            rows="3"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                            placeholder="If yes, please provide details."
                        ></textarea>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="navBar" className="block text-lg font-medium text-gray-800">Navigation Bar:</label>
                        <textarea
                            id="navBar"
                            name="navBar"
                            rows="3"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                            required
                        ></textarea>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="footer" className="block text-lg font-medium text-gray-800">Footer:</label>
                        <textarea
                            id="footer"
                            name="footer"
                            rows="3"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                            required
                        ></textarea>
                    </div>
                </section>

                {/* Website Structure Section */}
                <section className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h3 className="text-2xl font-semibold text-purple-700 mb-4">Website Structure:</h3>

                    <div>
                        <label className="block text-lg font-medium text-gray-800">Pages:</label>
                        <div className="flex flex-wrap gap-4 mt-2">
                            {["Home", "About Us", "Services", "Products", "Portfolio", "Blog", "Contact Us", "Pricing", "Other"].map((page) => (
                                <label key={page} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={page}
                                        checked={selectedPages.includes(page)}
                                        onChange={handlePageChange}
                                        className="form-checkbox"
                                    />
                                    <span className="text-gray-700">{page}</span>
                                    {page === "Other" && <input type="text" placeholder="Specify other pages" className="ml-2 border-gray-300 rounded-md shadow-sm" />}
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h3 className="text-2xl font-semibold text-purple-700 mb-4">Content:</h3>

                    <div>
                        <label htmlFor="homePage" className="block text-lg font-medium text-gray-800">Home Page:</label>
                        <textarea
                            id="homePage"
                            name="homePage"
                            rows="3"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                            required
                        ></textarea>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="otherPages" className="block text-lg font-medium text-gray-800">Other Pages:</label>
                        <textarea
                            id="otherPages"
                            name="otherPages"
                            rows="3"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                            required
                        ></textarea>
                    </div>
                </section>

                {/* Functionality Section */}
                <section className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h3 className="text-2xl font-semibold text-purple-700 mb-4">Functionality:</h3>

                    <div className="flex items-center mt-2">
                        <input
                            type="radio"
                            id="authYes"
                            name="authFunctionality"
                            value="Yes"
                            className="mr-2"
                            required
                        />
                        <label htmlFor="authYes" className="mr-4">Yes, I need user login and registration functionality.</label>

                        <input
                            type="radio"
                            id="authNo"
                            name="authFunctionality"
                            value="No"
                            className="mr-2"
                            required
                        />
                        <label htmlFor="authNo">No, I do not need user login functionality.</label>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="emailForm" className="block text-lg font-medium text-gray-800">User Email Form:</label>
                        <div className="flex items-center mt-2">
                            <input
                                type="radio"
                                id="emailFormYes"
                                name="emailForm"
                                value="Yes"
                                className="mr-2"
                                required
                            />
                            <label htmlFor="emailFormYes" className="mr-4">Yes, I need a user email form on contacts.</label>

                            <input
                                type="radio"
                                id="emailFormNo"
                                name="emailForm"
                                value="No"
                                className="mr-2"
                                required
                            />
                            <label htmlFor="emailFormNo">No, I do not need a user email form.</label>
                        </div>
                    </div>
                </section>

                {/* Attachments Section */}
                <section className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h3 className="text-2xl font-semibold text-purple-700 mb-4">Attachments:</h3>
                    <p className="text-gray-800 mb-2">Please attach any relevant documents, images, or files that would help in the website design process. Create a file on a memory stick that I can work with.</p>
                    <input
                        type="file"
                        id="attachments"
                        name="attachments"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        multiple
                    />
                </section>

                {/* Client Signature Section */}
                <section className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h3 className="text-2xl font-semibold text-purple-700 mb-4">Client Signature:</h3>

                    <div>
                        <label htmlFor="clientName" className="block text-lg font-medium text-gray-800">Name:</label>
                        <input
                            type="text"
                            id="clientName"
                            name="clientName"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="clientDate" className="block text-lg font-medium text-gray-800">Date:</label>
                        <input
                            type="date"
                            id="clientDate"
                            name="clientDate"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                            required
                        />
                    </div>
                </section>

                <div className="mt-8">
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WebsiteDesignForm;
