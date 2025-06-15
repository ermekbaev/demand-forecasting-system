export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-500 text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🧪 Тест Tailwind CSS
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-500 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Красная карточка</h2>
            <p>Если вы видите цвета и сетку - Tailwind работает!</p>
          </div>
          
          <div className="bg-green-500 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Зеленая карточка</h2>
            <p>Проверяем адаптивность: сетка должна быть responsive</p>
          </div>
          
          <div className="bg-purple-500 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Фиолетовая карточка</h2>
            <p>Если все цветное - переходим к основному сайту</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Кнопка с hover эффектом
          </button>
        </div>
      </div>
    </div>
  )
}