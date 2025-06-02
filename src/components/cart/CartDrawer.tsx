import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
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

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Подсчет итоговой суммы
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shipping;

  if (!isOpen) return null;

  const drawerContent = (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="ml-auto w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            Корзина ({items.length})
          </h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="rounded-full"
          >
            <Icon name="close" size="sm" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {items.length === 0 ? (
            // Empty state
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="shopping-bag" size="lg" className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Корзина пуста
                </h3>
                <p className="text-muted-foreground mb-6">
                  Добавьте товары для оформления заказа
                </p>
                <Button onClick={onClose} variant="outline">
                  Продолжить покупки
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {item.color.name} • Размер {item.size}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">
                            {formatPrice(item.price)}
                          </span>
                          
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7"
                            >
                              <Icon name="minus" size="xs" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7"
                            >
                              <Icon name="plus" size="xs" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Icon name="trash" size="sm" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-border p-6 space-y-4">
                {/* Clear cart */}
                {items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearCart}
                    className="text-muted-foreground hover:text-destructive w-full"
                  >
                    Очистить корзину
                  </Button>
                )}

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Товары:</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Доставка:</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Бесплатно' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                    <span>Итого:</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Free shipping notice */}
                {subtotal < 5000 && (
                  <div className="bg-muted/50 rounded-lg p-3 text-center text-sm">
                    <p className="text-muted-foreground">
                      Добавьте товаров на {formatPrice(5000 - subtotal)} для бесплатной доставки
                    </p>
                    <div className="w-full bg-border rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Checkout button */}
                <Button className="w-full" size="lg">
                  Оформить заказ
                  <Icon name="arrow-right" size="sm" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}