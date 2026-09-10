import { ArrowRight, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@base-ui/react';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContex';
import Popup from '@/components/ui/popup';

const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
    }`;

const AppLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
    const isAdminRoute = location.pathname.startsWith('/admin');

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-background w-full text-foreground">
            <Popup
                open={isLogoutPopupOpen}
                title="Log out?"
                description="Are you sure you want to log out of your account?"
                confirmText="Log out"
                confirmVariant="destructive"
                onConfirm={() => {
                    setIsLogoutPopupOpen(false);
                    logout();
                }}
                onCancel={() => setIsLogoutPopupOpen(false)}
            />
            {!isAdminRoute && (
                <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-[#f8f7f3]/95 backdrop-blur-md">
                    <nav className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
                        <NavLink to="/" className="flex items-center gap-3 text-foreground" aria-label="Neki home">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17211b] text-sm font-bold text-[#93c5fd]">N</span>
                            <span className="text-xl font-bold tracking-[0.18em]">Neki</span>
                        </NavLink>

                        <div className="hidden items-center gap-8 md:flex">
                            <NavLink to="/" className={navLinkClass}>Shop</NavLink>
                            <a href="#featured" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Featured</a>
                            <a href="#why-Neki" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Why Neki</a>
                        </div>

                        <ul className="flex items-center gap-2 sm:gap-4">
                            <li className="hidden sm:block">
                                {/* <label className="flex h-10 w-44 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-muted-foreground">
                                    <Search className="h-4 w-4" />
                                    <span className="text-sm">Search products</span>
                                </label> */}
                            </li>
                            {user && <li className="hidden sm:block"><NavLink to="/dashboard" className={navLinkClass} aria-label="Your account"><UserRound className="h-5 w-5" /></NavLink></li>}
                            <li>
                                <NavLink to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-foreground transition hover:bg-[#dbeafe]" aria-label={`Cart with ${cartCount} items`}>
                                    <ShoppingBag className="h-5 w-5" />
                                    {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e56b45] px-1 text-[10px] font-bold text-white">{cartCount}</span>}
                                </NavLink>
                            </li>
                            <li className="md:hidden">
                                <Button type="button" variant="outline" size="icon" aria-label="Open navigation menu" onClick={() => setIsMenuOpen((current) => !current)}>
                                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                                </Button>
                            </li>
                            {user ? (
                                <li>
                                    <Button variant="default" onClick={() => setIsLogoutPopupOpen(true)} className="hidden rounded-full px-4! py-2! text-xs font-semibold sm:block bg-[var(--brand-blue)] text-white">Logout</Button>
                                </li>
                            ) : (
                                <li>
                                    <NavLink to="/login" className="flex items-center gap-1 rounded-full bg-[#17211b] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#314438]">Sign in <ArrowRight className="h-3.5 w-3.5" /></NavLink>
                                </li>
                            )}
                        </ul>
                    </nav>
                    {isMenuOpen && (
                        <div className="border-t border-black/10 bg-[#f8f7f3] px-5 py-4 md:hidden">
                            <div className="flex flex-col gap-3">
                                <NavLink to="/" className={navLinkClass}>Shop</NavLink>
                                <a href="/#featured" className={navLinkClass}>Featured</a>
                                <a href="/#why-Neki" className={navLinkClass}>Why Neki</a>
                                {user && <NavLink to="/dashboard" className={navLinkClass}>Your account</NavLink>}
                            </div>
                        </div>
                    )}
                </header>
            )}

            <main className={`mx-auto flex w-full ${isAdminRoute ? 'max-w-full' : 'max-w-7xl'} flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10`}>
                {children}
            </main>
        </div>
    );
};

export default AppLayout;