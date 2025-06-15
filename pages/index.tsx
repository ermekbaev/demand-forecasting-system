import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { themeColors } from '@/lib/Theme/Colors';

export default function Home() {
  const router = useRouter();

  // Редирект на страницу дашборда
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Head>
        <title>Система прогнозирования спроса</title>
        <meta name="description" content="Прогнозирование спроса на основе исторических данных о продажах" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <svg 
            className="w-20 h-20 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              style={{ color: themeColors.teal }}
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Загрузка системы прогнозирования спроса</h2>
        <p className="mt-2 text-gray-600">Пожалуйста, подождите...</p>
      </div>
    </div>
  );
}