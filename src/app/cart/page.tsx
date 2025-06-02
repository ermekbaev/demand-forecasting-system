'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { cn, formatPrice } from '@/lib/utils';

interface CartItem {
  id: string;
  productSlug: string;
  name: string;
  price: number;
  imageUrl: string;
  color: { id: number; name: string };
  size: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка корзины
  useEffect(() => {
    const loadCart = () => {
      try {
        setLoading(true);
        
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const items = JSON.parse(savedCart);
          setCartItems(items);
        }
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Обновление количества
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Удаление товара
  const removeItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Очистка корзины
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Подсчет итогов
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shipping;

  const breadcrumbItems = [
    { label: 'Корзина' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-6">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-8">
            <div className="h-4 bg-muted rounded w-32 mb-4 animate-pulse" />
            <div className="h-8 bg-muted rounded w-48 animate-pulse" />
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="p-6 h-fit">
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                </div>
                <div className="h-12 bg-muted rounded" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-6">
      <div className="max-w-6xl mx-auto px-5">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Icon name="shopping-bag" size="lg" className="text-primary" />
              Корзина
            </h1>
            <p className="text-muted-foreground">
              {cartItems.length > 0 ? `${itemsCount} товаров в корзине` : 'Корзина пуста'}
            </p>
          </div>

          {/* Clear cart */}
          {cartItems.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Icon name="trash" size="sm" />
              Очистить корзину
            </Button>
          )}
        </div>

        {/* Content */}
        {cartItems.length === 0 ? (
          <Card variant="elevated" className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="shopping-bag" size="xl" className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Корзина пуста
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Добавьте товары в корзину, чтобы оформить заказ. 
              В каталоге вас ждет множество интересных предложений.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => window.location.href = '/catalog'}
                variant="default"
                size="lg"
              >
                Перейти в каталог
                <Icon name="arrow-right" size="sm" />
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                size="lg"
              >
                На главную
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="font-semibold text-foreground text-lg line-clamp-2 mb-2">
                            {item.name}
                          </h3>
                          <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                            <span>Цвет: {item.color.name}</span>
                            <span>Размер: {item.size}</span>
                          </div>
                          <div className="text-xl font-bold text-primary">
                            {formatPrice(item.price)}
                          </div>
                        </div>

                        {/* Remove button */}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive flex-shrink-0"
                        >
                          <Icon name="trash" size="sm" />
                        </Button>
                      </div>
                      
                      {/* Quantity controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            Количество:
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Icon name="minus" size="xs" />
                            </Button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Icon name="plus" size="xs" />
                            </Button>
                          </div>
                        </div>

                        {/* Item total */}
                        <div className="text-lg font-bold text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <Card className="p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Итого к оплате
              </h2>

              {/* Summary details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Товары ({itemsCount}):</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Доставка:</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-semibold">Бесплатно</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Итого:</span>
                    <span className="text-primary text-xl">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Free shipping notice */}
              {subtotal < 5000 && (
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="truck" size="sm" className="text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      Бесплатная доставка
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Добавьте товаров на {formatPrice(5000 - subtotal)} для бесплатной доставки
                  </p>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Checkout button */}
              <Button className="w-full mb-4" size="lg">
                Оформить заказ
                <Icon name="credit-card" size="sm" />
              </Button>

              {/* Continue shopping */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/catalog'}
              >
                Продолжить покупки
              </Button>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Icon name="shield" size="sm" className="text-emerald-600" />
                  <span className="text-muted-foreground">Гарантия качества</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Icon name="refresh-cw" size="sm" className="text-emerald-600" />
                  <span className="text-muted-foreground">Возврат 30 дней</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Icon name="credit-card" size="sm" className="text-emerald-600" />
                  <span className="text-muted-foreground">Безопасная оплата</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}