import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function AdminRoute() {
    const { adminStatus } = useSelector((state) => state.admin)
    return adminStatus == true ? <Outlet /> : <Navigate to='/admin/login' />
}
