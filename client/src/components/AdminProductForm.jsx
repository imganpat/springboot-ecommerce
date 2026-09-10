import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminProductForm = ({
    formData,
    onInputChange,
    onImageChange,
    onSubmit,
    onCancel,
    editingProductId,
    imagePreview,
    currentImage,
    submitting,
    actionMessage,
    nameError,
}) => {
    const isEditing = Boolean(editingProductId);

    return (
        <Card className="border-0 bg-background shadow-sm">
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="product-name" className="text-sm font-medium">Product name</label>
                            <Input
                                id="product-name"
                                name="name"
                                value={formData.name}
                                onChange={onInputChange}
                                required
                                pattern="[A-Za-z ]+"
                                title="Use letters and spaces only"
                                aria-invalid={Boolean(nameError)}
                                aria-describedby={nameError ? "product-name-error" : undefined}
                                placeholder="Enter product name"
                            />
                            {nameError && (
                                <p id="product-name-error" className="text-xs text-destructive">{nameError}</p>
                            )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={onInputChange}
                                rows={4}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                placeholder="Describe the product"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price</label>
                            <Input
                                name="price"
                                type="text"
                                inputMode="decimal"
                                value={formData.price}
                                onChange={onInputChange}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Quantity</label>
                            <Input
                                name="quantity"
                                type="text"
                                inputMode="numeric"
                                value={formData.quantity}
                                onChange={onInputChange}
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Product images</label>
                            <Input type="file" accept="image/*" multiple onChange={onImageChange} />
                            {(imagePreview || currentImage) && (
                                <img
                                    src={imagePreview || currentImage}
                                    alt="Product preview"
                                    className="mt-2 aspect-video max-h-40 w-full rounded-md border object-cover"
                                />
                            )}
                        </div>
                    </div>

                    {actionMessage.text && (
                        <p
                            className={`text-sm ${actionMessage.type === "error" ? "text-destructive" : "text-emerald-600"}`}
                        >
                            {actionMessage.text}
                        </p>
                    )}

                    {/* <div className="flex flex-wrap gap-3 pt-2">
                        <Button type="submit" disabled={submitting} className="py-5! px-6!">
                            {submitting ? "Saving..." : isEditing ? "Update product" : "Add product"}
                        </Button>
                        {isEditing && (
                            <Button type="button" variant="outline" className="py-5! px-6!" onClick={onCancel}>
                                Cancel edit
                            </Button>
                        )}
                    </div> */}

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                        <Button type="submit" disabled={submitting} className="w-full py-5! px-6! sm:w-auto">
                            {submitting ? "Saving..." : isEditing ? "Update product" : "Add product"}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full py-5! px-6! sm:w-auto"
                            onClick={onCancel}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                    </div>

                </form>
            </CardContent>
        </Card>
    );
};

export default AdminProductForm;
