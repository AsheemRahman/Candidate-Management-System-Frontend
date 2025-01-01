import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute({ role }) {
    const { currentUser } = useSelector(state => state.user)

    if (!currentUser) {
        return <Navigate to='/candidate/login' />
    }

    if (role && currentUser.role !== role) {
        return <Navigate to='/unauthorized' />
    }

    return <Outlet />
}