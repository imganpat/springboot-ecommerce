import { LayoutGrid, LogOut, Package, ShieldCheck, X } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutGrid },
    { href: "/admin/products", label: "Manage products", icon: Package },
];

const AdminSidebar = ({ onClose, onLogoutRequest, mobile = false }) => {
    const { user } = useAuth();

    return (
        <aside className={`flex h-full w-72 shrink-0 flex-col border-r border-border bg-card p-4 text-foreground shadow-sm ${mobile ? "" : "h-screen w-65"}`}>
            <div className="shrink-0 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--brand-blue)] text-white">
                        <ShieldCheck className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-blue)]">Admin</p>
                        <p className="truncate text-sm font-semibold text-foreground">{user?.name || "Store manager"}</p>
                    </div>

                    {mobile && (
                        <Button type="button" variant="ghost" size="icon" aria-label="Close admin menu" onClick={onClose}>
                            <X className="size-5" />
                        </Button>
                    )}
                </div>
            </div>

            <nav className="mt-6 space-y-2">
                {menuItems.map(({ href, label, icon: Icon }) => (
                    <NavLink
                        key={href}
                        to={href}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                ? "bg-[var(--brand-blue)] text-white"
                                : "text-muted-foreground hover:bg-[var(--brand-wash)] hover:text-foreground"
                            }`
                        }
                    >
                        <Icon className="size-4" />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* <div className="mt-8 rounded-2xl bg-muted/30 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Access</p>
                <p className="mt-1 text-sm font-medium text-foreground">Product inventory</p>
            </div> */}

            <div className="mt-auto shrink-0 border-t border-border pt-4">
                <Button type="button" variant="outline" className="w-full justify-center gap-2" onClick={onLogoutRequest}>
                    <LogOut className="size-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
};

export default AdminSidebar;