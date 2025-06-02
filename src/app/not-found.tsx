import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
      <div className="text-center space-y-6 max-w-md">
        {/* Большая 404 */}
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary">
            404
          </h1>
          <div className="h-1 w-24 mx-auto rounded-full bg-primary" />
        </div>
        
        {/* Текст ошибки */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Страница не найдена
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
        </div>
        
        {/* Кнопки действий */}
        <div className="space-y-4 pt-4">
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 bg-primary text-primary-foreground"
          >
            Вернуться на главную
          </Link>
          
          <button
            // onClick={() => window.history.back()}
            className="inline-block w-full px-6 py-3 rounded-lg font-medium border transition-all duration-200 hover:scale-105 text-foreground border-border bg-card"
          >
            Назад
          </button>
        </div>
        
        {/* Дополнительные ссылки */}
        <div className="pt-6 space-y-2">
          <p className="text-sm text-muted-foreground">
            Или перейдите к:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/catalog" 
              className="hover:underline text-primary"
            >
              Каталог
            </Link>
            <Link 
              href="/brands" 
              className="hover:underline text-primary"
            >
              Бренды
            </Link>
            <Link 
              href="/contact" 
              className="hover:underline text-primary"
            >
              Контакты
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}