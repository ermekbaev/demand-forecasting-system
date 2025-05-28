'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppTheme } from '@/hooks/useTheme';

// Иконки для мобильной навигации
const HomeIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const SearchIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const GridIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const HeartIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const UserIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ShoppingBagIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="m16 10a4 4 0 0 1-8 0"/>
  </svg>
);

// Навигационные элементы для мобильной версии
const mobileNavItems = [
  {
    name: 'Главная',
    href: '/',
    icon: HomeIcon,
    badge: null,
  },
  {
    name: 'Поиск',
    href: '/search',
    icon: SearchIcon,
    badge: null,
  },
  {
    name: 'Каталог',
    href: '/catalog',
    icon: GridIcon,
    badge: null,
  },
  {
    name: 'Избранное',
    href: '/favorites',
    icon: HeartIcon,
    badge: 'favorites',
  },
  {
    name: 'Профиль',
    href: '/profile',
    icon: UserIcon,
    badge: null,
  },
];

interface MobileNavProps {
  cartCount?: number;
  favoritesCount?: number;
}

export function MobileNav({ cartCount = 0, favoritesCount = 0 }: MobileNavProps) {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Получаем счетчик для бейджа
  const getBadgeCount = (badgeType: string | null) => {
    switch (badgeType) {
      case 'favorites':
        return favoritesCount;
      case 'cart':
        return cartCount;
      default:
        return 0;
    }
  };

  // Проверяем, активна ли ссылка
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Отступ для фиксированной навигации */}
      <div style={{ height: '80px' }} className="block sm:hidden" />
      
      {/* Мобильная навигация */}
      <nav 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: isDark 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: `1px solid ${colors.border}`,
          boxShadow: isDark 
            ? '0 -8px 32px rgba(0, 0, 0, 0.4)' 
            : '0 -8px 32px rgba(0, 0, 0, 0.1)',
          padding: '8px 0 8px',
        }}
        className="block sm:hidden"
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '480px',
          margin: '0 auto',
          padding: '0 12px',
        }}>
          {mobileNavItems.map((item) => {
            const active = isActive(item.href);
            const badgeCount = getBadgeCount(item.badge);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  background: active 
                    ? isDark 
                      ? 'rgba(16, 185, 129, 0.15)' 
                      : 'rgba(16, 185, 129, 0.1)'
                    : 'transparent',
                  minWidth: '60px',
                }}
                onTouchStart={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = colors.cardBackground;
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }
                }}
                onTouchEnd={(e) => {
                  if (!active) {
                    setTimeout(() => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }, 150);
                  }
                }}
              >
                {/* Иконка с индикатором активности */}
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                }}>
                  <item.icon 
                    size={24} 
                    style={{ 
                      color: active ? colors.tint : colors.placeholder,
                      transition: 'color 0.2s ease',
                    }} 
                  />
                  
                  {/* Бейдж с количеством */}
                  {badgeCount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      minWidth: '18px',
                      height: '18px',
                      background: colors.error,
                      borderRadius: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: '700',
                      color: 'white',
                      padding: '0 4px',
                      border: `2px solid ${colors.card}`,
                    }}>
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </div>
                  )}
                  
                  {/* Индикатор активности */}
                  {active && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      background: colors.tint,
                      borderRadius: '2px',
                      animation: 'pulse 2s infinite',
                    }} />
                  )}
                </div>
                
                {/* Название */}
                <span style={{
                  fontSize: '11px',
                  fontWeight: active ? '700' : '500',
                  color: active ? colors.tint : colors.placeholder,
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.2px',
                  textAlign: 'center',
                  lineHeight: '1.2',
                }}>
                  {item.name}
                </span>
              </Link>
            );
          })}
          
          {/* Отдельная кнопка корзины с особым дизайном */}
          <button
            onClick={() => router.push('/cart')}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              borderRadius: '16px',
              border: 'none',
              background: pathname === '/cart' 
                ? 'var(--gradient-emerald)'
                : colors.cardBackground,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              minWidth: '60px',
              boxShadow: pathname === '/cart' 
                ? 'var(--shadow-emerald)' 
                : 'none',
            }}
            onTouchStart={(e) => {
              if (pathname !== '/cart') {
                e.currentTarget.style.background = colors.tint;
                e.currentTarget.style.transform = 'scale(0.95)';
                e.currentTarget.style.color = 'white';
              }
            }}
            onTouchEnd={(e) => {
              if (pathname !== '/cart') {
                setTimeout(() => {
                  e.currentTarget.style.background = colors.cardBackground;
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.color = colors.placeholder;
                }, 150);
              }
            }}
          >
            {/* Иконка корзины */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
            }}>
              <ShoppingBagIcon 
                size={24} 
                style={{ 
                  color: pathname === '/cart' ? 'white' : colors.placeholder,
                  transition: 'color 0.2s ease',
                }} 
              />
              
              {/* Бейдж корзины */}
              {cartCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  minWidth: '18px',
                  height: '18px',
                  background: pathname === '/cart' ? 'white' : colors.tint,
                  borderRadius: '9px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '700',
                  color: pathname === '/cart' ? colors.tint : 'white',
                  padding: '0 4px',
                  border: `2px solid ${colors.card}`,
                  animation: cartCount > 0 ? 'bounce 0.6s ease' : 'none',
                }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </div>
              )}
            </div>
            
            {/* Название */}
            <span style={{
              fontSize: '11px',
              fontWeight: pathname === '/cart' ? '700' : '500',
              color: pathname === '/cart' ? 'white' : colors.placeholder,
              transition: 'all 0.2s ease',
              letterSpacing: '0.2px',
              textAlign: 'center',
              lineHeight: '1.2',
            }}>
              Корзина
            </span>
          </button>
        </div>
      </nav>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        /* Скрываем мобильную навигацию на больших экранах */
        @media (min-width: 640px) {
          nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}