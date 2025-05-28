'use client';

import { useState, useEffect, useCallback } from 'react';

// Интерфейсы
export interface CartItem {
  id: string;
  productSlug: string;
  name: string;
  price: number;
  imageUrl: string;
  color: { id: number; name: string };
  size: number;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface UseCartReturn {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (
    product: { slug: string; Name: string; Price: number; imageUrl: string },
    color: { id: number; Name: string },
    size: number
  ) => Promise<boolean>;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  calculateSummary: () => CartSummary;
  clearCart: () => Promise<boolean>;
  loadCart: () => void;
  isInCart: (productSlug: string, colorId: number, size: number) => boolean;
  getItemQuantity: (productSlug: string, colorId: number, size: number) => number;
}

/**
 * Хук для управления корзиной покупок
 */
const useCart = (): UseCartReturn => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем корзину при инициализации
  useEffect(() => {
    loadCart();
  }, []);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (err) {
        console.error('Ошибка при сохранении корзины:', err);
      }
    }
  }, [cartItems, loading]);

  // Функция загрузки корзины из localStorage
  const loadCart = useCallback(() => {
    try {
      setLoading(true);
      
      if (typeof window !== 'undefined') {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          // Валидируем структуру данных
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          }
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке корзины:', err);
      setError('Не удалось загрузить корзину');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Функция добавления товара в корзину
  const addToCart = useCallback(async (
    product: { slug: string; Name: string; Price: number; imageUrl: string },
    color: { id: number; Name: string },
    size: number
  ): Promise<boolean> => {
    try {
      const itemId = `${product.slug}-${color.id}-${size}`;
      
      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.id === itemId);
        
        if (existingItemIndex !== -1) {
          // Увеличиваем количество существующего товара
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1
          };
          return updatedItems;
        } else {
          // Добавляем новый товар
          const newItem: CartItem = {
            id: itemId,
            productSlug: product.slug,
            name: product.Name,
            price: product.Price,
            imageUrl: product.imageUrl,
            color: { id: color.id, name: color.Name },
            size,
            quantity: 1
          };
          
          return [...prevItems, newItem];
        }
      });
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Ошибка при добавлении в корзину:', err);
      setError('Не удалось добавить товар в корзину');
      return false;
    }
  }, []);

  // Функция удаления товара из корзины
  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    setError(null);
  }, []);

  // Функция обновления количества товара
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
    setError(null);
  }, [removeFromCart]);

  // Функция расчета итогов корзины
  const calculateSummary = useCallback((): CartSummary => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    // Логика расчета доставки (бесплатная доставка от 5000 рублей)
    const shipping = subtotal >= 5000 ? 0 : 500;
    const total = subtotal + shipping;
    
    return {
      subtotal,
      shipping,
      total,
      itemCount
    };
  }, [cartItems]);

  // Функция очистки корзины
  const clearCart = useCallback(async (): Promise<boolean> => {
    try {
      setCartItems([]);
      setError(null);
      return true;
    } catch (err) {
      console.error('Ошибка при очистке корзины:', err);
      setError('Не удалось очистить корзину');
      return false;
    }
  }, []);

  // Функция проверки наличия товара в корзине
  const isInCart = useCallback((productSlug: string, colorId: number, size: number): boolean => {
    const itemId = `${productSlug}-${colorId}-${size}`;
    return cartItems.some(item => item.id === itemId);
  }, [cartItems]);

  // Функция получения количества конкретного товара в корзине
  const getItemQuantity = useCallback((productSlug: string, colorId: number, size: number): number => {
    const itemId = `${productSlug}-${colorId}-${size}`;
    const item = cartItems.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  return {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateSummary,
    clearCart,
    loadCart,
    isInCart,
    getItemQuantity,
  };
};

export default useCart;