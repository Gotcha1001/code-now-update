import React, { useEffect } from 'react';
import emailjs from 'emailjs-com';

const PaymentNotify = () => {
    useEffect(() => {
        // Function to send the email
        const sendEmail = () => {
            const paymentDetails = JSON.parse(sessionStorage.getItem('paymentDetails'));

            if (paymentDetails) {
                const templateParams = {
                    firstname: 'Customer', // Replace with actual data
                    package_name: paymentDetails.packageName,
                    amount: paymentDetails.amount,
                    purchase_date: new Date().toLocaleDateString(),
                    order_id: 'ORDER12345', // Generate dynamically if needed
                    email: paymentDetails.email
                };

                emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                    templateParams,
                    import.meta.env.VITE_EMAILJS_USER_ID
                )
                    .then((response) => {
                        console.log('Email sent successfully!', response.status, response.text);
                    })
                    .catch((error) => {
                        console.error('Failed to send email. Error:', error);
                    });
            }
        };

        sendEmail();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black to-white">
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Payment Notification Received</h2>
                <p className="text-lg text-gray-700 text-center">Thank you for your payment. Your transaction was successful.</p>
            </div>
        </div>
    );
};

export default PaymentNotify;
