import { useState, useEffect } from 'react';

/**
 * Хук для задержки обновления значения (debounce)
 * Полезен для поиска, чтобы не отправлять запрос при каждом нажатии клавиши
 * 
 * @param value - значение для debounce
 * @param delay - задержка в миллисекундах
 * @returns debouncedValue - отложенное значение
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при изменении value или delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;