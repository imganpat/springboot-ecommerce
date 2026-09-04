import { Button } from '@base-ui/react';
import { ArrowRight, Search, ShoppingBag, UserRound } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContex';

const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
    }`;

const AppLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-background w-full text-foreground">
            {!isAdminRoute && (
                <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[#f8f7f3]/95 backdrop-blur-md">
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
                            {user ? (
                                <li>
                                    <Button onClick={logout} className="hidden rounded-full bg-[#17211b] px-4! py-2! text-xs font-semibold text-white hover:bg-[#314438] sm:block">Logout</Button>
                                </li>
                            ) : (
                                <li>
                                    <NavLink to="/login" className="flex items-center gap-1 rounded-full bg-[#17211b] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#314438]">Sign in <ArrowRight className="h-3.5 w-3.5" /></NavLink>
                                </li>
                            )}
                        </ul>
                    </nav>
                </header>
            )}

            <main className={`mx-auto flex w-full ${isAdminRoute ? 'max-w-full' : 'max-w-7xl'} flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10`}>
                {children}
            </main>
        </div>
    );
};

export default AppLayout;