/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const CART_STORAGE_KEY = "cart_data";

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.warn(
        "Failed to parse cart from localStorage, clearing storage:",
        error
      );
      localStorage.removeItem(CART_STORAGE_KEY);
      return {};
    }
  };

  const saveCartToStorage = (cartData) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.warn("Failed to save cart to localStorage:", error);
    }
  };

  const [cart, setCart] = useState(loadCartFromStorage);

  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = (storeId, item) => {
    setCart((prevCart) => {
      const existingItems = prevCart[storeId] || [];
      const existingItemIndex = existingItems.findIndex((existingItem) => {
        const { quantity, ...existingProps } = existingItem;
        const { quantity: itemQuantity, ...newProps } = item;
        return JSON.stringify(existingProps) === JSON.stringify(newProps);
      });

      let updatedItems;
      if (existingItemIndex !== -1) {
        updatedItems = existingItems.map((existingItem, index) => {
          if (index === existingItemIndex) {
            return {
              ...existingItem,
              quantity: existingItem.quantity + item.quantity,
            };
          }
          return existingItem;
        });
      } else {
        updatedItems = [...existingItems, item];
      }
      return { ...prevCart, [storeId]: updatedItems };
    });
  };

  const increaseQuantity = (storeId, itemIndex) => {
    setCart((prevCart) => {
      if (!prevCart[storeId] || !prevCart[storeId][itemIndex]) {
        return prevCart;
      }

      const updatedItems = [...prevCart[storeId]];
      const item = updatedItems[itemIndex];

      updatedItems[itemIndex] = {
        ...item,
        quantity: item.quantity + 1,
        total:
          parseFloat(item.price) * (item.quantity + 1) +
          (item.selectedOptions.length
            ? parseFloat(item.additionalPrice || 0) * (item.quantity + 1)
            : 0),
      };

      return { ...prevCart, [storeId]: updatedItems };
    });
  };

  const decreaseQuantity = (storeId, itemIndex) => {
    setCart((prevCart) => {
      if (!prevCart[storeId] || !prevCart[storeId][itemIndex]) {
        return prevCart;
      }

      const updatedItems = [...prevCart[storeId]];
      const item = updatedItems[itemIndex];

      if (item.quantity <= 1) {
        return removeItem(storeId, itemIndex, true);
      }

      updatedItems[itemIndex] = {
        ...item,
        quantity: item.quantity - 1,
        total:
          parseFloat(item.price) * (item.quantity - 1) +
          (item.selectedOptions.length
            ? parseFloat(item.additionalPrice || 0) * (item.quantity - 1)
            : 0),
      };

      return { ...prevCart, [storeId]: updatedItems };
    });
  };

  const removeItem = (storeId, itemIndex, isStateUpdate = false) => {
    if (isStateUpdate) {
      const updatedStoreItems = prevCart[storeId].filter(
        (_, index) => index !== itemIndex
      );

      if (updatedStoreItems.length === 0) {
        const { [storeId]: _, ...restCart } = prevCart;
        return restCart;
      }

      return { ...prevCart, [storeId]: updatedStoreItems };
    } else {
      setCart((prevCart) => {
        if (!prevCart[storeId] || !prevCart[storeId][itemIndex]) {
          return prevCart;
        }

        const updatedStoreItems = prevCart[storeId].filter(
          (_, index) => index !== itemIndex
        );

        if (updatedStoreItems.length === 0) {
          const { [storeId]: _, ...restCart } = prevCart;
          return restCart;
        }

        return { ...prevCart, [storeId]: updatedStoreItems };
      });
    }
  };

  const removeWholeStore = (storeId) => {
    setCart((prevCart) => {
      const { [storeId]: _, ...restCart } = prevCart;
      return restCart;
    });
  };

  const value = {
    cart,
    setCart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    removeWholeStore,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
