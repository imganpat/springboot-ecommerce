import { useState } from "react";

import Popup from "@/components/ui/popup";
import { useCart } from "@/context/CartContex";

const CartPage = () => {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        cartTotal,
    } = useCart();

    const availableCart = cart.filter((item) => !item.deleted && Number(item.quantity ?? 0) > 0);
    const [removeItemId, setRemoveItemId] = useState(null);

    const handleRemoveConfirm = () => {
        if (removeItemId) {
            removeFromCart(removeItemId);
            setRemoveItemId(null);
        }
    };

    if (availableCart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">
                    Your cart is empty
                </h1>
            </div>
        );
    }

    const removeItem = availableCart.find((item) => item.id === removeItemId);

    return (
        <>
            <Popup
                open={Boolean(removeItemId)}
                title="Remove item"
                description={removeItem ? `Are you sure you want to remove ${removeItem.name} from your cart?` : "Are you sure you want to remove this item from your cart?"}
                confirmText="Remove"
                confirmVariant="destructive"
                onConfirm={handleRemoveConfirm}
                onCancel={() => setRemoveItemId(null)}
            />

            <div className="bg-gray-100 p-8 mt-20!">

                <h1 className="text-3xl font-bold mb-8">
                    Shopping Cart
                </h1>

                <div className="max-w-4xl mx-auto space-y-4">

                    {availableCart.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl p-5 flex items-center gap-6"
                        >

                            <img
                                src={`http://localhost:8080/uploads/images/${item.imageFilename}`}
                                alt={item.name}
                                className="w-32 h-32 object-contain bg-gray-100 rounded-lg"
                            />

                            <div className="flex-1">

                                <h2 className="text-xl font-semibold">
                                    {item.name}
                                </h2>

                                <p className="text-gray-500">
                                    ₹{item.price.toLocaleString("en-IN")}
                                </p>

                                {Number(item.quantity ?? 0) <= 0 ? (
                                    <p className="mt-2 text-sm text-red-500">This product is no longer available.</p>
                                ) : (
                                    <div className="flex items-center gap-3 mt-4">

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.cartQuantity - 1
                                                )
                                            }
                                            className="w-8 h-8 border rounded"
                                        >
                                            -
                                        </button>

                                        <span>
                                            {item.cartQuantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.cartQuantity + 1
                                                )
                                            }
                                            className="w-8 h-8 border rounded"
                                        >
                                            +
                                        </button>

                                    </div>
                                )}

                            </div>

                            <div className="text-right">

                                <p className="font-bold">
                                    ₹{(
                                        item.price * item.cartQuantity
                                    ).toLocaleString("en-IN")}
                                </p>

                                <button
                                    onClick={() => setRemoveItemId(item.id)}
                                    className="text-red-500 mt-3"
                                >
                                    Remove
                                </button>

                            </div>

                        </div>
                    ))}

                    <div className="bg-white rounded-xl p-6 flex justify-between">

                        <span className="text-xl font-semibold">
                            Total
                        </span>

                        <span className="text-2xl font-bold">
                            ₹{cartTotal.toLocaleString("en-IN")}
                        </span>

                    </div>

                </div>
            </div>
        </>
    );
};

export default CartPage;
