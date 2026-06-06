import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase'; // Adjust the path if needed
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';

export default function ProfileCard() {
    const [backgroundVideoUrl, setBackgroundVideoUrl] = useState('');
    const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAdmin(user.email === 'admin@example.com');
            } else {
                setIsAdmin(false);
            }
        });

        const fetchBackgroundVideoUrl = async () => {
            try {
                const docRef = doc(db, 'settings', 'cv');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.backgroundMediaUrl) {
                        setBackgroundVideoUrl(data.backgroundMediaUrl);
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching background video URL:', err);
                setLoading(false);
            }
        };

        fetchBackgroundVideoUrl();
        return () => unsubscribe();
    }, []);

    const openBackgroundDialog = () => {
        setShowBackgroundDialog(true);
    };

    const closeBackgroundDialog = () => {
        setShowBackgroundDialog(false);
    };

    const changeBackgroundVideo = async () => {
        try {
            const docRef = doc(db, 'settings', 'cv');
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    backgroundMediaUrl: newVideoUrl,
                    isBackgroundVideo: true
                });
            } else {
                await updateDoc(docRef, {
                    backgroundMediaUrl: newVideoUrl,
                    isBackgroundVideo: true
                });
            }
            setBackgroundVideoUrl(newVideoUrl);
            setNewVideoUrl('');
            closeBackgroundDialog();
        } catch (err) {
            console.error('Error updating background video URL:', err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative flex flex-col justify-center items-center min-h-screen p-4 overflow-hidden">
            {backgroundVideoUrl && (
                <video
                    src={backgroundVideoUrl}
                    autoPlay
                    loop
                    muted
                    className="absolute object-cover w-full h-full z-0"
                />
            )}
            <div className="relative z-10 bg-black text-white max-w-4xl mt-3 mx-auto p-6 rounded-lg shadow-sky mb-3">
                <div className="flex justify-center mb-6">
                    <img
                        src="/Cv.jpg"
                        alt="Profile Picture"
                        width={150}
                        height={150}
                        className="rounded-full shadow-neon zoom"
                    />
                </div>

                <ProfileCardSection title="Personal Details">

                    <div className='mt-8 text-center animate-bounce mb-10 '>
                        <Link
                            to='/certificates'
                            className='bg-purple-600 text-white text-center p-3 rounded-lg  '
                        >
                            View My Certificates
                        </Link>
                    </div>
                    <ul className="space-y-2 bg-gray-900 p-4 rounded-lg shadow-md mb-8 hover:bg-black transition duration-300 ">
                        <li><strong>NAME:</strong> Wesley Wayne Olivier</li>
                        <li><strong>ADDRESS:</strong> 110 Manfred Drive, ParkHills, Durban North, 4051</li>
                        <li><strong>CELL. NO.:</strong> 078-0077368 (alternative 083 4487334)</li>
                        <li><strong>DATE OF BIRTH:</strong> 22 January 1982</li>
                        <li><strong>MARITAL STATUS:</strong> Single</li>
                        <li><strong>ID NUMBER:</strong> 820122 5120 084</li>
                    </ul>
                </ProfileCardSection>

                <ProfileCardSection title="Qualifications">
                    <div className="space-y-4   ">
                        <QualificationCard
                            year="1999"
                            institution="SOUTH PENINSULA COLLEGE"
                            qualification="National Intermediate Certificate"
                        />
                        <QualificationCard
                            year="2000"
                            institution="SOUTH PENINSULA COLLEGE"
                            qualification="National Senior Certificate"
                            details="Subjects: English 1st Language, Afrikaans 2nd Language, Office Practice, Information Processing, Computer Practice, Small Business Management"
                        />
                        <QualificationCard
                            year="2004 – 2007"
                            institution="UKZN (University of Kwa-Zulu Natal) Howard Campus"
                            qualification="Diploma in Jazz and Popular music"
                            details="Subjects: Rhythm, Aural Perception, Ensemble, Improvisation, Harmony, Arranging, First Practical Study (Piano), English, Keyboard tech"
                        />
                        <QualificationCard
                            year="2008"
                            institution="UKZN (University of Kwa-Zulu Natal) Howard Campus"
                            qualification="BPMus Jazz and popular music (Honours Degree)"
                            details="Subjects: Performance, Electro acoustics (Sound Engineering)"
                        />
                        <QualificationCard
                            year="2020"
                            institution="The TEFL Academy (RQF)"
                            qualification="Qualifi Level 5 Certificate in Teaching English as a Foreign Language (168 hours)"
                        />
                        <QualificationCard
                            year="2020"
                            institution="The TEFL Academy (RQF)"
                            qualification="Teaching English Online and One to One course (30 hours)"
                        />
                        <QualificationCard
                            year="2021 – 2023"
                            institution="Udemy"
                            qualification="Various Programming Courses"
                            details="C# Fundamentals, C# Intermediate, C# Advanced Topics, Angular and Asp.Net Core Rest API, ASPNet Core and Angular Dating App"
                        />
                    </div>
                </ProfileCardSection>

                <ProfileCardSection title="Programming Skills">
                    <ul className="bg-gray-900  p-4 rounded-lg  hover:bg-black transition duration-300">
                        <li>C# and Typescript, using Angular and VS Code</li>
                        <li>ASP.Net Core: Route Guards, Custom Directives, Headers, SignalR, Bootstrap, Services, Async Pipe, Observables, Components, Templates, Basic HTML and TypeScript, Parent-Child Components, Basic CSS, Setting up Routes, Toastr Service, Interceptors, Model State Errors, Async Validators</li>
                        <li>API: Domain models, Dependency Injection, Adding Services, Repository Pattern, Error Handling, Identity ASP.Net Identity and Role Management, CRUD Operations, Authentication, Authorization, Swagger and Postman, Request DTOs, Controllers, Endpoints, DB Context, Asynchronous Programming, Interfaces, Repositories, JWT Tokens, Roles, CORS, Query Params, Cache, Paging, Sorting, Filtering, MVC, Web API Versioning</li>
                        <li>Databases: SQL Server Management, SQLite, PostgreSQL (Fly.io)</li>
                        <li>Photo Management: Cloudinary</li>
                        <li>GitHub: Storing Repositories</li>
                        <li>Docker: Creating Images, Redis</li>
                    </ul>
                </ProfileCardSection>

                <ProfileCardSection title="Work Experience">
                    <div className="space-y-4 ">
                        <ExperienceCard
                            year="2009 – 2022"
                            title="Durban School: Music Specialist"
                            details={[
                                "Teaching Music Theory and Practice from Grade R to Grade 7",
                                "Teaching choir weekly",
                                "Performing at school functions as a cocktail pianist",
                                "Writing and performing original pieces for school events"
                            ]}
                        />
                        <ExperienceCard
                            year="2004 – 2007"
                            title="CD Warehouse, Gateway Shopping Mall"
                            details={[
                                "Selling CDs, operating the till, sealing stock",
                                "Packing and repacking shelves, placing orders",
                                "Dealing with demanding customers"
                            ]}
                        />
                        <ExperienceCard
                            year="2002"
                            title="Beds for Africa Warehouse"
                            details={[
                                "Taking stock of beds and furniture",
                                "Capturing invoices, receiving stock, packing, and organizing"
                            ]}
                        />
                        <ExperienceCard
                            year="2002"
                            title="Standard Bank Assessors Home Loans Department"
                            details={[
                                "Capturer and then Clerk"
                            ]}
                        />
                        <ExperienceCard
                            year="2001"
                            title="Zimbabalula (Zimbabwe Clothes Goods)"
                            details={[
                                "Managed shop operations, stock, till, credit"
                            ]}
                        />
                        <ExperienceCard
                            year="1997"
                            title="Spargies"
                            details={[
                                "Takeaways and delivery orders"
                            ]}
                        />
                    </div>
                </ProfileCardSection>

                <ProfileCardSection title="General">
                    <ul className="list-disc pl-5 space-y-2 bg-gray-900 p-4 rounded-lg  mb-8 hover:bg-black transition duration-300 ">
                        <li>1996 – Victorix Ludorum – Overall Achiever</li>
                        <li>1998 – Mr. Personality</li>
                        <li>2001 – SRC Treasurer</li>
                        <li>1996 – Head Boy – Thornton Road Primary School</li>
                        <li>1997 – Best contribution to the school</li>
                        <li>Computer Literacy – Word, Excel, Access, PowerPoint, SAP</li>
                    </ul>
                </ProfileCardSection>

                <ProfileCardSection title="References">
                    <div className="space-y-4">
                        <ReferenceCard
                            name="Mrs. Wynne Paice"
                            role="HOD, Durban North Primary School"
                            contact="Tel.: 083 776 7062"
                        />
                        <ReferenceCard
                            name="Mrs. Dawn Olive"
                            role="HOD, Glenwood Prep"
                            contact="Tel.: 083 777 0932"
                        />
                        <ReferenceCard
                            name="Mrs. Liz Kemp"
                            role="Headmaster, Parkhill Primary"
                            contact="Tel.: 083 777 6009"
                        />
                        <ReferenceCard
                            name="Miss Fiona Squires"
                            role="Music Teacher, Atholl Heights Primary"
                            contact="Tel.: 083 773 5441"
                        />
                        <ReferenceCard
                            name="Mrs. Kath Hoad"
                            role="HOD, Brighton Beach Senior Primary School"
                            contact="Tel.: 083 776 7042"
                        />
                        <ReferenceCard
                            name="Mrs. Erica Bush"
                            role="HOD, Warner Beach Senior Primary School"
                            contact="Tel.: 083 776 7066"
                        />
                    </div>
                </ProfileCardSection>

                <div className='mt-8 text-center animate-bounce '>
                    <Link
                        to='/certificates'
                        className='bg-purple-600 text-white text-center p-3 rounded-lg  '
                    >
                        View My Certificates
                    </Link>
                </div>

                {isAdmin && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={openBackgroundDialog}
                            className="bg-yellow-500 text-white py-2 px-4 rounded-lg"
                        >
                            Change Background Video
                        </button>
                    </div>
                )}

                {showBackgroundDialog && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-black p-4 rounded-lg shadow-lg max-w-md mx-auto">
                            <h2 className="text-lg font-semibold mb-4">Change Background Video</h2>
                            <input
                                type="text"
                                value={newVideoUrl}
                                onChange={(e) => setNewVideoUrl(e.target.value)}
                                placeholder="Enter new video URL"
                                className="w-full p-2 border rounded-lg mb-4 text-black"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={closeBackgroundDialog}
                                    className="bg-gray-300 py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={changeBackgroundVideo}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProfileCardSection({ title, children }) {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
            {children}
        </div>
    );
}

function QualificationCard({ year, institution, qualification, details }) {
    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-neon mb-8 hover:bg-black transition duration-300 ">
            <div className="flex justify-between mb-2">
                <span className="font-semibold">{year}</span>
                <span className="font-semibold">{institution}</span>
            </div>
            <div>
                <strong>{qualification}</strong>
                {details && <p>{details}</p>}
            </div>
        </div>
    );
}

function ExperienceCard({ year, title, details }) {
    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-neon mb-8 hover:bg-black transition duration-300 ">
            <div className="flex justify-between mb-2">
                <span className="font-semibold">{year}</span>
                <span className="font-semibold">{title}</span>
            </div>
            <div>
                {details.map((detail, index) => (
                    <p key={index}>{detail}</p>
                ))}
            </div>
        </div>
    );
}

function ReferenceCard({ name, role, contact }) {
    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-neon mb-8 hover:bg-black transition duration-300 ">
            <div className="flex justify-between mb-2">
                <span className="font-semibold">{name}</span>
                <span className="font-semibold">{role}</span>
            </div>
            <div>
                <strong>{contact}</strong>
            </div>
        </div>
    );
}
