'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

// Навигационные элементы для мобильной версии
const mobileNavItems = [
  {
    name: 'Главная',
    href: '/',
    icon: 'home',
    badge: null,
  },
  {
    name: 'Поиск',
    href: '/search',
    icon: 'search',
    badge: null,
  },
  {
    name: 'Каталог',
    href: '/catalog',
    icon: 'grid',
    badge: null,
  },
  {
    name: 'Избранное',
    href: '/favorites',
    icon: 'heart',
    badge: 'favorites',
  },
  {
    name: 'Профиль',
    href: '/profile',
    icon: 'user',
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
                  <Icon 
                    name={item.icon as any}
                    size={24} 
                    className="transition-colors duration-200" 
                  />
                  
                  {/* Бейдж с количеством */}
                  {badgeCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-destructive-foreground min-w-[20px]">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </div>
                  )}

                  {/* Индикатор активного состояния */}
                  {active && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                  )}
                </div>

                {/* Название */}
                <span className={cn(
                  "text-xs font-semibold tracking-tight transition-colors duration-200",
                  active ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.name}
                </span>

                {/* Подсветка активного элемента */}
                {active && (
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl -z-10 animate-fadeIn" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Декоративный элемент внизу */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-border rounded-t-full" />
      </nav>
    </>
  );
}