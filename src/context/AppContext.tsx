'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Интерфейсы для типизации
export interface Product {
  slug: string;
  Name: string;
  Description: string;
  Price: number;
  imageUrl: string;
  imageUrls: string[];
  brandName: string;
  brandSlug: string;
  categoryNames: string[];
  categoryIds: string[];
  categorySlugs: string[];
  genders: string[];
  colors: string[];
  sizes: number[];
}

export interface BrandWithProducts {
  name: string;
  slug: string;
  products: Product[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  selected?: boolean;
}

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

export interface FavoriteItem {
  id: string;
  product: Partial<Product>;
  color: { id: number; name: string; colorCode?: string };
}

// Определяем интерфейс для контекста
interface AppContextType {
  // Продукты
  products: Product[];
  brandProducts: BrandWithProducts[];
  productsLoading: boolean;
  productsError: string | null;
  refreshProducts: () => void;
  filterProductsByCategory: (categoryName: string) => Product[];
  
  // Категории
  categories: Category[];
  selectedCategory: string;
  categoriesLoading: boolean;
  categoriesError: string | null;
  selectCategory: (categoryName: string) => void;
  refreshCategories: () => void;
  
  // Корзина
  cartItems: CartItem[];
  cartLoading: boolean;
  cartError: string | null;
  addToCart: (product: Partial<Product>, color: any, size: number) => Promise<boolean>;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  cartSummary: { subtotal: number; shipping: number; total: number; itemCount: number };
  clearCart: () => Promise<boolean>;
  
  // Избранное
  favorites: FavoriteItem[];
  favoritesLoading: boolean;
  favoritesError: string | null;
  addToFavorites: (product: Partial<Product>, color: any) => void;
  removeFromFavorites: (favoriteId: string) => void;
  getFavorites: () => FavoriteItem[];
  isInFavorites: (productSlug: string, colorId: number) => boolean;
  toggleFavorite: (product: Partial<Product>, color: any) => void;
  
  // Поиск
  searchResults: Product[];
  searchLoading: boolean;
  searchError: string | null;
  searchProducts: (query: string, filters?: any) => void;
  
