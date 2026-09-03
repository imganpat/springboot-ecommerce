import { LayoutGrid, LogOut, Package, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutGrid },
    { href: "/admin/products", label: "Manage products", icon: Package },
];

const AdminSidebar = () => {
    const { user, logout } = useAuth();

    return (
        <aside className="flex h-screen w-65 shrink-0 flex-col border-r border-border/80 bg-card p-4 shadow-sm">
            <div className="shrink-0 border-b border-border/80 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ShieldCheck className="size-5" />
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Admin</p>
                        <p className="text-sm font-semibold text-foreground">{user?.name || "Store manager"}</p>
                    </div>
                </div>
            </div>

            <nav className="mt-6 space-y-2">
                {menuItems.map(({ href, label, icon: Icon }) => (
                    <NavLink
                        key={href}
                        to={href}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

            <div className="mt-auto shrink-0 border-t border-border/80 pt-4">
                <Button type="button" variant="outline" className="w-full justify-center gap-2" onClick={logout}>
                    <LogOut className="size-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
};

export default AdminSidebar;