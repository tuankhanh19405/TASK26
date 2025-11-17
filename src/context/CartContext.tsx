import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { CartAction, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const newQty = Math.max(1, Math.min(quantity, 99));
      return state.map(item =>
        item.id === id ? { ...item, quantity: newQty } : item
      );
    }

    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload);

    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};