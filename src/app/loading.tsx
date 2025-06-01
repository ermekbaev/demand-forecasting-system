export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* Анимированный лого/спиннер */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-border border-t-primary" />
          <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-2 border-primary" />
        </div>
        
        {/* Текст загрузки */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Загрузка магазина
          </h2>
          <p className="text-sm text-muted-foreground">
            Готовим для вас лучшие кроссовки...
          </p>
        </div>

        {/* Прогресс бар */}
        <div className="w-64 h-1 rounded-full overflow-hidden bg-border">
          <div className="h-full rounded-full bg-primary animate-loading-progress" />
        </div>
      </div>
    </div>
  );
}