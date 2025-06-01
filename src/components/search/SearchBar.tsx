'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

const SearchIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const ClockIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const TrendingUpIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
    <polyline points="16,7 22,7 22,13"/>
  </svg>
);

const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18"/>
    <path d="M6 6l12 12"/>
  </svg>
);

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'brand' | 'category' | 'recent' | 'trending';
  count?: number;
  image?: string;
}

interface SearchBarProps {
  placeholder?: string;
  variant?: 'default' | 'hero' | 'mobile';
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  className?: string;
}

export function SearchBar({
  placeholder = "Поиск товаров...",
  variant = 'default',
  onSearch,
  autoFocus = false,
  showSuggestions = true,
  className = '',
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Debounce для поиска
  const debouncedQuery = useDebounce(query, 300);

  // Загружаем недавние поиски при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Автофокус
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Поиск предложений
  useEffect(() => {
    if (!showSuggestions) return;

    const fetchSuggestions = async () => {
      if (debouncedQuery.length >= 2) {
        setLoading(true);
        try {
          // Поиск товаров
          const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`);
          if (response.ok) {
            const data = await response.json();
            
            const productSuggestions: SearchSuggestion[] = data.results?.slice(0, 3).map((product: any) => ({
              id: `product-${product.slug}`,
              text: product.Name,
              type: 'product' as const,
              image: product.imageUrl,
            })) || [];

            // Добавляем предложения брендов и категорий
            const brandSuggestions: SearchSuggestion[] = [
              { id: 'brand-nike', text: 'Nike', type: 'brand', count: 150 },
              { id: 'brand-adidas', text: 'Adidas', type: 'brand', count: 120 },
            ].filter(item => item.text.toLowerCase().includes(debouncedQuery.toLowerCase()));

            const categorySuggestions: SearchSuggestion[] = [
              { id: 'category-sneakers', text: 'Кроссовки', type: 'category', count: 300 },
              { id: 'category-clothing', text: 'Одежда', type: 'category', count: 200 },
            ].filter(item => item.text.toLowerCase().includes(debouncedQuery.toLowerCase()));

            setSuggestions([...productSuggestions, ...brandSuggestions, ...categorySuggestions]);
          }
        } catch (error) {
          console.error('Ошибка поиска предложений:', error);
        } finally {
          setLoading(false);
        }
      } else if (debouncedQuery.length === 0) {
        // Показываем недавние поиски и популярные запросы
        const recentSuggestions: SearchSuggestion[] = recentSearches.slice(0, 3).map(search => ({
          id: `recent-${search}`,
          text: search,
          type: 'recent' as const,
        }));

        const trendingSuggestions: SearchSuggestion[] = [
          { id: 'trending-1', text: 'Nike Air Max', type: 'trending' },
          { id: 'trending-2', text: 'Adidas Ultraboost', type: 'trending' },
          { id: 'trending-3', text: 'Зимние кроссовки', type: 'trending' },
        ];

        setSuggestions([...recentSuggestions, ...trendingSuggestions]);
      } else {
        setSuggestions([]);
      }
    };

    if (isOpen) {
      fetchSuggestions();
    }
  }, [debouncedQuery, isOpen, showSuggestions, recentSearches]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else if (query.trim()) {
            handleSearch();
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, suggestions, query]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Сохранение недавних поисков
  const saveRecentSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Обработка поиска
  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    saveRecentSearch(trimmed);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (onSearch) {
      onSearch(trimmed);
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  // Обработка клика по предложению
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const searchText = suggestion.text;
    setQuery(searchText);
    saveRecentSearch(searchText);
    setIsOpen(false);
    setSelectedIndex(-1);

    if (onSearch) {
      onSearch(searchText);
    } else {
      // Определяем URL в зависимости от типа предложения
      let url = `/search?q=${encodeURIComponent(searchText)}`;
      
      if (suggestion.type === 'brand') {
        url = `/brands/${suggestion.id.replace('brand-', '')}`;
      } else if (suggestion.type === 'category') {
        url = `/categories/${suggestion.id.replace('category-', '')}`;
      } else if (suggestion.type === 'product') {
        url = `/products/${suggestion.id.replace('product-', '')}`;
      }
      
      router.push(url);
    }
  };

  // Удаление недавнего поиска
  const removeRecentSearch = (searchToRemove: string) => {
    const updated = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Получение иконки для типа предложения
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <ClockIcon size={16} className="text-muted-foreground" />;
      case 'trending':
        return <TrendingUpIcon size={16} className="text-primary" />;
      default:
        return <SearchIcon size={16} className="text-muted-foreground" />;
    }
  };

  // Стили в зависимости от варианта
  const getContainerStyles = () => {
    const baseClasses = "relative w-full";
    
    switch (variant) {
      case 'hero':
        return cn(baseClasses, "max-w-2xl z-50");
      case 'mobile':
        return cn(baseClasses, "max-w-full");
      default:
        return cn(baseClasses, "max-w-md");
    }
  };

  return (
    <div className={cn(getContainerStyles(), className)}>
      {/* Стеклянная обертка для hero варианта */}
      {variant === 'hero' ? (
        <div className="glass relative flex items-center rounded-[60px] p-2 bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="flex-1 px-8 py-5 border-0 bg-transparent text-base text-white outline-none font-medium placeholder:text-white/70"
          />
          
          <button
            onClick={handleSearch}
            className="rounded-full min-w-[140px] px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 border-0 text-white text-base font-semibold cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <SearchIcon size={20} className="text-white" />
            Найти
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className={cn(
              "w-full border-2 border-transparent text-[15px] font-medium text-foreground outline-none transition-all duration-300 focus:border-primary",
              variant === 'default' && "bg-muted rounded-[20px] px-5 py-3.5 pr-12 placeholder:text-muted-foreground",
              isOpen && "border-primary"
            )}
          />
          
          <button
            onClick={handleSearch}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary border-0 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
          >
            <SearchIcon size={18} className="text-primary-foreground" />
          </button>
        </div>
      )}

      {/* Выпадающий список предложений */}
      {isOpen && showSuggestions && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 bg-card border border-border rounded-2xl shadow-2xl dark:shadow-black/40 mt-2 p-3 z-[9999] max-h-96 overflow-y-auto"
        >
          {loading && (
            <div className="flex items-center justify-center py-5">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!loading && suggestions.length === 0 && query.length >= 2 && (
            <div className="py-5 text-center text-muted-foreground">
              Ничего не найдено
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <>
              {/* Заголовки секций */}
              {query.length === 0 && recentSearches.length > 0 && (
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-2 mb-1">
                  Недавние поиски
                </div>
              )}

              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200",
                    selectedIndex === index ? "bg-muted" : "hover:bg-muted"
                  )}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {/* Изображение товара или иконка */}
                  {suggestion.image ? (
                    <img
                      src={suggestion.image}
                      alt={suggestion.text}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                  )}

                  {/* Текст предложения */}
                  <div className="flex-1">
                    <div className="text-[15px] font-semibold text-foreground">
                      {suggestion.text}
                    </div>
                    {suggestion.count && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {suggestion.count} товаров
                      </div>
                    )}
                  </div>

                  {/* Кнопка удаления для недавних поисков */}
                  {suggestion.type === 'recent' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(suggestion.text);
                      }}
                      className="w-6 h-6 bg-transparent border-0 rounded-full flex items-center justify-center cursor-pointer text-muted-foreground transition-all duration-200 hover:bg-border hover:text-foreground"
                    >
                      <XIcon size={14} />
                    </button>
                  )}
                </div>
              ))}

              {/* Показать все результаты */}
              {query.length >= 2 && (
                <div
                  onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 mt-2 border-t border-border text-primary font-semibold hover:bg-muted"
                >
                  <SearchIcon size={16} />
                  Показать все результаты для "{query}"
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}