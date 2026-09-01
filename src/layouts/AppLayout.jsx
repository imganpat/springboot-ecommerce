import { Button } from '@base-ui/react'
import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'

const AppLayout = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <>
            <header className='fixed top-0 w-screen z-50 bg-white flex justify-center'>
                <nav className='flex w-4/5 justify-between p-4!'>
                    <div id="logo" className="text-2xl">Logo</div>
                    <div id="links">
                        <ul className='flex gap-4 items-center'>
                            <NavLink to="/"><li>Home</li></NavLink>
                            {user && <NavLink to="/dashboard"><li>Dashboard</li></NavLink>}
                            {user?.admin && <NavLink to="/admin/dashboard"><li>Admin</li></NavLink>}
                            <NavLink to="/cart"><li><ShoppingCart /></li></NavLink>
                            {user ? (
                                <li>
                                    <Button onClick={logout} variant="destructive">Logout</Button>
                                </li>
                            ) : (
                                <NavLink to="/login"><li>Login</li></NavLink>
                            )}
                        </ul>
                    </div>
                </nav>
            </header>

            <main className='h-full flex flex-col gap-8 overflow-x-hidden'>
                {children}
            </main>
        </>
    )
}

export default AppLayout