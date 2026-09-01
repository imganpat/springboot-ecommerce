import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useCart } from "@/context/CartContex";
import Popup from "@/components/ui/popup";
import { Card, CardTitle } from "./ui/card";

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [popupOpen, setPopupOpen] = useState(false);

    const primaryImage = product.imageFilename || product.imageFilenames?.[0];
    const imageUrl = primaryImage ? `http://localhost:8080/uploads/images/${primaryImage}` : "";

    const handleAddToCart = (event) => {
        event.preventDefault();
        addToCart(product, 1);
        setPopupOpen(true);
    };

    return (
        <>
            <NavLink to={`/product/${product.id}`} className="block">
                <Card className="group relative h-full bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-48 sm:h-56 bg-gray-100 overflow-hidden flex items-center justify-center">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="text-sm text-gray-400">No image</div>
                        )}
                    </div>

                    <div className="p-4! flex flex-col">
                        <CardTitle className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition">
                            {product.name}
                        </CardTitle>

                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                                ₹{product.price}
                            </span>
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="p-2! rounded-full bg-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white transition"
                                aria-label={`Add ${product.name} to cart`}
                            >
                                <ShoppingCart size={18} />
                            </button>
                        </div>
                    </div>
                </Card>
            </NavLink>

            <Popup
                open={popupOpen}
                title="Added to cart"
                description={`${product.name} has been added to your cart.`}
                confirmText="Continue Shopping"
                onConfirm={() => setPopupOpen(false)}
                onCancel={() => setPopupOpen(false)}
            />
        </>
    );
}