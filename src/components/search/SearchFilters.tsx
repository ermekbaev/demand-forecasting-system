'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

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
          <h3 className="text-lg font-bold text-foreground">
            Фильтры
          </h3>
          {showMobileClose && (
            <button
              onClick={onClose}
              className="bg-transparent border-0 cursor-pointer p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="close" size="sm" />
            </button>
          )}
        </div>

        {/* Ценовой диапазон */}
        <div className="mb-6">
          <h4 className="text-base font-semibold mb-3 text-foreground">
            Цена
          </h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="number"
              placeholder="От"
              value={priceInputs.min === options.priceRange.min.toString() ? '' : priceInputs.min}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm outline-none bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              type="number"
              placeholder="До"
              value={priceInputs.max === options.priceRange.max.toString() ? '' : priceInputs.max}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm outline-none bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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
              className="w-full h-1.5 rounded-sm outline-none bg-border appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
            />
          </div>
        </div>

        {/* Бренды */}
        <div className="mb-6">
          <h4 className="text-base font-semibold mb-3 text-foreground">
            Бренды
          </h4>
          <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto">
            {options.brands.map(brand => (
              <label
                key={brand.name}
                className="flex items-center justify-between gap-2 cursor-pointer text-sm py-1 text-foreground hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.brands.includes(brand.name)}
                    onChange={() => updateFilters({
                      brands: toggleArrayItem(localFilters.brands, brand.name)
                    })}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 accent-primary"
                  />
                  <span>{brand.name}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {brand.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Категории */}
        <div className="mb-6">
          <h4 className="text-base font-semibold mb-3 text-foreground">
            Категории
          </h4>
          <div className="flex flex-col gap-2">
            {options.categories.slice(0, 5).map(category => (
              <label
                key={category.name}
                className="flex items-center justify-between gap-2 cursor-pointer text-sm py-1 text-foreground hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.categories.includes(category.name)}
                    onChange={() => updateFilters({
                      categories: toggleArrayItem(localFilters.categories, category.name)
                    })}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 accent-primary"
                  />
                  <span>{category.name}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {category.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Размеры */}
        <div className="mb-6">
          <h4 className="text-base font-semibold mb-3 text-foreground">
            Размеры
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {options.sizes.map(sizeOption => (
              <button
                key={sizeOption.size}
                onClick={() => updateFilters({
                  sizes: toggleArrayItem(localFilters.sizes, sizeOption.size)
                })}
                className={cn(
                  "px-1 py-2 border rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 text-center",
                  localFilters.sizes.includes(sizeOption.size)
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                )}
              >
                {sizeOption.size}
              </button>
            ))}
          </div>
        </div>

        {/* Цвета */}
        <div className="mb-6">
          <h4 className="text-base font-semibold mb-3 text-foreground">
            Цвета
          </h4>
          <div className="flex flex-col gap-2">
            {options.colors.slice(0, 6).map(colorOption => (
              <label
                key={colorOption.name}
                className="flex items-center justify-between gap-2 cursor-pointer text-sm py-1 text-foreground hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.colors.includes(colorOption.name)}
                    onChange={() => updateFilters({
                      colors: toggleArrayItem(localFilters.colors, colorOption.name)
                    })}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 accent-primary"
                  />
                  <span>{colorOption.name}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {colorOption.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Пол */}
        <div className="mb-6">
          <h4 className="text-base font-semibold mb-3 text-foreground">
            Для кого
          </h4>
          <div className="flex flex-col gap-2">
            {options.genders.map(gender => (
              <label
                key={gender.name}
                className="flex items-center justify-between gap-2 cursor-pointer text-sm py-1 text-foreground hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.genders.includes(gender.name)}
                    onChange={() => updateFilters({
                      genders: toggleArrayItem(localFilters.genders, gender.name)
                    })}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 accent-primary"
                  />
                  <span>{gender.name}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
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
            className="w-full disabled:opacity-50"
          >
            Сбросить фильтры
          </Button>
          
          {hasActiveFilters() && (
            <div className="px-3 py-2 rounded-lg text-center text-xs bg-muted text-muted-foreground">
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