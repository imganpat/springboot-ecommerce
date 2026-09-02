// import { useState } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//     const [cart, setCart] = useState([]);

//     return (
//         <CartContext.Provider value={{ cart, setCart }}>
//             {children}
//         </CartContext.Provider>
//     );
// }


// export const useCart = () => {
//     return useContext(CartContext);
// }

import { createContext, useContext, useEffect, useState } from "react";

const CART_STORAGE_KEY = "cart";

const isProductUnavailable = (product) => {
    return Boolean(product?.deleted) || Number(product?.quantity ?? 0) <= 0;
};

const sanitizeCart = (items = []) => {
    return items.filter((item) => !isProductUnavailable(item));
};

const CartContext = createContext();

const readCartFromStorage = () => {
    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        return storedCart ? sanitizeCart(JSON.parse(storedCart)) : [];
    } catch {
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => readCartFromStorage());

    useEffect(() => {
        try {
            const cleanCart = sanitizeCart(cart);
            if (JSON.stringify(cleanCart) !== JSON.stringify(cart)) {
                setCart(cleanCart);
                return;
            }
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cleanCart));
        } catch {
            // Ignore storage errors silently.
        }
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        if (isProductUnavailable(product)) {
            return false;
        }

        const requestedQuantity = Number(quantity) > 0 ? Number(quantity) : 1;

        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                const nextQuantity = existingItem.cartQuantity + requestedQuantity;
                const maxAvailable = Number(product.quantity ?? 0);

                if (maxAvailable > 0 && nextQuantity > maxAvailable) {
                    return prevCart.map((item) =>
                        item.id === product.id
                            ? {
                                ...item,
                                cartQuantity: maxAvailable,
                            }
                            : item
                    );
                }

                return prevCart.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            cartQuantity: nextQuantity,
                        }
                        : item
                );
            }

            return [
                ...prevCart,
                {
                    ...product,
                    cartQuantity: Math.min(requestedQuantity, Number(product.quantity ?? requestedQuantity)),
                },
            ];
        });

        return true;
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) =>
            prevCart.filter((item) => item.id !== productId)
        );
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart((prevCart) =>
            prevCart
                .filter((item) => !isProductUnavailable(item))
                .map((item) => {
                    if (item.id !== productId) {
                        return item;
                    }

                    const maxAvailable = Number(item.quantity ?? 0);
                    return {
                        ...item,
                        cartQuantity: maxAvailable > 0 ? Math.min(quantity, maxAvailable) : 0,
                    };
                })
                .filter((item) => item.cartQuantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const validCart = sanitizeCart(cart);

    const cartCount = validCart.reduce(
        (total, item) => total + item.cartQuantity,
        0
    );

    const cartTotal = validCart.reduce(
        (total, item) => total + item.price * item.cartQuantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
