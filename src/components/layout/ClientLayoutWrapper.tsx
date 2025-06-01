'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Загружаем счетчики при монтировании
  useEffect(() => {
    const loadCounts = () => {
      try {
        // Загружаем корзину
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cart = JSON.parse(savedCart);
          if (Array.isArray(cart)) {
            // Считаем общее количество товаров (с учетом quantity)
            const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
            setCartCount(totalItems);
          }
        }

        // Загружаем избранное
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          const favorites = JSON.parse(savedFavorites);
          if (Array.isArray(favorites)) {
            setFavoritesCount(favorites.length);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке счетчиков:', error);
      }
    };

    loadCounts();

    // Подписываемся на изменения localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart' || e.key === 'favorites') {
        loadCounts();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Также слушаем кастомные события для обновления счетчиков
    const handleCartUpdate = () => loadCounts();
    const handleFavoritesUpdate = () => loadCounts();

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - передаем счетчики */}
      <Header />
      
      {/* Основной контент */}
      <main className="flex-1 relative">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* MobileNav - передаем актуальные счетчики */}
      <MobileNav 
        cartCount={cartCount} 
        favoritesCount={favoritesCount} 
      />
    </div>
  );
}