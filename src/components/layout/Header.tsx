'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

// Навигационные ссылки
const navigationLinks = [
  { 
    name: 'Каталог', 
    href: '/catalog', 
    hasDropdown: true,
    subItems: [
      { name: 'Все товары', href: '/catalog' },
      { name: 'Новинки', href: '/catalog?filter=new' },
      { name: 'Распродажа', href: '/catalog?filter=sale' },
      { name: 'Премиум', href: '/catalog?filter=premium' },
    ]
  },
  { 
    name: 'Бренды', 
    href: '/brands',
    hasDropdown: true,
    subItems: [
      { name: 'Все бренды', href: '/brands' },
      { name: 'Nike', href: '/brands/nike' },
      { name: 'Adidas', href: '/brands/adidas' },
      { name: 'New Balance', href: '/brands/new-balance' },
    ]
  },
  { 
    name: 'Категории', 
    href: '/categories',
    hasDropdown: true,
    subItems: [
      { name: 'Все категории', href: '/categories' },
      { name: 'Кроссовки', href: '/categories/sneakers' },
      { name: 'Одежда', href: '/categories/clothing' },
      { name: 'Аксессуары', href: '/categories/accessories' },
    ]
  },
  { name: 'Тренды', href: '/trends' },
  { name: 'О нас', href: '/about' },
];

export function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Отслеживание скролла
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Загрузка счетчиков корзины и избранного
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedFavorites = localStorage.getItem('favorites');
    
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        setCartItemsCount(cart.length || 0);
      } catch {}
    }
    
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        setFavoritesCount(favorites.length || 0);
      } catch {}
    }
  }, []);

  // Обработка поиска
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Закрытие дропдауна при клике вне его
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out backdrop-blur-md',
        isScrolled 
          ? 'bg-background/95 border-b border-border shadow-2xl dark:shadow-black/40' 
          : 'bg-background/80 border-b border-transparent'
      )}>
        <div className="max-w-[1600px] mx-auto px-3">
          <div className="flex items-center justify-between h-20">
            
            {/* Логотип */}
            <Link 
              href="/" 
              className="flex items-center gap-3 no-underline z-2 group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <Icon name="gem" size={20} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-foreground leading-none tracking-tight">
                  STORE
                </div>
                <div className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  Premium
                </div>
              </div>
            </Link>

            {/* Десктопная навигация */}
            <nav className="hidden lg:flex items-center gap-2">
              {navigationLinks.map((link) => (
                <div 
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1 px-4 py-3 rounded-xl text-sm font-semibold no-underline transition-all duration-200',
                      'text-foreground hover:bg-muted hover:text-primary',
                      activeDropdown === link.name && 'bg-muted text-primary'
                    )}
                  >
                    {link.name}
                    {link.hasDropdown && (
                      <Icon 
                        name="chevron-down"
                        size={14} 
                        className={cn(
                          'transition-transform duration-200',
                          activeDropdown === link.name ? 'rotate-180' : 'rotate-0'
                        )}
                      />
                    )}
                  </Link>

                  {/* Выпадающее меню */}
                  {link.hasDropdown && activeDropdown === link.name && (
                    <div className="absolute top-full left-0 min-w-[200px] mt-2 p-2 bg-card border border-border rounded-2xl shadow-xl dark:shadow-black/40 animate-fadeIn">
                      {link.subItems?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-3 rounded-xl text-sm font-medium text-foreground no-underline transition-all duration-200 hover:bg-muted hover:text-primary"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Поиск */}
            <div className="flex-1 max-w-md mx-6 hidden md:block">
              <SearchBar 
                placeholder="Поиск товаров..."
                variant="default"
                onSearch={handleSearch}
                showSuggestions={true}
              />
            </div>

            {/* Действия пользователя */}
            <div className="flex items-center gap-2">
              
              {/* Мобильный поиск */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/search')}
                className="md:hidden rounded-xl"
              >
                <Icon name="search" size={20} />
              </Button>

              {/* Избранное */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/favorites')}
                className="relative rounded-xl"
              >
                <Icon name="heart" size={20} />
                {favoritesCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full border-2 border-card flex items-center justify-center text-xs font-bold text-destructive-foreground">
                    {favoritesCount}
                  </div>
                )}
              </Button>

              {/* Корзина */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/cart')}
                className="relative rounded-xl"
              >
                <Icon name="shopping-bag" size={20} />
                {cartItemsCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-card flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {cartItemsCount}
                  </div>
                )}
              </Button>

              {/* Профиль */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/profile')}
                className="hidden sm:flex rounded-xl"
              >
                <Icon name="user" size={20} />
              </Button>

              {/* Мобильное меню */}
              <Button
                variant={isMobileMenuOpen ? "default" : "ghost"}
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden rounded-xl"
              >
                <Icon name={isMobileMenuOpen ? "close" : "menu"} size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-card border-t-0 border-l border-r border-b border-border shadow-xl dark:shadow-black/40 animate-slideDown">
            <div className="p-5">
              {/* Мобильный поиск */}
              <div className="mb-6">
                <SearchBar 
                  placeholder="Поиск..."
                  variant="mobile"
                  onSearch={handleSearch}
                  showSuggestions={true}
                />
              </div>

              {/* Мобильная навигация */}
              <nav className="mb-6">
                {navigationLinks.map((link) => (
                  <div key={link.name} className="mb-2">
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-5 py-4 rounded-xl text-base font-semibold text-foreground no-underline bg-muted transition-all duration-200 active:bg-primary active:text-primary-foreground"
                    >
                      {link.name}
                    </Link>
                  </div>
                ))}
              </nav>

              {/* Дополнительные ссылки */}
              <div className="flex gap-3 pt-5 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push('/profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1"
                >
                  <Icon name="user" size={18} />
                  Профиль
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Отступ для фиксированного хедера */}
      <div className="h-20" />
    </>
  );
}