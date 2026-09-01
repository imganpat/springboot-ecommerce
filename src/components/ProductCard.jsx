import { useState } from "react";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useCart } from "../contexts/CartContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";


export default function ProductCard({ product }) {
    return (
        <NavLink to={`/product/${product.id}`} className="block">
            <Card className="group relative h-full bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Image Section */}
                <div className="relative h-48 sm:h-56 bg-gray-100 overflow-hidden flex items-center justify-center">
                    <img
                        src={`http://localhost:8080/uploads/images/${product.imageFilename}`}
                        alt={product.name}
                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Content Section */}
                <div className="p-4! flex flex-col">
                    {/* Title */}
                    <CardTitle className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition">
                        {product.name}
                    </CardTitle>

                    {/* Price and Cart Button */}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                            ₹{product.price}
                        </span>
                        <button className="p-2! rounded-full bg-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white transition">
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>
            </Card>
        </NavLink>
    );
}