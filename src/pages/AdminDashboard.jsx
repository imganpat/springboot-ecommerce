import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Popup from "@/components/ui/popup";
import { useAuth } from "@/context/AuthContext";
import {
    createAdminProduct,
    deleteAdminProduct,
    getAdminProducts,
    restoreAdminProduct,
    updateAdminProduct,
    uploadProductImage,
    uploadProductImages,
} from "@/services/adminProductService";

const emptyForm = {
    name: "",
    description: "",
    price: "",
    quantity: "",
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState(emptyForm);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const [editingProductId, setEditingProductId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [actionMessage, setActionMessage] = useState({ type: "", text: "" });

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

    useEffect(() => {
        fetchProducts();
    }, []);

    const resetForm = () => {
        setFormData(emptyForm);
        setSelectedImages([]);
        setImagePreview("");
        setEditingProductId(null);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            setSelectedImages([]);
            setImagePreview("");
            return;
        }

        setSelectedImages(files);
        setImagePreview(URL.createObjectURL(files[0]));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setActionMessage({ type: "", text: "" });

        try {
            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: Number(formData.price),
                quantity: Number(formData.quantity),
            };

            if (!payload.name) {
                throw new Error("Product name is required.");
            }

            if (!Number.isFinite(payload.price) || payload.price < 0) {
                throw new Error("Price must be a valid number.");
            }

            if (!Number.isInteger(payload.quantity) || payload.quantity < 0) {
                throw new Error("Quantity must be a whole number.");
            }

            let savedProduct;

            if (editingProductId) {
                savedProduct = await updateAdminProduct(editingProductId, payload);
                setProducts((current) =>
                    current.map((product) => (product.id === savedProduct.id ? savedProduct : product))
                );
                setActionMessage({ type: "success", text: "Product updated successfully." });
            } else {
                savedProduct = await createAdminProduct(payload);
                setProducts((current) => [savedProduct, ...current]);
                setActionMessage({ type: "success", text: "Product created successfully." });
            }

            if (selectedImages.length > 0 && savedProduct?.id) {
                const uploadedProduct = await uploadProductImages(savedProduct.id, selectedImages);
                setProducts((current) =>
                    current.map((product) =>
                        product.id === uploadedProduct.id ? uploadedProduct : product
                    )
                );
                setActionMessage({
                    type: "success",
                    text: `${editingProductId ? "Product updated" : "Product created"} successfully with images.`
                });
            }

            resetForm();
        } catch (requestError) {
            const message = requestError.response?.data?.message || requestError.message || "Unable to save product.";
            setActionMessage({ type: "error", text: message });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProductId(product.id);
        setFormData({
            name: product.name || "",
            description: product.description || "",
            price: String(product.price ?? 0),
            quantity: String(product.quantity ?? 0),
        });
        setSelectedImages([]);
        setImagePreview(product.imageFilename ? `http://localhost:8080/uploads/images/${product.imageFilename}` : "");
        setActionMessage({ type: "", text: "" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (productId) => {
        setConfirmDeleteId(productId);
    };

    const confirmDeleteProduct = async () => {
        if (!confirmDeleteId) {
            return;
        }

        try {
            await deleteAdminProduct(confirmDeleteId);
            setProducts((current) =>
                current.map((product) =>
                    product.id === confirmDeleteId ? { ...product, deleted: true } : product
                )
            );
            setActionMessage({ type: "success", text: "Product marked as deleted." });
        } catch (requestError) {
            const message = requestError.response?.data?.message || "Unable to delete product.";
            setActionMessage({ type: "error", text: message });
        } finally {
            setConfirmDeleteId(null);
        }
    };

    const handleRestore = async (productId) => {
        try {
            await restoreAdminProduct(productId);
            setProducts((current) =>
                current.map((product) =>
                    product.id === productId ? { ...product, deleted: false } : product
                )
            );
            setActionMessage({ type: "success", text: "Product restored successfully." });
        } catch (requestError) {
            const message = requestError.response?.data?.message || "Unable to restore product.";
            setActionMessage({ type: "error", text: message });
        }
    };

    return (
        <div className="mx-auto space-y-6! px-4 py-8">
            <div className="mt-20! flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin panel</p>
                    <h1 className="text-3xl font-bold">Welcome, {user?.name || "Admin"}</h1>
                </div>
                <Link to="/dashboard">
                    <Button variant="outline" className="p-4">User dashboard</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{editingProductId ? "Edit product" : "Add a new product"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Product name</label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    placeholder="Describe the product"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price</label>
                                <Input
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Quantity</label>
                                <Input
                                    name="quantity"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Product images</label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                {(imagePreview || (editingProductId && products.find((product) => product.id === editingProductId)?.imageFilename)) && (
                                    <img
                                        src={
                                            imagePreview ||
                                            `http://localhost:8080/uploads/images/${products.find((product) => product.id === editingProductId)?.imageFilename}`
                                        }
                                        alt="Product preview"
                                        className="mt-2 h-40 w-full rounded-md border object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        {actionMessage.text && (
                            <p
                                className={`text-sm ${actionMessage.type === "error" ? "text-destructive" : "text-emerald-600"
                                    }`}
                            >
                                {actionMessage.text}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-3 mt-2!">
                            <Button type="submit" disabled={submitting} className="py-5! px-6!">
                                {submitting ? "Saving..." : editingProductId ? "Update product" : "Add product"}
                            </Button>
                            {editingProductId && (
                                <Button type="button" variant="outline" className="py-5! px-6!" onClick={resetForm}>
                                    Cancel edit
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Popup
                open={Boolean(confirmDeleteId)}
                title="Delete product"
                description="This product will be hidden from the storefront and can be restored later from the admin dashboard."
                confirmText="Delete"
                confirmVariant="destructive"
                onConfirm={confirmDeleteProduct}
                onCancel={() => setConfirmDeleteId(null)}
            />

            <div className="mt-6! p-4! shadow-none flex flex-col gap-4">
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
                                <div
                                    key={product.id}
                                    className={`rounded-xl border p-4! shadow-sm ${product.deleted ? "border-dashed border-muted-foreground/40 bg-muted/30" : ""
                                        }`}
                                >
                                    {product.imageFilename && (
                                        <img
                                            src={`http://localhost:8080/uploads/images/${product.imageFilename}`}
                                            alt={product.name}
                                            className="mb-3 h-40 w-full rounded-md object-cover"
                                        />
                                    )}

                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-lg font-semibold">{product.name}</p>
                                            {product.deleted && (
                                                <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                                    Deleted
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="outline" size="sm" className="py-2! px-2!" onClick={() => handleEdit(product)}>
                                                Edit
                                            </Button>
                                            {product.deleted ? (
                                                <Button type="button" variant="secondary" size="sm" className="py-2! px-2!" onClick={() => handleRestore(product.id)}>
                                                    Restore
                                                </Button>
                                            ) : (
                                                <Button type="button" variant="destructive" size="sm" className="py-2! px-2!" onClick={() => handleDelete(product.id)}>
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm text-muted-foreground">
                                        {product.description || "No description"}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <span>Price: ${Number(product.price || 0).toFixed(2)}</span>
                                        <span>Qty: {product.quantity ?? 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </div>
        </div>
    );
};

export default AdminDashboard;
