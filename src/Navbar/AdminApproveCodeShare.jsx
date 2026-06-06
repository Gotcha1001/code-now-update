import React, { useState, useEffect } from 'react';
import { db, Timestamp } from '../firebaseConfig/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Pagination from '../SpecialSetups/Pagination'; // Import Pagination component
import Spinner from '../SpecialSetups/Spinner'; // Import Spinner component

const AdminApproveCodeShare = () => {
    const [codeShares, setCodeShares] = useState([]);
    const [selectedShare, setSelectedShare] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sharesPerPage] = useState(5);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCodeShares = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'sharing-code'));
                const sharesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date.toDate(), // Convert Firestore Timestamp to Date
                }));
                sharesData.sort((a, b) => b.date - a.date); // Sort by date descending
                setCodeShares(sharesData);
            } catch (err) {
                console.error('Error fetching code shares:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCodeShares();
    }, []);

    const handleDeleteClick = async (shareId) => {
        try {
            // Delete document from Firestore
            await deleteDoc(doc(db, 'sharing-code', shareId));
            setCodeShares(codeShares.filter(share => share.id !== shareId));
        } catch (err) {
            console.error('Error deleting code share:', err);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        const { id, date, title, content, picUrl } = selectedShare;

        try {
            const shareRef = doc(db, 'sharing-code', id);
            await updateDoc(shareRef, {
                date: Timestamp.fromDate(new Date(date)), // Convert date string to Firestore Timestamp
                title,
                content,
                picUrl, // Include picUrl in the update
            });
            setIsDialogOpen(false);
            // Optionally refresh the list of code shares
            window.location.reload();
        } catch (err) {
            console.error('Error updating code share:', err);
        }
    };

    const handleApprove = async (shareId) => {
        try {
            const shareRef = doc(db, 'sharing-code', shareId);
            await updateDoc(shareRef, { isApproved: true });
            setCodeShares(codeShares.map(share => (share.id === shareId ? { ...share, isApproved: true } : share)));
        } catch (err) {
            console.error('Error approving code share:', err);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSelectedShare(prevShare => ({
            ...prevShare,
            [name]: value,
        }));
    };

    const handleUpdateClick = (share) => {
        setSelectedShare(share);
        setIsDialogOpen(true);
    };

    // Logic to get current code shares for the current page
    const indexOfLastShare = currentPage * sharesPerPage;
    const indexOfFirstShare = indexOfLastShare - sharesPerPage;
    const currentShares = codeShares.slice(indexOfFirstShare, indexOfLastShare);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(codeShares.length / sharesPerPage)));
    const prevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold my-8">Manage Code Shares</h1>
            <div className="code-shares-list w-full max-w-2xl mt-8 flex flex-col items-center">
                {currentShares.map(share => (
                    <div key={share.id} className="p-4 border mb-4 rounded bg-white shadow">
                        <h2 className="text-xl font-bold mb-2">{share.title}</h2>
                        <p className="mb-2"><strong>Content:</strong> {share.content}</p>
                        <p className="mb-2"><strong>Date:</strong> {share.date.toLocaleDateString('en-GB')}</p>
                        {share.picUrl && <img src={share.picUrl} alt="Code Related" className="mb-2 rounded-lg max-w-full h-auto" />}
                        <div className="flex">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={() => handleUpdateClick(share)}>Edit</button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={() => handleDeleteClick(share.id)}>Delete</button>
                            {!share.isApproved && (
                                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleApprove(share.id)}>Approve</button>
                            )}
                        </div>
                    </div>
                ))}
                <Pagination
                    sharesPerPage={sharesPerPage}
                    totalShares={codeShares.length}
                    paginate={paginate}
                    currentPage={currentPage}
                    nextPage={nextPage}
                    prevPage={prevPage}
                />
            </div>
            {isDialogOpen && selectedShare && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Edit Code Share</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label htmlFor="date" className="block text-gray-700 font-bold mb-2">Date:</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={selectedShare.date.toISOString().split('T')[0]} // Format to 'YYYY-MM-DD'
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title:</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={selectedShare.title}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content:</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={selectedShare.content}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="picUrl" className="block text-gray-700 font-bold mb-2">Picture URL:</label>
                                <input
                                    type="text"
                                    id="picUrl"
                                    name="picUrl"
                                    value={selectedShare.picUrl || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setIsDialogOpen(false)}>Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminApproveCodeShare;
