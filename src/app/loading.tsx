export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-text)'
    }}>
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* Анимированный лого/спиннер */}
        <div className="relative">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent"
            style={{ borderColor: 'var(--color-border) transparent var(--color-tint) transparent' }}
          ></div>
          <div 
            className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-2"
            style={{ borderColor: 'var(--color-tint)' }}
          ></div>
        </div>
        
        {/* Текст загрузки */}
        <div className="text-center space-y-2">
          <h2 
            className="text-xl font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            Загрузка магазина
          </h2>
          <p 
            className="text-sm"
            style={{ color: 'var(--color-placeholder)' }}
          >
            Готовим для вас лучшие кроссовки...
          </p>
        </div>

        {/* Прогресс бар */}
        <div 
          className="w-64 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--color-border)' }}
        >
          <div 
            className="h-full rounded-full loading-progress"
            style={{ backgroundColor: 'var(--color-tint)' }}
          ></div>
        </div>
      </div>
    </div>
  );
}