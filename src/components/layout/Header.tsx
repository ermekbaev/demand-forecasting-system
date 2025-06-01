'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { Button } from '@/components/ui/Button';

// Иконки
const SearchIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const ShoppingBagIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="m16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const HeartIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const UserIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const MenuIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="4" y1="18" x2="20" y2="18"/>
  </svg>
);

const XIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18"/>
    <path d="M6 6l12 12"/>
  </svg>
);

const ChevronDownIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const DiamondIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h12l4 6-10 12L2 9z"/>
  </svg>
);

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

  // Обработка поиска - переход на страницу поиска
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
      <header className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out backdrop-blur-md
        ${isScrolled 
          ? 'bg-background/95 border-b border-border shadow-2xl dark:shadow-black/40' 
          : 'bg-background/80 border-b border-transparent'
        }
      `}>
        <div className="max-w-[1600px] mx-auto px-3">
          <div className="flex items-center justify-between h-20">
            
            {/* Логотип */}
            <Link 
              href="/" 
              className="flex items-center gap-3 text-decoration-none z-2 group"
            >
              <div className="
                w-10 h-10 bg-gradient-emerald rounded-xl 
                flex items-center justify-center 
                shadow-emerald transition-transform duration-300
                group-hover:scale-110 group-hover:shadow-emerald-lg
              ">
                <DiamondIcon size={20} className="text-white" />
              </div>
              <div>
                <div className="
                  text-2xl font-extrabold text-foreground 
                  leading-none tracking-tight
                ">
                  STORE
                </div>
                <div className="
                  text-xs font-semibold text-placeholder 
                  tracking-widest uppercase
                ">
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
                    className={`
                      flex items-center gap-1 px-4 py-3 rounded-xl 
                      text-sm font-semibold text-foreground 
                      no-underline transition-all duration-200
                      hover:bg-card-background hover:text-tint
                      ${activeDropdown === link.name ? 'bg-card-background text-tint' : ''}
                    `}
                  >
                    {link.name}
                    {link.hasDropdown && (
                      <ChevronDownIcon 
                        size={14} 
                        className={`
                          transition-transform duration-200
                          ${activeDropdown === link.name ? 'rotate-180' : 'rotate-0'}
                        `}
                      />
                    )}
                  </Link>

                  {/* Выпадающее меню */}
                  {link.hasDropdown && activeDropdown === link.name && (
                    <div className="
                      absolute top-full left-0 min-w-[200px] mt-2 p-2
                      bg-card border border-border rounded-2xl
                      shadow-xl dark:shadow-black/40
                      animate-fadeIn
                    ">
                      {link.subItems?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="
                            block px-4 py-3 rounded-xl text-sm font-medium 
                            text-foreground no-underline transition-all duration-200
                            hover:bg-card-background hover:text-tint
                          "
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
              <button
                onClick={() => router.push('/search')}
                className="
                  md:hidden flex items-center justify-center w-11 h-11
                  bg-card-background rounded-xl border-0 cursor-pointer
                  transition-all duration-200
                  hover:bg-tint hover:text-white hover:scale-105
                "
              >
                <SearchIcon size={20} className="text-foreground" />
              </button>

              {/* Избранное */}
              <button
                onClick={() => router.push('/favorites')}
                className="
                  relative flex items-center justify-center w-11 h-11
                  bg-card-background rounded-xl border-0 cursor-pointer
                  transition-all duration-200
                  hover:bg-tint hover:text-white hover:scale-105
                "
              >
                <HeartIcon size={20} className="text-foreground" />
                {favoritesCount > 0 && (
                  <div className="
                    absolute -top-1 -right-1 w-5 h-5
                    bg-error rounded-full border-2 border-card
                    flex items-center justify-center
                    text-xs font-bold text-white
                  ">
                    {favoritesCount}
                  </div>
                )}
              </button>

              {/* Корзина */}
              <button
                onClick={() => router.push('/cart')}
                className="
                  relative flex items-center justify-center w-11 h-11
                  bg-card-background rounded-xl border-0 cursor-pointer
                  transition-all duration-200
                  hover:bg-tint hover:text-white hover:scale-105
                "
              >
                <ShoppingBagIcon size={20} className="text-foreground" />
                {cartItemsCount > 0 && (
                  <div className="
                    absolute -top-1 -right-1 w-5 h-5
                    bg-tint rounded-full border-2 border-card
                    flex items-center justify-center
                    text-xs font-bold text-white
                  ">
                    {cartItemsCount}
                  </div>
                )}
              </button>

              {/* Профиль */}
              <button
                onClick={() => router.push('/profile')}
                className="
                  hidden sm:flex items-center justify-center w-11 h-11
                  bg-card-background rounded-xl border-0 cursor-pointer
                  transition-all duration-200
                  hover:bg-tint hover:text-white hover:scale-105
                "
              >
                <UserIcon size={20} className="text-foreground" />
              </button>

              {/* Мобильное меню */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`
                  lg:hidden flex items-center justify-center w-11 h-11
                  rounded-xl border-0 cursor-pointer transition-all duration-200
                  ${isMobileMenuOpen 
                    ? 'bg-tint text-white' 
                    : 'bg-card-background text-foreground hover:bg-tint hover:text-white'
                  }
                `}
              >
                {isMobileMenuOpen ? (
                  <XIcon size={20} />
                ) : (
                  <MenuIcon size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="
            lg:hidden absolute top-full left-0 right-0
            bg-card border-t-0 border-l border-r border-b border-border
            shadow-xl dark:shadow-black/40
            animate-slideDown
          ">
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
                      className="
                        block px-5 py-4 rounded-xl text-base font-semibold 
                        text-foreground no-underline bg-card-background
                        transition-all duration-200
                        active:bg-tint active:text-white
                      "
                    >
                      {link.name}
                    </Link>
                  </div>
                ))}
              </nav>

              {/* Дополнительные ссылки */}
              <div className="
                flex gap-3 pt-5 border-t border-border
              ">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="
                    flex-1 flex items-center justify-center gap-2 py-3.5
                    bg-card-background rounded-xl no-underline
                    text-foreground font-semibold
                    transition-all duration-200
                    active:bg-tint active:text-white
                  "
                >
                  <UserIcon size={18} />
                  Профиль
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Отступ для фиксированного хедера */}
      <div className="h-20" />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease;
        }
      `}</style>
    </>
  );
}