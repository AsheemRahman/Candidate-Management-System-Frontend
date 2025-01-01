import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {

    const { currentUser } = useSelector((state) => state.user);

    return (
        <div className='bg-slate-200 h-16'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                {currentUser ? (
                    <Link to='/candidate/home'><h1 className='font-bold'>Candidate Management System</h1></Link>
                ) : (
                    <Link to='/candidate/login'><h1 className='font-bold'>Candidate Management System</h1></Link>
                )}
                <ul className='flex gap-4'>
                    {currentUser ? (
                        <Link to='/candidate/home'><li>Home</li></Link>
                    ) : (
                        <Link to='/candidate/login'><li>Home</li></Link>
                    )}
                    <li>About</li>
                    {currentUser ? (
                        <Link to='/candidate/profile'>
                            <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
                        </Link>
                    ) : (
                        <Link to='/candidate/login'>
                            <li>Sign In</li>
                        </Link>
                    )}
                </ul>
            </div>
        </div >
    );
}
