
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6 px-4! py-8!">
            <div className="flex items-center justify-between gap-4 mt-14!">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
                    <h1 className="text-3xl font-bold">Welcome, {user?.name || "User"}</h1>
                </div>
                {user?.admin && (
                    <Link to="/admin/dashboard">
                        <Button className="p-4!">Open admin dashboard</Button>
                    </Link>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Email: {user?.email || "N/A"}</p>
                    <p>Role: {user?.admin ? "Admin" : "Customer"}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;