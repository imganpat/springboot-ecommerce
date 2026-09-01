import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
        <div className="mx-auto w-full max-w-5xl space-y-6 px-4! py-8!">
            <div className="flex items-center justify-between gap-4! mt-14!">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin panel</p>
                    <h1 className="text-3xl font-bold">Welcome, {user?.name || "Admin"}</h1>
                </div>
                <Link to="/dashboard">
                    <Button variant="outline" className="p-4!">User dashboard</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Inventory overview</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-sm text-muted-foreground">Loading products...</p>
                    ) : error ? (
                        <p className="text-sm text-destructive">{error}</p>
                    ) : products.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No products found.</p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {products.map((product) => (
                                <div key={product.id} className="rounded-xl border p-4 shadow-sm">
                                    <p className="text-lg font-semibold">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.description || "No description"}</p>
                                    <div className="mt-3 flex items-center justify-between text-sm">
                                        <span>Price: ${Number(product.price || 0).toFixed(2)}</span>
                                        <span>Qty: {product.quantity ?? 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;
