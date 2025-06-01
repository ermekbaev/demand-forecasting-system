'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppTheme } from '@/hooks/useTheme';

const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18"/>
    <path d="M6 6l12 12"/>
  </svg>
);

interface Filters {
  brands: string[];
  categories: string[];
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  genders: string[];
}

interface FilterOptions {
  brands: Array<{ name: string; count: number }>;
  categories: Array<{ name: string; count: number }>;
  colors: Array<{ name: string; count: number }>;
  sizes: Array<{ size: string; count: number }>;
  genders: Array<{ name: string; count: number }>;
  priceRange: { min: number; max: number };
}

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose?: () => void;
  showMobileClose?: boolean;
  availableOptions?: FilterOptions;
}

export function SearchFilters({
  filters,
  onFiltersChange,
  onClose,
  showMobileClose = false,
  availableOptions
}: SearchFiltersProps) {
  const { colors } = useAppTheme();
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  
  // Отдельное состояние для полей ввода цены (для лучшего UX)
  const [priceInputs, setPriceInputs] = useState({
    min: filters.minPrice.toString(),
    max: filters.maxPrice.toString()
  });

  // Дефолтные опции если не переданы
  const defaultOptions: FilterOptions = {
    brands: [
      { name: 'Nike', count: 156 },
      { name: 'Adidas', count: 134 },
      { name: 'New Balance', count: 89 },
      { name: 'Converse', count: 67 },
      { name: 'Vans', count: 45 },
      { name: 'Puma', count: 38 },
    ],
    categories: [
      { name: 'Кроссовки', count: 245 },
      { name: 'Спортивная обувь', count: 189 },
      { name: 'Lifestyle', count: 123 },
      { name: 'Баскетбольные', count: 67 },
      { name: 'Беговые', count: 98 },
    ],
    colors: [
      { name: 'Черный', count: 89 },
      { name: 'Белый', count: 76 },
      { name: 'Красный', count: 45 },
      { name: 'Серый', count: 67 },
      { name: 'Синий', count: 54 },
      { name: 'Зеленый', count: 32 },
    ],
    sizes: [
      { size: '38', count: 23 },
      { size: '39', count: 34 },
      { size: '40', count: 45 },
      { size: '41', count: 56 },
      { size: '42', count: 67 },
      { size: '43', count: 54 },
      { size: '44', count: 43 },
      { size: '45', count: 32 },
    ],
    genders: [
      { name: 'Мужские', count: 234 },
      { name: 'Женские', count: 189 },
      { name: 'Унисекс', count: 67 },
    ],
    priceRange: { min: 500, max: 25000 }
  };

  const options = availableOptions || defaultOptions;

  // Синхронизируем локальные фильтры с внешними
  useEffect(() => {
    setLocalFilters(filters);
    setPriceInputs({
      min: filters.minPrice.toString(),
      max: filters.maxPrice.toString()
    });
  }, [filters]);

  // Debounced обновление цены
  const [priceUpdateTimeout, setPriceUpdateTimeout] = useState<NodeJS.Timeout | null>(null);

  const debouncedPriceUpdate = useCallback((minPrice: number, maxPrice: number) => {
    if (priceUpdateTimeout) {
      clearTimeout(priceUpdateTimeout);
    }
    
    const timeout = setTimeout(() => {
      const updatedFilters = { 
        ...localFilters, 
        minPrice: Math.max(minPrice, options.priceRange.min),
        maxPrice: Math.min(maxPrice, options.priceRange.max)
      };
      setLocalFilters(updatedFilters);
      onFiltersChange(updatedFilters);
    }, 500);
    
    setPriceUpdateTimeout(timeout);
  }, [localFilters, options.priceRange, priceUpdateTimeout, onFiltersChange]);

  // Обновление фильтров
  const updateFilters = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  // Переключение элемента в массиве
  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  // Обработка изменения минимальной цены
  const handleMinPriceChange = (value: string) => {
    setPriceInputs(prev => ({ ...prev, min: value }));
    const numValue = parseInt(value) || options.priceRange.min;
    debouncedPriceUpdate(numValue, localFilters.maxPrice);
  };

  // Обработка изменения максимальной цены
  const handleMaxPriceChange = (value: string) => {
    setPriceInputs(prev => ({ ...prev, max: value }));
    const numValue = parseInt(value) || options.priceRange.max;
    debouncedPriceUpdate(localFilters.minPrice, numValue);
  };

  // Очистка всех фильтров
  const clearAllFilters = () => {
    const clearedFilters: Filters = {
      brands: [],
      categories: [],
      minPrice: options.priceRange.min,
      maxPrice: options.priceRange.max,
      sizes: [],
      colors: [],
      genders: [],
    };
    setLocalFilters(clearedFilters);
    setPriceInputs({
      min: options.priceRange.min.toString(),
      max: options.priceRange.max.toString()
    });
    onFiltersChange(clearedFilters);
  };

  // Проверка есть ли активные фильтры
  const hasActiveFilters = () => {
    return localFilters.brands.length > 0 ||
           localFilters.categories.length > 0 ||
           localFilters.colors.length > 0 ||
           localFilters.sizes.length > 0 ||
           localFilters.genders.length > 0 ||
           localFilters.minPrice > options.priceRange.min ||
           localFilters.maxPrice < options.priceRange.max;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (priceUpdateTimeout) {
        clearTimeout(priceUpdateTimeout);
      }
    };
  }, [priceUpdateTimeout]);

  return (
    <Card variant="elevated" className="sticky top-[100px]">
      <div className="p-6">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-6">
          <h3 
            className="text-lg font-bold"
            style={{ color: colors.text }}
          >
            Фильтры
          </h3>
          {showMobileClose && (
            <button
              onClick={onClose}
              className="bg-transparent border-0 cursor-pointer p-1"
              style={{ color: colors.placeholder }}
            >
              <XIcon size={20} />
            </button>
          )}
        </div>

        {/* Ценовой диапазон */}
        <div className="mb-6">
          <h4 
            className="text-base font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Цена
          </h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="number"
              placeholder="От"
              value={priceInputs.min === options.priceRange.min.toString() ? '' : priceInputs.min}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm outline-none"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.searchBackground,
                color: colors.text,
              }}
            />
            <input
              type="number"
              placeholder="До"
              value={priceInputs.max === options.priceRange.max.toString() ? '' : priceInputs.max}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm outline-none"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.searchBackground,
                color: colors.text,
              }}
            />
          </div>
          
          {/* Ползунок цены */}
          <div className="relative mt-4">
            <input
              type="range"
              min={options.priceRange.min}
              max={options.priceRange.max}
              value={localFilters.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: parseInt(e.target.value) })}
              className="w-full h-1.5 rounded-sm outline-none"
              style={{
                background: colors.border,
                accentColor: colors.tint,
              }}
            />
          </div>
        </div>

        {/* Бренды */}
        <div className="mb-6">
          <h4 
            className="text-base font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Бренды
          </h4>
          <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto">
            {options.brands.map(brand => (
              <label
                key={brand.name}
                className="flex items-center justify-between gap-2 cursor-pointer text-sm py-1"
                style={{ color: colors.text }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.brands.includes(brand.name)}
                    onChange={() => updateFilters({
                      brands: toggleArrayItem(localFilters.brands, brand.name)
                    })}
                    style={{ accentColor: colors.tint }}
                  />
                  <span>{brand.name}</span>
                </div>
                <span 
                  className="text-xs font-medium"
                  style={{ color: colors.placeholder }}
                >
                  {brand.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Категории */}
        <div className="mb-6">
          <h4 
            className="text-base font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Категории
          </h4>
          <div className="flex flex-col gap-2">
            {options.categories.slice(0, 5).map(category => (
              <label
                key={category.name}
                className="flex items-center justify-between gap-2 cursor-pointer text-sm py-1"
                style={{ color: colors.text }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.categories.includes(category.name)}
                    onChange={() => updateFilters({
                      categories: toggleArrayItem(localFilters.categories, category.name)
                    })}
                    style={{ accentColor: colors.tint }}
                  />
                  <span>{category.name}</span>
                </div>
                <span 
                  className="text-xs font-medium"
                  style={{ color: colors.placeholder }}
                >
                  {category.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Размеры */}
        <div className="mb-6">
          <h4 
            className="text-base font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Размеры
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {options.sizes.map(sizeOption => (
              <button
                key={sizeOption.size}
                onClick={() => updateFilters({
                  sizes: toggleArrayItem(localFilters.sizes, sizeOption.size)
                })}
                className="px-1 py-2 border rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 text-center"
                style={{
                  borderColor: localFilters.sizes.includes(sizeOption.size) ? colors.tint : colors.border,
                  backgroundColor: localFilters.sizes.includes(sizeOption.size) ? colors.tint : colors.card,
                  color: localFilters.sizes.includes(sizeOption.size) ? 'white' : colors.text,
                }}
              >
                {sizeOption.size}
              </button>
            ))}
          </div>
        </div>

        {/* Цвета */}
        <div className="mb-6">
          <h4 
            className="text-base font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Цвета
          </h4>
          <div className="flex flex-col gap-2">
            {options.colors.slice(0, 6).map(colorOption => (
              <label
                key={colorOption.name}
                className="flex items-center justify-between gap-2 cursor-pointer text-sm py-1"
                style={{ color: colors.text }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.colors.includes(colorOption.name)}
                    onChange={() => updateFilters({
                      colors: toggleArrayItem(localFilters.colors, colorOption.name)
                    })}
                    style={{ accentColor: colors.tint }}
                  />
                  <span>{colorOption.name}</span>
                </div>
                <span 
                  className="text-xs font-medium"
                  style={{ color: colors.placeholder }}
                >
                  {colorOption.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Пол */}
        <div className="mb-6">
          <h4 
            className="text-base font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Для кого
          </h4>
          <div className="flex flex-col gap-2">
            {options.genders.map(gender => (
              <label
                key={gender.name}
                className="flex items-center justify-between gap-2 cursor-pointer text-sm py-1"
                style={{ color: colors.text }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.genders.includes(gender.name)}
                    onChange={() => updateFilters({
                      genders: toggleArrayItem(localFilters.genders, gender.name)
                    })}
                    style={{ accentColor: colors.tint }}
                  />
                  <span>{gender.name}</span>
                </div>
                <span 
                  className="text-xs font-medium"
                  style={{ color: colors.placeholder }}
                >
                  {gender.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={clearAllFilters}
            disabled={!hasActiveFilters()}
            className="w-full"
            style={{
              borderColor: colors.border,
              color: colors.text,
              opacity: hasActiveFilters() ? 1 : 0.5,
            }}
          >
            Сбросить фильтры
          </Button>
          
          {hasActiveFilters() && (
            <div 
              className="px-3 py-2 rounded-lg text-center text-xs"
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.placeholder,
              }}
            >
              Активных фильтров: {
                localFilters.brands.length + 
                localFilters.categories.length + 
                localFilters.colors.length + 
                localFilters.sizes.length + 
                localFilters.genders.length +
                (localFilters.minPrice > options.priceRange.min ? 1 : 0) +
                (localFilters.maxPrice < options.priceRange.max ? 1 : 0)
              }
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}