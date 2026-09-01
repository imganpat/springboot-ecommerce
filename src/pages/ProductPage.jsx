import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "@/services/productService";
import { ShoppingCart, Heart, ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContex";

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center">
                <p className="text-gray-600 text-lg">Loading...</p>
            </div>
        );
    }

    const imageUrl = `http://localhost:8080/uploads/images/${product.imageFilename}`;

    const increaseQuantity = () => {
        if (quantity < product.quantity) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const handleBuyNow = () => {
        console.log("Buy now:", {
            productId: product.id,
            quantity: quantity,
        });
    };

    return (
        <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center p-6">

            {/* Product Card */}
            <div
                id="product"
                className="w-full max-w-5xl min-h-[550px] bg-white shadow-xl rounded-2xl p-5 flex flex-col md:flex-row gap-8"
            >

                {/* LEFT SIDE - IMAGE */}
                <div className="w-full md:w-1/2 bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">

                    {/* Wishlist */}
                    <button
                        onClick={() => setLiked(!liked)}
                        className={`absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white shadow flex items-center justify-center transition
                            ${liked
                                ? "text-red-500"
                                : "text-gray-600 hover:text-red-500"
                            }`}
                    >
                        <Heart
                            className="w-5 h-5"
                            fill={liked ? "currentColor" : "none"}
                        />
                    </button>

                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full max-h-[520px] object-contain p-8"
                    />
                </div>

                {/* RIGHT SIDE - PRODUCT DETAILS */}
                <div className="w-full md:w-1/2 flex flex-col justify-between py-4">

                    <div className="flex flex-col h-full gap-4">
                        {/* Back */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition mb-8!"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>

                        {/* Product label */}
                        <p className="text-blue-500 font-semibold text-sm uppercase tracking-wider">
                            Product
                        </p>

                        {/* Product name */}
                        <h1 className="text-4xl font-bold text-gray-900 mt-2">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <p className="text-3xl font-bold text-gray-900 mt-5">
                            ₹{product.price.toLocaleString("en-IN")}
                        </p>

                        {/* Description */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Description
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Stock */}
                        <div className="mt-6">
                            {product.quantity > 0 ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />

                                    <span className="text-green-600 font-medium">
                                        In Stock
                                    </span>

                                    <span className="text-gray-400">
                                        ({product.quantity} available)
                                    </span>
                                </div>
                            ) : (
                                <span className="text-red-500 font-medium">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Quantity */}
                        {product.quantity > 0 && (
                            <div className="mt-6">
                                <p className="font-semibold text-gray-900 mb-2">
                                    Quantity
                                </p>

                                <div className="flex items-center w-fit border border-gray-300 rounded-lg overflow-hidden">

                                    <button
                                        onClick={decreaseQuantity}
                                        disabled={quantity === 1}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>

                                    <span className="w-12 text-center font-semibold">
                                        {quantity}
                                    </span>

                                    <button
                                        onClick={increaseQuantity}
                                        disabled={quantity === product.quantity}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-8 h-40 pt-6">

                        <div className="w-80 flex justify-evenly gap-4">

                            <button
                                onClick={handleBuyNow}
                                disabled={product.quantity === 0}
                                className="flex-1 px-6! py-3! rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Buy Now
                            </button>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.quantity === 0}
                                className="flex-1 px-6 py-3 rounded-lg border border-blue-500 text-blue-500 font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>

                        </div>

                        <p className="text-xs text-gray-400 mt-4!">
                            Product ID: {product.id}
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
