import { useCart } from "@/context/CartContex";

const CartPage = () => {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        cartTotal,
    } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">
                    Your cart is empty
                </h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-3xl font-bold mb-8">
                Shopping Cart
            </h1>

            <div className="max-w-4xl mx-auto space-y-4">

                {cart.map((item) => (
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

                        </div>

                        <div className="text-right">

                            <p className="font-bold">
                                ₹{(
                                    item.price * item.cartQuantity
                                ).toLocaleString("en-IN")}
                            </p>

                            <button
                                onClick={() =>
                                    removeFromCart(item.id)
                                }
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
    );
};

export default CartPage;
