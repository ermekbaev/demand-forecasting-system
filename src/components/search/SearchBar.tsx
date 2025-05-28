'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppTheme } from '@/hooks/useTheme';
import { useDebounce } from '@/hooks/useDebounce';

// Иконки
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
  const { colors, isDark } = useAppTheme();
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
        return <ClockIcon size={16} style={{ color: colors.placeholder }} />;
      case 'trending':
        return <TrendingUpIcon size={16} style={{ color: colors.tint }} />;
      default:
        return <SearchIcon size={16} style={{ color: colors.placeholder }} />;
    }
  };

  // Стили в зависимости от варианта
  const getContainerStyles = () => {
    const baseStyles = {
      position: 'relative' as const,
      width: '100%',
      zIndex: variant === 'hero' ? 1000 : 10, // ✅ Высокий z-index для hero
    };

    switch (variant) {
      case 'hero':
        return { ...baseStyles, maxWidth: '600px' };
      case 'mobile':
        return { ...baseStyles, maxWidth: '100%' };
      default:
        return { ...baseStyles, maxWidth: '400px' };
    }
  };

  const getInputStyles = () => {
    const baseStyles = {
      width: '100%',
      border: `2px solid ${isOpen ? colors.tint : 'transparent'}`,
      fontSize: variant === 'hero' ? '16px' : '15px',
      fontWeight: '500',
      color: variant === 'hero' ? '#ffffff' : colors.text,
      outline: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    if (variant === 'hero') {
      return {
        ...baseStyles,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        borderRadius: '50px',
        padding: '20px 60px 20px 32px',
        border: `1px solid rgba(255, 255, 255, 0.2)`,
        '::placeholder': {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      };
    } else {
      return {
        ...baseStyles,
        background: colors.searchBackground,
        borderRadius: '20px',
        padding: '14px 48px 14px 20px',
        '::placeholder': {
          color: colors.placeholder,
        }
      };
    }
  };

  const getButtonStyles = () => {
    const size = variant === 'hero' ? '48px' : '36px';
    const iconSize = variant === 'hero' ? 20 : 18;

    return {
      position: 'absolute' as const,
      right: variant === 'hero' ? '8px' : '6px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: size,
      height: size,
      background: colors.tint,
      border: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      iconSize,
    };
  };

  return (
    <div style={getContainerStyles()} className={className}>
      {/* Стеклянная обертка для hero варианта */}
      {variant === 'hero' ? (
        <div className="glass" style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '60px',
          padding: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            style={{
              flex: 1,
              padding: '20px 32px',
              border: 'none',
              background: 'transparent',
              fontSize: '16px',
              color: '#ffffff',
              outline: 'none',
              fontWeight: '500',
              '::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
              }
            }}
          />
          
          <button
            onClick={handleSearch}
            style={{
              borderRadius: '50px',
              minWidth: '140px',
              padding: '16px 32px',
              background: 'var(--gradient-button)',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-emerald)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gradient-button-hover)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-emerald-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--gradient-button)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-emerald)';
            }}
          >
            <SearchIcon size={20} style={{ color: 'white' }} />
            Найти
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            style={getInputStyles()}
          />
          
          <button
            onClick={handleSearch}
            style={getButtonStyles()}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = 'var(--shadow-emerald)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <SearchIcon size={getButtonStyles().iconSize} style={{ color: 'white' }} />
          </button>
        </div>
      )}

      {/* Выпадающий список предложений */}
      {isOpen && showSuggestions && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: '16px',
            boxShadow: isDark 
              ? '0 20px 40px rgba(0, 0, 0, 0.4)' 
              : '0 20px 40px rgba(0, 0, 0, 0.1)',
            marginTop: '8px',
            padding: '12px',
            zIndex: 9999, // ✅ Очень высокий z-index для hero-варианта
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {loading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}>
              <div
                className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent"
                style={{ borderColor: `${colors.tint} transparent ${colors.tint} ${colors.tint}` }}
              />
            </div>
          )}

          {!loading && suggestions.length === 0 && query.length >= 2 && (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: colors.placeholder,
            }}>
              Ничего не найдено
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <>
              {/* Заголовки секций */}
              {query.length === 0 && recentSearches.length > 0 && (
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: colors.placeholder,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '8px 16px 8px 16px',
                  marginBottom: '4px',
                }}>
                  Недавние поиски
                </div>
              )}

              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: selectedIndex === index ? colors.cardBackground : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.cardBackground;
                    setSelectedIndex(index);
                  }}
                  onMouseLeave={(e) => {
                    if (selectedIndex !== index) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {/* Изображение товара или иконка */}
                  {suggestion.image ? (
                    <img
                      src={suggestion.image}
                      alt={suggestion.text}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: colors.cardBackground,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                  )}

                  {/* Текст предложения */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: colors.text,
                    }}>
                      {suggestion.text}
                    </div>
                    {suggestion.count && (
                      <div style={{
                        fontSize: '12px',
                        color: colors.placeholder,
                        marginTop: '2px',
                      }}>
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
                      style={{
                        width: '24px',
                        height: '24px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: colors.placeholder,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.border;
                        e.currentTarget.style.color = colors.text;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.placeholder;
                      }}
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginTop: '8px',
                    borderTop: `1px solid ${colors.border}`,
                    color: colors.tint,
                    fontWeight: '600',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.cardBackground;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
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