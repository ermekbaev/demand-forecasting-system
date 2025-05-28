import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-text)'
    }}>
      <div className="text-center space-y-6 max-w-md">
        {/* Большая 404 */}
        <div className="space-y-2">
          <h1 
            className="text-8xl font-bold"
            style={{ color: 'var(--color-tint)' }}
          >
            404
          </h1>
          <div className="h-1 w-24 mx-auto rounded-full" style={{
            backgroundColor: 'var(--color-tint)'
          }}></div>
        </div>
        
        {/* Текст ошибки */}
        <div className="space-y-3">
          <h2 
            className="text-2xl font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            Страница не найдена
          </h2>
          <p 
            className="text-lg leading-relaxed"
            style={{ color: 'var(--color-placeholder)' }}
          >
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
        </div>
        
        {/* Кнопки действий */}
        <div className="space-y-4 pt-4">
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'var(--color-tint)',
              color: '#ffffff'
            }}
          >
            Вернуться на главную
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-block w-full px-6 py-3 rounded-lg font-medium border transition-all duration-200 hover:scale-105"
            style={{
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-card)'
            }}
          >
            Назад
          </button>
        </div>
        
        {/* Дополнительные ссылки */}
        <div className="pt-6 space-y-2">
          <p 
            className="text-sm"
            style={{ color: 'var(--color-placeholder)' }}
          >
            Или перейдите к:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/catalog" 
              className="hover:underline"
              style={{ color: 'var(--color-tint)' }}
            >
              Каталог
            </Link>
            <Link 
              href="/brands" 
              className="hover:underline"
              style={{ color: 'var(--color-tint)' }}
            >
              Бренды
            </Link>
            <Link 
              href="/contact" 
              className="hover:underline"
              style={{ color: 'var(--color-tint)' }}
            >
              Контакты
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}