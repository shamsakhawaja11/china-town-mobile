import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // One line per dish: { item, quantity }. Mirrors order_items, which has
  // UNIQUE (order_id, menu_item_id).
  const [lines, setLines] = useState([]);

  // Empty the cart on logout so the next person on this phone starts fresh.
  // The guard returns the same array when it is already empty, which avoids a
  // pointless re-render on app start (isAuthenticated is false while restoring).
  useEffect(() => {
    if (!isAuthenticated) {
      setLines((prev) => (prev.length === 0 ? prev : []));
    }
  }, [isAuthenticated]);

  const addItem = useCallback((item) => {
    setLines((prev) => {
      const exists = prev.some((line) => line.item.id === item.id);
      if (exists) {
        return prev.map((line) =>
          line.item.id === item.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }, []);

  const decrementItem = useCallback((itemId) => {
    setLines((prev) =>
      prev
        .map((line) =>
          line.item.id === itemId
            ? { ...line, quantity: line.quantity - 1 }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((itemId) => {
    setLines((prev) => prev.filter((line) => line.item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  // Total quantity across all lines (feeds the badge).
  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  // Display only. Prices arrive as strings ("450.00"), so convert first.
  // Checkout must recompute prices on the backend.
  const subtotal = useMemo(
    () =>
      lines.reduce(
        (sum, line) => sum + Number(line.item.price) * line.quantity,
        0,
      ),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      addItem,
      decrementItem,
      removeItem,
      clearCart,
    }),
    [lines, itemCount, subtotal, addItem, decrementItem, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return context;
};