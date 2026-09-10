import { ArrowLeft, Menu } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import Popup from "@/components/ui/popup";
import { useAuth } from "@/context/AuthContext";

const AdminLayout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isDashboard = location.pathname === "/admin/dashboard";

    return (
        <div className="min-h-screen w-full bg-[linear-gradient(135deg,var(--brand-wash)_0%,var(--background)_42%)] text-foreground">
            <div className="flex min-h-screen">
                <div className="hidden sticky top-0 h-screen shrink-0 md:block">
                    <AdminSidebar onLogoutRequest={() => setIsLogoutPopupOpen(true)} />
                </div>

                {isMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setIsMenuOpen(false)} />
                )}
                <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <AdminSidebar mobile onClose={() => setIsMenuOpen(false)} onLogoutRequest={() => setIsLogoutPopupOpen(true)} />
                </div>

                <main className="min-w-0 flex-1 overflow-y-auto">
                    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/80 bg-background/90 px-4 py-3 backdrop-blur md:hidden">
                        <Button type="button" variant="outline" size="icon" aria-label="Open admin menu" onClick={() => setIsMenuOpen(true)}>
                            <Menu className="size-5" />
                        </Button>
                        {!isDashboard && (
                            <Button type="button" variant="ghost" className="gap-2" onClick={() => navigate("/admin/dashboard")}>
                                <ArrowLeft className="size-4" />
                                <span>Back</span>
                            </Button>
                        )}
                        <p className="ml-auto text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Admin</p>
                    </div>
                    <div className="min-h-screen">{children}</div>
                </main>
            </div>
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
                contentClassName="z-[60] max-w-md"
            />
        </div>
    );
};

export default AdminLayout;
