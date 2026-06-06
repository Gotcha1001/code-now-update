import React from 'react';

const DownloadPDFButton = () => {
    const pdfUrl = 'https://raw.githubusercontent.com/Gotcha1001/My-Images-for-sites-Wes/main/Website%20Client%20Form1.pdf';

    return (
        <div className="gradient-background2 p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold text-purple-700 mb-8 animate-bounce hover:bg-black rounded-lg p-3">
                Download the Website Requirements Form
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                <img
                    src="https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/codenow1.jpg?raw=true"
                    alt="Example 1"
                    className="w-32 h-32 object-cover rounded-full shadow-neon mx-auto"
                />
                <img
                    src="https://images.pexels.com/photos/97077/pexels-photo-97077.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Example 2"
                    className="w-32 h-32 object-cover rounded-full shadow-neon mx-auto"
                />
                <img
                    src="https://images.pexels.com/photos/5935788/pexels-photo-5935788.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Example 3"
                    className="w-32 h-32 object-cover rounded-full shadow-neon mx-auto"
                />
            </div>

            <a
                href={pdfUrl}
                download
                className="bg-purple-500 text-white py-3 px-4 rounded-full shadow-lg hover:bg-purple-700 transition duration-300 mb-6 block mx-auto max-w-xs"
            >
                Download PDF
            </a>

            <div className="text-lg text-gray-100 mt-6">
                Complete the form and send it to <a href="mailto:CodeNow101@gmail.com" className="text-purple-700 font-bold">CodeNow101@gmail.com</a>.
            </div>

            <div className="text-lg text-gray-100 mt-4">
                We'll get back to you and start building your requirements for your custom website.
            </div>
        </div>
    );
};

export default DownloadPDFButton;
