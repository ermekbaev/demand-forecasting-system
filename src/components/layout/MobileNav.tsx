'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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
      <div className="h-20 block sm:hidden" />
      
      {/* Мобильная навигация */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl dark:shadow-black/40 p-2 block sm:hidden">
        <div className="flex justify-around items-center max-w-[480px] mx-auto px-3">
          {mobileNavItems.map((item) => {
            const active = isActive(item.href);
            const badgeCount = getBadgeCount(item.badge);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 px-3 rounded-2xl no-underline transition-all duration-300 relative min-w-[60px]",
                  active 
                    ? "bg-primary/15 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95"
                )}
              >
                {/* Иконка с индикатором активности */}
                <div className="relative flex items-center justify-center w-7 h-7">
                  <item.icon 
                    size={24} 
                    className="transition-colors duration-200" 
                  />
                  
                  {/* Бейдж с количеством */}
                  {badgeCount > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-destructive border-2 border-background rounded-full flex items-center justify-center text-[10px] font-bold text-destructive-foreground px-1">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </div>
                  )}
                  
                  {/* Индикатор активности */}
                  {active && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
                
                {/* Название */}
                <span className={cn(
                  "text-[11px] font-medium transition-all duration-200 tracking-wide text-center leading-tight",
                  active ? "font-bold" : "font-medium"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
          
          {/* Отдельная кнопка корзины с особым дизайном */}
          <button
            onClick={() => router.push('/cart')}
            className={cn(
              "relative flex flex-col items-center gap-1 p-2 px-3 rounded-2xl border-0 cursor-pointer transition-all duration-300 min-w-[60px]",
              pathname === '/cart' 
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground active:scale-95"
            )}
          >
            {/* Иконка корзины */}
            <div className="relative flex items-center justify-center w-7 h-7">
              <ShoppingBagIcon 
                size={24} 
                className="transition-colors duration-200"
              />
              
              {/* Бейдж корзины */}
              {cartCount > 0 && (
                <div className={cn(
                  "absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] border-2 border-background rounded-full flex items-center justify-center text-[10px] font-bold px-1 animate-bounce",
                  pathname === '/cart' 
                    ? "bg-white text-primary" 
                    : "bg-primary text-primary-foreground"
                )}>
                  {cartCount > 99 ? '99+' : cartCount}
                </div>
              )}
            </div>
            
            {/* Название */}
            <span className={cn(
              "text-[11px] font-medium transition-all duration-200 tracking-wide text-center leading-tight",
              pathname === '/cart' ? "font-bold" : "font-medium"
            )}>
              Корзина
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}