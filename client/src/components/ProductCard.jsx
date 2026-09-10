import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useCart } from "@/context/CartContex";
import Popup from "@/components/ui/popup";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { getImageUrl } from "@/config/image";

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [popupOpen, setPopupOpen] = useState(false);

    const isUnavailable = product.deleted || Number(product.quantity ?? 0) <= 0;
    const primaryImage = product.imageFilename || product.imageFilenames?.[0];
    const imageUrl = getImageUrl(primaryImage);

    const handleAddToCart = (event) => {
        event.preventDefault();

        if (isUnavailable) {
            setPopupOpen(true);
            return;
        }

        const added = addToCart(product, 1);
        if (added) {
            setPopupOpen(true);
        }
    };

    return (
        <>
            <NavLink to={`/product/${product.id}`} className="block">
                <Card className="group relative h-full rounded-2xl border border-black/10 bg-white shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-[#17211b]/30 hover:shadow-xl">
                    <div className="relative flex h-56 items-center justify-center overflow-hidden sm:h-64">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="text-sm text-gray-400">No image</div>
                        )}

                        {isUnavailable && (
                            <span className="absolute left-3 top-3 rounded-full bg-[#e56b45] px-2.5 py-1 text-xs font-semibold text-white">
                                Out of stock
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col px-5!">
                        <CardTitle className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 transition group-hover:text-[#e56b45] sm:text-base">
                            {product.name}
                        </CardTitle>

                        <CardDescription>
                            {product.description}

                            <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-4">
                                <span className="text-lg font-bold text-gray-900 sm:text-xl">
                                    ₹
                                    {Number(
                                        product.price
                                    ).toLocaleString("en-IN")}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={isUnavailable}
                                    className={`rounded-full p-2! transition ${isUnavailable
                                        ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                        : "bg-[#dbeafe] text-[#1d4ed8] hover:bg-[#2563eb] hover:text-white"
                                        }`}
                                    aria-label={isUnavailable ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
                                >
                                    <ShoppingCart size={18} />
                                </button>
                            </div>
                        </CardDescription>
                    </div>
                </Card>
            </NavLink >

            <Popup
                open={popupOpen}
                title={isUnavailable ? "Out of stock" : "Added to cart"}
                description={
                    isUnavailable
                        ? `${product.name} is currently unavailable.`
                        : `${product.name} has been added to your cart.`
                }
                confirmText="Continue Shopping"
                onConfirm={() => setPopupOpen(false)}
                onCancel={() => setPopupOpen(false)}
            />
        </>
    );
}