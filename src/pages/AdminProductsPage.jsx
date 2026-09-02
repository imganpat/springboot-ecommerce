import { useEffect, useState } from "react";

import AdminProductForm from "@/components/AdminProductForm";
import AdminProductTable from "@/components/AdminProductTable";
import { Button } from "@/components/ui/button";
import Popup from "@/components/ui/popup";
import {
    createAdminProduct,
    deleteAdminProduct,
    getAdminProducts,
    restoreAdminProduct,
    updateAdminProduct,
    uploadProductImages,
} from "@/services/adminProductService";

const emptyForm = {
    name: "",
    description: "",
    price: "",
    quantity: "",
};

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState(emptyForm);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const [editingProductId, setEditingProductId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
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

    const openCreateProductForm = () => {
        resetForm();
        setIsProductFormOpen(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "price") {
            if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
            if ((value.match(/\./g) || []).length > 1) return;
            if (value.includes(".") && value.split(".")[1]?.length > 2) return;
        }

        if (name === "quantity") {
            if (value !== "" && !/^\d*$/.test(value)) return;
        }

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
            const priceValue = String(formData.price ?? "").trim();
            const quantityValue = String(formData.quantity ?? "").trim();

            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: Number(priceValue),
                quantity: Number(quantityValue),
            };

            if (!payload.name) {
                throw new Error("Product name is required.");
            }

            if (!/^\d+(\.\d{1,2})?$/.test(priceValue) || Number(priceValue) < 0) {
                throw new Error("Price must be a valid number with up to 2 decimal places.");
            }

            if (!/^\d+$/.test(quantityValue) || !Number.isInteger(payload.quantity) || payload.quantity < 0) {
                throw new Error("Quantity must be a whole number greater than or equal to 0.");
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
                    current.map((product) => (product.id === uploadedProduct.id ? uploadedProduct : product))
                );
                setActionMessage({
                    type: "success",
                    text: `${editingProductId ? "Product updated" : "Product created"} successfully with images.`,
                });
            }

            resetForm();
            setIsProductFormOpen(false);
            return true;
        } catch (requestError) {
            const message = requestError.response?.data?.message || requestError.message || "Unable to save product.";
            setActionMessage({ type: "error", text: message });
            return false;
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
        setIsProductFormOpen(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (productId) => {
        setConfirmDeleteId(productId);
    };

    const confirmDeleteProduct = async () => {
        if (!confirmDeleteId) return;

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
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
            <div className="flex flex-col gap-3 rounded-3xl border border-border/80 bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Inventory</p>
                    <h1 className="mt-2 text-3xl font-bold">Product catalog</h1>
                </div>
                <Button type="button" onClick={openCreateProductForm}>Add product</Button>
            </div>

            {loading ? (
                <p className="text-sm text-muted-foreground">Loading products...</p>
            ) : error ? (
                <p className="text-sm text-destructive">{error}</p>
            ) : (
                <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-sm">
                    <AdminProductTable
                        products={products}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onRestore={handleRestore}
                    />
                </div>
            )}

            <Popup
                open={isProductFormOpen}
                title={editingProductId ? "Edit product" : "Add new product"}
                description={editingProductId ? "Update the selected product details." : "Create a new product for your store inventory."}
                onCancel={() => {
                    setIsProductFormOpen(false);
                    resetForm();
                }}
                hideFooter
                contentClassName="max-w-3xl"
            >
                <div className="mt-4">
                    <AdminProductForm
                        formData={formData}
                        onInputChange={handleInputChange}
                        onImageChange={handleImageChange}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setIsProductFormOpen(false);
                            resetForm();
                        }}
                        editingProductId={editingProductId}
                        imagePreview={imagePreview}
                        currentImage={
                            editingProductId
                                ? products.find((product) => product.id === editingProductId)?.imageFilename
                                    ? `http://localhost:8080/uploads/images/${products.find((product) => product.id === editingProductId)?.imageFilename}`
                                    : ""
                                : ""
                        }
                        submitting={submitting}
                        actionMessage={actionMessage}
                    />
                </div>
            </Popup>

            <Popup
                open={Boolean(confirmDeleteId)}
                title="Delete product"
                description="This product will be hidden from the storefront and can be restored later from the admin dashboard."
                confirmText="Delete"
                confirmVariant="destructive"
                onConfirm={confirmDeleteProduct}
                onCancel={() => setConfirmDeleteId(null)}
            />
        </div>
    );
};

export default AdminProductsPage;
