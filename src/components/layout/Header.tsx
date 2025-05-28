'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppTheme } from '@/hooks/useTheme';
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

const SunIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const MoonIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
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
  const { colors, isDark } = useAppTheme();
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
    // TODO: Загрузить из localStorage или API
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

  const headerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: isScrolled 
      ? isDark 
        ? 'rgba(15, 23, 42, 0.95)' 
        : 'rgba(248, 250, 252, 0.95)'
      : isDark
        ? 'rgba(15, 23, 42, 0.8)'
        : 'rgba(248, 250, 252, 0.8)',
    backdropFilter: 'blur(16px)',
    borderBottom: `1px solid ${isScrolled ? colors.border : 'transparent'}`,
    boxShadow: isScrolled 
      ? isDark 
        ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
        : '0 8px 32px rgba(0, 0, 0, 0.1)'
      : 'none',
  };

  return (
    <>
      <header style={headerStyle}>
        <div style={{ 
          maxWidth: '1600px', 
          margin: '0 auto', 
          padding: '0 12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '80px',
          }}>
            
            {/* Логотип */}
            <Link 
              href="/" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                zIndex: 2,
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                background: 'var(--gradient-emerald)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-emerald)',
              }}>
                <DiamondIcon size={20} style={{ color: 'white' }} />
              </div>
              <div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: colors.text,
                  lineHeight: '1',
                  letterSpacing: '-0.02em',
                }}>
                  STORE
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: colors.placeholder,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}>
                  Premium
                </div>
              </div>
            </Link>

            {/* Десктопная навигация */}
            <nav style={{ 
              display: 'none',
              '@media (min-width: 1024px)': {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }
            }} className="hidden lg:flex items-center gap-2">
              {navigationLinks.map((link) => (
                <div 
                  key={link.name}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: colors.text,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      ':hover': {
                        backgroundColor: colors.cardBackground,
                        color: colors.tint,
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.cardBackground;
                      e.currentTarget.style.color = colors.tint;
                    }}
                    onMouseLeave={(e) => {
                      if (activeDropdown !== link.name) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.text;
                      }
                    }}
                  >
                    {link.name}
                    {link.hasDropdown && (
                      <ChevronDownIcon 
                        size={14} 
                        style={{ 
                          transform: activeDropdown === link.name ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.2s ease'
                        }} 
                      />
                    )}
                  </Link>

                  {/* Выпадающее меню */}
                  {link.hasDropdown && activeDropdown === link.name && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      minWidth: '200px',
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '16px',
                      boxShadow: isDark 
                        ? '0 20px 40px rgba(0, 0, 0, 0.4)' 
                        : '0 20px 40px rgba(0, 0, 0, 0.1)',
                      marginTop: '8px',
                      padding: '8px',
                      animation: 'fadeIn 0.2s ease',
                    }}>
                      {link.subItems?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          style={{
                            display: 'block',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: colors.text,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.cardBackground;
                            e.currentTarget.style.color = colors.tint;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = colors.text;
                          }}
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
            <div style={{ 
              flex: 1, 
              maxWidth: '400px', 
              margin: '0 24px',
              display: 'none',
            }} className="hidden md:block">
              <SearchBar 
                placeholder="Поиск товаров..."
                variant="default"
                onSearch={handleSearch}
                showSuggestions={true}
              />
            </div>

            {/* Действия пользователя */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px'
            }}>
              
              {/* Мобильный поиск */}
              <button
                onClick={() => router.push('/search')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  background: colors.cardBackground,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="md:hidden"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.tint;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.cardBackground;
                  e.currentTarget.style.color = colors.text;
                }}
              >
                <SearchIcon size={20} style={{ color: colors.text }} />
              </button>

              {/* Избранное */}
              <button
                onClick={() => router.push('/favorites')}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  background: colors.cardBackground,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.tint;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.cardBackground;
                  e.currentTarget.style.color = colors.text;
                }}
              >
                <HeartIcon size={20} style={{ color: colors.text }} />
                {favoritesCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '20px',
                    height: '20px',
                    background: colors.error,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: 'white',
                  }}>
                    {favoritesCount}
                  </div>
                )}
              </button>

              {/* Корзина */}
              <button
                onClick={() => router.push('/cart')}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  background: colors.cardBackground,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.tint;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.cardBackground;
                  e.currentTarget.style.color = colors.text;
                }}
              >
                <ShoppingBagIcon size={20} style={{ color: colors.text }} />
                {cartItemsCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '20px',
                    height: '20px',
                    background: colors.tint,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: 'white',
                  }}>
                    {cartItemsCount}
                  </div>
                )}
              </button>

              {/* Профиль */}
              <button
                onClick={() => router.push('/profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  background: colors.cardBackground,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="hidden sm:flex"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.tint;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.cardBackground;
                  e.currentTarget.style.color = colors.text;
                }}
              >
                <UserIcon size={20} style={{ color: colors.text }} />
              </button>

              {/* Мобильное меню */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  background: isMobileMenuOpen ? colors.tint : colors.cardBackground,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="lg:hidden"
              >
                {isMobileMenuOpen ? (
                  <XIcon size={20} style={{ color: 'white' }} />
                ) : (
                  <MenuIcon size={20} style={{ color: colors.text }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderTop: 'none',
              boxShadow: isDark 
                ? '0 20px 40px rgba(0, 0, 0, 0.4)' 
                : '0 20px 40px rgba(0, 0, 0, 0.1)',
              animation: 'slideDown 0.3s ease',
            }}
            className="lg:hidden"
          >
            <div style={{ padding: '20px' }}>
              {/* Мобильный поиск */}
              <div style={{ marginBottom: '24px' }}>
                <SearchBar 
                  placeholder="Поиск..."
                  variant="mobile"
                  onSearch={handleSearch}
                  showSuggestions={true}
                />
              </div>

              {/* Мобильная навигация */}
              <nav style={{ marginBottom: '24px' }}>
                {navigationLinks.map((link) => (
                  <div key={link.name} style={{ marginBottom: '8px' }}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'block',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: colors.text,
                        textDecoration: 'none',
                        background: colors.cardBackground,
                        transition: 'all 0.2s ease',
                      }}
                      onTouchStart={(e) => {
                        e.currentTarget.style.backgroundColor = colors.tint;
                        e.currentTarget.style.color = 'white';
                      }}
                      onTouchEnd={(e) => {
                        setTimeout(() => {
                          e.currentTarget.style.backgroundColor = colors.cardBackground;
                          e.currentTarget.style.color = colors.text;
                        }, 150);
                      }}
                    >
                      {link.name}
                    </Link>
                  </div>
                ))}
              </nav>

              {/* Дополнительные ссылки */}
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '20px',
                borderTop: `1px solid ${colors.border}`,
              }}>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px',
                    background: colors.cardBackground,
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: colors.text,
                    fontWeight: '600',
                  }}
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
      <div style={{ height: '80px' }} />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}