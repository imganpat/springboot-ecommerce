import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "@/services/productService";
import {
    ShoppingCart,
    Heart,
    ArrowLeft,
    Plus,
    Minus,
    Store,
    ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContex";
import Popup from "@/components/ui/popup";
import { getImageUrl } from "@/config/image";

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [liked, setLiked] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState({
        title: "",
        description: "",
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
                setQuantity(1);
                setActiveImageIndex(0);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading product...</p>
                </div>
            </div>
        );
    }

    const imageList = product?.imageFilenames?.length
        ? product.imageFilenames
        : product?.imageFilename
            ? [product.imageFilename]
            : [];

    const activeImage =
        imageList[activeImageIndex] || imageList[0];

    const imageUrl = getImageUrl(activeImage);

    const isOutOfStock =
        product.deleted || Number(product.quantity ?? 0) <= 0;

    const increaseQuantity = () => {
        if (quantity < Number(product.quantity)) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (isOutOfStock) {
            setPopupMessage({
                title: "Out of stock",
                description: `${product.name} is currently unavailable.`,
            });

            setPopupOpen(true);
            return;
        }

        const added = addToCart(product, quantity);

        if (added) {
            setPopupMessage({
                title: "Added to cart",
                description: `${quantity} ${product.name} ${quantity > 1 ? "items" : "item"
                    } added to your cart.`,
            });

            setPopupOpen(true);
        }
    };

    const handleBuyNow = () => {
        console.log("Buy now:", {
            productId: product.id,
            quantity,
        });
    };

    return (
        <>
            <Popup
                open={popupOpen}
                title={popupMessage.title}
                description={popupMessage.description}
                confirmText="Continue Shopping"
                onConfirm={() => setPopupOpen(false)}
                onCancel={() => setPopupOpen(false)}
            />

            <main className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 lg:h-[calc(100vh-64px)] lg:overflow-hidden">
                <div className="max-w-6xl mx-auto h-full flex flex-col min-h-0">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-3 flex-shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4" />

                        <span className="font-medium">
                            Back to products
                        </span>
                    </button>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-1 min-h-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 h-full min-h-0">
                            <div className="bg-gray-50 p-4 sm:p-6 flex flex-col min-h-0">
                                <div className="relative flex-1 min-h-[360px] lg:min-h-0 rounded-2xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setLiked((prev) => !prev)
                                        }
                                        aria-label="Add to wishlist"
                                        className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-all hover:scale-105 ${liked
                                            ? "text-red-500"
                                            : "text-gray-500 hover:text-red-500"
                                            }`}
                                    >
                                        <Heart
                                            className="w-5 h-5"
                                            fill={
                                                liked
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    </button>

                                    {/* Product Image */}
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-6 sm:p-8"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <Store className="w-6 h-6" />
                                            </div>

                                            <p className="text-sm">
                                                No image available
                                            </p>
                                        </div>
                                    )}

                                    {/* Previous Image */}
                                    {imageList.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveImageIndex(
                                                    (prev) =>
                                                        prev === 0
                                                            ? imageList.length - 1
                                                            : prev - 1
                                                )
                                            }
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition"
                                            aria-label="Previous image"
                                        >
                                            ‹
                                        </button>
                                    )}

                                    {/* Next Image */}
                                    {imageList.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveImageIndex(
                                                    (prev) =>
                                                        (prev + 1) %
                                                        imageList.length
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition"
                                            aria-label="Next image"
                                        >
                                            ›
                                        </button>
                                    )}

                                    {/* Image Indicators */}
                                    {imageList.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm">
                                            {imageList.map(
                                                (image, index) => (
                                                    <button
                                                        key={`${product.id}-${image}`}
                                                        type="button"
                                                        aria-label={`View image ${index + 1
                                                            }`}
                                                        onClick={() =>
                                                            setActiveImageIndex(
                                                                index
                                                            )
                                                        }
                                                        className={`h-2 w-2 rounded-full transition-all ${index ===
                                                            activeImageIndex
                                                            ? "bg-white w-5"
                                                            : "bg-white/50"
                                                            }`}
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-3 flex-shrink-0">
                                    <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="w-4 h-4 text-green-600" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                                                Secure Purchase
                                            </p>

                                            <p className="text-[11px] sm:text-xs text-gray-400 truncate">
                                                Safe & reliable
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <Store className="w-4 h-4 text-blue-600" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                                                Trusted Seller
                                            </p>

                                            <p className="text-[11px] sm:text-xs text-gray-400 truncate">
                                                {product.owner?.name ||
                                                    "Seller"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-7 lg:p-8 flex flex-col min-h-0 overflow-hidden">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                                            Product
                                        </span>

                                        {isOutOfStock ? (
                                            <span className="text-sm font-semibold text-red-500">
                                                Out of Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
                                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                                In Stock
                                            </span>
                                        )}
                                    </div>

                                    {/* Product Name */}
                                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mt-4">
                                        {product.name}
                                    </h1>

                                    {/* Seller */}
                                    <div className="mt-3 inline-flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 px-3.5 py-2.5">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Store className="w-4 h-4 text-blue-600" />
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Sold by
                                            </p>

                                            <p className="text-sm font-semibold text-gray-800">
                                                {product.owner?.name ||
                                                    "Unknown seller"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="mt-5">
                                        <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                                            ₹
                                            {Number(
                                                product.price
                                            ).toLocaleString("en-IN")}
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-gray-100 my-5" />

                                    {/* Description */}
                                    <div>
                                        <h2 className="text-base font-semibold text-gray-900 mb-1.5">
                                            Description
                                        </h2>

                                        <p className="text-gray-600 leading-6 text-sm sm:text-base line-clamp-3">
                                            {product.description ||
                                                "No description available for this product."}
                                        </p>
                                    </div>

                                    {/* Stock Information */}
                                    <div className="mt-5">
                                        {isOutOfStock ? (
                                            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                                                <p className="font-semibold text-red-600">
                                                    Currently unavailable
                                                </p>

                                                <p className="text-sm text-red-500 mt-1">
                                                    This product is currently
                                                    out of stock.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />

                                                <span className="font-medium text-green-600">
                                                    In Stock
                                                </span>

                                                <span className="text-sm text-gray-400">
                                                    · {product.quantity}{" "}
                                                    available
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    {!isOutOfStock && (
                                        <div className="mt-5">
                                            <p className="text-sm font-semibold text-gray-900 mb-2">
                                                Quantity
                                            </p>

                                            <div className="flex items-center w-fit rounded-xl border border-gray-200 overflow-hidden bg-white">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        decreaseQuantity
                                                    }
                                                    disabled={
                                                        quantity === 1
                                                    }
                                                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>

                                                <span className="w-12 text-center font-semibold text-gray-900">
                                                    {quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        increaseQuantity
                                                    }
                                                    disabled={
                                                        quantity >=
                                                        Number(
                                                            product.quantity
                                                        )
                                                    }
                                                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-5 flex-shrink-0">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            type="button"
                                            onClick={handleBuyNow}
                                            disabled={isOutOfStock}
                                            className="flex-1 min-h-11 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        >
                                            Buy Now
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            disabled={isOutOfStock}
                                            className="flex-1 min-h-11 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 active:bg-blue-100 transition disabled:border-gray-200 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        >
                                            <ShoppingCart className="w-5 h-5" />

                                            Add to Cart
                                        </button>
                                    </div>

                                    {/* Metadata */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-1.5 sm:gap-6 text-xs text-gray-400">
                                        <span>
                                            Product ID:{" "}
                                            <span className="text-gray-500">
                                                {product.id}
                                            </span>
                                        </span>

                                        <span>
                                            Seller:{" "}
                                            <span className="text-gray-500">
                                                {product.owner?.name ||
                                                    "Unknown seller"}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ProductPage;
