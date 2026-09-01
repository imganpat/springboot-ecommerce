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

const CartContext = createContext();

const readCartFromStorage = () => {
    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        return storedCart ? JSON.parse(storedCart) : [];
    } catch {
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => readCartFromStorage());

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch {
            // Ignore storage errors silently.
        }
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            cartQuantity: item.cartQuantity + quantity,
                        }
                        : item
                );
            }

            return [
                ...prevCart,
                {
                    ...product,
                    cartQuantity: quantity,
                },
            ];
        });
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
            prevCart.map((item) =>
                item.id === productId
                    ? {
                        ...item,
                        cartQuantity: quantity,
                    }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce(
        (total, item) => total + item.cartQuantity,
        0
    );

    const cartTotal = cart.reduce(
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
