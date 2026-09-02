import { Button } from '@base-ui/react';
import { ShoppingCart } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';

const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
    }`;

const AppLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-background w-full text-foreground">
            {!isAdminRoute && (
                <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-sm w-screen">
                    <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                        <NavLink to="/" className="text-2xl font-semibold tracking-tight text-foreground">
                            Logo
                        </NavLink>

                        <ul className="flex items-center gap-4 text-sm">
                            <li>
                                <NavLink to="/" className={navLinkClass}>Home</NavLink>
                            </li>
                            {user && (
                                <li>
                                    <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                                </li>
                            )}
                            {user?.admin && (
                                <li>
                                    <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>
                                </li>
                            )}
                            <li>
                                <NavLink to="/cart" className={navLinkClass} aria-label="Cart">
                                    <ShoppingCart className="h-5 w-5" />
                                </NavLink>
                            </li>
                            {user ? (
                                <li>
                                    <Button onClick={logout} variant="destructive">Logout</Button>
                                </li>
                            ) : (
                                <li>
                                    <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                                </li>
                            )}
                        </ul>
                    </nav>
                </header>
            )}

            <main className={`mx-auto flex w-full ${isAdminRoute ? 'max-w-full' : 'max-w-6xl'} flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8`}>
                {children}
            </main>
        </div>
    );
};

export default AppLayout;