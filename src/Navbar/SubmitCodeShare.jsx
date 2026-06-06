import React, { useState, useEffect } from 'react';
import { db, auth, Timestamp } from '../firebaseConfig/firebase'; // Import Timestamp
import { addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SubmitCodeShare = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [picUrl, setPicUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserName(user.displayName || user.email);
            } else {
                setUserName('');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const date = Timestamp.now();

            // Add code share to Firestore
            await addDoc(collection(db, 'sharing-code'), {
                userName,
                title,
                content,
                picUrl,
                date,
                approved: false,
                isApproved: false,
            });

            setTitle('');
            setContent('');
            setPicUrl('');
            setError(null);

            alert('Code shared successfully. It will be displayed once approved!');
            navigate('/');
        } catch (err) {
            console.error('Error adding code share:', err);
            setError('Failed to add code share.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="form-container p-6 bg-white shadow-md rounded-lg max-w-2xl mx-auto mt-10 mb-4 gradient-background">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800">Submit Code Share</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <div>
                        <label className="block text-gray-700 mb-2">Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Content:</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            placeholder="Enter your code here..."
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-none"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Picture URL (optional):</label>
                        <input
                            type="text"
                            value={picUrl}
                            onChange={(e) => setPicUrl(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="py-2 px-5 bg-red-500 text-white rounded mr-4 hover:bg-red-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2 px-5 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitCodeShare;
