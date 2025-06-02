'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

const profileTabs = [
  { id: 'personal', label: 'Личные данные', icon: 'user' },
  { id: 'orders', label: 'Заказы', icon: 'package' },
  { id: 'addresses', label: 'Адреса', icon: 'map-pin' },
  { id: 'settings', label: 'Настройки', icon: 'settings' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [userData, setUserData] = useState({
    firstName: 'Иван',
    lastName: 'Петров', 
    email: 'ivan.petrov@email.com',
    phone: '+7 (999) 123-45-67',
    birthDate: '1990-01-01',
  });

  const breadcrumbItems = [
    { label: 'Личный кабинет' }
  ];

  const handleSave = () => {
    // TODO: Сохранение данных профиля
    console.log('Сохранение профиля:', userData);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">
              Личные данные
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Имя"
                value={userData.firstName}
                onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
              />
              <Input
                label="Фамилия"
                value={userData.lastName}
                onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
              />
              <Input
                label="Email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
              />
              <Input
                label="Телефон"
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              />
              <Input
                label="Дата рождения"
                type="date"
                value={userData.birthDate}
                onChange={(e) => setUserData(prev => ({ ...prev, birthDate: e.target.value }))}
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSave}>
                Сохранить изменения
              </Button>
              <Button variant="outline">
                Отменить
              </Button>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">
              История заказов
            </h2>
            
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="package" size="lg" className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Заказов пока нет
              </h3>
              <p className="text-muted-foreground mb-6">
                Оформите первый заказ в нашем каталоге
              </p>
              <Button onClick={() => window.location.href = '/catalog'}>
                Перейти в каталог
              </Button>
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">
                Адреса доставки
              </h2>
              <Button>
                <Icon name="plus" size="sm" />
                Добавить адрес
              </Button>
            </div>
            
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="map-pin" size="lg" className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Адресов нет
              </h3>
              <p className="text-muted-foreground mb-6">
                Добавьте адрес для быстрого оформления заказов
              </p>
              <Button>
                Добавить первый адрес
              </Button>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">
              Настройки аккаунта
            </h2>
            
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Безопасность
              </h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="lock" size="sm" />
                  Изменить пароль
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="shield" size="sm" />
                  Двухфакторная аутентификация
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Уведомления
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Email уведомления</p>
                    <p className="text-sm text-muted-foreground">Получать уведомления о заказах</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 accent-primary"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">SMS уведомления</p>
                    <p className="text-sm text-muted-foreground">Получать SMS о статусе доставки</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 accent-primary"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-destructive/20">
              <h3 className="font-semibold text-destructive mb-4">
                Опасная зона
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Удаление аккаунта необратимо. Все ваши данные будут удалены.
              </p>
              <Button variant="destructive">
                Удалить аккаунт
              </Button>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-6">
      <div className="max-w-6xl mx-auto px-5">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Icon name="user" size="lg" className="text-primary" />
            Личный кабинет
          </h1>
          <p className="text-muted-foreground">
            Управление профилем и заказами
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Tabs */}
          <Card className="lg:col-span-1 p-4 h-fit">
            <nav className="space-y-2">
              {profileTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon name={tab.icon as any} size="sm" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>

          {/* Tab Content */}
          <Card className="lg:col-span-3 p-8">
            {renderTabContent()}
          </Card>
        </div>
      </div>
    </div>
  );
}