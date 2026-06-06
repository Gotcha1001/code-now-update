import React from 'react';

export default function DataProtectionPolicy() {
    return (
        <div className="relative min-h-screen p-8 overflow-hidden">
            {/* Background Video */}
            <video
                src="https://cdn.pixabay.com/video/2023/08/19/176837-856056463_large.mp4"
                title="Background Video"
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                style={{ zIndex: -1 }} // Ensure it is behind the content
            ></video>

            {/* Content */}
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-neon" style={{ zIndex: 1 }}>
                <div className="p-6">
                    <h1 className="mb-4 text-4xl font-bold text-center zoom ">DATA PROTECTION POLICY</h1>
                    <p className="mb-4 text-center">
                        <strong>July 2024</strong>
                    </p>

                    {[
                        {
                            id: 1,
                            title: "Introduction",
                            content: "Wesley Olivier, trading as CodeNow, is dedicated to safeguarding the personal data of our users. This policy outlines our commitment to data protection, ensuring compliance with the Protection of Personal Information Act (POPIA) and other applicable legislation."
                        },
                        {
                            id: 2,
                            title: "Purpose of Data Processing",
                            content: (
                                <ul className="list-inside list-disc">
                                    <li>Enabling communication and interaction among our users.</li>
                                    <li>Facilitating the sharing of messages, photos, and profiles among users.</li>
                                    <li>Providing personalized customer support and services.</li>
                                    <li>Improving our platform’s functionality and user experience.</li>
                                    <li>Ensuring compliance with legal obligations and responding effectively to inquiries and complaints.</li>
                                </ul>
                            )
                        },
                        {
                            id: 3,
                            title: "Legal Basis for Processing",
                            content: "All processing of personal data is conducted on a lawful basis under POPIA, with explicit consent obtained from users for specific processing activities, including the sharing of personal messages, photos, and other content."
                        },
                        {
                            id: 4,
                            title: "Data Protection Principles",
                            content: (
                                <ul className="list-inside list-disc">
                                    <li>Lawfulness, Fairness, and Transparency: Data is processed with user consent and in a transparent manner.</li>
                                    <li>Purpose Limitation: Personal data is collected for specified, explicit, and legitimate purposes related to supporting our users.</li>
                                    <li>Data Minimization: We collect only the minimum amount of personal data necessary for our purposes.</li>
                                    <li>Accuracy: Users are encouraged to keep their information accurate and up to date.</li>
                                    <li>Storage Limitation: Personal data is kept only for as long as necessary for the purposes for which it was collected.</li>
                                    <li>Integrity and Confidentiality: We implement appropriate technical and organizational measures to ensure the security and confidentiality of personal data.</li>
                                </ul>
                            )
                        },
                        {
                            id: 5,
                            title: "Roles and Responsibilities",
                            content: "Data Controller: Wesley Olivier is responsible for overseeing compliance with this policy and applicable data protection laws. Data Processor: All employees and contractors processing personal data on behalf of CodeNow must comply with this policy and relevant data protection laws."
                        },
                        {
                            id: 6,
                            title: "Data Subjects' Rights",
                            content: "Users have the right to access, rectify, and erase their personal data, as well as to restrict or object to its processing. Requests related to these rights should be directed to our Information Officer."
                        },
                        {
                            id: 7,
                            title: "Cybersecurity and Data Breach Management",
                            content: "We maintain robust cybersecurity measures to protect against unauthorized access, alteration, disclosure, or destruction of personal data. Procedures are in place to detect, investigate, and respond to data breaches promptly."
                        },
                        {
                            id: 8,
                            title: "Website, Cookies, and Marketing",
                            content: "Our website collects personal information in compliance with data protection laws, ensuring transparency in data processing practices. Users are informed about the use of cookies and have the option to manage cookie preferences."
                        },
                        {
                            id: 9,
                            title: "Policy Review and Updates",
                            content: "This policy is reviewed regularly to ensure ongoing compliance with data protection laws and best practices. Updates are communicated to employees and users as necessary."
                        },
                        {
                            id: 10,
                            title: "Contact Information",
                            content: "For questions regarding this policy or to exercise your data protection rights, please contact our Information Officer at <a href='mailto:info@codenow.com' className='text-blue-500 hover:text-blue-700'>CodeNow101@gmail.com</a>"
                        }
                    ].map(({ id, title, content }) => (
                        <div key={id} className="mb-4 rounded-lg bg-gray-100 p-4 transition-transform transform hover:-translate-y-2 hover:bg-black hover:text-white">
                            <h2 className="mb-2 text-2xl font-bold">{`${id}. ${title}`}</h2>
                            <div className="text-gray-800">
                                {typeof content === 'string' ? content : content}
                            </div>
                        </div>
                    ))}

                    <div className="mt-8 text-center">
                        <p className="text-lg font-bold mb-10">Signature</p>
                        <img src="/CodeSignature.jpg" alt="Signature" className="mx-auto mt-2 animate-bounce" />
                    </div>
                </div>
            </div>
        </div>
    );
}
