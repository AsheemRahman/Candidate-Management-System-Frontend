import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useSelector, useDispatch } from 'react-redux';
import { signOut, updateUserSuccess, updateUserFailure } from '../../redux/user/userSlice';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

function CandidateProfile() {
    const s3Client = new S3Client({
        region: import.meta.env.VITE_AWS_REGION,
        credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        },
    });

    const [image, setImage] = useState(undefined);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState({ profilePicture: '' });
    const fileRef = useRef(null);
    const navigate = useNavigate();

    const { currentUser, loading, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleFileUpload = async (imageFile) => {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const params = {
            Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
            Key: fileName,
            Body: imageFile,
            ContentType: imageFile.type,
        };

        try {
            setImageUploading(true);
            const command = new PutObjectCommand(params);
            const data = await s3Client.send(command);
            const imageUrl = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileName}`;

            const updatedUser = { ...currentUser, profilePicture: imageUrl };
            setFormData((prev) => ({ ...prev, profilePicture: imageUrl }));
            dispatch(updateUserSuccess(updatedUser));
            setImageUploading(false);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image to S3:', error);
            setImageError(true);
            setImageUploading(false);
            toast.error('Failed to upload image');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    useEffect(() => {
        if (image) {
            handleFileUpload(image);
        }
    }, [image]);

    const handleSignOut = async () => {
        try {
            await fetch('/api/candidate/signout');
            dispatch(signOut());
            navigate('/candidate/login');
            toast.success('Signout successfully');
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/candidate/upload/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || 'Profile update failed');
            }

            dispatch(updateUserSuccess(data.rest));
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <div className='p-3 mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type='file' ref={fileRef} hidden  accept='image/*' onChange={handleImageChange}/>
                <img src={formData.profilePicture || currentUser.profilePicture || 'defaultImageURL'} alt='profile'
                    className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
                    onClick={() => fileRef.current.click()}/>
                <p className='text-sm self-center'>
                    {imageError ? (
                        <span className='text-red-700'>Error uploading image</span>
                    ) : imageUploading ? (
                        <span className='text-slate-700'>Uploading...</span>
                    ) : (
                        ''
                    )}
                </p>
                <button type="submit" className="self-center bg-blue-500 text-white py-2 px-4 rounded mt-4">
                    Save Profile
                </button>
            </form>
            {currentUser && (
                <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-gray-800 text-lg font-semibold">
                        <span className="text-gray-600 font-medium">Name:</span> {currentUser.name}
                    </p>
                    <p className="text-gray-800 text-lg font-semibold mt-2">
                        <span className="text-gray-600 font-medium">Email:</span> {currentUser.email}
                    </p>
                    <p className="text-gray-800 text-lg font-semibold mt-2">
                        <span className="text-gray-600 font-medium">Mobile:</span> {currentUser.mobile}
                    </p>
                    <p className="text-gray-800 text-lg font-semibold mt-2">
                        <span className="text-gray-600 font-medium">Address:</span> {currentUser.address}
                    </p>
                </div>
            )}
            <div className="flex justify-between mt-5 max-w-md mx-auto">
                <span
                    onClick={handleSignOut}
                    className="text-red-600 font-medium cursor-pointer hover:text-red-800 transition duration-200"
                >
                    Sign out
                </span>
            </div>

            <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
        </div>
    );
}

export default CandidateProfile;
