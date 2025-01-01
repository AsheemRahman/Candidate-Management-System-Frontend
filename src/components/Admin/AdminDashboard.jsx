import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { adminLogout } from "../../redux/admin/adminslice";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

const AdminDashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchCandidates = async () => {
        try {
            const { data } = await axios.get("https://candidate-management-system-backend.onrender.com/api/admin/candidates", { withCredentials: true });
            setCandidates(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateCandidate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://candidate-management-system-backend.onrender.com/api/admin/candidate/create",
                { name, email, password, mobile, address },
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            setName("");
            setEmail("");
            setPassword("");
            setMobile("");
            setAddress("");
            setIsModalOpen(false);
            fetchCandidates();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://candidate-management-system-backend.onrender.com/api/admin/candidate/delete/${id}`, { headers: { Authorization: localStorage.getItem("token") } });
            const data = response.data;
            toast.success(data.message);
            dispatch(deleteUser(id));
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete the user");
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('https://candidate-management-system-backend.onrender.com/api/admin/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                navigate('/candidate/login');
                dispatch(adminLogout(false));
                toast.success("Logged out successfully!");
            } else {
                throw new Error("Logout failed");
            }
        } catch (error) {
            toast.error("Try again!");
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleViewCandidate = (id) => {
        navigate(`/admin/candidate/${id}`);
    };

    return (
        <div className="container mx-auto py-6">
            <h2 className="text-6xl text-center font-bold mb-4">Admin Dashboard</h2>

            <div className="flex items-center justify-between flex-wrap pb-4 bg-white ">
                {/* <input type="text" className="block mx-8 p-2 text-sm  border-2 border-black rounded-lg w-80 bg-gray-50"
                    placeholder="Search for users" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /> */}
                <button className="inline-flex mx-8 items-center text-gray-500 bg-white  focus:outline-none hover:bg-gray-100  font-medium rounded-lg text-sm px-3 py-3 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                    onClick={() => setIsModalOpen(true)} >
                    Add Candidate
                </button>
                <button onClick={handleLogout} className="inline-flex mx-8 items-center text-gray-500 bg-white  focus:outline-none hover:bg-gray-100  font-medium rounded-lg text-sm px-5 py-3 dark:bg-red-600 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-red-500">
                    Logout
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white shadow-md rounded-md p-4 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Create Candidate</h3>
                        <form onSubmit={handleCreateCandidate}>
                            <div className="grid grid-cols-1 gap-4">
                                <input type="text" placeholder="Name" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                    value={name} onChange={(e) => setName(e.target.value)} />
                                <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                    value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input type="password" placeholder="Password" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                    value={password} onChange={(e) => setPassword(e.target.value)} />
                                <input type="text" placeholder="Mobile" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                    value={mobile} onChange={(e) => setMobile(e.target.value)} />
                                <input type="text" placeholder="Address" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" value={address}
                                    onChange={(e) => setAddress(e.target.value)} />
                                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none">
                                    Create Candidate
                                </button>
                            </div>
                        </form>
                        <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none w-full" >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col mt-10 items-center min-h-screen bg-gray-50">
                <h2 className="text-4xl font-semibold text-gray-900 mb-6">Candidates Details</h2>
                <div className="container mx-auto w-full px-4">
                    <table className="min-w-full text-sm text-left text-gray-700 shadow-md rounded-lg overflow-hidden">
                        <thead className="text-xs uppercase bg-gray-200 text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Sl</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Mobile</th>
                                <th scope="col" className="px-6 py-3">Address</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((candidate, index) => (
                                <tr className="bg-white border-b hover:bg-gray-100" key={candidate.id}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {index + 1}
                                    </th>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => handleViewCandidate(candidate._id)}>
                                        {candidate.name}
                                    </td>
                                    <td className="px-6 py-4">{candidate.email}</td>
                                    <td className="px-6 py-4">{candidate.mobile}</td>
                                    <td className="px-6 py-4">{candidate.address}</td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button type="button"
                                            onClick={() => handleEdit(candidate)}
                                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(candidate._id)} type="button"
                                            className="text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 transition">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
