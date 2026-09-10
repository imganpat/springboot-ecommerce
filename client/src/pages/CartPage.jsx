import { useState } from "react";

import Popup from "@/components/ui/popup";
import { useCart } from "@/context/CartContex";
import { getImageUrl } from "@/config/image";

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

            <div className="mt-4 bg-gray-100 p-4 sm:mt-12! sm:p-8">

                <h1 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
                    Shopping Cart
                </h1>

                <div className="max-w-4xl mx-auto space-y-4">

                    {availableCart.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col items-start gap-4 rounded-xl bg-white p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5"
                        >

                            <img
                                src={getImageUrl(item.imageFilename)}
                                alt={item.name}
                                className="h-28 w-full rounded-lg bg-gray-100 object-contain sm:h-32 sm:w-32"
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

                            <div className="flex w-full items-center justify-between gap-4 text-left sm:w-auto sm:text-right">

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

                    <div className="flex flex-col gap-2 rounded-xl bg-white p-5 sm:flex-row sm:justify-between sm:p-6">

                        <span className="text-xl font-semibold">
                            Total
                        </span>

                        <span className="text-xl font-bold sm:text-2xl">
                            ₹{cartTotal.toLocaleString("en-IN")}
                        </span>

                    </div>

                </div>
            </div>
        </>
    );
};

export default CartPage;
