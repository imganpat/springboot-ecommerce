import AdminSidebar from "@/components/AdminSidebar";

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <div className="flex min-h-screen">
                <div className="hidden sticky top-0 h-screen shrink-0 md:block">
                    <AdminSidebar />
                </div>

                <main className="flex-1 overflow-y-auto">
                    <div className="min-h-screen">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
