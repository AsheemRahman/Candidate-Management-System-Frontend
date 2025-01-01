import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CandidateDetails = () => {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);

    useEffect(() => {
        const fetchCandidateDetails = async () => {
            try {
                const { data } = await axios.get(`http://13.60.30.111:3000/api/admin/candidateDetail/${id}`, { withCredentials: true });
                setCandidate(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCandidateDetails();
    }, [id]);

    if (!candidate) return <p>Loading...</p>;

    return (
        <div className="container mx-auto py-6 flex flex-col items-center">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6 text-center">Candidate : {candidate.name}</h2>
            <img src={candidate.profilePicture} alt='profile' className='h-24 w-24 cursor-pointer rounded-full object-cover mt-2' />
            <div className="bg-white p-4 rounded-md shadow-md mt-6 flex flex-col items-center">
                <p><strong>Email:</strong> {candidate.email}</p>
                <p><strong>Mobile:</strong> {candidate.mobile}</p>
                <p><strong>Address:</strong> {candidate.address}</p>
            </div>
        </div>

    );
};

export default CandidateDetails;
