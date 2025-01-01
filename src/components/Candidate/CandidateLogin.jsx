import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';

function CandidateLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            dispatch(signInStart());
            const response = await axios.post('http://localhost:8080/api/candidate/login', { email, password });

            if (response.data.success === false) {
                dispatch(signInFailure(response.data));
                return;
            }

            dispatch(signInSuccess(response.data));
            navigate('/candidate/home');
            toast.success("Login successful!");
        } catch (error) {
            dispatch(signInFailure(error));
            toast.error(error.response?.data?.message || error.message || "Login failed!");
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded-md p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Candidate Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none">
                    Login
                </button>
            </form>
        </div>
    );
}

export default CandidateLogin;