  // Общее состояние приложения
  appLoading: boolean;
}

// Создаем контекст
const AppContext = createContext<AppContextType | undefined>(undefined);

// Создаем провайдер контекста
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Состояния для продуктов
  const [products, setProducts] = useState<Product[]>([]);
  const [brandProducts, setBrandProducts] = useState<BrandWithProducts[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  
  // Состояния для категорий
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  
  // Состояния для корзины
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  
  // Состояние для избранного
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  
  // Состояния для поиска
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Загрузка избранного при монтировании
  useEffect(() => {
    loadFavorites();
    loadCart();
  }, []);

  // Функция загрузки избранного из localStorage
  const loadFavorites = async () => {
    try {
      setFavoritesLoading(true);
      if (typeof window !== 'undefined') {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      }
      setFavoritesError(null);
    } catch (error) {
      console.error('Ошибка при загрузке избранного:', error);
      setFavoritesError('Не удалось загрузить избранное');
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Функция загрузки корзины из localStorage
  const loadCart = async () => {
    try {
      setCartLoading(true);
      if (typeof window !== 'undefined') {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      }
      setCartError(null);
    } catch (error) {
      console.error('Ошибка при загрузке корзины:', error);
      setCartError('Не удалось загрузить корзину');
    } finally {
      setCartLoading(false);
    }
  };

  // Сохранение избранного при изменении
  useEffect(() => {
    const saveFavorites = () => {
      try {
        if (typeof window !== 'undefined' && !favoritesLoading) {
          localStorage.setItem('favorites', JSON.stringify(favorites));
        }
      } catch (error) {
        console.error('Ошибка при сохранении избранного:', error);
      }
    };
    
    if (!favoritesLoading) {
      saveFavorites();
    }
  }, [favorites, favoritesLoading]);

  // Сохранение корзины при изменении
  useEffect(() => {
    const saveCart = () => {
      try {
        if (typeof window !== 'undefined' && !cartLoading) {
          localStorage.setItem('cart', JSON.stringify(cartItems));
        }
      } catch (error) {
        console.error('Ошибка при сохранении корзины:', error);
      }
    };
    
    if (!cartLoading) {
      saveCart();
    }
  }, [cartItems, cartLoading]);

  // Функции для работы с продуктами
  const refreshProducts = () => {
    // Здесь будет логика загрузки продуктов из API
    console.log('Refreshing products...');
  };

  const filterProductsByCategory = (categoryName: string) => {
    if (categoryName === 'All') {
      return products;
    }
    return products.filter(product => 
      product.categoryNames.includes(categoryName)
    );
  };

  // Функции для работы с категориями
  const selectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const refreshCategories = () => {
    // Здесь будет логика загрузки категорий из API
    console.log('Refreshing categories...');
  };

  // Функции для работы с корзиной
  const addToCart = async (product: Partial<Product>, color: any, size: number): Promise<boolean> => {
    try {
      const itemId = `${product.slug}-${color.id}-${size}`;
      
      // Проверяем, есть ли уже такой товар в корзине
      const existingItemIndex = cartItems.findIndex(item => item.id === itemId);
      
      if (existingItemIndex !== -1) {
        // Увеличиваем количество
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += 1;
        setCartItems(updatedItems);
      } else {
        // Добавляем новый товар
        const newItem: CartItem = {
          id: itemId,
          productSlug: product.slug!,
          name: product.Name!,
          price: product.Price!,
          imageUrl: product.imageUrl!,
          color: { id: color.id, name: color.Name || color.name },
          size,
          quantity: 1
        };
        
        setCartItems(prev => [...prev, newItem]);
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
      setCartError('Не удалось добавить товар в корзину');
      return false;
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async (): Promise<boolean> => {
    try {
      setCartItems([]);
      return true;
    } catch (error) {
      console.error('Ошибка при очистке корзины:', error);
      return false;
    }
  };

  // Расчет итогов корзины
  const calculateSummary = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const shipping = subtotal >= 5000 ? 0 : 500; // Бесплатная доставка от 5000
    const total = subtotal + shipping;
    
    return { subtotal, shipping, total, itemCount };
  };

  const cartSummary = calculateSummary();

  // Функции для работы с избранным
  const getFavorites = () => {
    return favorites;
  };

  const addToFavorites = (product: Partial<Product>, color: any) => {
    const favoriteId = `${product.slug}-${color.id}`;
    
    // Проверяем, есть ли такой товар уже в избранном
    const exists = favorites.some(item => item.id === favoriteId);
    
    if (!exists) {
      const newFavorite: FavoriteItem = {
        id: favoriteId,
        product,
        color: {
          id: color.id,
          name: color.Name || color.name,
          colorCode: color.colorCode
        }
      };
      
      setFavorites(prev => [...prev, newFavorite]);
    }
  };

  const removeFromFavorites = (favoriteId: string) => {
    setFavorites(prev => prev.filter(item => item.id !== favoriteId));
  };

  const isInFavorites = (productSlug: string, colorId: number): boolean => {
    const favoriteId = `${productSlug}-${colorId}`;
    return favorites.some(item => item.id === favoriteId);
  };

  const toggleFavorite = (product: Partial<Product>, color: any) => {
    const favoriteId = `${product.slug}-${color.id}`;
    
    if (isInFavorites(product.slug!, color.id)) {
      removeFromFavorites(favoriteId);
    } else {
      addToFavorites(product, color);
    }
  };

  // Функция поиска
  const searchProducts = async (query: string, filters?: any) => {
    setSearchLoading(true);
    
    try {
      // Простая реализация поиска по существующим продуктам
      if (query.length > 0) {
        const results = products.filter(product => {
          const searchLower = query.toLowerCase();
          return (
            product.Name.toLowerCase().includes(searchLower) ||
            product.brandName.toLowerCase().includes(searchLower) ||
            product.Description.toLowerCase().includes(searchLower)
          );
        });
        
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      
      setSearchError(null);
    } catch (error: any) {
      console.error('Ошибка при поиске:', error);
      setSearchError('Ошибка при поиске товаров');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Общее состояние загрузки приложения
  const appLoading = productsLoading || categoriesLoading || cartLoading || favoritesLoading;

  // Значение контекста
  const contextValue: AppContextType = {
    // Продукты
    products,
    brandProducts,
    productsLoading,
    productsError,
    refreshProducts,
    filterProductsByCategory,
    
    // Категории
    categories,
    selectedCategory,
    categoriesLoading,
    categoriesError,
    selectCategory,
    refreshCategories,
    
    // Корзина
    cartItems,
    cartLoading,
    cartError,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    cartSummary,
    clearCart,
    
    // Избранное
    favorites,
    favoritesLoading,
    favoritesError,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    isInFavorites,
    toggleFavorite,
    
    // Поиск
    searchResults,
    searchLoading,
    searchError,
    searchProducts,
    
    // Общее состояние
    appLoading
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Хук для использования контекста в компонентах
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};