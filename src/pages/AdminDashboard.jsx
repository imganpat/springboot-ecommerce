import { useEffect, useState } from "react";

import SalesReportChart from "@/components/SalesReportChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getAdminProducts } from "@/services/adminProductService";

const AdminDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const adminProducts = await getAdminProducts();
                setProducts(adminProducts || []);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load admin products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
            <div className="flex flex-col gap-3 rounded-3xl border border-border/80 bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Admin panel</p>
                    <h1 className="mt-2 text-3xl font-bold">Welcome, {user?.name || "Admin"}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" type="button" onClick={() => window.location.assign("/admin/products")}>
                        Manage products
                    </Button>
                    <Button variant="default" type="button" onClick={() => window.location.assign("/dashboard")}>
                        User dashboard
                    </Button>
                </div>
            </div>

            <section className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Total products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{products.length}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Available</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{products.filter((product) => !product.deleted).length}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Deleted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{products.filter((product) => product.deleted).length}</p>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
                <SalesReportChart />

                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Quick notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Best selling</p>
                            <p className="mt-1 text-lg font-semibold">Premium Hoodie</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Low stock alerts</p>
                            <p className="mt-1 text-lg font-semibold">
                                {products.filter((product) => Number(product.quantity ?? 0) <= 5).length} items
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Store health</p>
                            <p className="mt-1 text-lg font-semibold text-emerald-600">Strong</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {loading ? (
                <p className="text-sm text-muted-foreground">Loading products...</p>
            ) : error ? (
                <p className="text-sm text-destructive">{error}</p>
            ) : null}
        </div>
    );
};

export default AdminDashboard;
